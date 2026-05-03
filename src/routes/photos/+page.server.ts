/**
 * Server load: read each photo's pixel dimensions at build time and attach
 * them to the Photo objects. The /photos component stamps width/height on
 * each <img>, which lets the browser reserve correctly-sized space *before*
 * the image data arrives — masonry columns no longer reflow as photos load
 * and scroll stays smooth.
 *
 * Runs once at build time (page is prerendered + adapter-static), so the
 * cost of statting ~370 files is paid once per build, never at request time.
 */
import path from 'node:path';
import sharp from 'sharp';
import { getPhotos, type Photo } from '$lib/gallery';

async function attachDims(photo: Photo): Promise<Photo> {
	try {
		const abs = path.join(process.cwd(), 'static', photo.href);
		const { width, height } = await sharp(abs).metadata();
		if (width && height) return { ...photo, width, height };
	} catch {
		/* missing file or unreadable header — fall through to undecorated photo */
	}
	return photo;
}

export async function load() {
	const { sets, flat } = getPhotos();
	const flatWithDims = await Promise.all(flat.map(attachDims));
	const setsWithDims = await Promise.all(
		sets.map(async (s) => ({ ...s, photos: await Promise.all(s.photos.map(attachDims)) }))
	);
	return {
		pageTitle: 'Photos · sharnko.net',
		pageDescription: 'Photographs by Sharn-Konet Reitsma.',
		sets: setsWithDims,
		flat: flatWithDims
	};
}
