// Strange-attractor simulation core.
// RK4 integrator + a curated selection of chaotic systems, ported from the
// original Flo.jl-derived implementation that lived under src/lib/attractors.ts
// before the CRT redesign (commit 370d9209). Stripped of the Three.js coupling
// — this version is renderer-agnostic so a Canvas2D phosphor view can use it.

export type Vec3 = [number, number, number];
export type DerivativeFn = (state: Vec3, params: Record<string, number>) => Vec3;

export interface AttractorSystem {
	name: string;
	derivative: DerivativeFn;
	defaultParams: Record<string, number>;
	initialState: Vec3;
	dt: number;
}

export interface Normalization {
	center: Vec3;
	scale: number;
}

function rk4Step(f: DerivativeFn, s: Vec3, p: Record<string, number>, dt: number): Vec3 {
	const k1 = f(s, p);
	const k2 = f([s[0] + dt * 0.5 * k1[0], s[1] + dt * 0.5 * k1[1], s[2] + dt * 0.5 * k1[2]], p);
	const k3 = f([s[0] + dt * 0.5 * k2[0], s[1] + dt * 0.5 * k2[1], s[2] + dt * 0.5 * k2[2]], p);
	const k4 = f([s[0] + dt * k3[0], s[1] + dt * k3[1], s[2] + dt * k3[2]], p);
	return [
		s[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
		s[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
		s[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2])
	];
}

export function stepParticle(state: Vec3, system: AttractorSystem, params: Record<string, number>): Vec3 {
	const next = rk4Step(system.derivative, state, params, system.dt);
	if (!isFinite(next[0]) || !isFinite(next[1]) || !isFinite(next[2])) {
		return [...system.initialState];
	}
	return next;
}

// Run the system silently for `samples` steps to find a bounding box, then
// return offset+scale that maps the attractor into a unit cube.
export function computeNormalization(
	system: AttractorSystem,
	params: Record<string, number>,
	samples = 8000
): Normalization {
	let s: Vec3 = [...system.initialState];
	const skip = Math.floor(samples * 0.1);
	for (let i = 0; i < skip; i++) {
		s = rk4Step(system.derivative, s, params, system.dt);
		if (!isFinite(s[0])) {
			s = [...system.initialState];
			break;
		}
	}
	let minX = Infinity, minY = Infinity, minZ = Infinity;
	let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
	let valid = 0;
	for (let i = 0; i < samples; i++) {
		if (!isFinite(s[0]) || !isFinite(s[1]) || !isFinite(s[2])) break;
		minX = Math.min(minX, s[0]); maxX = Math.max(maxX, s[0]);
		minY = Math.min(minY, s[1]); maxY = Math.max(maxY, s[1]);
		minZ = Math.min(minZ, s[2]); maxZ = Math.max(maxZ, s[2]);
		valid++;
		s = rk4Step(system.derivative, s, params, system.dt);
	}
	if (!valid || !isFinite(minX)) return { center: [...system.initialState], scale: 1 };
	const center: Vec3 = [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2];
	const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
	return { center, scale: extent > 1e-10 ? extent / 2 : 1 };
}

export function generateInitialStates(system: AttractorSystem, count: number, perturb = 0.02): Vec3[] {
	const out: Vec3[] = [];
	const b = system.initialState;
	const mag = Math.max(Math.abs(b[0]), Math.abs(b[1]), Math.abs(b[2]), 1);
	for (let i = 0; i < count; i++) {
		out.push([
			b[0] + (Math.random() - 0.5) * 2 * perturb * mag,
			b[1] + (Math.random() - 0.5) * 2 * perturb * mag,
			b[2] + (Math.random() - 0.5) * 2 * perturb * mag
		]);
	}
	return out;
}

export interface ProjBounds {
	maxX: number;
	maxY: number;
}

/**
 * Sample the attractor's trajectory and project it at many rotZ angles.
 * Returns the worst-case projected |x|/|y| under the renderer's tumble so the
 * caller can fit `drawScale` to keep every frame inside the canvas.
 */
export function computeProjBounds(
	system: AttractorSystem,
	params: Record<string, number>,
	norm: Normalization,
	tilt: number,
	sampleSteps = 4000,
	rotSamples = 24
): ProjBounds {
	let maxX = 0;
	let maxY = 0;
	let s: Vec3 = [...system.initialState];
	const skip = Math.floor(sampleSteps * 0.1);
	for (let i = 0; i < skip; i++) {
		s = rk4Step(system.derivative, s, params, system.dt);
		if (!isFinite(s[0])) {
			s = [...system.initialState];
			break;
		}
	}
	const cosT = Math.cos(tilt);
	const sinT = Math.sin(tilt);
	const cosArr = new Float64Array(rotSamples);
	const sinArr = new Float64Array(rotSamples);
	for (let r = 0; r < rotSamples; r++) {
		const a = (r / rotSamples) * Math.PI * 2;
		cosArr[r] = Math.cos(a);
		sinArr[r] = Math.sin(a);
	}
	for (let i = 0; i < sampleSteps; i++) {
		if (!isFinite(s[0]) || !isFinite(s[1]) || !isFinite(s[2])) break;
		const nx = (s[0] - norm.center[0]) / norm.scale;
		const ny = (s[1] - norm.center[1]) / norm.scale;
		const nz = (s[2] - norm.center[2]) / norm.scale;
		for (let r = 0; r < rotSamples; r++) {
			const wx = nx * cosArr[r] - ny * sinArr[r];
			const wy = nx * sinArr[r] + ny * cosArr[r];
			const tz = wy * sinT + nz * cosT;
			const ax = Math.abs(wx);
			const ay = Math.abs(tz);
			if (ax > maxX) maxX = ax;
			if (ay > maxY) maxY = ay;
		}
		s = rk4Step(system.derivative, s, params, system.dt);
	}
	if (maxX < 1e-6) maxX = 1;
	if (maxY < 1e-6) maxY = 1;
	return { maxX, maxY };
}

// ============ Systems ============
// Selected from the original 21 for visual variety — classic, smooth, cyclic,
// curly, and cyclic-symmetric forms.

export const lorenz: AttractorSystem = {
	name: 'Lorenz',
	derivative: ([x, y, z], { sigma, rho, beta }) => [
		sigma * (y - x),
		x * (rho - z) - y,
		x * y - beta * z
	],
	defaultParams: { sigma: 10, rho: 28, beta: 8 / 3 },
	initialState: [1, 1, 1],
	dt: 0.005
};

export const aizawa: AttractorSystem = {
	name: 'Aizawa',
	derivative: ([x, y, z], { alpha, beta, sigma, delta, epsilon, zeta }) => [
		(z - beta) * x - delta * y,
		delta * x + (z - beta) * y,
		sigma + alpha * z - (z * z * z) / 3 - (x * x + y * y) * (1 + epsilon * z) + zeta * z * x * x * x
	],
	defaultParams: { alpha: 0.95, beta: 0.7, sigma: 0.6, delta: 3.5, epsilon: 0.25, zeta: 0.1 },
	initialState: [0.1, 0, 0],
	dt: 0.005
};

export const thomas: AttractorSystem = {
	name: 'Thomas',
	derivative: ([x, y, z], { beta }) => [
		Math.sin(y) - beta * x,
		Math.sin(z) - beta * y,
		Math.sin(x) - beta * z
	],
	defaultParams: { beta: 0.19 },
	initialState: [1, 0, 0],
	dt: 0.03
};

export const halvorsen: AttractorSystem = {
	name: 'Halvorsen',
	derivative: ([x, y, z], { alpha }) => [
		-alpha * x - 4 * y - 4 * z - y * y,
		-alpha * y - 4 * z - 4 * x - z * z,
		-alpha * z - 4 * x - 4 * y - x * x
	],
	defaultParams: { alpha: 1.4 },
	initialState: [-5, 0, 0],
	dt: 0.005
};

export const rucklidge: AttractorSystem = {
	name: 'Rucklidge',
	derivative: ([x, y, z], { kappa, alpha }) => [
		-kappa * x + alpha * y - y * z,
		x,
		-z + y * y
	],
	defaultParams: { kappa: 2, alpha: 6.7 },
	initialState: [1, 0, 4.5],
	dt: 0.01
};

export const shimizuMorioka: AttractorSystem = {
	name: 'Shimizu-Morioka',
	derivative: ([x, y, z], { alpha, beta }) => [
		y,
		(1 - z) * x - alpha * y,
		x * x - beta * z
	],
	defaultParams: { alpha: 0.75, beta: 0.45 },
	initialState: [0.1, 0.1, 0.1],
	dt: 0.02
};

export const attractors: AttractorSystem[] = [
	lorenz,
	aizawa,
	thomas,
	halvorsen,
	rucklidge,
	shimizuMorioka
];
