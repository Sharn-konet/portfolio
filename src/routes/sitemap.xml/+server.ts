import { getWorkList, getWritingList } from '$lib/content';

export const prerender = true;

const ORIGIN = 'https://sharnko.net';

export function GET() {
	const staticUrls = ['/', '/work', '/projects', '/writing', '/photos', '/contact', '/film'];
	const workUrls = getWorkList().map((w) => `/work/${w.slug}`);
	const writingUrls = getWritingList().map((w) => `/writing/${w.slug}`);
	const all = [...staticUrls, ...workUrls, ...writingUrls];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((u) => `\t<url><loc>${ORIGIN}${u}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
