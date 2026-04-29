export type Tab = {
	slug: string;
	label: string;
	href: string;
	id: string;
	path: string;
};

export const tabs: Tab[] = [
	{ slug: 'about', label: 'About', href: '/', id: 'about', path: '~/about' },
	{ slug: 'skills', label: 'Skills', href: '/skills', id: 'skills', path: '~/skills' },
	{ slug: 'work', label: 'Work', href: '/work', id: 'work', path: '~/work' },
	{ slug: 'projects', label: 'Projects', href: '/projects', id: 'projects', path: '~/projects' },
	{ slug: 'writing', label: 'Writing', href: '/writing', id: 'writing', path: '~/writing' },
	{ slug: 'photos', label: 'Photos', href: '/photos', id: 'photos', path: '~/photos' },
	{ slug: 'videos', label: 'Videos', href: '/videos', id: 'videos', path: '~/videos' }
];

export function activeTab(pathname: string): Tab {
	if (pathname === '/' || pathname.startsWith('/about')) return tabs[0];
	if (pathname.startsWith('/skills')) return tabs[1];
	if (pathname.startsWith('/work')) return tabs[2];
	if (pathname.startsWith('/projects')) return tabs[3];
	if (pathname.startsWith('/writing')) return tabs[4];
	if (pathname.startsWith('/photos')) return tabs[5];
	if (pathname.startsWith('/videos')) return tabs[6];
	return tabs[0];
}
