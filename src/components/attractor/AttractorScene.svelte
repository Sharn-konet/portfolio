<script lang="ts">
  import { Canvas } from '@threlte/core';
  import AttractorRenderer from './AttractorRenderer.svelte';
  import type { AttractorSystem } from '@lib/attractors';

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
</script>

<div class="canvas-container">
  <Canvas>
    <AttractorRenderer
      {system}
      {params}
      {numPoints}
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
