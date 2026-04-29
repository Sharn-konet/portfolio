<script lang="ts">
	import { page } from '$app/state';
	import { tabs, activeTab } from '$lib/nav';
	import SoundToggle from './SoundToggle.svelte';

	let tab = $derived(activeTab(page.url.pathname));
	let index = $derived(tabs.findIndex((t) => t.slug === tab.slug));
	let path = $derived.by(() => {
		const p = page.url.pathname;
		if (p === '/') return '~/about.md';
		if (p === '/work') return '~/work/';
		if (p.startsWith('/work/')) return `~/work/${p.split('/')[2]}.md`;
		if (p === '/writing') return '~/writing/';
		if (p.startsWith('/writing/')) return `~/writing/${p.split('/')[2]}.md`;
		if (p === '/photos') return '~/photos/';
		if (p.startsWith('/photos/')) return `~/photos/${p.split('/')[2]}/`;
		if (p === '/contact') return '~/contact.md';
		if (p === '/film') return '~/film.mp4';
		return tab.path;
	});
</script>

<footer>
	<div class="left">
		<span aria-live="polite">{path}</span>
	</div>
	<div class="right">
		<span><span class="dot" aria-hidden="true">●</span> Ready</span>
		<span class="sep">·</span>
		<span class="muted">{index + 1} of {tabs.length}</span>
		<SoundToggle />
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid rgba(140, 200, 220, 0.22);
		padding: 12px 28px;
		font-size: var(--font-tiny);
		letter-spacing: 0.14em;
		color: var(--phosphor-dim);
		display: flex;
		justify-content: space-between;
		background: rgba(140, 200, 220, 0.04);
		text-shadow: 0 0 3px var(--glow-soft);
		flex-shrink: 0;
	}
	.left,
	.right {
		display: flex;
		gap: 14px;
		align-items: center;
	}
	.dot {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}
	.sep {
		opacity: 0.4;
	}
	.muted {
		font-variant-numeric: tabular-nums;
	}
	@media (max-width: 1024px) {
		footer {
			padding: 10px 22px;
		}
	}
	@media (max-width: 600px) {
		footer {
			padding: 8px 14px;
			letter-spacing: 0.1em;
		}
		.right {
			gap: 8px;
		}
		.sep {
			display: none;
		}
	}
</style>
