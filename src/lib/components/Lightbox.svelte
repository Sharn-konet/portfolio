<script lang="ts">
	import type { Photo } from '$lib/gallery';
	import { onMount } from 'svelte';

	let {
		photos,
		index = $bindable(0),
		onClose
	}: { photos: Photo[]; index: number; onClose: () => void } = $props();

	let current = $derived(photos[index]);

	function prev() {
		index = (index - 1 + photos.length) % photos.length;
	}
	function next() {
		index = (index + 1) % photos.length;
	}

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			else if (e.key === 'ArrowLeft') prev();
			else if (e.key === 'ArrowRight') next();
		};
		document.addEventListener('keydown', onKey);
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
		};
	});
</script>

<div
	class="lightbox"
	role="dialog"
	aria-modal="true"
	aria-label={current?.caption ?? 'Photo'}
>
	<button class="backdrop" onclick={onClose} aria-label="Close"></button>
	<button class="nav prev" onclick={prev} aria-label="Previous">◀</button>
	<button class="nav next" onclick={next} aria-label="Next">▶</button>
	<button class="close" onclick={onClose} aria-label="Close">✕ Close</button>
	<picture>
		{#if current.avif}<source srcset={current.avif} type="image/avif" />{/if}
		{#if current.webp}<source srcset={current.webp} type="image/webp" />{/if}
		<img src={current.href} alt={current.alt} />
	</picture>
	{#if current.caption}<div class="caption">{current.caption}</div>{/if}
	<div class="counter">{index + 1} / {photos.length}</div>
</div>

<style>
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(5, 8, 14, 0.96);
		font-family: var(--font-mono);
	}
	.backdrop {
		position: absolute;
		inset: 0;
		cursor: none;
		z-index: 1;
		background: transparent;
	}
	picture {
		position: relative;
		z-index: 2;
		max-width: 92vw;
		max-height: 88vh;
		display: block;
	}
	picture img {
		max-width: 92vw;
		max-height: 88vh;
		object-fit: contain;
		display: block;
		filter: drop-shadow(0 0 30px rgba(120, 200, 220, 0.18));
	}
	.nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 3;
		font-size: 18px;
		color: var(--phosphor-mid);
		padding: 16px 22px;
		text-shadow: 0 0 6px var(--glow-soft);
		transition: color 100ms, text-shadow 100ms;
	}
	.nav:hover {
		color: var(--phosphor);
		text-shadow: 0 0 6px var(--glow), 0 0 14px var(--glow-soft);
	}
	.nav.prev {
		left: 12px;
	}
	.nav.next {
		right: 12px;
	}
	.close {
		position: absolute;
		top: 18px;
		right: 18px;
		z-index: 3;
		font-size: var(--font-tiny);
		letter-spacing: 0.16em;
		color: var(--phosphor-dim);
		text-shadow: 0 0 4px var(--glow-soft);
	}
	.close:hover {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}
	.caption {
		position: absolute;
		bottom: 26px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 3;
		color: var(--phosphor-mid);
		font-size: var(--font-small);
		letter-spacing: 0.1em;
		text-shadow: 0 0 4px var(--glow-soft);
	}
	.counter {
		position: absolute;
		top: 18px;
		left: 18px;
		z-index: 3;
		color: var(--phosphor-dim);
		font-size: var(--font-tiny);
		letter-spacing: 0.14em;
		font-variant-numeric: tabular-nums;
		text-shadow: 0 0 4px var(--glow-soft);
	}
</style>
