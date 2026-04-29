import { getWorkList, formatRange, type WorkMeta } from '$lib/content';

export const prerender = true;

export function load() {
	const items = getWorkList();
	const experience = items.filter((i: WorkMeta) => (i.kind ?? 'experience') === 'experience');
	const projects = items.filter((i: WorkMeta) => i.kind === 'project');
	return {
		pageTitle: 'work — sharnko.net',
		pageDescription: 'experience and projects.',
		experience: experience.map((i: WorkMeta) => ({
			href: `/work/${i.slug}`,
			title: `${i.org} — ${i.title}`,
			meta: formatRange(i.start, i.end)
		})),
		projects: projects.map((i: WorkMeta) => ({
			href: `/work/${i.slug}`,
			title: i.title,
			meta: i.org && i.org !== 'project' ? i.org : 'demo'
		}))
	};
}
