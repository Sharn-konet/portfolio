<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import * as THREE from 'three';
  import {
    computeNormalization,
    normalizePoint,
    stepParticle,
    type AttractorSystem,
    type Vec3,
    type Normalization,
  } from '@lib/attractors';

  let {
    system,
    params,
    particleCount = 100,
    trailLength = 300,
    stepsPerFrame = 3,
    colorStart = '#3366ff',
    colorEnd = '#ff33cc',
  }: {
    system: AttractorSystem;
    params: Record<string, number>;
    particleCount?: number;
    trailLength?: number;
    stepsPerFrame?: number;
    colorStart?: string;
    colorEnd?: string;
  } = $props();

  // All simulation state managed imperatively — no $state for perf-critical data
  let particleStates: Vec3[] = [];
  let trailBuffers: Vec3[][] = [];
  let norm: Normalization = { center: [0, 0, 0], scale: 1 };
  let posAttr: THREE.BufferAttribute | null = null;
  let colAttr: THREE.BufferAttribute | null = null;
  let ready = false;

  // Plain variable for disposal (never read inside $effect to avoid loops)
  let prevGeo: THREE.BufferGeometry | null = null;

  // The geometry is $state ONLY so the template {#if} can react — write-only from effects
  let geometry: THREE.BufferGeometry | undefined = $state(undefined);

  const material = new THREE.PointsMaterial({
    size: 2.5,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  function buildGeometry() {
    const total = particleCount * trailLength;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 4);

    posAttr = new THREE.BufferAttribute(positions, 3);
    colAttr = new THREE.BufferAttribute(colors, 4);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    colAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('color', colAttr);

    // Fill initial positions from trail buffers
    for (let p = 0; p < particleCount; p++) {
      for (let t = 0; t < trailLength; t++) {
        const idx = p * trailLength + t;
        const pt = trailBuffers[p][t];
        positions[idx * 3] = pt[0];
        positions[idx * 3 + 1] = pt[1];
        positions[idx * 3 + 2] = pt[2];
      }
    }

    applyColors(colors);

    return geo;
  }

  function applyColors(colorData?: Float32Array) {
    const arr = colorData || colAttr?.array as Float32Array;
    if (!arr) return;

    const c1 = new THREE.Color(colorStart);
    const c2 = new THREE.Color(colorEnd);

    for (let p = 0; p < particleCount; p++) {
      const particleT = p / Math.max(particleCount - 1, 1);
      const pc = new THREE.Color().copy(c1).lerp(c2, particleT);

      for (let t = 0; t < trailLength; t++) {
        const idx = (p * trailLength + t) * 4;
        const alpha = (t / trailLength) * 0.8 + 0.05;
        arr[idx] = pc.r;
        arr[idx + 1] = pc.g;
        arr[idx + 2] = pc.b;
        arr[idx + 3] = alpha;
      }
    }

    if (colAttr) colAttr.needsUpdate = true;
  }

  function initSimulation() {
    ready = false;

    norm = computeNormalization(system, params, 15000);

    // Spawn particles at random positions sampled from the attractor trajectory
    // so they start spread across the entire attractor, not clustered together
    const spawns = norm.spawnPoints;
    particleStates = [];
    trailBuffers = [];
    for (let p = 0; p < particleCount; p++) {
      // Pick a random point from the sampled trajectory
      const spawnIdx = Math.floor(Math.random() * spawns.length);
      particleStates.push([...spawns[spawnIdx]]);

      const pos = normalizePoint(particleStates[p], norm);
      const trail: Vec3[] = [];
      for (let t = 0; t < trailLength; t++) {
        trail.push([...pos]);
      }
      trailBuffers.push(trail);
    }

    // Clean up old geometry via plain variable (not $state read)
    if (prevGeo) {
      prevGeo.dispose();
    }

    const geo = buildGeometry();
    prevGeo = geo;
    geometry = geo; // write-only — triggers template update
    ready = true;
  }

  // Re-initialize when system or params change
  $effect(() => {
    // Read reactive deps to track them
    const _sys = system;
    const _params = { ...params };
    const _pc = particleCount;
    const _tl = trailLength;

    initSimulation();
  });

  // Update colors when they change (without recreating geometry)
  $effect(() => {
    const _cs = colorStart;
    const _ce = colorEnd;
    if (ready) {
      applyColors();
    }
  });

  // Animation loop — runs every frame, mutates buffers directly
  useTask(() => {
    if (!ready || !posAttr) return;

    // Step each particle forward
    for (let s = 0; s < stepsPerFrame; s++) {
      for (let p = 0; p < particleCount; p++) {
        particleStates[p] = stepParticle(particleStates[p], system, params);
        const normalized = normalizePoint(particleStates[p], norm);

        // Shift trail: drop oldest, append newest
        trailBuffers[p].shift();
        trailBuffers[p].push(normalized);
      }
    }

    // Write to GPU buffer
    const arr = posAttr.array as Float32Array;
    for (let p = 0; p < particleCount; p++) {
      for (let t = 0; t < trailLength; t++) {
        const idx = (p * trailLength + t) * 3;
        const pt = trailBuffers[p][t];
        arr[idx] = pt[0];
        arr[idx + 1] = pt[1];
        arr[idx + 2] = pt[2];
      }
    }
    posAttr.needsUpdate = true;
  });
</script>

<T.PerspectiveCamera makeDefault position={[3, 2, 3]} fov={60}>
  <OrbitControls
    autoRotate
    autoRotateSpeed={0.5}
    enableDamping
    dampingFactor={0.1}
  />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.3} />

{#if geometry}
  <T.Points {geometry} {material} />
{/if}
