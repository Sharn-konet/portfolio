<script lang="ts">
	import { onMount } from 'svelte';
	import { reducedMotion } from '$lib/stores/motion';
	import {
		attractors,
		computeNormalization,
		computeProjBounds,
		generateInitialStates,
		stepParticle,
		type Vec3,
		type Normalization,
		type ProjBounds
	} from '$lib/attractors';

	let canvas: HTMLCanvasElement;
	let activeIdx = $state(0);
	let paused = $state(false);

	const PARTICLES = 90;
	const ROTATION_SPEED = 0.18; // rad/s, slow tumble around Z (vertical)
	const STEPS_PER_FRAME = 4;
	const TILT = -0.18; // ~10° X-axis tilt for depth

	function fmtParams(p: Record<string, number>) {
		return Object.entries(p)
			.map(([k, v]) => `${k}=${(+v.toFixed(3)).toString()}`)
			.join('  ');
	}

	async function play(name: 'click' | 'kachunk') {
		try {
			const { sound } = await import('$lib/sound/engine');
			sound[name]();
		} catch {
			/* ignore */
		}
	}

	function selectSystem(i: number) {
		if (i === activeIdx) return;
		activeIdx = i;
		play('kachunk');
	}

	function togglePause() {
		paused = !paused;
		play('click');
	}

	onMount(() => {
		const ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) return;

		let raf = 0;
		let dpr = Math.min(2, window.devicePixelRatio || 1);
		let particles: Vec3[] = [];
		let norm: Normalization = { center: [0, 0, 0], scale: 1 };
		let bounds: ProjBounds = { maxX: 1, maxY: 1 };
		let rotZ = 0;
		let lastTime = 0;
		let currentIdx = activeIdx;
		let cssWidth = 0;
		let cssHeight = 0;

		function resize() {
			const r = canvas.getBoundingClientRect();
			cssWidth = r.width;
			cssHeight = r.height;
			canvas.width = Math.max(1, Math.round(r.width * dpr));
			canvas.height = Math.max(1, Math.round(r.height * dpr));
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			fillBg();
		}

		function fillBg() {
			ctx!.fillStyle = '#0a1f3a';
			ctx!.fillRect(0, 0, cssWidth, cssHeight);
		}

		function reseed(idx: number) {
			const sys = attractors[idx];
			norm = computeNormalization(sys, sys.defaultParams);
			bounds = computeProjBounds(sys, sys.defaultParams, norm, TILT);
			particles = generateInitialStates(sys, PARTICLES, 0.05);
			// Spread particles around the attractor by stepping each one a
			// different number of warmup steps. Without this, particles sit on
			// top of each other for many seconds before chaos pulls them apart.
			const baseWarmup = 800;
			for (let i = 0; i < particles.length; i++) {
				const extra = Math.floor((i / particles.length) * 1200);
				const total = baseWarmup + extra;
				let s = particles[i];
				for (let k = 0; k < total; k++) {
					s = stepParticle(s, sys, sys.defaultParams);
				}
				particles[i] = s;
			}
			rotZ = 0;
			fillBg();
		}

		function frame(t: number) {
			if (currentIdx !== activeIdx) {
				currentIdx = activeIdx;
				reseed(currentIdx);
			}

			if (!lastTime) lastTime = t;
			const dt = Math.min(0.05, (t - lastTime) / 1000);
			lastTime = t;

			if (!paused) {
				if (!$reducedMotion) rotZ += ROTATION_SPEED * dt;

				// Phosphor decay — translucent screen wash leaves trails fading
				ctx!.fillStyle = 'rgba(10, 31, 58, 0.035)';
				ctx!.fillRect(0, 0, cssWidth, cssHeight);

				const sys = attractors[currentIdx];
				const cx = cssWidth / 2;
				const cy = cssHeight / 2;
				// Fit the per-attractor projected bounds inside the canvas with a
				// small margin. This is the only thing that keeps every system
				// (including the asymmetric ones) inside the frame at every
				// rotation.
				const drawScale =
					Math.min(cx / bounds.maxX, cy / bounds.maxY) * 0.92;
				const cosZ = Math.cos(rotZ);
				const sinZ = Math.sin(rotZ);
				const cosT = Math.cos(TILT);
				const sinT = Math.sin(TILT);

				ctx!.globalCompositeOperation = 'lighter';
				for (let i = 0; i < particles.length; i++) {
					let s = particles[i];
					for (let k = 0; k < STEPS_PER_FRAME; k++) {
						s = stepParticle(s, sys, sys.defaultParams);
					}
					particles[i] = s;
					const nx = (s[0] - norm.center[0]) / norm.scale;
					const ny = (s[1] - norm.center[1]) / norm.scale;
					const nz = (s[2] - norm.center[2]) / norm.scale;

					// Rotate around world Z (vertical screen axis), then tilt
					// around world X for depth feel. World X→screen X, world
					// Z→screen Y (negated because screen Y is down). World Y is
					// depth (into screen). This gives the famous Lorenz view at
					// rotZ=0 — wings in X-Z plane, slowly tumbling.
					const wx = nx * cosZ - ny * sinZ;
					const wy = nx * sinZ + ny * cosZ;
					const ty = wy * cosT - nz * sinT;
					const tz = wy * sinT + nz * cosT;

					const px = cx + wx * drawScale;
					const py = cy - tz * drawScale;
					// Depth = ty (positive toward camera with negative tilt)
					const depth = Math.max(0, Math.min(1, (ty + 1.4) / 2.8));
					const a = 0.4 + 0.6 * depth;
					const r = 1.3 + 0.7 * depth;
					ctx!.fillStyle = `rgba(180, 230, 240, ${a.toFixed(3)})`;
					ctx!.beginPath();
					ctx!.arc(px, py, r, 0, Math.PI * 2);
					ctx!.fill();
				}
				ctx!.globalCompositeOperation = 'source-over';
			}

			raf = requestAnimationFrame(frame);
		}

		resize();
		reseed(currentIdx);
		raf = requestAnimationFrame(frame);

		const onResize = () => resize();
		window.addEventListener('resize', onResize);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
		};
	});

	let activeName = $derived(attractors[activeIdx].name);
	let activeParams = $derived(fmtParams(attractors[activeIdx].defaultParams));
</script>

<section class="sim" data-reveal>
	<div class="header">
		<span class="tag">// Simulation · Strange Attractors</span>
		<span class="meta">{activeName.toUpperCase()} · RK4 · {PARTICLES} PARTICLES</span>
	</div>

	<div class="viewport-wrap">
		<div class="viewport">
			<canvas bind:this={canvas} aria-label="Strange attractor simulation"></canvas>
			<div class="overlay top-left">RK4 · dt={attractors[activeIdx].dt}</div>
			<div class="overlay top-right">{paused ? '◼ PAUSED' : '▸ RUNNING'}</div>
			<div class="overlay bottom">{activeParams}</div>
			<button
				class="pause-btn"
				class:paused
				onclick={togglePause}
				type="button"
				aria-label={paused ? 'Resume simulation' : 'Pause simulation'}
			>
				{paused ? '▸' : '❚❚'}
			</button>
		</div>
	</div>

	<div class="controls">
		<div class="presets">
			{#each attractors as sys, i (sys.name)}
				<button
					class="preset"
					class:active={activeIdx === i}
					onclick={() => selectSystem(i)}
					type="button"
				>
					<span class="bracket left" aria-hidden="true">[ </span>
					<span class="label">{sys.name}</span>
					<span class="bracket right" aria-hidden="true"> ]</span>
				</button>
			{/each}
		</div>
	</div>
</section>

<style>
	.sim {
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: 100%;
		min-height: 0;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		font-size: var(--font-tiny);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--phosphor-dim);
		flex-shrink: 0;
	}
	.header .tag {
		color: var(--phosphor-mid);
	}
	.viewport-wrap {
		flex: 1;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		container-type: size;
		overflow: hidden;
	}
	.viewport {
		position: relative;
		aspect-ratio: 4 / 3;
		width: min(100cqw, calc(100cqh * 4 / 3));
		border: 1px solid rgba(140, 200, 220, 0.25);
		background: var(--screen);
		overflow: hidden;
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
	.overlay {
		position: absolute;
		font-size: 10px;
		letter-spacing: 0.16em;
		color: var(--phosphor-dim);
		text-shadow: 0 0 4px var(--glow-soft);
		pointer-events: none;
		font-variant-numeric: tabular-nums;
	}
	.overlay.top-left {
		top: 10px;
		left: 12px;
	}
	.overlay.top-right {
		top: 10px;
		right: 12px;
		color: var(--phosphor);
	}
	.overlay.bottom {
		bottom: 10px;
		left: 12px;
		right: 12px;
		text-align: center;
		color: var(--phosphor-mid);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.pause-btn {
		position: absolute;
		bottom: 12px;
		right: 12px;
		width: 38px;
		height: 38px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: rgba(10, 31, 58, 0.55);
		border: 1px solid rgba(140, 200, 220, 0.35);
		color: var(--phosphor);
		font-family: var(--font-mono);
		font-size: 13px;
		letter-spacing: 0.05em;
		text-shadow: 0 0 4px var(--glow), 0 0 12px var(--glow-soft);
		transition: background 120ms, border-color 120ms, color 120ms;
		padding: 0;
		z-index: 4;
	}
	.pause-btn:hover {
		background: rgba(140, 200, 220, 0.18);
		border-color: rgba(140, 200, 220, 0.65);
	}
	.pause-btn.paused {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow), 0 0 14px rgba(255, 183, 77, 0.4);
	}
	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		flex-shrink: 0;
	}
	.presets {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 14px;
	}
	.preset {
		background: transparent;
		border: 0;
		font: inherit;
		font-size: var(--font-small);
		letter-spacing: 0.08em;
		color: var(--phosphor-dim);
		padding: 4px 0;
		transition: color 100ms, text-shadow 100ms;
	}
	.preset:hover {
		color: var(--phosphor-mid);
		text-shadow: 0 0 6px var(--glow-soft);
	}
	.preset.active {
		color: var(--phosphor);
		text-shadow: 0 0 4px var(--glow), 0 0 12px var(--glow-soft);
	}
	.preset .bracket {
		color: var(--phosphor-mid);
		visibility: hidden;
	}
	.preset.active .bracket {
		visibility: visible;
	}
	@media (max-width: 700px) {
		.header {
			flex-direction: column;
			align-items: flex-start;
			gap: 4px;
		}
		.viewport {
			aspect-ratio: 4 / 3;
		}
		.overlay.bottom {
			font-size: 9px;
		}
	}
</style>
