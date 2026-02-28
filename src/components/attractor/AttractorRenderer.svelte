<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import * as THREE from 'three';
  import { Line2 } from 'three/addons/lines/Line2.js';
  import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
  import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
  import { solveAttractor, type AttractorSystem } from '@lib/attractors';

  let {
    system,
    params,
    numPoints = 50000,
    colorStart = '#3366ff',
    colorEnd = '#ff33cc',
  }: {
    system: AttractorSystem;
    params: Record<string, number>;
    numPoints?: number;
    colorStart?: string;
    colorEnd?: string;
  } = $props();

  let lineRef: Line2 | undefined = $state(undefined);
  let headRef: THREE.Mesh | undefined = $state(undefined);
  let drawCount = $state(0);
  let maxDrawCount = $state(0);
  let positions = $state(new Float32Array(0));

  // Solve and create geometry whenever system or params change
  $effect(() => {
    const solved = solveAttractor(system, params, numPoints);
    positions = solved;
    drawCount = 0;
    maxDrawCount = numPoints;

    if (lineRef) {
      const geo = new LineGeometry();
      const posArray: number[] = [];
      const colorArray: number[] = [];

      const c1 = new THREE.Color(colorStart);
      const c2 = new THREE.Color(colorEnd);
      const tempColor = new THREE.Color();

      for (let i = 0; i < numPoints; i++) {
        posArray.push(solved[i * 3], solved[i * 3 + 1], solved[i * 3 + 2]);
        const t = i / (numPoints - 1);
        tempColor.copy(c1).lerp(c2, t);
        colorArray.push(tempColor.r, tempColor.g, tempColor.b);
      }

      geo.setPositions(posArray);
      geo.setColors(colorArray);

      lineRef.geometry.dispose();
      lineRef.geometry = geo;
      lineRef.computeLineDistances();
    }
  });

  // Animated trail reveal
  useTask((delta) => {
    if (drawCount < maxDrawCount) {
      drawCount = Math.min(drawCount + Math.ceil(numPoints / 200), maxDrawCount);

      if (lineRef && lineRef.geometry) {
        const instanceCount = Math.max(1, drawCount - 1);
        lineRef.geometry.instanceCount = instanceCount;
      }

      // Move head particle
      if (headRef && drawCount > 0) {
        const idx = (drawCount - 1) * 3;
        if (idx < positions.length) {
          headRef.position.set(positions[idx], positions[idx + 1], positions[idx + 2]);
        }
      }
    }
  });

  // Create line material
  const lineMaterial = new LineMaterial({
    linewidth: 2,
    vertexColors: true,
    worldUnits: false,
    alphaToCoverage: true,
  });

  // Create initial geometry
  const initialGeo = new LineGeometry();
  initialGeo.setPositions([0, 0, 0, 0, 0, 0]);

  // Create line
  const line = new Line2(initialGeo, lineMaterial);
  line.computeLineDistances();
</script>

<T.PerspectiveCamera makeDefault position={[3, 2, 3]} fov={60}>
  <OrbitControls
    autoRotate
    autoRotateSpeed={0.5}
    enableDamping
    dampingFactor={0.1}
  />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[5, 5, 5]} intensity={0.8} />

<T is={line} bind:ref={lineRef} />

<!-- Glowing head particle -->
<T.Mesh bind:ref={headRef}>
  <T.SphereGeometry args={[0.03, 16, 16]} />
  <T.MeshBasicMaterial
    color={colorEnd}
    toneMapped={false}
  />
</T.Mesh>
