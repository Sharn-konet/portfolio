import { error } from '@sveltejs/kit';
import { getWritingComponent, type WritingMeta } from '$lib/content';

export const prerender = true;

const writingModules = import.meta.glob<{ metadata?: WritingMeta }>('/src/content/writing/*.md', {
	eager: true
});

export function entries() {
	return Object.entries(writingModules).map(([path]) => ({
		slug: path.split('/').pop()!.replace(/\.md$/, '')
	}));
}

export function load({ params }) {
	const found = getWritingComponent(params.slug);
	if (!found) throw error(404, 'not found');
	return {
		Component: found.Component,
		meta: found.meta,
		pageTitle: `${found.meta.title} — sharnko.net`,
		pageDescription: found.meta.description ?? found.meta.title
	};
}
