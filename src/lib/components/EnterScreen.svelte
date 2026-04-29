<script lang="ts">
	import { onMount } from 'svelte';
	import { soundEnabled } from '$lib/stores/sound';

	let { onEnter }: { onEnter: () => void } = $props();

	let entered = false;

	async function enter() {
		if (entered) return;
		entered = true;
		if ($soundEnabled) {
			try {
				const { sound } = await import('$lib/sound/engine');
				if (!sound.enabled) await sound.enable();
				else await sound.resume();
			} catch {
				/* ignore */
			}
		}
		onEnter();
	}

	function onKey(e: KeyboardEvent) {
		// any key triggers enter
		if (e.key === 'Tab') return; // let users tab to the button
		enter();
	}

	onMount(() => {
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="enter" aria-label="Enter terminal" onclick={enter}>
	<div class="stack">
		<div class="title">SHARNKO.NET</div>
		<div class="sub">PERSONAL PORTFOLIO</div>
		<button class="cta" type="button" onclick={(e) => { e.stopPropagation(); enter(); }}>
			<span class="bracket">[</span>
			<span class="label">PRESS TO ENTER</span>
			<span class="bracket">]</span>
		</button>
	</div>
</div>

<style>
	.enter {
		position: absolute;
		inset: 0;
		z-index: 25;
		background: var(--screen);
		color: var(--phosphor);
		font-family: var(--font-mono);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		text-shadow: 0 0 4px var(--glow), 0 0 12px var(--glow-soft);
	}
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}
	.title {
		font-size: 22px;
		letter-spacing: 0.32em;
	}
	.sub {
		font-size: 12px;
		letter-spacing: 0.32em;
		color: var(--phosphor-mid);
	}
	.cta {
		margin-top: 22px;
		background: transparent;
		border: 0;
		font: inherit;
		color: var(--phosphor);
		font-size: 16px;
		letter-spacing: 0.24em;
		padding: 10px 4px;
		text-shadow: 0 0 4px var(--glow), 0 0 12px var(--glow-soft);
		animation: cta-blink 1.4s steps(1) infinite;
	}
	.cta:hover,
	.cta:focus-visible {
		color: var(--phosphor);
		outline: none;
		animation: none;
		text-shadow: 0 0 6px var(--glow), 0 0 18px var(--glow-soft);
	}
	.bracket {
		color: var(--phosphor-mid);
		margin: 0 8px;
	}
	@keyframes cta-blink {
		50% { opacity: 0.55; }
	}
	@media (max-width: 600px) {
		.title { font-size: 18px; }
		.cta { font-size: 14px; }
	}
</style>
