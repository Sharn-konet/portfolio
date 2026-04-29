import { getWritingList } from '$lib/content';

export const prerender = true;

const ORIGIN = 'https://sharnko.net';

function escape(s: string) {
	return s.replace(/[&<>"']/g, (c) => {
		switch (c) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '"':
				return '&quot;';
			case "'":
				return '&apos;';
			default:
				return c;
		}
	});
}

export function GET() {
	const items = getWritingList();
	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>sharnko.net — writing</title>
		<link>${ORIGIN}/writing</link>
		<description>engineering posts and notes by sharn-konet reitsma.</description>
		<atom:link href="${ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />
${items
	.map(
		(p) => `\t\t<item>
\t\t\t<title>${escape(p.title)}</title>
\t\t\t<link>${ORIGIN}/writing/${p.slug}</link>
\t\t\t<guid isPermaLink="true">${ORIGIN}/writing/${p.slug}</guid>
\t\t\t<pubDate>${new Date(p.date).toUTCString()}</pubDate>
${p.description ? `\t\t\t<description>${escape(p.description)}</description>` : ''}
\t\t</item>`
	)
	.join('\n')}
	</channel>
</rss>
`;
	return new Response(rss, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
}
