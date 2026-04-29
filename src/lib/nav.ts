export type Tab = {
	slug: string;
	label: string;
	href: string;
	id: string;
	path: string;
};

export const tabs: Tab[] = [
	{ slug: 'about', label: 'about', href: '/', id: 'SKR·SELF', path: '~/about.md' },
	{ slug: 'skills', label: 'skills', href: '/skills', id: 'SKR·KIT', path: '~/skills/' },
	{ slug: 'work', label: 'work', href: '/work', id: 'SKR·HIST', path: '~/work/' },
	{
		slug: 'writing',
		label: 'writing',
		href: '/writing',
		id: 'SKR·LOGS',
		path: '~/writing/'
	},
	{ slug: 'photos', label: 'photos', href: '/photos', id: 'SKR·PICS', path: '~/photos/' },
	{ slug: 'contact', label: 'contact', href: '/contact', id: 'SKR·LINK', path: '~/contact.md' }
];

export function activeTab(pathname: string): Tab {
	if (pathname === '/' || pathname.startsWith('/about')) return tabs[0];
	if (pathname.startsWith('/skills')) return tabs[1];
	if (pathname.startsWith('/work')) return tabs[2];
	if (pathname.startsWith('/writing')) return tabs[3];
	if (pathname.startsWith('/photos')) return tabs[4];
	if (pathname.startsWith('/contact')) return tabs[5];
	return tabs[0];
}
