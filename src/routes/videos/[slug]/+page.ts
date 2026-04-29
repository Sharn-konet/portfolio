import { error } from '@sveltejs/kit';
import { getVideoComponent, type VideoMeta } from '$lib/content';

export const prerender = true;

const videoModules = import.meta.glob<{ metadata?: VideoMeta }>('/src/content/videos/*.md', {
	eager: true
});

export function entries() {
	return Object.entries(videoModules).map(([path]) => ({
		slug: path.split('/').pop()!.replace(/\.md$/, '')
	}));
}

export function load({ params }) {
	const found = getVideoComponent(params.slug);
	if (!found) throw error(404, 'not found');
	return {
		Component: found.Component,
		meta: found.meta,
		pageTitle: `${found.meta.title} · sharnko.net`,
		pageDescription: found.meta.description ?? found.meta.title
	};
}
