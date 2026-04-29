#!/usr/bin/env node
/**
 * Image → ASCII art converter.
 *
 * Resolution order, per skill slug:
 *   1. src/content/skills-art/<slug>.txt    (hand-authored override)
 *   2. static/logos/<slug>.{png,svg,jpg,jpeg}
 *   3. node_modules/devicon/icons/<deviconName>/<deviconName>-{original,plain,line}{,-wordmark}.svg
 *
 * Emits src/lib/skills-art.generated.ts containing { [slug]: asciiString }.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const LOGOS_DIR = join(ROOT, 'static', 'logos');
const OVERRIDES_DIR = join(ROOT, 'src', 'content', 'skills-art');
const DEVICON_DIR = join(ROOT, 'node_modules', 'devicon', 'icons');
const OUT_FILE = join(ROOT, 'src', 'lib', 'skills-art.generated.ts');

// Width in characters. Chars are ~2x taller than wide, so the height is
// derived per-image from the source aspect ratio with a 0.5x correction.
const WIDTH = 44;
const ASPECT_CORRECT = 0.55;
const RAMP = ' .,:-=+*#%@';

// Skill slugs to render. Keep in sync with src/lib/skills.ts.
const SKILLS = [
	'python',
	'rust',
	'julia',
	'svelte',
	'bash',
	'r',
	'matlab',
	'excel',
	'html',
	'css',
	'aws',
	'snowflake',
	'new-relic',
	'sumo-logic',
	'netlify',
	'kubernetes',
	'docker',
	'git',
	'teamcity'
];

// Devicon directory name per slug. null = not in Devicon (skip).
const DEVICON_NAME = {
	python: 'python',
	rust: 'rust',
	julia: 'julia',
	svelte: 'svelte',
	bash: 'bash',
	r: 'r',
	matlab: 'matlab',
	excel: null,
	html: 'html5',
	css: 'css3',
	aws: 'amazonwebservices',
	snowflake: null,
	'new-relic': 'newrelic',
	'sumo-logic': null,
	netlify: 'netlify',
	kubernetes: 'kubernetes',
	docker: 'docker',
	git: 'git',
	teamcity: null
};

// Variant search order. `plain` first — it's typically a single-path silhouette
// that reads cleaner at ASCII resolution than the multi-path `original` icon.
const VARIANTS = ['plain', 'original', 'line', 'plain-wordmark', 'original-wordmark', 'line-wordmark'];

function lumToChar(l) {
	const idx = Math.min(RAMP.length - 1, Math.max(0, Math.round((l / 255) * (RAMP.length - 1))));
	return RAMP[idx];
}

async function imageToAscii(filePath) {
	const meta = await sharp(filePath).metadata();
	const srcAspect = (meta.height ?? 1) / (meta.width ?? 1);
	const height = Math.max(6, Math.round(WIDTH * srcAspect * ASPECT_CORRECT));

	// Render at higher resolution, then downsample manually so we can read both
	// alpha (silhouette) and colour (depth shading) per cell. Sharp's resize
	// with `fit: inside` returns variable dimensions; we resize to exactly
	// WIDTH×height to match our grid.
	const { data, info } = await sharp(filePath)
		.resize(WIDTH, height, { fit: 'fill' })
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const channels = info.channels;
	const lines = [];
	for (let y = 0; y < height; y++) {
		let row = '';
		for (let x = 0; x < WIDTH; x++) {
			const off = (y * WIDTH + x) * channels;
			const r = data[off] ?? 0;
			const g = data[off + 1] ?? 0;
			const b = data[off + 2] ?? 0;
			const a = data[off + 3] ?? 0;

			if (a < 32) {
				row += ' ';
				continue;
			}

			// Inside the silhouette: brand-colour brightness modulates the char.
			// Lighter colours (e.g. Python yellow) → denser chars; darker hues
			// → mid chars. Edges with partial alpha fade with the alpha factor.
			const lum = 0.299 * r + 0.587 * g + 0.114 * b;
			const intensity = (lum / 255) * (a / 255);
			// Boost so most logo pixels land toward the dense end of the ramp.
			const boosted = Math.min(1, 0.45 + intensity * 0.85);
			const idx = Math.round(boosted * (RAMP.length - 1));
			row += RAMP[Math.max(1, idx)];
		}
		lines.push(row.replace(/\s+$/, ''));
	}
	while (lines.length && lines[0].trim() === '') lines.shift();
	while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
	return lines.join('\n');
}

function readOverride(slug) {
	const p = join(OVERRIDES_DIR, `${slug}.txt`);
	if (!existsSync(p)) return null;
	return readFileSync(p, 'utf-8').replace(/\s+$/, '');
}

function findLocalLogo(slug) {
	if (!existsSync(LOGOS_DIR)) return null;
	const files = readdirSync(LOGOS_DIR);
	for (const ext of ['.svg', '.png', '.jpg', '.jpeg']) {
		const match = files.find((f) => f.toLowerCase() === slug + ext);
		if (match) return join(LOGOS_DIR, match);
	}
	return null;
}

function findDevicon(slug) {
	const name = DEVICON_NAME[slug];
	if (!name) return null;
	const dir = join(DEVICON_DIR, name);
	if (!existsSync(dir)) return null;
	for (const variant of VARIANTS) {
		const file = join(dir, `${name}-${variant}.svg`);
		if (existsSync(file)) return file;
	}
	return null;
}

async function main() {
	const out = {};
	const report = [];

	for (const slug of SKILLS) {
		const override = readOverride(slug);
		if (override != null) {
			out[slug] = override;
			report.push(`  · manual:  ${slug}`);
			continue;
		}

		const local = findLocalLogo(slug);
		if (local) {
			try {
				out[slug] = await imageToAscii(local);
				report.push(`  · local:   ${slug}  (${local.replace(ROOT, '')})`);
				continue;
			} catch (err) {
				report.push(`  ✗ failed:  ${slug} (local): ${err.message}`);
			}
		}

		const devicon = findDevicon(slug);
		if (devicon) {
			try {
				out[slug] = await imageToAscii(devicon);
				report.push(`  · devicon: ${slug}  (${devicon.split('/').slice(-2).join('/')})`);
				continue;
			} catch (err) {
				report.push(`  ✗ failed:  ${slug} (devicon): ${err.message}`);
			}
		}

		report.push(`  ◌ skip:    ${slug}  (no source — placeholder will render)`);
	}

	const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));

	const banner =
		`// AUTO-GENERATED by scripts/build-skills-art.mjs — do not edit by hand.\n` +
		`// To update: drop a logo into static/logos/<slug>.{png,svg} (or hand-author a\n` +
		`// .txt file at src/content/skills-art/<slug>.txt) and run \`npm run skills:build\`.\n` +
		`// Devicon is consulted automatically for any slug not provided locally.\n\n`;

	const body =
		`export const skillArt: Record<string, string> = ${JSON.stringify(sorted, null, 2)};\n`;

	if (!existsSync(parse(OUT_FILE).dir)) {
		mkdirSync(parse(OUT_FILE).dir, { recursive: true });
	}
	writeFileSync(OUT_FILE, banner + body);
	console.log(report.join('\n'));
	console.log(`\nwrote ${OUT_FILE.replace(ROOT, '')}  (${Object.keys(sorted).length} of ${SKILLS.length} skill(s))`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
