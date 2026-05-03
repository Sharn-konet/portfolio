/**
 * Shared helpers for the photo publishing pipeline.
 *
 * Walks an archive of finished JPEGs (default: /mnt/a/Pictures), tracks
 * which ones have been published into static/gallery/, and derives the
 * gallery "set" (subfolder) from the archive layout. Folder and file names
 * are slugified into URL-safe lowercase-hyphen form on the way through.
 *
 * RAW siblings (.cr2, .nef, .raf, .arw, .dng, ...) are ignored by extension
 * whitelist — only .jpg/.jpeg/.png reach the processor.
 *
 * Only files under a `processed/` ancestor directory are considered for
 * publishing. Loose JPGs at the top of the archive (camera dumps,
 * un-edited shots) are skipped. The `processed/` segment is also dropped
 * from the gallery set name — see PUBLISH_DIRS / setNameFor.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { open } from 'node:fs/promises';
import path from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname;

export const ARCHIVE_ROOT = process.env.PHOTOS_ARCHIVE ?? '/mnt/a/Pictures';
export const GALLERY_DIR = path.join(ROOT, 'static', 'gallery');
export const MANIFEST_PATH = path.join(GALLERY_DIR, 'manifest.json');

export const INPUT_EXTS = ['.jpg', '.jpeg', '.png'];
export const LONG_EDGE = 2000;
export const JPEG_Q = 82;
export const WEBP_Q = 80;
export const AVIF_Q = 50;

// Subfolder names that mean "ready to publish". Two effects:
//   1. walkArchive only yields files that have at least one ancestor
//      directory matching one of these names (or whose archive root
//      basename matches). So loose top-level JPGs and files in unedited
//      camera-dump folders are skipped.
//   2. The matched segment is stripped from the gallery set name, so
//      "iceland/processed/foo.jpg" → set "iceland".
export const PUBLISH_DIRS = new Set(['processed']);

const MANIFEST_VERSION = 2;
const FINGERPRINT_BYTES = 65536;

/**
 * Walk a directory, yielding absolute paths of files matching INPUT_EXTS
 * AND living under a PUBLISH_DIRS ancestor (or directly inside `root` if
 * `root`'s own basename is a publish-dir). Skips hidden directories.
 *
 * With `shallow: true`, only the immediate `root` is read — subdirectories
 * are not descended into. Combined with the publish-dir filter, this means
 * `--shallow` only yields files when `root` itself is a `processed/` folder.
 */
export function* walkArchive(root = ARCHIVE_ROOT, { shallow = false } = {}) {
	const rootIsPublishDir = PUBLISH_DIRS.has(path.basename(root).toLowerCase());
	const stack = [{ dir: root, inPublishDir: rootIsPublishDir }];
	while (stack.length) {
		const { dir, inPublishDir } = stack.pop();
		let entries;
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch (err) {
			if (err.code === 'ENOENT') continue;
			throw err;
		}
		for (const entry of entries) {
			if (entry.name.startsWith('.')) continue;
			const abs = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				if (shallow) continue;
				const nowIn = inPublishDir || PUBLISH_DIRS.has(entry.name.toLowerCase());
				stack.push({ dir: abs, inPublishDir: nowIn });
			} else if (entry.isFile() && inPublishDir) {
				const ext = path.extname(entry.name).toLowerCase();
				if (INPUT_EXTS.includes(ext)) yield abs;
			}
		}
	}
}

/**
 * Cheap content fingerprint: SHA-256 over (size, first 64KB, last 64KB).
 * Reads ~128KB per file regardless of size, so it stays fast on slow
 * filesystems (WSL 9p, network drives) where full-content hashing is
 * minutes-per-thousand-files. Strong enough that any realistic re-export
 * from a raw processor changes the fingerprint.
 *
 * Hex-encoded with an "fp1-" prefix so a future format bump can be
 * detected by inspection.
 */
export async function hashFile(absPath) {
	const handle = await open(absPath, 'r');
	try {
		const stat = await handle.stat();
		const size = stat.size;
		const hash = createHash('sha256');

		const sizeBuf = Buffer.alloc(8);
		sizeBuf.writeBigUInt64LE(BigInt(size));
		hash.update(sizeBuf);

		if (size <= FINGERPRINT_BYTES * 2) {
			const buf = Buffer.alloc(size);
			await handle.read(buf, 0, size, 0);
			hash.update(buf);
		} else {
			const head = Buffer.alloc(FINGERPRINT_BYTES);
			await handle.read(head, 0, FINGERPRINT_BYTES, 0);
			hash.update(head);
			const tail = Buffer.alloc(FINGERPRINT_BYTES);
			await handle.read(tail, 0, FINGERPRINT_BYTES, size - FINGERPRINT_BYTES);
			hash.update(tail);
		}

		return 'fp1-' + hash.digest('hex');
	} finally {
		await handle.close();
	}
}

export function archiveRelative(absPath, root = ARCHIVE_ROOT) {
	const rel = path.relative(root, absPath).split(path.sep).join('/');
	if (rel.startsWith('..') || path.isAbsolute(rel)) {
		throw new Error(
			`Path is not under ARCHIVE_ROOT: ${absPath}\n` +
				`  ARCHIVE_ROOT=${root}\n` +
				`  Set PHOTOS_ARCHIVE so both list and process scripts agree on the archive location.`
		);
	}
	return rel;
}

/**
 * URL-safe slug: lowercase, runs of non-alphanumeric collapsed to single
 * hyphens, leading/trailing hyphens trimmed.
 *
 *   "2025-09-04 Emiys Gig"   -> "2025-09-04-emiys-gig"
 *   "Lars' House"            -> "lars-house"
 *   "iceland-march"          -> "iceland-march"  (already a slug, no-op)
 */
export function slugify(s) {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Derive the gallery set name from an archive-relative path. Drops the
 * filename, drops any segment in COLLAPSE_DIRS, slugifies each remaining
 * segment, joins with '/'.
 *
 *   "2025-09-04 Emiys Gig/DSC0001.jpg"        -> "2025-09-04-emiys-gig"
 *   "Lars' House/processed/foo.jpg"           -> "lars-house"
 *   "Japan Trip Photos/2023/foo.jpg"          -> "japan-trip-photos/2023"
 *   "top-level.jpg"                            -> ""
 */
export function setNameFor(relPath) {
	const segments = relPath.split('/').slice(0, -1);
	return segments
		.filter((s) => !PUBLISH_DIRS.has(s.toLowerCase()))
		.map(slugify)
		.filter(Boolean)
		.join('/');
}

export function loadManifest() {
	if (!existsSync(MANIFEST_PATH)) {
		return { version: MANIFEST_VERSION, entries: {} };
	}
	const raw = readFileSync(MANIFEST_PATH, 'utf-8');
	const parsed = JSON.parse(raw);
	if (parsed.version !== MANIFEST_VERSION) {
		process.stderr.write(
			`note: manifest version ${parsed.version} → ${MANIFEST_VERSION}; entries cleared, all photos will be re-evaluated\n`
		);
		const migrated = { version: MANIFEST_VERSION, entries: {} };
		saveManifest(migrated);
		return migrated;
	}
	parsed.entries ??= {};
	return parsed;
}

/**
 * Atomic write: write to .tmp then rename, so a crash mid-save can't leave
 * the manifest half-written.
 */
export function saveManifest(manifest) {
	if (!existsSync(GALLERY_DIR)) mkdirSync(GALLERY_DIR, { recursive: true });
	const tmp = MANIFEST_PATH + '.tmp';
	const sorted = sortManifest(manifest);
	writeFileSync(tmp, JSON.stringify(sorted, null, 2) + '\n');
	renameSync(tmp, MANIFEST_PATH);
}

function sortManifest(manifest) {
	const sortedEntries = {};
	for (const key of Object.keys(manifest.entries).sort()) {
		sortedEntries[key] = manifest.entries[key];
	}
	return { version: manifest.version ?? MANIFEST_VERSION, entries: sortedEntries };
}

/**
 * Returns 'new' (not in manifest), 'changed' (in manifest but hash differs),
 * or 'published' (in manifest and hash matches).
 */
export function manifestStatus(relPath, hash, manifest) {
	const entry = manifest.entries[relPath];
	if (!entry) return 'new';
	if (entry.hash !== hash) return 'changed';
	return 'published';
}

/**
 * Resolve the on-disk output directory for a given set. Empty set string
 * means top-level (static/gallery/ directly).
 */
export function outputDirFor(setName) {
	return setName ? path.join(GALLERY_DIR, setName) : GALLERY_DIR;
}

/**
 * Output basename: slugified filename without extension. Keeps URLs clean
 * even if the source has spaces or apostrophes.
 */
export function outputBasenameFor(absPath) {
	const slug = slugify(path.parse(absPath).name);
	if (!slug) {
		throw new Error(
			`Cannot derive a slugified basename for ${absPath} — filename has no alphanumeric characters. Rename the source file.`
		);
	}
	return slug;
}

/**
 * Path-relative-to-GALLERY_DIR for use in the manifest's "outputs" array.
 */
export function galleryRelative(absPath) {
	return path.relative(GALLERY_DIR, absPath).split(path.sep).join('/');
}

/**
 * Best-effort sanity check on existence of ARCHIVE_ROOT. Throws with a clear
 * message if missing — common cause is /mnt/a/ not being mounted in WSL.
 */
export function ensureArchiveExists() {
	if (!existsSync(ARCHIVE_ROOT)) {
		throw new Error(
			`Archive root not found: ${ARCHIVE_ROOT}\n` +
				`Set PHOTOS_ARCHIVE to override, or mount the drive (WSL: ensure /mnt/a/ is available).`
		);
	}
	const s = statSync(ARCHIVE_ROOT);
	if (!s.isDirectory()) {
		throw new Error(`Archive root is not a directory: ${ARCHIVE_ROOT}`);
	}
}
