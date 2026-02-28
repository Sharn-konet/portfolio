<script lang="ts">
  import { allSystems, type AttractorSystem } from '@lib/attractors';

  let AttractorScene: typeof import('@components/attractor/AttractorScene.svelte').default | null = $state(null);
  let AttractorControls: typeof import('@components/attractor/AttractorControls.svelte').default | null = $state(null);

  let selectedSystem: AttractorSystem = $state(allSystems[0]);
  let currentParams: Record<string, number> = $state({ ...allSystems[0].defaultParams });
  let colorStart = $state('#3366ff');
  let colorEnd = $state('#ff33cc');
  let speed = $state(1);
  let stepsPerFrame = $derived(Math.max(1, Math.round(speed * 3)));

  let outerWidth = $state(0);
  let mobile = $derived(outerWidth < 768);
  let tinyMobile = $derived(outerWidth < 480);
  let particleCount = $derived(mobile ? 50 : 100);
  let trailLength = $derived(mobile ? 150 : 300);

  let loaded = $state(false);

  // Lazy-load Three.js/Threlte
  $effect(() => {
    Promise.all([
      import('@components/attractor/AttractorScene.svelte'),
      import('@components/attractor/AttractorControls.svelte'),
    ]).then(([sceneModule, controlsModule]) => {
      AttractorScene = sceneModule.default;
      AttractorControls = controlsModule.default;
      loaded = true;
    });
  });
</script>

<svelte:window bind:outerWidth />

<svelte:head>
  <title>sharnko.net | Chaotic Attractors</title>
</svelte:head>

<div class="attractor-page">
  <div class="header">
    <h1>Chaotic Attractors</h1>
    <p class="intro">
      Interactive 3D visualizations of strange attractors — chaotic systems governed by
      differential equations that never repeat, yet stay bounded.
      Inspired by <a href="https://github.com/Sharn-konet/Flo.jl">Flo.jl</a>.
    </p>
  </div>

  <div class="viewport" aria-label="Interactive 3D visualization of the {selectedSystem.name} chaotic attractor. Use mouse to orbit, scroll to zoom." role="img">
    {#if tinyMobile}
      <div class="fallback">
        <img src="/projects/lorenz-attractor.gif" alt="Lorenz attractor animation" />
        <p class="fallback-text">
          {selectedSystem.name} attractor — rotate on a larger screen for the full 3D experience.
        </p>
      </div>
    {:else if loaded && AttractorScene && AttractorControls}
      <AttractorScene
        system={selectedSystem}
        params={currentParams}
        {particleCount}
        {trailLength}
        {stepsPerFrame}
        {colorStart}
        {colorEnd}
      />
      <AttractorControls
        bind:selectedSystem
        bind:currentParams
        bind:colorStart
        bind:colorEnd
        bind:speed
      />
    {:else}
      <div class="loading">
        <p>Loading 3D scene...</p>
      </div>
    {/if}
  </div>

  <div class="info">
    <h2>{selectedSystem.name}</h2>
    <div class="equation-info">
      <p>Parameters: {Object.entries(currentParams).map(([k, v]) => `${k}=${v.toFixed(3)}`).join(', ')}</p>
      <p>dt = {selectedSystem.dt} · {particleCount} particles · {trailLength}-point trails</p>
    </div>
  </div>
</div>

<style>
  .attractor-page {
    margin-top: clamp(5em, 12%, 7em);
    padding: 0 5%;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .header {
    text-align: center;
    margin-bottom: 1em;
  }

  h1 {
    font-family: Bombing;
    font-size: var(--section-title-size);
    font-weight: lighter;
    margin-bottom: 0.25em;
  }

  .intro {
    font-size: 1.1em;
    max-width: 700px;
    margin: 0 auto;
    opacity: 0.8;
  }

  .intro a {
    color: inherit;
    text-decoration: underline;
  }

  .viewport {
    position: relative;
    width: 100%;
    height: 70vh;
    min-height: 400px;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.05);
  }

  :global(body.dark-mode) .viewport {
    background: rgba(255, 255, 255, 0.03);
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 1.2em;
    opacity: 0.6;
  }

  .fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2em;
  }

  .fallback img {
    max-width: 100%;
    max-height: 60%;
    border-radius: 8px;
  }

  .fallback-text {
    margin-top: 1em;
    text-align: center;
    opacity: 0.7;
    font-size: 0.9em;
  }

  .info {
    text-align: center;
    padding: 1.5em 0;
  }

  h2 {
    font-family: Bombing;
    font-size: 2em;
    font-weight: lighter;
    margin-bottom: 0.25em;
  }

  .equation-info {
    font-family: monospace;
    font-size: 0.85em;
    opacity: 0.7;
  }

  .equation-info p {
    margin: 0.25em 0;
  }
</style>
