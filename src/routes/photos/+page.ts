import { getPhotos } from '$lib/gallery';

export const prerender = true;

export function load() {
	const { sets, flat } = getPhotos();
	return {
		pageTitle: 'Photos · sharnko.net',
		pageDescription: 'Photographs by Sharn-Konet Reitsma.',
		sets,
		flat
	};
}
