<script lang="ts">
	import { onMount } from 'svelte';
	import { reducedMotion } from '$lib/stores/motion';
	import BootScreen from './BootScreen.svelte';
	import EnterScreen from './EnterScreen.svelte';

	let { children } = $props();

	type PowerState = 'enter' | 'loading' | 'on';
	let powerState = $state<PowerState>('on');

	function startBoot() {
		powerState = 'loading';
	}

	function finishBoot() {
		powerState = 'on';
	}

	onMount(() => {
		powerState = 'enter';
	});
</script>

<div class="case">
	<div class="screen" data-state={powerState} class:flicker-off={$reducedMotion}>
		<div class="curve" aria-hidden="true"></div>
		<div class="glow-layer" aria-hidden="true"></div>
		<div class="scroll-band" aria-hidden="true"></div>
		<div class="content">
			{@render children?.()}
		</div>
		<div class="scanlines" aria-hidden="true"></div>
		<div class="rgb-mask" aria-hidden="true"></div>
		<div class="vignette" aria-hidden="true"></div>
		{#if powerState === 'loading'}
			<BootScreen onDone={finishBoot} />
		{/if}
		{#if powerState === 'enter'}
			<EnterScreen onEnter={startBoot} />
		{/if}
	</div>
</div>

<style>
	.case {
		position: fixed;
		inset: 0;
		padding: var(--case-padding);
		background: radial-gradient(ellipse at center, #1a1410 0%, #050402 80%);
		z-index: 0;
	}

	.screen {
		position: relative;
		width: 100%;
		height: 100%;
		background: var(--screen);
		border-radius: var(--crt-radius);
		overflow: hidden;
		box-shadow:
			inset 0 0 80px rgba(0, 0, 0, 0.85),
			inset 0 0 220px rgba(0, 0, 0, 0.55),
			0 0 0 1px rgba(0, 0, 0, 0.9),
			0 0 60px rgba(120, 200, 220, 0.08),
			0 0 140px rgba(120, 200, 220, 0.04);
		isolation: isolate;
		animation: flicker 6s infinite;
	}

	.flicker-off {
		animation: none;
	}

	@keyframes flicker {
		0%,
		96%,
		100% {
			opacity: 1;
		}
		97% {
			opacity: 0.93;
		}
		98% {
			opacity: 1;
		}
		98.5% {
			opacity: 0.96;
		}
	}

	/* Curvature highlight — fakes barrel distortion via a top sheen + corner darkening */
	.curve {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 7;
		background:
			radial-gradient(
				ellipse 80% 60% at 50% -10%,
				rgba(255, 255, 255, 0.06) 0%,
				transparent 50%
			),
			radial-gradient(
				ellipse 40% 40% at 0% 100%,
				rgba(0, 0, 0, 0.35) 0%,
				transparent 60%
			),
			radial-gradient(
				ellipse 40% 40% at 100% 100%,
				rgba(0, 0, 0, 0.35) 0%,
				transparent 60%
			);
	}

	.scanlines {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, var(--scanline-opacity)) 0,
			rgba(0, 0, 0, var(--scanline-opacity)) 1px,
			transparent 1px,
			transparent 3px
		);
		z-index: 12;
		mix-blend-mode: multiply;
	}

	/* Subtle RGB mask — fakes phosphor triad columns */
	.rgb-mask {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image: repeating-linear-gradient(
			90deg,
			rgba(255, 0, 0, 0.04) 0,
			rgba(255, 0, 0, 0.04) 1px,
			rgba(0, 255, 0, 0.04) 1px,
			rgba(0, 255, 0, 0.04) 2px,
			rgba(0, 0, 255, 0.04) 2px,
			rgba(0, 0, 255, 0.04) 3px
		);
		z-index: 11;
		mix-blend-mode: screen;
	}

	.vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse at center,
			transparent 35%,
			rgba(0, 0, 0, calc(var(--vignette-strength) * 0.5)) 80%,
			rgba(0, 0, 0, var(--vignette-strength)) 100%
		);
		z-index: 13;
	}

	.glow-layer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse at center,
			rgba(120, 200, 220, 0.07) 0%,
			transparent 70%
		);
		z-index: 8;
	}

	.scroll-band {
		position: absolute;
		left: 0;
		right: 0;
		height: 120px;
		background: linear-gradient(
			180deg,
			transparent 0%,
			rgba(150, 220, 240, 0.05) 50%,
			transparent 100%
		);
		z-index: 9;
		pointer-events: none;
		animation: roll 8s linear infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.scroll-band,
		.rgb-mask {
			display: none;
		}
	}
	@keyframes roll {
		0% {
			top: -120px;
		}
		100% {
			top: 100%;
		}
	}

	.content {
		position: relative;
		width: 100%;
		height: 100%;
		z-index: 1;
		transform-origin: center center;
		display: flex;
		flex-direction: column;
	}

	:global(html.js) [data-state='enter'] .content,
	:global(html.js) [data-state='loading'] .content {
		opacity: 0;
	}
</style>
