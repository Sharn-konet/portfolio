export type Tab = {
	slug: string;
	label: string;
	href: string;
	id: string;
	path: string;
};

export const tabs: Tab[] = [
	{ slug: 'about', label: 'About', href: '/', id: 'SKR·SELF', path: '~/about.md' },
	{ slug: 'contact', label: 'Contact', href: '/contact', id: 'SKR·LINK', path: '~/contact.md' },
	{ slug: 'skills', label: 'Skills', href: '/skills', id: 'SKR·KIT', path: '~/skills/' },
	{ slug: 'work', label: 'Work', href: '/work', id: 'SKR·HIST', path: '~/work/' },
	{
		slug: 'projects',
		label: 'Projects',
		href: '/projects',
		id: 'SKR·SIM',
		path: '~/projects/'
	},
	{
		slug: 'writing',
		label: 'Writing',
		href: '/writing',
		id: 'SKR·LOGS',
		path: '~/writing/'
	},
	{ slug: 'photos', label: 'Photos', href: '/photos', id: 'SKR·PICS', path: '~/photos/' }
];

export function activeTab(pathname: string): Tab {
	if (pathname === '/' || pathname.startsWith('/about')) return tabs[0];
	if (pathname.startsWith('/contact')) return tabs[1];
	if (pathname.startsWith('/skills')) return tabs[2];
	if (pathname.startsWith('/work')) return tabs[3];
	if (pathname.startsWith('/projects')) return tabs[4];
	if (pathname.startsWith('/writing')) return tabs[5];
	if (pathname.startsWith('/photos')) return tabs[6];
	return tabs[0];
}
