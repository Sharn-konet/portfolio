<script lang="ts">
	import RevealText from '$lib/components/RevealText.svelte';

	let { data } = $props();
	let Component = $derived(data.Component);

	let embedSrc = $derived.by(() => {
		const m = data.meta;
		if (m.platform === 'youtube') {
			return `https://www.youtube-nocookie.com/embed/${m.embedId}`;
		}
		const hash = m.embedHash ? `?h=${m.embedHash}` : '';
		return `https://player.vimeo.com/video/${m.embedId}${hash}`;
	});
</script>

<RevealText>
	<header class="post" data-reveal>
		<h1>{data.meta.title}</h1>
		<div class="sub">
			<span class="kind">{data.meta.kind}</span>
			<span class="sep">·</span>
			<span class="year">{data.meta.year}</span>
		</div>
	</header>

	<div class="player" data-reveal>
		<iframe
			src={embedSrc}
			title={data.meta.title}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowfullscreen
			loading="lazy"
			referrerpolicy="strict-origin-when-cross-origin"
		></iframe>
	</div>

	<article class="prose" data-reveal>
		<Component />
	</article>

	<a class="back" href="/videos">← Back to Videos</a>
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
	.sep {
		margin: 0 8px;
		opacity: 0.5;
	}
	.player {
		margin: 22px 0 28px;
		max-width: 820px;
		aspect-ratio: 16 / 9;
		background: #000;
		border: 1px solid rgba(140, 200, 220, 0.18);
		box-shadow: 0 0 18px rgba(80, 160, 180, 0.12);
	}
	.player iframe {
		width: 100%;
		height: 100%;
		display: block;
		border: 0;
	}
	.prose {
		font-size: 14px;
		line-height: 1.85;
		max-width: 640px;
	}
	.prose :global(p) {
		margin: 0 0 1em;
	}
	.prose :global(p:last-child) {
		margin-bottom: 0;
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
