// RK4 ODE solver and all 21 chaotic attractor systems
// Ported from Flo.jl (src/Solvers.jl and src/ExampleFunctions.jl)

export type Vec3 = [number, number, number];
export type DerivativeFn = (state: Vec3, params: Record<string, number>) => Vec3;

export interface AttractorSystem {
  name: string;
  derivative: DerivativeFn;
  defaultParams: Record<string, number>;
  initialState: Vec3;
  dt: number;
  scale: number;
}

// RK4 solver using Butcher tableau:
// α = [1/6, 1/3, 1/3, 1/6], β = [0, 1/2, 1/2, 1]
function rk4Step(f: DerivativeFn, state: Vec3, params: Record<string, number>, dt: number): Vec3 {
  const k1 = f(state, params);
  const k2 = f(
    [state[0] + dt * 0.5 * k1[0], state[1] + dt * 0.5 * k1[1], state[2] + dt * 0.5 * k1[2]],
    params
  );
  const k3 = f(
    [state[0] + dt * 0.5 * k2[0], state[1] + dt * 0.5 * k2[1], state[2] + dt * 0.5 * k2[2]],
    params
  );
  const k4 = f(
    [state[0] + dt * k3[0], state[1] + dt * k3[1], state[2] + dt * k3[2]],
    params
  );

  return [
    state[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    state[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    state[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

export interface Normalization {
  center: Vec3;
  scale: number;
  /** Sampled trajectory points for spawning particles across the attractor */
  spawnPoints: Vec3[];
}

/**
 * Pre-solve the attractor to compute bounding box, then return center offset
 * and scale factor so the attractor fills a [-1,1]^3 cube.
 */
export function computeNormalization(
  system: AttractorSystem,
  params: Record<string, number>,
  samplePoints: number = 10000
): Normalization {
  let state: Vec3 = [...system.initialState];
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let validSamples = 0;
  const spawnPoints: Vec3[] = [];

  // Skip transient (first 10% of samples)
  const skip = Math.floor(samplePoints * 0.1);
  for (let i = 0; i < skip; i++) {
    state = rk4Step(system.derivative, state, params, system.dt);
    if (!isFinite(state[0]) || !isFinite(state[1]) || !isFinite(state[2])) {
      state = [...system.initialState];
      break;
    }
  }

  // Sample every Nth point for spawn positions (collect ~500 evenly spaced)
  const spawnInterval = Math.max(1, Math.floor(samplePoints / 500));

  for (let i = 0; i < samplePoints; i++) {
    if (!isFinite(state[0]) || !isFinite(state[1]) || !isFinite(state[2])) break;
    minX = Math.min(minX, state[0]); maxX = Math.max(maxX, state[0]);
    minY = Math.min(minY, state[1]); maxY = Math.max(maxY, state[1]);
    minZ = Math.min(minZ, state[2]); maxZ = Math.max(maxZ, state[2]);
    if (i % spawnInterval === 0) {
      spawnPoints.push([...state]);
    }
    validSamples++;
    state = rk4Step(system.derivative, state, params, system.dt);
  }

  // Fallback if no valid samples or bounds are degenerate
  if (validSamples === 0 || !isFinite(minX) || !isFinite(maxX)) {
    return {
      center: [...system.initialState],
      scale: system.scale || 1,
      spawnPoints: [system.initialState],
    };
  }

  const center: Vec3 = [
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2,
  ];
  const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
  const scale = extent > 1e-10 ? extent / 2 : 1;

  return { center, scale, spawnPoints };
}

/**
 * Normalize a point: center then scale to [-1,1]^3
 */
export function normalizePoint(p: Vec3, norm: Normalization): Vec3 {
  const x = (p[0] - norm.center[0]) / norm.scale;
  const y = (p[1] - norm.center[1]) / norm.scale;
  const z = (p[2] - norm.center[2]) / norm.scale;
  // Guard against NaN/Infinity leaking into GPU buffers
  if (!isFinite(x) || !isFinite(y) || !isFinite(z)) return [0, 0, 0];
  return [x, y, z];
}

/**
 * Generate perturbed initial states for multiple particles.
 * Each is a small random offset from the system's initialState.
 */
export function generateInitialStates(
  system: AttractorSystem,
  count: number,
  perturbScale: number = 0.01
): Vec3[] {
  const states: Vec3[] = [];
  const base = system.initialState;
  const mag = Math.max(Math.abs(base[0]), Math.abs(base[1]), Math.abs(base[2]), 1);
  for (let i = 0; i < count; i++) {
    states.push([
      base[0] + (Math.random() - 0.5) * 2 * perturbScale * mag,
      base[1] + (Math.random() - 0.5) * 2 * perturbScale * mag,
      base[2] + (Math.random() - 0.5) * 2 * perturbScale * mag,
    ]);
  }
  return states;
}

/**
 * Step a single particle forward by one RK4 step.
 */
export function stepParticle(
  state: Vec3,
  system: AttractorSystem,
  params: Record<string, number>
): Vec3 {
  const next = rk4Step(system.derivative, state, params, system.dt);
  if (!isFinite(next[0]) || !isFinite(next[1]) || !isFinite(next[2])) {
    return state; // freeze on divergence
  }
  return next;
}

// Legacy solver kept for reference but no longer used by renderer
export function solveAttractor(
  system: AttractorSystem,
  params: Record<string, number>,
  numPoints: number
): Float32Array {
  const norm = computeNormalization(system, params);
  const positions = new Float32Array(numPoints * 3);
  let state: Vec3 = [...system.initialState];

  for (let i = 0; i < numPoints; i++) {
    const n = normalizePoint(state, norm);
    positions[i * 3] = n[0];
    positions[i * 3 + 1] = n[1];
    positions[i * 3 + 2] = n[2];
    state = rk4Step(system.derivative, state, params, system.dt);
    if (!isFinite(state[0]) || !isFinite(state[1]) || !isFinite(state[2])) {
      for (let j = i + 1; j < numPoints; j++) {
        positions[j * 3] = positions[i * 3];
        positions[j * 3 + 1] = positions[i * 3 + 1];
        positions[j * 3 + 2] = positions[i * 3 + 2];
      }
      break;
    }
  }

  return positions;
}

// ============================================
// All 21 attractor systems
// ============================================

export const lorenz: AttractorSystem = {
  name: 'Lorenz',
  derivative: ([x, y, z], { sigma, rho, beta }) => [
    sigma * (y - x),
    x * (rho - z) - y,
    x * y - beta * z,
  ],
  defaultParams: { sigma: 10, rho: 28, beta: 8 / 3 },
  initialState: [1, 1, 1],
  dt: 0.005,
  scale: 25,
};

export const tsucs1: AttractorSystem = {
  name: 'TSUCS1',
  derivative: ([x, y, z], { alpha, beta, delta, epsilon, zeta }) => [
    alpha * (y - x) + delta * x * z,
    beta * x - x * z + epsilon * y,
    zeta * z + x * y - delta * x * x,
  ],
  defaultParams: { alpha: 40, beta: 0.833, delta: 0.5, epsilon: 0.65, zeta: 20 },
  initialState: [1, 1, 1],
  dt: 0.001,
  scale: 40,
};

export const tsucs2: AttractorSystem = {
  name: 'TSUCS2',
  derivative: ([x, y, z], { alpha, delta, varsigma, zeta, beta, epsilon }) => [
    alpha * (y - x) + delta * x * z,
    varsigma * x - x * z + epsilon * y,
    zeta * z + x * y - beta * x * x,
  ],
  defaultParams: { alpha: 40, delta: 0.16, varsigma: 55, zeta: 20, beta: 1.833, epsilon: 0.65 },
  initialState: [1, 1, 1],
  dt: 0.0005,
  scale: 60,
};

export const yuWang: AttractorSystem = {
  name: 'Yu-Wang',
  derivative: ([x, y, z], { alpha, beta, sigma, delta }) => [
    alpha * (y - x),
    beta * x - alpha * x * z,
    Math.exp(x * y) - sigma * z + delta,
  ],
  defaultParams: { alpha: 10, beta: 40, sigma: 2, delta: 2.5 },
  initialState: [1, 1, 1],
  dt: 0.001,
  scale: 20,
};

export const aizawa: AttractorSystem = {
  name: 'Aizawa',
  derivative: ([x, y, z], { alpha, beta, sigma, delta, epsilon, zeta }) => [
    (z - beta) * x - delta * y,
    delta * x + (z - beta) * y,
    sigma + alpha * z - (z * z * z) / 3 - (x * x + y * y) * (1 + epsilon * z) + zeta * z * x * x * x,
  ],
  defaultParams: { alpha: 0.95, beta: 0.7, sigma: 0.6, delta: 3.5, epsilon: 0.25, zeta: 0.1 },
  initialState: [0.1, 0, 0],
  dt: 0.005,
  scale: 1.5,
};

export const thomas: AttractorSystem = {
  name: 'Thomas',
  derivative: ([x, y, z], { beta }) => [
    Math.sin(y) - beta * x,
    Math.sin(z) - beta * y,
    Math.sin(x) - beta * z,
  ],
  defaultParams: { beta: 0.19 },
  initialState: [1, 0, 0],
  dt: 0.03,
  scale: 4,
};

export const rucklidge: AttractorSystem = {
  name: 'Rucklidge',
  derivative: ([x, y, z], { kappa, alpha }) => [
    -kappa * x + alpha * y - y * z,
    x,
    -z + y * y,
  ],
  defaultParams: { kappa: 2, alpha: 6.7 },
  initialState: [1, 0, 4.5],
  dt: 0.01,
  scale: 8,
};

export const genesioTesi: AttractorSystem = {
  name: 'Genesio-Tesi',
  derivative: ([x, y, z], { alpha, beta, sigma }) => [
    y,
    z,
    -alpha * x - beta * y - sigma * z + x * x,
  ],
  defaultParams: { alpha: 0.44, beta: 1.1, sigma: 1.0 },
  initialState: [0.1, 0.1, 0.1],
  dt: 0.01,
  scale: 1.5,
};

export const finance: AttractorSystem = {
  name: 'Finance',
  derivative: ([x, y, z], { alpha, beta, sigma }) => [
    (1 / beta - alpha) * x + x * y + z,
    -beta * y - x * x,
    -x - sigma * z,
  ],
  defaultParams: { alpha: 0.001, beta: 0.2, sigma: 1.1 },
  initialState: [0.1, 0.1, 0.1],
  dt: 0.02,
  scale: 4,
};

export const shimizuMorioka: AttractorSystem = {
  name: 'Shimizu-Morioka',
  derivative: ([x, y, z], { alpha, beta }) => [
    y,
    (1 - z) * x - alpha * y,
    x * x - beta * z,
  ],
  defaultParams: { alpha: 0.75, beta: 0.45 },
  initialState: [0.1, 0.1, 0.1],
  dt: 0.02,
  scale: 2,
};

export const noseHoover: AttractorSystem = {
  name: 'Nosé-Hoover',
  derivative: ([x, y, z], { alpha }) => [
    y,
    -x + y * z,
    alpha - y * y,
  ],
  defaultParams: { alpha: 1.5 },
  initialState: [0.1, 0, 0],
  dt: 0.02,
  scale: 3,
};

export const liuChen: AttractorSystem = {
  name: 'Liu-Chen',
  derivative: ([x, y, z], { alpha, beta, sigma, delta, epsilon, zeta, eta }) => [
    alpha * y + beta * x + sigma * y * z,
    delta * y - z + epsilon * x * z,
    zeta * z + eta * x * y,
  ],
  defaultParams: { alpha: 2.4, beta: -3.78, sigma: 14, delta: -11, epsilon: 4, zeta: 5.58, eta: 1 },
  initialState: [1, 1, 1],
  dt: 0.001,
  scale: 15,
};

export const arneodo: AttractorSystem = {
  name: 'Arneodo',
  derivative: ([x, y, z], { alpha, beta, sigma }) => [
    y,
    z,
    -alpha * x - beta * y - z + sigma * x * x * x,
  ],
  defaultParams: { alpha: -5.5, beta: 3.5, sigma: -1.0 },
  initialState: [0.1, 0, 0],
  dt: 0.01,
  scale: 4,
};

export const bouali: AttractorSystem = {
  name: 'Bouali',
  derivative: ([x, y, z], { alpha, sigma }) => [
    x * (4 - y) + alpha * z,
    -y * (1 - x * x),
    -x * (1.5 - sigma * z) - 0.05 * z,
  ],
  defaultParams: { alpha: 0.3, sigma: 1.0 },
  initialState: [1, 0.1, 0.1],
  dt: 0.01,
  scale: 5,
};

export const burkeShaw: AttractorSystem = {
  name: 'Burke-Shaw',
  derivative: ([x, y, z], { sigma, nu }) => [
    -sigma * (x + y),
    -y - sigma * x * z,
    sigma * x * y + nu,
  ],
  defaultParams: { sigma: 10, nu: 4.272 },
  initialState: [1, 0, 0],
  dt: 0.005,
  scale: 3,
};

export const chenCelikovsky: AttractorSystem = {
  name: 'Chen-Celikovsky',
  derivative: ([x, y, z], { alpha, beta, sigma }) => [
    alpha * (y - x),
    (alpha - beta) * x - x * z + sigma * y,
    x * y - beta * z,
  ],
  defaultParams: { alpha: 36, beta: 3, sigma: 20 },
  initialState: [1, 1, 1],
  dt: 0.002,
  scale: 30,
};

export const chenLee: AttractorSystem = {
  name: 'Chen-Lee',
  derivative: ([x, y, z], { alpha, beta, sigma }) => [
    alpha * x - y * z,
    beta * y + x * z,
    sigma * z + x * y / 3,
  ],
  defaultParams: { alpha: 5, beta: -10, sigma: -0.38 },
  initialState: [1, 0, 4.5],
  dt: 0.003,
  scale: 20,
};

export const hadley: AttractorSystem = {
  name: 'Hadley',
  derivative: ([x, y, z], { alpha, beta, zeta, eta }) => [
    -y * y - z * z - alpha * x + alpha * zeta,
    x * y - beta * x * z - y + eta,
    beta * x * y + x * z - z,
  ],
  defaultParams: { alpha: 0.2, beta: 4, zeta: 8, eta: 1 },
  initialState: [0.1, 0, 0],
  dt: 0.01,
  scale: 2,
};

export const halvorsen: AttractorSystem = {
  name: 'Halvorsen',
  derivative: ([x, y, z], { alpha }) => [
    -alpha * x - 4 * y - 4 * z - y * y,
    -alpha * y - 4 * z - 4 * x - z * z,
    -alpha * z - 4 * x - 4 * y - x * x,
  ],
  defaultParams: { alpha: 1.4 },
  initialState: [-5, 0, 0],
  dt: 0.005,
  scale: 12,
};

export const newtonLeipnik: AttractorSystem = {
  name: 'Newton-Leipnik',
  derivative: ([x, y, z], { alpha, beta }) => [
    -alpha * x + y + 10 * y * z,
    -x - 0.4 * y + 5 * x * z,
    beta * z - 5 * x * y,
  ],
  defaultParams: { alpha: 0.4, beta: 0.175 },
  initialState: [0.349, 0, -0.16],
  dt: 0.02,
  scale: 0.8,
};

export const lorenzMod2: AttractorSystem = {
  name: 'Lorenz Mod 2',
  derivative: ([x, y, z], { alpha, beta, sigma, delta }) => [
    -alpha * x + y * y - z * z + alpha * sigma,
    x * (y - beta * z) + delta,
    z + x * (beta * y + z),
  ],
  defaultParams: { alpha: 0.9, beta: 5, sigma: 9.9, delta: 1 },
  initialState: [0.1, 0.1, 0.1],
  dt: 0.005,
  scale: 5,
};

// Export all systems as an array
export const allSystems: AttractorSystem[] = [
  lorenz,
  tsucs1,
  tsucs2,
  yuWang,
  aizawa,
  thomas,
  rucklidge,
  genesioTesi,
  finance,
  shimizuMorioka,
  noseHoover,
  liuChen,
  arneodo,
  bouali,
  burkeShaw,
  chenCelikovsky,
  chenLee,
  hadley,
  halvorsen,
  newtonLeipnik,
  lorenzMod2,
];
