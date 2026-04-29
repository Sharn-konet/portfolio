import { getWorkList, type WorkMeta } from '$lib/content';

export const prerender = true;

export function load() {
	const projects = getWorkList().filter((i: WorkMeta) => i.kind === 'project');
	return {
		pageTitle: 'Projects · sharnko.net',
		pageDescription: 'Live simulation and assorted side-builds.',
		projects: projects.map((i: WorkMeta) => ({
			slug: i.slug,
			href: `/work/${i.slug}`,
			title: i.title,
			description: i.description ?? ''
		}))
	};
}
