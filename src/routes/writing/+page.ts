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
		pageTitle: 'writing — sharnko.net',
		pageDescription: 'engineering posts and notes.',
		items: [
			...items.map((i: WritingMeta) => ({
				href: `/writing/${i.slug}`,
				title: i.title,
				meta: formatDate(i.date)
			})),
			{
				href: '/film',
				title: 'intensive care — short documentary, 2017',
				meta: '2017',
				icon: '▶'
			}
		]
	};
}
