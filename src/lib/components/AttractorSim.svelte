<script lang="ts">
	import { onMount } from 'svelte';
	import {
		attractors,
		computeStats,
		generateInitialStates,
		stepParticle,
		type Vec3,
		type Normalization
	} from '$lib/attractors';

	let canvas: HTMLCanvasElement;
	let viewport: HTMLDivElement;
	let activeIdx = $state(0);
	let paused = $state(false);

	const PARTICLES = 90;
	const STEPS_PER_FRAME = 2;
	// Render-time slowdown applied on top of each system's dt. 1.0 = use the
	// system's natural dt; lower = slower, more contemplative motion.
	const SIM_SPEED = 0.5;
	const TRAIL_LEN = 40;
	const INITIAL_PITCH = -0.18; // ~10° X-axis tilt for depth
	const PITCH_LIMIT = Math.PI / 2 - 0.05;
	const ROT_SENSITIVITY = 0.006;
	const ZOOM_STEP = 1.1;
	const ZOOM_MIN = 0.4;
	const ZOOM_MAX = 4;
	// Virtual camera distance (in normalized units, where the attractor fits
	// inside radius ≈ 1). Lower → stronger perspective. Anything above ~5 starts
	// to look orthographic again.
	const CAMERA_DIST = 2.6;

	// Plain locals — read by the requestAnimationFrame loop, not the template,
	// so Svelte reactivity would just be overhead on each pointermove tick.
	let yaw = 0;
	let pitch = INITIAL_PITCH;
	let zoom = 1;
	let dragging = $state(false);
	let dragId: number | null = null;
	let lastX = 0;
	let lastY = 0;

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

	function resetView() {
		yaw = 0;
		pitch = INITIAL_PITCH;
		zoom = 1;
		play('click');
	}

	function clampPitch(p: number) {
		if (p > PITCH_LIMIT) return PITCH_LIMIT;
		if (p < -PITCH_LIMIT) return -PITCH_LIMIT;
		return p;
	}

	function onPointerDown(e: PointerEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		dragId = e.pointerId;
		lastX = e.clientX;
		lastY = e.clientY;
		dragging = true;
		viewport.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (dragId !== e.pointerId) return;
		const dx = e.clientX - lastX;
		const dy = e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
		yaw += dx * ROT_SENSITIVITY;
		pitch = clampPitch(pitch - dy * ROT_SENSITIVITY);
	}

	function onPointerUp(e: PointerEvent) {
		if (dragId !== e.pointerId) return;
		dragId = null;
		dragging = false;
		viewport.releasePointerCapture(e.pointerId);
	}

	function onDblClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		resetView();
	}

	onMount(() => {
		const ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) return;

		let raf = 0;
		let dpr = Math.min(2, window.devicePixelRatio || 1);
		let particles: Vec3[] = [];
		let trails: Vec3[][] = [];
		let norm: Normalization = { center: [0, 0, 0], scale: 1 };
		let radius = 1;
		let halfExtents: Vec3 = [1, 1, 1];
		let currentIdx = activeIdx;
		let cssWidth = 0;
		let cssHeight = 0;

		// Reused per-frame projection buffers (avoid GC pressure in the hot loop).
		const trailProjX = new Float64Array(PARTICLES * TRAIL_LEN);
		const trailProjY = new Float64Array(PARTICLES * TRAIL_LEN);
		const headPersp = new Float64Array(PARTICLES);
		const headDepth = new Float64Array(PARTICLES);
		// Pre-quantised stroke styles, one per trail-age bucket.
		const trailStyles: string[] = [];
		for (let j = 1; j < TRAIL_LEN; j++) {
			const ageFrac = j / (TRAIL_LEN - 1);
			const alpha = 0.04 + 0.45 * ageFrac;
			trailStyles[j] = `rgba(180, 230, 250, ${alpha.toFixed(3)})`;
		}

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
			const stats = computeStats(sys, sys.defaultParams);
			norm = stats.norm;
			radius = stats.radius;
			halfExtents = stats.halfExtents;
			particles = generateInitialStates(sys, PARTICLES, 0.05);
			// Spread particles around the attractor by stepping each one a
			// different number of warmup steps. Without this, particles sit on
			// top of each other for many seconds before chaos pulls them apart.
			const baseWarmup = 800;
			trails = new Array(PARTICLES);
			for (let i = 0; i < particles.length; i++) {
				const extra = Math.floor((i / particles.length) * 1200);
				const total = baseWarmup + extra;
				let s = particles[i];
				for (let k = 0; k < total; k++) {
					s = stepParticle(s, sys, sys.defaultParams);
				}
				// Fill the trail by walking TRAIL_LEN more steps so every trail
				// is full-length from frame zero — keeps the render loop branch-
				// free and the alpha gradient stable across particles.
				const renderDt = sys.dt * SIM_SPEED;
				const trail: Vec3[] = new Array(TRAIL_LEN);
				for (let k = 0; k < TRAIL_LEN; k++) {
					s = stepParticle(s, sys, sys.defaultParams, renderDt);
					trail[k] = [s[0], s[1], s[2]];
				}
				particles[i] = s;
				trails[i] = trail;
			}
			fillBg();
		}

		function frame() {
			if (currentIdx !== activeIdx) {
				currentIdx = activeIdx;
				reseed(currentIdx);
			}

			fillBg();

			const sys = attractors[currentIdx];
			const cx = cssWidth / 2;
			const cy = cssHeight / 2;
			const drawScale = (Math.min(cx, cy) / radius) * 0.92 * zoom;
			const cosY = Math.cos(yaw);
			const sinY = Math.sin(yaw);
			const cosP = Math.cos(pitch);
			const sinP = Math.sin(pitch);
			const cxN = norm.center[0];
			const cyN = norm.center[1];
			const czN = norm.center[2];
			const sN = norm.scale;
			const invR = 1 / radius;

			// Step + record new trail entry per particle.
			if (!paused) {
				const renderDt = sys.dt * SIM_SPEED;
				for (let i = 0; i < particles.length; i++) {
					let s = particles[i];
					for (let k = 0; k < STEPS_PER_FRAME; k++) {
						s = stepParticle(s, sys, sys.defaultParams, renderDt);
					}
					particles[i] = s;
					const trail = trails[i];
					trail.push([s[0], s[1], s[2]]);
					trail.shift();
				}
			}

			// Project every trail point into the shared buffers.
			for (let i = 0; i < PARTICLES; i++) {
				const trail = trails[i];
				const base = i * TRAIL_LEN;
				for (let j = 0; j < TRAIL_LEN; j++) {
					const t = trail[j];
					const nx = (t[0] - cxN) / sN;
					const ny = (t[1] - cyN) / sN;
					const nz = (t[2] - czN) / sN;
					const wx = nx * cosY - ny * sinY;
					const wy = nx * sinY + ny * cosY;
					const ty = wy * cosP - nz * sinP;
					const tz = wy * sinP + nz * cosP;
					const persp = CAMERA_DIST / Math.max(0.1, CAMERA_DIST - ty);
					trailProjX[base + j] = cx + wx * persp * drawScale;
					trailProjY[base + j] = cy - tz * persp * drawScale;
					if (j === TRAIL_LEN - 1) {
						headPersp[i] = persp;
						headDepth[i] = Math.max(0, Math.min(1, 0.5 + 0.5 * ty * invR));
					}
				}
			}

			// Stroke the trail in age buckets — one beginPath/stroke per age-step
			// across all particles, instead of one per segment.
			ctx!.globalCompositeOperation = 'lighter';
			ctx!.lineWidth = 1;
			ctx!.lineCap = 'round';
			ctx!.shadowBlur = 0;
			for (let j = 1; j < TRAIL_LEN; j++) {
				ctx!.strokeStyle = trailStyles[j];
				ctx!.beginPath();
				for (let i = 0; i < PARTICLES; i++) {
					const base = i * TRAIL_LEN;
					ctx!.moveTo(trailProjX[base + j - 1], trailProjY[base + j - 1]);
					ctx!.lineTo(trailProjX[base + j], trailProjY[base + j]);
				}
				ctx!.stroke();
			}

			// Glowing head dots.
			ctx!.shadowColor = 'rgba(140, 220, 255, 0.9)';
			for (let i = 0; i < PARTICLES; i++) {
				const headIdx = i * TRAIL_LEN + (TRAIL_LEN - 1);
				const px = trailProjX[headIdx];
				const py = trailProjY[headIdx];
				const persp = headPersp[i];
				const depth = headDepth[i];
				const a = 0.7 + 0.3 * depth;
				const r = (2 + 1.2 * depth) * persp;
				ctx!.fillStyle = `rgba(210, 240, 250, ${a.toFixed(3)})`;
				ctx!.shadowBlur = (8 + 6 * depth) * persp;
				ctx!.beginPath();
				ctx!.arc(px, py, r, 0, Math.PI * 2);
				ctx!.fill();
			}
			ctx!.shadowBlur = 0;
			ctx!.globalCompositeOperation = 'source-over';

			drawBox(cx, cy, drawScale, cosY, sinY, cosP, sinP);
			drawGizmo(cosY, sinY, cosP, sinP);

			raf = requestAnimationFrame(frame);
		}

		function drawBox(
			cx: number,
			cy: number,
			drawScale: number,
			cosY: number,
			sinY: number,
			cosP: number,
			sinP: number
		) {
			const [hx, hy, hz] = halfExtents;
			const corners: Array<[number, number, number]> = [
				[-hx, -hy, -hz], [hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz],
				[-hx, -hy, hz], [hx, -hy, hz], [hx, hy, hz], [-hx, hy, hz]
			];
			const proj: { px: number; py: number; depth: number }[] = corners.map(([nx, ny, nz]) => {
				const wx = nx * cosY - ny * sinY;
				const wy = nx * sinY + ny * cosY;
				const ty = wy * cosP - nz * sinP;
				const tz = wy * sinP + nz * cosP;
				const persp = CAMERA_DIST / Math.max(0.1, CAMERA_DIST - ty);
				return {
					px: cx + wx * persp * drawScale,
					py: cy - tz * persp * drawScale,
					depth: Math.max(0, Math.min(1, 0.5 + 0.5 * (ty / radius)))
				};
			});
			const edges: [number, number][] = [
				[0, 1], [1, 2], [2, 3], [3, 0],
				[4, 5], [5, 6], [6, 7], [7, 4],
				[0, 4], [1, 5], [2, 6], [3, 7]
			];
			ctx!.lineWidth = 1;
			ctx!.setLineDash([3, 5]);
			for (const [a, b] of edges) {
				const pa = proj[a];
				const pb = proj[b];
				const d = (pa.depth + pb.depth) / 2;
				ctx!.strokeStyle = `rgba(140, 200, 220, ${(0.08 + 0.14 * d).toFixed(3)})`;
				ctx!.beginPath();
				ctx!.moveTo(pa.px, pa.py);
				ctx!.lineTo(pb.px, pb.py);
				ctx!.stroke();
			}
			ctx!.setLineDash([]);
		}

		function drawGizmo(cosY: number, sinY: number, cosP: number, sinP: number) {
			const gx = 42;
			const gy = cssHeight - 52;
			const gr = 22;

			ctx!.lineWidth = 1.5;
			ctx!.lineCap = 'round';
			ctx!.font = '10px ui-monospace, monospace';
			ctx!.textAlign = 'center';
			ctx!.textBaseline = 'middle';

			const axes: [number, number, number, string, string][] = [
				[1, 0, 0, 'X', '255, 130, 120'],
				[0, 1, 0, 'Y', '160, 240, 170'],
				[0, 0, 1, 'Z', '140, 200, 255']
			];

			for (const [ax, ay, az, label, rgb] of axes) {
				const wx = ax * cosY - ay * sinY;
				const wy = ax * sinY + ay * cosY;
				const ty = wy * cosP - az * sinP;
				const tz = wy * sinP + az * cosP;
				const persp = CAMERA_DIST / Math.max(0.1, CAMERA_DIST - ty);
				const dx = wx * persp * gr;
				const dy = -tz * persp * gr;
				const depth = Math.max(0, Math.min(1, 0.5 + 0.5 * ty));
				ctx!.strokeStyle = `rgba(${rgb}, ${(0.45 + 0.55 * depth).toFixed(3)})`;
				ctx!.beginPath();
				ctx!.moveTo(gx, gy);
				ctx!.lineTo(gx + dx, gy + dy);
				ctx!.stroke();
				ctx!.fillStyle = `rgba(${rgb}, ${(0.6 + 0.4 * depth).toFixed(3)})`;
				ctx!.fillText(label, gx + dx * 1.32, gy + dy * 1.32);
			}
		}

		resize();
		reseed(currentIdx);
		raf = requestAnimationFrame(frame);

		const onResize = () => resize();
		window.addEventListener('resize', onResize);

		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
			const next = zoom * factor;
			zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, next));
		};
		viewport.addEventListener('wheel', onWheel, { passive: false });

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
			viewport.removeEventListener('wheel', onWheel);
		};
	});

	let activeName = $derived(attractors[activeIdx].name);
	let activeParams = $derived(fmtParams(attractors[activeIdx].defaultParams));
</script>

<section class="sim" data-reveal>
	<div class="frame">
		<div class="header">
			<span class="tag">// Simulation · Strange Attractors</span>
			<span class="meta">{activeName.toUpperCase()} · RK4 · {PARTICLES} PARTICLES</span>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="viewport"
			class:dragging
			bind:this={viewport}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
			ondblclick={onDblClick}
		>
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
			<div class="hint" aria-hidden="true">DRAG · SCROLL · DBL-CLICK RESET</div>
		</div>
	</div>
</section>

<style>
	.sim {
		height: 100%;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		container-type: size;
		overflow: hidden;
	}
	.frame {
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-height: 0;
		/* Width derived so the inner 4:3 viewport plus chrome (header +
		   controls + gaps, ~80px) fits the container. Header and controls
		   inherit this width, so they line up with the viewport edges. */
		width: min(100cqw, calc((100cqh - 80px) * 4 / 3));
		max-height: 100cqh;
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
	.viewport {
		position: relative;
		aspect-ratio: 4 / 3;
		width: 100%;
		border: 1px solid rgba(140, 200, 220, 0.25);
		background: var(--screen);
		overflow: hidden;
		cursor: grab;
		touch-action: none;
	}
	.viewport.dragging {
		cursor: grabbing;
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
	.hint {
		font-size: var(--font-tiny);
		letter-spacing: 0.18em;
		color: var(--phosphor-dim);
		white-space: nowrap;
	}
</style>
