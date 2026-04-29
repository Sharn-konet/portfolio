<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let cursor: HTMLDivElement;
	let trail: HTMLDivElement;

	onMount(() => {
		if (!browser) return;
		// Disable on touch devices
		if (window.matchMedia('(hover: none)').matches) return;

		let mx = window.innerWidth / 2;
		let my = window.innerHeight / 2;
		let cx = mx,
			cy = my,
			tx = mx,
			ty = my;
		let visible = false;
		let raf: number;
		let lastTk = 0;

		cursor.style.opacity = '0';
		trail.style.opacity = '0';

		const onMove = (e: MouseEvent) => {
			mx = e.clientX;
			my = e.clientY;
			if (!visible) {
				cursor.style.opacity = '1';
				trail.style.opacity = '1';
				visible = true;
			}
		};
		const onLeave = () => {
			cursor.style.opacity = '0';
			trail.style.opacity = '0';
			visible = false;
		};

		const interactiveSel = 'a, button, [data-interactive]';

		const onOver = async (e: MouseEvent) => {
			const t = e.target as Element;
			if (t.closest && t.closest(interactiveSel)) {
				cursor.classList.add('locked');
				const now = performance.now();
				if (now - lastTk > 50) {
					lastTk = now;
					try {
						const { sound } = await import('$lib/sound/engine');
						sound.tk();
					} catch {
						/* sound module not yet loaded */
					}
				}
			}
		};
		const onOut = (e: MouseEvent) => {
			const t = e.target as Element;
			const r = e.relatedTarget as Element | null;
			const from = t?.closest && t.closest(interactiveSel);
			const to = r?.closest && r.closest(interactiveSel);
			if (from && !to) cursor.classList.remove('locked');
		};

		const tick = () => {
			// Cursor tracks the mouse 1:1 — no smoothing, no lag.
			// The trail keeps a soft lerp for the afterimage effect.
			cx = mx;
			cy = my;
			tx += (mx - tx) * 0.22;
			ty += (my - ty) * 0.22;
			cursor.style.transform = `translate(${cx}px, ${cy}px)`;
			trail.style.transform = `translate(${tx}px, ${ty}px)`;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseleave', onLeave);
		document.addEventListener('mouseover', onOver);
		document.addEventListener('mouseout', onOut);

		return () => {
			cancelAnimationFrame(raf);
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseleave', onLeave);
			document.removeEventListener('mouseover', onOver);
			document.removeEventListener('mouseout', onOut);
		};
	});
</script>

<div class="trail" bind:this={trail} aria-hidden="true"></div>
<div class="cursor" bind:this={cursor} aria-hidden="true"></div>

<style>
	.cursor,
	.trail {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 9999;
		will-change: transform, opacity;
		transition: opacity 200ms;
	}
	.cursor {
		width: 8px;
		height: 8px;
		margin-left: -4px;
		margin-top: -4px;
		background: var(--phosphor);
		border-radius: 1px;
		box-shadow: 0 0 6px var(--glow), 0 0 12px var(--glow-soft);
		transition: width 120ms, height 120ms, margin 120ms, background 120ms, border-radius 120ms,
			border 120ms, opacity 200ms;
	}
	:global(.cursor.locked) {
		width: 14px !important;
		height: 14px !important;
		margin-left: -7px !important;
		margin-top: -7px !important;
		background: transparent !important;
		background-image: none !important;
		border: 1px solid var(--accent) !important;
		box-shadow: 0 0 8px var(--accent-glow), 0 0 16px rgba(255, 183, 77, 0.35) !important;
	}
	.trail {
		width: 22px;
		height: 22px;
		margin-left: -11px;
		margin-top: -11px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(140, 220, 235, 0.25) 0%, transparent 70%);
	}
	@media (hover: none) {
		.cursor,
		.trail {
			display: none;
		}
	}
</style>
