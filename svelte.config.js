import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.svx', '.md']
		})
	],
	kit: {
		adapter: adapter({
			fallback: undefined,
			strict: true
		}),
		alias: {
			$content: 'src/content'
		},
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;
