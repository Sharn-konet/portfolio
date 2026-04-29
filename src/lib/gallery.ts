/**
 * Auto-discover photos under `static/gallery/`.
 *
 * Drop any image (.jpg, .jpeg, .png, .webp, .avif) anywhere under
 * `static/gallery/` and it will appear in the grid. If you put images in a
 * subdirectory, that subdirectory's name becomes a section heading.
 *
 * Per-image AVIF/WebP fallbacks: drop `name.avif` and/or `name.webp`
 * alongside `name.jpg` and the <picture> tag will use the best one.
 */

export type Photo = {
	href: string;
	alt: string;
	avif?: string;
	webp?: string;
	caption?: string;
	set?: string;
};

export type PhotoSet = {
	name: string;
	slug: string;
	photos: Photo[];
};

const allFiles = import.meta.glob('/static/gallery/**/*.{jpg,jpeg,png,JPG,JPEG,PNG,webp,WEBP,avif,AVIF}', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

const PRIMARY_RE = /\.(jpe?g|png)$/i;

function setFromPath(path: string): string {
	// /static/gallery/foo/bar.jpg -> "foo"; /static/gallery/bar.jpg -> ""
	const parts = path.replace('/static/gallery/', '').split('/');
	if (parts.length <= 1) return '';
	return parts.slice(0, -1).join('/');
}

function basenameNoExt(path: string): string {
	const file = path.split('/').pop() ?? '';
	return file.replace(/\.[^.]+$/, '');
}

function publicHref(path: string): string {
	return path.replace('/static', '');
}

export function getPhotos(): { sets: PhotoSet[]; flat: Photo[] } {
	const byKey: Record<string, Photo> = {};

	for (const path of Object.keys(allFiles)) {
		if (!PRIMARY_RE.test(path)) continue;
		const set = setFromPath(path);
		const base = basenameNoExt(path);
		const key = `${set}/${base}`;
		byKey[key] = {
			href: publicHref(path),
			alt: base.replace(/[-_]/g, ' '),
			caption: base.replace(/[-_]/g, ' '),
			set: set || undefined
		};
	}

	for (const path of Object.keys(allFiles)) {
		const set = setFromPath(path);
		const base = basenameNoExt(path);
		const key = `${set}/${base}`;
		const photo = byKey[key];
		if (!photo) continue;
		if (/\.avif$/i.test(path)) photo.avif = publicHref(path);
		if (/\.webp$/i.test(path)) photo.webp = publicHref(path);
	}

	const flat = Object.values(byKey).sort((a, b) => a.href.localeCompare(b.href));

	const setMap: Record<string, Photo[]> = {};
	for (const p of flat) {
		const k = p.set ?? '';
		(setMap[k] ||= []).push(p);
	}
	const sets: PhotoSet[] = Object.entries(setMap).map(([name, photos]) => ({
		name: name || 'photographs',
		slug: name || 'photographs',
		photos
	}));
	sets.sort((a, b) => a.name.localeCompare(b.name));

	return { sets, flat };
}
