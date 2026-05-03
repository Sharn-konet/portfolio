#!/usr/bin/env node
/**
 * Lists archive paths to stdout, one per line. Pipe into nsxiv to pick.
 *
 * The walker only considers files under a `processed/` ancestor directory
 * (see PUBLISH_DIRS in lib/photos.mjs) — loose JPGs in camera-dump folders
 * or at the archive root are ignored.
 *
 * Default mode: only prints photos that are new (not in manifest) or changed
 * (hash differs from the recorded one). `--all` prints every qualifying
 * JPG/PNG, skipping the manifest check. `--shallow` does not descend into
 * subdirectories (useful only when ARCHIVE_ROOT itself is a `processed/`
 * folder, e.g. PHOTOS_ARCHIVE=/mnt/a/Pictures/iceland/processed).
 *
 * Stderr gets a one-line summary so you can see archive state when running
 * interactively without polluting the path list piped to nsxiv.
 *
 * Usage:
 *   node scripts/photos-list.mjs                         # new + changed
 *   node scripts/photos-list.mjs --all                   # every published-eligible photo
 *   PHOTOS_ARCHIVE=/path/to/processed/ node scripts/photos-list.mjs --shallow
 */
import {
	ARCHIVE_ROOT,
	archiveRelative,
	ensureArchiveExists,
	hashFile,
	loadManifest,
	manifestStatus,
	walkArchive
} from './lib/photos.mjs';

async function main() {
	const all = process.argv.includes('--all');
	const shallow = process.argv.includes('--shallow');

	ensureArchiveExists();

	const paths = [...walkArchive(ARCHIVE_ROOT, { shallow })].sort();
	const counts = { total: paths.length, new: 0, changed: 0, published: 0 };
	const scope = shallow ? `${ARCHIVE_ROOT} (shallow)` : ARCHIVE_ROOT;

	if (all) {
		for (const abs of paths) process.stdout.write(abs + '\n');
		process.stderr.write(`${counts.total} photos in ${scope} (all)\n`);
		return;
	}

	const manifest = loadManifest();
	const tty = process.stderr.isTTY;
	let done = 0;

	const statuses = await pool(paths, 8, async (abs) => {
		const rel = archiveRelative(abs);
		const hash = await hashFile(abs);
		const status = manifestStatus(rel, hash, manifest);
		done++;
		if (tty && (done % 10 === 0 || done === paths.length)) {
			process.stderr.write(`\rhashing ${done}/${paths.length}`);
		}
		return status;
	});
	if (tty) process.stderr.write('\r\x1b[K');

	for (let i = 0; i < paths.length; i++) {
		const status = statuses[i];
		counts[status]++;
		if (status !== 'published') process.stdout.write(paths[i] + '\n');
	}
	process.stderr.write(
		`${counts.total} photos in ${scope}, ${counts.new} new, ${counts.changed} changed, ${counts.published} published\n`
	);
}

async function pool(items, concurrency, fn) {
	const results = new Array(items.length);
	let next = 0;
	const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
		while (true) {
			const i = next++;
			if (i >= items.length) return;
			results[i] = await fn(items[i], i);
		}
	});
	await Promise.all(workers);
	return results;
}

main().catch((err) => {
	process.stderr.write(`photos-list: ${err.message}\n`);
	process.exit(1);
});
