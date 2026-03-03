<script lang="ts">
  import { allSystems, type AttractorSystem } from '@lib/attractors';
  import { parseODEBlock } from '@lib/equation-parser';

  let AttractorScene: typeof import('@components/attractor/AttractorScene.svelte').default | null = $state(null);
  let AttractorControls: typeof import('@components/attractor/AttractorControls.svelte').default | null = $state(null);

  let selectedSystem: AttractorSystem = $state(allSystems[0]);
  let currentParams: Record<string, number> = $state({ ...allSystems[0].defaultParams });
  let equationText: string = $state(allSystems[0].equations);
  let equationError: string | null = $state(null);
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
  let fullscreen = $state(false);

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

  // Debounced equation compilation
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  function handlePresetSelect(system: AttractorSystem) {
    selectedSystem = system;
    currentParams = { ...system.defaultParams };
    equationText = system.equations;
    equationError = null;
  }

  function handleEquationEdit(text: string) {
    equationText = text;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const result = parseODEBlock(text);
      if (result.error) {
        equationError = result.error;
        return;
      }
      equationError = null;
      const newParams: Record<string, number> = {};
      for (const name of result.paramNames) {
        newParams[name] = currentParams[name] ?? result.paramDefaults[name] ?? 1;
      }
      currentParams = newParams;
      selectedSystem = {
        name: 'Custom',
        derivative: result.derivative!,
        equations: text,
        defaultParams: { ...newParams },
        initialState: selectedSystem.initialState,
        dt: selectedSystem.dt,
        scale: selectedSystem.scale,
      };
    }, 400);
  }

  function handleParamChange(key: string, value: number) {
    currentParams = { ...currentParams, [key]: value };
    equationText = equationText.replace(
      new RegExp(`^(${key}\\s*=\\s*).*$`, 'm'),
      `$1${value}`
    );
  }
</script>

<svelte:window bind:outerWidth />

<svelte:head>
  <title>sharnko.net | Chaotic Attractors</title>
</svelte:head>

<div class="attractor-viewport" class:fullscreen aria-label="Interactive 3D visualization of the {selectedSystem.name} chaotic attractor. Use mouse to orbit, scroll to zoom." role="img">
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
      {selectedSystem}
      bind:currentParams
      {equationText}
      {equationError}
      onPresetSelect={handlePresetSelect}
      onEquationEdit={handleEquationEdit}
      onParamChange={handleParamChange}
      bind:colorStart
      bind:colorEnd
      bind:speed
    />
    <button class="fullscreen-btn" onclick={() => fullscreen = !fullscreen} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
      {#if fullscreen}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
      {:else}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18-5h-3a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
      {/if}
    </button>
  {:else}
    <div class="loading">
      <p>Loading 3D scene...</p>
    </div>
  {/if}
</div>

<style>
  .attractor-viewport {
    position: relative;
    margin-top: clamp(5em, 12%, 7em);
    margin-left: 2%;
    margin-right: 2%;
    height: calc(100vh - clamp(5em, 12%, 7em) - 2em);
    border-radius: 12px;
    overflow: hidden;
    background: #000;
  }

  .attractor-viewport.fullscreen {
    position: fixed;
    inset: 0;
    margin: 0;
    height: auto;
    border-radius: 0;
    z-index: 1040;
  }

  .fullscreen-btn {
    position: absolute;
    bottom: 1em;
    right: 1em;
    z-index: 10;
    width: 36px;
    height: 36px;
    padding: 6px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: background 0.2s;
  }

  .fullscreen-btn:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .fullscreen-btn svg {
    width: 100%;
    height: 100%;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 1.2em;
    opacity: 0.6;
    color: #fff;
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
    color: #fff;
  }
</style>
