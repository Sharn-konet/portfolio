<script lang="ts">
  import { Canvas } from '@threlte/core';
  import AttractorRenderer from './AttractorRenderer.svelte';
  import type { AttractorSystem } from '@lib/attractors';

  let {
    system,
    params,
    particleCount = 100,
    trailLength = 300,
    colorStart = '#3366ff',
    colorEnd = '#ff33cc',
  }: {
    system: AttractorSystem;
    params: Record<string, number>;
    particleCount?: number;
    trailLength?: number;
    colorStart?: string;
    colorEnd?: string;
  } = $props();
</script>

<div class="canvas-container">
  <Canvas>
    <AttractorRenderer
      {system}
      {params}
      {particleCount}
      {trailLength}
      {colorStart}
      {colorEnd}
    />
  </Canvas>
</div>

<style>
  .canvas-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
</style>
