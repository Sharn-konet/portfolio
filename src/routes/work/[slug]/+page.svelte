<script lang="ts">
	import RevealText from '$lib/components/RevealText.svelte';

	let { data } = $props();
	let Component = $derived(data.Component);
</script>

<RevealText>
	<header class="entry" data-reveal>
		<h1>{data.meta.title}</h1>
		<div class="sub">
			<span class="org">{data.meta.org}</span>
			<span class="sep">·</span>
			<span class="range">{data.range}</span>
		</div>
	</header>
	<div class="divider" data-reveal></div>
	<article class="prose" data-reveal>
		<Component />
	</article>
	<a class="back" href="/work" data-reveal>← back to work</a>
</RevealText>

<style>
	.entry h1 {
		font-size: 18px;
		margin: 0 0 6px;
		font-weight: 400;
		color: var(--phosphor);
		letter-spacing: 0.04em;
		text-shadow: 0 0 4px var(--glow), 0 0 12px var(--glow-soft);
	}
	.sub {
		font-size: 12px;
		color: var(--phosphor-dim);
		letter-spacing: 0.14em;
		text-transform: uppercase;
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
		line-height: 1.8;
		max-width: 640px;
	}
	.prose :global(p) {
		margin: 0 0 1em;
	}
	.prose :global(ul) {
		padding-left: 1.2em;
		margin: 0 0 1em;
	}
	.prose :global(li) {
		margin-bottom: 0.4em;
	}
	.prose :global(li::marker) {
		color: var(--phosphor-dim);
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
