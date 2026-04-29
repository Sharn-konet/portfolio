import { getPhotos } from '$lib/gallery';

export const prerender = true;

export function load() {
	const { sets, flat } = getPhotos();
	return {
		pageTitle: 'photos — sharnko.net',
		pageDescription: 'photographs by sharn-konet reitsma.',
		sets,
		flat
	};
}
