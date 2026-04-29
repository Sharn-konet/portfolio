import { getWorkList, getWritingList, getVideoList } from '$lib/content';

export const prerender = true;

const ORIGIN = 'https://sharnko.net';

export function GET() {
	const staticUrls = ['/', '/work', '/projects', '/writing', '/photos', '/videos', '/skills'];
	const workUrls = getWorkList().map((w) => `/work/${w.slug}`);
	const writingUrls = getWritingList()
		.filter((w) => !w.external)
		.map((w) => `/writing/${w.slug}`);
	const videoUrls = getVideoList().map((v) => `/videos/${v.slug}`);
	const all = [...staticUrls, ...workUrls, ...writingUrls, ...videoUrls];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((u) => `\t<url><loc>${ORIGIN}${u}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
