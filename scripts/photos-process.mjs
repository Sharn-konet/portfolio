#!/usr/bin/env node
/**
 * Reads archive photo paths from stdin (one per line), generates web-ready
 * variants (.jpg / .webp / .avif) into static/gallery/<set>/, and updates
 * static/gallery/.manifest.json after each successful photo.
 *
 * Set name is derived from the archive subfolder layout (see setNameFor in
 * scripts/lib/photos.mjs). The runtime side already discovers anything
 * dropped under static/gallery/ via gallery.ts — no other wiring needed.
 *
 * Idempotent: a photo whose source hash matches the manifest is skipped
 * unless `--force` is passed.
 *
 * Usage:
 *   echo /path/to/foo.jpg | node scripts/photos-process.mjs
 *   node scripts/photos-list.mjs | nsxiv -tio | node scripts/photos-process.mjs
 *   ... | node scripts/photos-process.mjs --force
 */
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import sharp from 'sharp';
import {
	AVIF_Q,
	JPEG_Q,
	LONG_EDGE,
	WEBP_Q,
	archiveRelative,
	galleryRelative,
	hashFile,
	loadManifest,
	manifestStatus,
	outputBasenameFor,
	outputDirFor,
	saveManifest,
	setNameFor
} from './lib/photos.mjs';

async function readPathsFromStdin() {
	const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
	const paths = [];
	for await (const line of rl) {
		const trimmed = line.trim();
		if (trimmed) paths.push(trimmed);
	}
	return paths;
}

async function processPhoto(abs, manifest, { force }) {
	const rel = archiveRelative(abs);
	const hash = await hashFile(abs);
	const status = manifestStatus(rel, hash, manifest);

	if (status === 'published' && !force) {
		return { kind: 'skip', rel };
	}

	const setName = setNameFor(rel);
	const outDir = outputDirFor(setName);
	if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

	const base = outputBasenameFor(abs);
	const outJpg = path.join(outDir, `${base}.jpg`);
	const outWebp = path.join(outDir, `${base}.webp`);
	const outAvif = path.join(outDir, `${base}.avif`);

	const pipeline = sharp(abs, { failOn: 'error' })
		.rotate()
		.resize({
			width: LONG_EDGE,
			height: LONG_EDGE,
			fit: 'inside',
			withoutEnlargement: true
		});

	await Promise.all([
		pipeline.clone().jpeg({ quality: JPEG_Q, mozjpeg: true }).toFile(outJpg),
		pipeline.clone().webp({ quality: WEBP_Q, effort: 4 }).toFile(outWebp),
		pipeline.clone().avif({ quality: AVIF_Q, effort: 4 }).toFile(outAvif)
	]);

	manifest.entries[rel] = {
		hash,
		set: setName,
		outputs: [galleryRelative(outJpg), galleryRelative(outWebp), galleryRelative(outAvif)],
		publishedAt: new Date().toISOString()
	};
	saveManifest(manifest);

	return { kind: status === 'changed' ? 'updated' : 'wrote', rel, base, setName };
}

async function main() {
	const force = process.argv.includes('--force');
	const paths = await readPathsFromStdin();

	if (paths.length === 0) {
		process.stderr.write('photos-process: nothing to do (no paths on stdin)\n');
		return;
	}

	const manifest = loadManifest();
	const counts = { wrote: 0, updated: 0, skip: 0, failed: 0 };

	for (const abs of paths) {
		try {
			const result = await processPhoto(abs, manifest, { force });
			counts[result.kind]++;
			if (result.kind === 'skip') {
				console.log(`  · skip:    ${result.rel}`);
			} else {
				const verb = result.kind === 'updated' ? 'updated' : 'wrote  ';
				const setLabel = result.setName ? `${result.setName}/` : '';
				console.log(`  · ${verb}: ${setLabel}${result.base}  (jpg, webp, avif)`);
			}
		} catch (err) {
			counts.failed++;
			console.log(`  ✗ failed:  ${abs}  (${err.message})`);
		}
	}

	process.stderr.write(
		`\n${counts.wrote} new, ${counts.updated} updated, ${counts.skip} skipped, ${counts.failed} failed\n`
	);
	if (counts.failed > 0) process.exit(1);
}

main().catch((err) => {
	process.stderr.write(`photos-process: ${err.message}\n`);
	process.exit(1);
});
