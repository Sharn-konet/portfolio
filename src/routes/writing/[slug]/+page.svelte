<script lang="ts">
	import RevealText from '$lib/components/RevealText.svelte';

	let { data } = $props();
	let Component = $derived(data.Component);

	function formatDate(s: string): string {
		if (!s) return '';
		const [y, m, d] = s.split('-');
		return `${y}.${m}.${d}`;
	}
</script>

<RevealText>
	<header class="post" data-reveal>
		<h1>{data.meta.title}</h1>
		<div class="sub">
			<span class="date">{formatDate(data.meta.date)}</span>
			{#if data.meta.draft}
				<span class="sep">·</span>
				<span class="draft">Draft</span>
			{/if}
		</div>
	</header>
	<div class="divider" data-reveal></div>
	<article class="prose">
		<Component />
	</article>
	<a class="back" href="/writing">← Back to Writing</a>
</RevealText>

<style>
	.post h1 {
		font-size: 18px;
		margin: 0 0 6px;
		font-weight: 400;
		color: var(--phosphor);
		letter-spacing: 0.02em;
		text-shadow: 0 0 4px var(--glow), 0 0 12px var(--glow-soft);
		max-width: 640px;
	}
	.sub {
		font-size: 12px;
		color: var(--phosphor-dim);
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.draft {
		color: var(--accent);
		text-shadow: 0 0 4px var(--accent-glow);
	}
	.sep {
		margin: 0 8px;
		opacity: 0.5;
	}
	.divider {
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(140, 200, 220, 0.3) 30%,
			rgba(140, 200, 220, 0.3) 70%,
			transparent
		);
		margin: 18px 0;
	}
	.prose {
		font-size: 14px;
		line-height: 1.85;
		max-width: 640px;
	}
	.prose :global(p) {
		margin: 0 0 1em;
	}
	.prose :global(blockquote) {
		border-left: 2px solid rgba(140, 200, 220, 0.4);
		padding: 4px 16px;
		margin: 0 0 1em;
		color: var(--phosphor-mid);
		font-style: normal;
	}
	.prose :global(code) {
		font-family: var(--font-mono);
		background: rgba(140, 200, 220, 0.08);
		padding: 1px 6px;
		border-radius: 2px;
		font-size: 0.92em;
		text-shadow: none;
	}
	.prose :global(pre) {
		background: var(--screen-deep);
		border: 1px solid rgba(140, 200, 220, 0.18);
		padding: 12px 14px;
		overflow-x: auto;
		margin: 0 0 1em;
	}
	.prose :global(pre code) {
		background: none;
		padding: 0;
	}
	.prose :global(a) {
		color: var(--phosphor);
		border-bottom: 1px dashed rgba(140, 200, 220, 0.4);
	}
	.prose :global(a:hover) {
		color: var(--accent);
		border-bottom-color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}
	.back {
		display: inline-block;
		margin-top: 32px;
		font-size: 12px;
		color: var(--phosphor-dim);
		letter-spacing: 0.12em;
		transition: color 100ms, text-shadow 100ms;
	}
	.back:hover {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}
</style>
