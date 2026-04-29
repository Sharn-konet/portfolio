<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children, stagger = 70 } = $props<{
		children: import('svelte').Snippet;
		stagger?: number;
	}>();

	let host: HTMLDivElement;

	onMount(() => {
		if (!browser) return;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const lines = Array.from(host.querySelectorAll<HTMLElement>('[data-reveal]'));
		if (lines.length === 0) return;

		// Cursor element follows the scan
		const cursor = document.createElement('span');
		cursor.className = 'reveal-cursor';
		cursor.setAttribute('aria-hidden', 'true');
		host.appendChild(cursor);

		// Initial state: hide all lines, move cursor to top of first
		for (const el of lines) {
			el.style.opacity = '0';
		}
		// Force layout so first frame is hidden before transitions start
		void host.offsetHeight;

		if (reduced) {
			// Reveal everything immediately, no animation
			for (const el of lines) {
				el.style.opacity = '';
			}
			cursor.remove();
			return;
		}

		const positionCursor = (el: HTMLElement) => {
			const lr = el.getBoundingClientRect();
			const hr = host.getBoundingClientRect();
			cursor.style.transform = `translate(${lr.right - hr.left + 4}px, ${lr.top - hr.top + lr.height - 16}px)`;
		};

		// Start cursor at top-left of first line
		positionCursor(lines[0]);
		cursor.classList.add('visible');

		let cancelled = false;
		const reveal = (i: number) => {
			if (cancelled || i >= lines.length) {
				// Park at end of last line, fade out the moving cursor
				cursor.classList.add('done');
				setTimeout(() => cursor.remove(), 800);
				return;
			}
			const el = lines[i];
			el.style.transition = 'opacity 220ms ease-out';
			el.style.opacity = '1';
			positionCursor(el);
			setTimeout(() => reveal(i + 1), stagger);
		};
		// Small delay so the cursor is visible briefly before first line appears
		const start = setTimeout(() => reveal(0), 50);

		return () => {
			cancelled = true;
			clearTimeout(start);
			cursor.remove();
			for (const el of lines) {
				el.style.opacity = '';
				el.style.transition = '';
			}
		};
	});
</script>

<div bind:this={host} class="reveal">
	{@render children?.()}
</div>

<style>
	.reveal {
		position: relative;
	}
	:global(.reveal-cursor) {
		position: absolute;
		top: 0;
		left: 0;
		width: 10px;
		height: 18px;
		background: #ffffff;
		opacity: 0;
		pointer-events: none;
		z-index: 4;
		box-shadow:
			0 0 8px rgba(255, 255, 255, 0.9),
			0 0 16px rgba(160, 230, 240, 0.7),
			0 0 32px rgba(120, 200, 220, 0.4);
		transition: transform 120ms ease-out, opacity 200ms;
		will-change: transform, opacity;
	}
	:global(.reveal-cursor.visible) {
		opacity: 1;
		animation: reveal-blink 0.7s steps(1) infinite;
	}
	:global(.reveal-cursor.done) {
		animation: reveal-blink 1.1s steps(1) infinite;
	}
	@keyframes reveal-blink {
		50% {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.reveal-cursor) {
			display: none;
		}
	}
</style>
