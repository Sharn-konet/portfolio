import { error } from '@sveltejs/kit';
import { getWorkList, getWorkComponent, formatRange } from '$lib/content';

export const prerender = true;

export function entries() {
	return getWorkList().map((w) => ({ slug: w.slug }));
}

export function load({ params }) {
	const found = getWorkComponent(params.slug);
	if (!found) throw error(404, 'not found');
	return {
		Component: found.Component,
		meta: found.meta,
		range: formatRange(found.meta.start, found.meta.end),
		pageTitle: `${found.meta.title} · ${found.meta.org} · sharnko.net`,
		pageDescription: found.meta.description ?? `${found.meta.title} at ${found.meta.org}.`
	};
}
