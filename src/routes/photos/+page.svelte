<script lang="ts">
	import RevealText from '$lib/components/RevealText.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let { data } = $props();
	const photos = $derived(data.flat);

	let lightboxIndex = $state<number | null>(null);

	async function play(name: 'click' | 'kachunk') {
		try {
			const { sound } = await import('$lib/sound/engine');
			sound[name]();
		} catch {
			/* ignore */
		}
	}

	function open(i: number) {
		lightboxIndex = i;
		play('kachunk');
	}
	function close() {
		lightboxIndex = null;
	}
</script>

<RevealText>
	{#if data.flat.length === 0}
		<div class="empty" data-reveal>
			<div class="prose">
				<span class="muted">// No photographs loaded.</span>
			</div>
			<div class="prose hint">
				Drop images into <code>static/gallery/</code>, at the top level or grouped into
				subfolders, and they'll appear here. Supports
				<code>.jpg</code> / <code>.jpeg</code> / <code>.png</code>, with optional matching
				<code>.avif</code> and <code>.webp</code> variants for better compression.
			</div>
		</div>
	{:else}
		<div class="grid" data-reveal>
			{#each photos as photo, i (photo.href)}
				<button class="tile" onclick={() => open(i)} aria-label={photo.caption ?? 'photo'}>
					<picture>
						{#if photo.avif}<source srcset={photo.avif} type="image/avif" />{/if}
						{#if photo.webp}<source srcset={photo.webp} type="image/webp" />{/if}
						<img
						src={photo.href}
						alt={photo.alt}
						width={photo.width}
						height={photo.height}
						loading="lazy"
						decoding="async"
					/>
					</picture>
				</button>
			{/each}
		</div>
	{/if}
</RevealText>

{#if lightboxIndex !== null}
	<Lightbox {photos} bind:index={lightboxIndex} onClose={close} />
{/if}

<style>
	.empty {
		max-width: 600px;
	}
	.prose {
		font-size: var(--font-base);
		line-height: 1.7;
		margin-bottom: 1em;
	}
	.muted {
		color: var(--phosphor-mid);
		text-shadow: 0 0 2px rgba(80, 140, 160, 0.3);
	}
	.hint {
		font-size: var(--font-small);
		color: var(--phosphor-mid);
	}
	code {
		font-family: var(--font-mono);
		background: rgba(140, 200, 220, 0.08);
		padding: 1px 6px;
		border-radius: 2px;
		font-size: 0.92em;
		text-shadow: none;
		color: var(--phosphor);
	}
	.grid {
		columns: 3;
		column-gap: 14px;
		margin-bottom: 24px;
	}
	@media (max-width: 1024px) {
		.grid {
			columns: 2;
			column-gap: 12px;
		}
	}
	@media (max-width: 600px) {
		.grid {
			columns: 1;
		}
	}
	.tile {
		display: block;
		width: 100%;
		margin-bottom: 14px;
		break-inside: avoid;
		padding: 0;
		background: var(--screen-deep);
		border: 1px solid rgba(140, 200, 220, 0.18);
		transition: border-color 100ms, box-shadow 200ms, transform 200ms;
	}
	.tile:hover {
		border-color: rgba(160, 230, 240, 0.5);
		box-shadow: 0 0 24px rgba(120, 200, 220, 0.18);
		transform: translateY(-1px);
	}
	.tile:focus {
		outline: none;
	}
	.tile:focus-visible {
		outline: 1px solid rgba(160, 230, 240, 0.7);
		outline-offset: 2px;
	}
	.tile picture,
	.tile img {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
