<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import * as THREE from 'three';
  import {
    computeNormalization,
    normalizePoint,
    generateInitialStates,
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

  let pointsRef: THREE.Points | undefined = $state(undefined);

  // Total vertices = particleCount * trailLength
  let totalPoints = $derived(particleCount * trailLength);

  // Simulation state (re-initialized when system/params change)
  let particleStates: Vec3[] = [];
  let trails: Vec3[][] = [];
  let norm: Normalization = { center: [0, 0, 0], scale: 1 };
  let initialized = false;

  // Track previous system/params to detect changes
  let prevSystemName = '';
  let prevParamsKey = '';

  function paramsKey(p: Record<string, number>): string {
    return Object.entries(p).map(([k, v]) => `${k}:${v}`).join(',');
  }

  function initSimulation() {
    norm = computeNormalization(system, params, 15000);
    particleStates = generateInitialStates(system, particleCount, 0.02);

    // Warm up each particle a bit so they spread out, each gets a different warmup
    trails = [];
    for (let p = 0; p < particleCount; p++) {
      const warmup = 50 + Math.floor(Math.random() * 200);
      for (let w = 0; w < warmup; w++) {
        particleStates[p] = stepParticle(particleStates[p], system, params);
      }
      // Initialize trail with current position
      const normalizedPos = normalizePoint(particleStates[p], norm);
      const trail: Vec3[] = [];
      for (let t = 0; t < trailLength; t++) {
        trail.push([...normalizedPos]);
      }
      trails.push(trail);
    }
    initialized = true;
  }

  // Re-initialize when system or params change
  $effect(() => {
    const sysName = system.name;
    const pKey = paramsKey(params);
    if (sysName !== prevSystemName || pKey !== prevParamsKey) {
      prevSystemName = sysName;
      prevParamsKey = pKey;
      initSimulation();
    }
  });

  // Build the buffer geometry
  let geometry: THREE.BufferGeometry | undefined = $state(undefined);

  $effect(() => {
    if (!initialized) return;
    const total = particleCount * trailLength;

    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(new Float32Array(total * 3), 3);
    const colAttr = new THREE.BufferAttribute(new Float32Array(total * 4), 4);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    colAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('color', colAttr);

    // Initial fill
    const c1 = new THREE.Color(colorStart);
    const c2 = new THREE.Color(colorEnd);

    for (let p = 0; p < particleCount; p++) {
      // Each particle gets a unique color by interpolating along the gradient
      const particleT = p / Math.max(particleCount - 1, 1);
      const particleColor = new THREE.Color().copy(c1).lerp(c2, particleT);

      for (let t = 0; t < trailLength; t++) {
        const idx = p * trailLength + t;
        const trail = trails[p][t];
        posAttr.setXYZ(idx, trail[0], trail[1], trail[2]);
        // Older points (low t) = more transparent, newer (high t) = more opaque
        const alpha = (t / trailLength) * 0.8 + 0.05;
        colAttr.setXYZW(idx, particleColor.r, particleColor.g, particleColor.b, alpha);
      }
    }

    if (geometry) geometry.dispose();
    geometry = geo;
  });

  // Points material
  const material = new THREE.PointsMaterial({
    size: 2.5,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  // Animation loop: step particles and update trails
  useTask(() => {
    if (!initialized || !geometry) return;

    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    if (!posAttr) return;

    // Step each particle forward
    for (let s = 0; s < stepsPerFrame; s++) {
      for (let p = 0; p < particleCount; p++) {
        particleStates[p] = stepParticle(particleStates[p], system, params);
        const normalized = normalizePoint(particleStates[p], norm);

        // Shift trail: drop oldest (index 0), append newest
        const trail = trails[p];
        trail.shift();
        trail.push(normalized);
      }
    }

    // Update buffer
    for (let p = 0; p < particleCount; p++) {
      for (let t = 0; t < trailLength; t++) {
        const idx = p * trailLength + t;
        const pt = trails[p][t];
        posAttr.setXYZ(idx, pt[0], pt[1], pt[2]);
      }
    }
    posAttr.needsUpdate = true;
  });

  // Update colors when colorStart/colorEnd change
  $effect(() => {
    if (!geometry) return;
    const colAttr = geometry.getAttribute('color') as THREE.BufferAttribute;
    if (!colAttr) return;

    const c1 = new THREE.Color(colorStart);
    const c2 = new THREE.Color(colorEnd);

    for (let p = 0; p < particleCount; p++) {
      const particleT = p / Math.max(particleCount - 1, 1);
      const particleColor = new THREE.Color().copy(c1).lerp(c2, particleT);

      for (let t = 0; t < trailLength; t++) {
        const idx = p * trailLength + t;
        const alpha = (t / trailLength) * 0.8 + 0.05;
        colAttr.setXYZW(idx, particleColor.r, particleColor.g, particleColor.b, alpha);
      }
    }
    colAttr.needsUpdate = true;
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
  <T.Points bind:ref={pointsRef} {geometry} {material} />
{/if}
