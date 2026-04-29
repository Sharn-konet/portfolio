import { getVideoList, type VideoMeta } from '$lib/content';

export const prerender = true;

export function load() {
	const items = getVideoList();
	return {
		pageTitle: 'Videos · sharnko.net',
		pageDescription: 'Films and short documentaries.',
		items: items.map((v: VideoMeta) => ({
			href: `/videos/${v.slug}`,
			title: v.title,
			subtitle: v.kind,
			meta: String(v.year),
			icon: '▶'
		}))
	};
}
