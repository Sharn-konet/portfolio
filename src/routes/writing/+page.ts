import { getWritingList, type WritingMeta } from '$lib/content';

export const prerender = true;

function formatDate(date: string): string {
	if (!date) return '';
	const [y, m] = date.split('-');
	return `${y}.${m}`;
}

export function load() {
	const items = getWritingList();
	return {
		pageTitle: 'Writing · sharnko.net',
		pageDescription: 'Engineering posts and notes.',
		items: items.map((i: WritingMeta) => ({
			href: i.external ?? `/writing/${i.slug}`,
			title: i.title,
			meta: formatDate(i.date),
			external: Boolean(i.external),
			icon: i.external ? '↗' : undefined
		}))
	};
}
