import { getWorkList, formatRange, type WorkMeta } from '$lib/content';

export const prerender = true;

export function load() {
	const items = getWorkList();
	const experience = items.filter((i: WorkMeta) => (i.kind ?? 'experience') === 'experience');
	return {
		pageTitle: 'Work · sharnko.net',
		pageDescription: 'Work history.',
		experience: experience.map((i: WorkMeta) => ({
			href: `/work/${i.slug}`,
			title: i.title,
			subtitle: i.org,
			meta: formatRange(i.start, i.end)
		}))
	};
}
