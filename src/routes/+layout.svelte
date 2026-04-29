<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { soundEnabled } from '$lib/stores/sound';
	import CRT from '$lib/components/CRT.svelte';
	import Header from '$lib/components/Header.svelte';
	import TabStrip from '$lib/components/TabStrip.svelte';
	import StatusBar from '$lib/components/StatusBar.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import KeyboardShortcuts from '$lib/components/KeyboardShortcuts.svelte';
	import HelpOverlay from '$lib/components/HelpOverlay.svelte';

	let { children } = $props();

	let isFilm = $derived(page.url.pathname === '/film');
	let routeKey = $derived(page.url.pathname);

	$effect(() => {
		if (!browser || !$soundEnabled) return;
		import('$lib/sound/engine').then(({ sound }) => {
			sound.setBed('crt');
		});
	});
</script>

<svelte:head>
	<title>{page.data?.pageTitle ?? 'sharnko.net'}</title>
	<meta
		name="description"
		content={page.data?.pageDescription ??
			'Sharn-Konet Reitsma — founding engineer, sometimes filmmaker, occasional photographer.'}
	/>
</svelte:head>

<a class="skip-link" href="#main">skip to content</a>

<CRT>
	<Header />
	{#if !isFilm}
		<TabStrip />
	{/if}
	<main id="main" class="body" class:film={isFilm}>
		{#key routeKey}
			{@render children()}
		{/key}
	</main>
	<StatusBar />
</CRT>

<Cursor />
<KeyboardShortcuts />
<HelpOverlay />

<style>
	.body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: var(--pad-y) var(--pad-x);
		font-size: var(--font-base);
		line-height: 1.7;
		color: var(--phosphor);
		text-shadow: 0 0 3px var(--glow-soft), 0 0 8px rgba(80, 160, 180, 0.25);
		scrollbar-width: thin;
		scrollbar-color: rgba(140, 200, 220, 0.3) transparent;
	}
	.body::-webkit-scrollbar {
		width: 8px;
	}
	.body::-webkit-scrollbar-thumb {
		background: rgba(140, 200, 220, 0.25);
		border-radius: 4px;
	}
	.body::-webkit-scrollbar-thumb:hover {
		background: rgba(140, 200, 220, 0.45);
	}
	.body.film {
		padding: 0;
		display: flex;
	}
</style>
