<script lang="ts">
	import { page } from '$app/state';
	import { tabs, activeTab } from '$lib/nav';

	let tab = $derived(activeTab(page.url.pathname));
	let index = $derived(tabs.findIndex((t) => t.slug === tab.slug));
</script>

<footer>
	<div class="left">
		<span class="brand">SKR</span>
		<span class="sep">·</span>
		<span class="loc">Auckland · NZ</span>
	</div>
	<div class="right">
		<span><span class="dot" aria-hidden="true">●</span> Ready</span>
		<span class="sep">·</span>
		<span class="muted">{index + 1} of {tabs.length}</span>
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
		text-transform: uppercase;
	}
	.left,
	.right {
		display: flex;
		gap: 14px;
		align-items: center;
	}
	.brand {
		color: var(--phosphor);
		text-shadow: 0 0 6px var(--glow), 0 0 12px var(--glow-soft);
		letter-spacing: 0.22em;
	}
	.loc {
		color: var(--phosphor-mid);
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
