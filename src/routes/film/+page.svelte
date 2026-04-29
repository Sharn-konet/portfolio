<script lang="ts">
	const FILM_URL = ''; // TODO: youtube / vimeo embed url
</script>

<svelte:head>
	<title>intensive care — sharnko.net</title>
	<meta name="description" content="intensive care, 2017 — short documentary about an icu doctor." />
</svelte:head>

<div class="film">
	{#if FILM_URL}
		<iframe
			src={FILM_URL}
			title="intensive care (2017)"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			loading="lazy"
		></iframe>
	{:else}
		<div class="placeholder">
			<div class="title">Intensive Care</div>
			<div class="meta">2017 · Short Documentary</div>
			<div class="note">// Awaiting upload — embed URL not yet wired in.</div>
			<a class="back" href="/writing">← Back</a>
		</div>
	{/if}
</div>

<style>
	.film {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
	}
	.film iframe {
		width: 100%;
		height: 100%;
		border: 0;
	}
	.placeholder {
		text-align: center;
		color: var(--phosphor);
		padding: 40px;
	}
	.title {
		font-size: 22px;
		letter-spacing: 0.06em;
		margin-bottom: 6px;
		text-shadow: 0 0 4px var(--glow), 0 0 12px var(--glow-soft);
	}
	.meta {
		font-size: 12px;
		color: var(--phosphor-dim);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		margin-bottom: 28px;
	}
	.note {
		font-size: 12px;
		color: var(--phosphor-mid);
		margin-bottom: 18px;
	}
	.back {
		font-size: 12px;
		color: var(--phosphor-dim);
		letter-spacing: 0.12em;
	}
	.back:hover {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}
</style>
