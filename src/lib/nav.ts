export type Tab = {
	slug: string;
	label: string;
	href: string;
	id: string;
	path: string;
};

export const tabs: Tab[] = [
	{ slug: 'about', label: 'about', href: '/', id: '0X4Q·SELF', path: '~/about.md' },
	{ slug: 'work', label: 'work', href: '/work', id: '0X4Q·HIST', path: '~/work/' },
	{
		slug: 'writing',
		label: 'writing',
		href: '/writing',
		id: '0X4Q·LOGS',
		path: '~/writing/'
	},
	{ slug: 'photos', label: 'photos', href: '/photos', id: '0X4Q·LUME', path: '~/photos/' },
	{ slug: 'contact', label: 'contact', href: '/contact', id: '0X4Q·LINK', path: '~/contact.md' }
];

export function activeTab(pathname: string): Tab {
	if (pathname === '/' || pathname.startsWith('/about')) return tabs[0];
	if (pathname.startsWith('/work')) return tabs[1];
	if (pathname.startsWith('/writing')) return tabs[2];
	if (pathname.startsWith('/photos')) return tabs[3];
	if (pathname.startsWith('/contact')) return tabs[4];
	return tabs[0];
}
