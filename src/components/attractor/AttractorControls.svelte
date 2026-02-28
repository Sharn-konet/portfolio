<script lang="ts">
  import { allSystems, type AttractorSystem } from '@lib/attractors';
  import SketchyBox from '@components/handdrawn/SketchyBox.svelte';

  let {
    selectedSystem = $bindable(allSystems[0]),
    currentParams = $bindable({ ...allSystems[0].defaultParams }),
    colorStart = $bindable('#3366ff'),
    colorEnd = $bindable('#ff33cc'),
  }: {
    selectedSystem: AttractorSystem;
    currentParams: Record<string, number>;
    colorStart: string;
    colorEnd: string;
  } = $props();

  let showControls = $state(true);

  function selectSystem(system: AttractorSystem) {
    selectedSystem = system;
    currentParams = { ...system.defaultParams };
  }

  function resetParams() {
    currentParams = { ...selectedSystem.defaultParams };
  }

  const colorPresets = [
    { start: '#3366ff', end: '#ff33cc', label: 'Blue → Magenta' },
    { start: '#00ffaa', end: '#ff6600', label: 'Cyan → Orange' },
    { start: '#ff0044', end: '#ffee00', label: 'Red → Yellow' },
    { start: '#8844ff', end: '#00ddff', label: 'Purple → Cyan' },
    { start: '#ffffff', end: '#00ff88', label: 'White → Green' },
  ];
</script>

<div class="controls-overlay" class:collapsed={!showControls}>
  <button class="toggle-btn" onclick={() => showControls = !showControls}>
    {showControls ? '◀' : '▶'} Controls
  </button>

  {#if showControls}
    <div class="controls-inner">
      <SketchyBox roughness={1} padding={2}>
        <div class="controls-content">
          <h3>Attractor System</h3>
          <div class="system-grid">
            {#each allSystems as system}
              <button
                class="system-btn"
                class:active={selectedSystem.name === system.name}
                onclick={() => selectSystem(system)}
              >
                {system.name}
              </button>
            {/each}
          </div>

          <h3>Parameters</h3>
          <div class="params">
            {#each Object.entries(currentParams) as [key, value]}
              <div class="param-row">
                <label>{key}</label>
                <input
                  type="range"
                  min={value * -2 || -10}
                  max={value * 3 || 10}
                  step={Math.abs(value) > 1 ? 0.1 : 0.001}
                  bind:value={currentParams[key]}
                />
                <span class="param-value">{currentParams[key].toFixed(3)}</span>
              </div>
            {/each}
            <button class="reset-btn" onclick={resetParams}>Reset Defaults</button>
          </div>

          <h3>Trail Color</h3>
          <div class="color-presets">
            {#each colorPresets as preset}
              <button
                class="color-btn"
                class:active={colorStart === preset.start && colorEnd === preset.end}
                onclick={() => { colorStart = preset.start; colorEnd = preset.end; }}
                style="background: linear-gradient(90deg, {preset.start}, {preset.end})"
                title={preset.label}
              ></button>
            {/each}
          </div>
        </div>
      </SketchyBox>
    </div>
  {/if}
</div>

<style>
  .controls-overlay {
    position: absolute;
    top: 1em;
    left: 1em;
    z-index: 10;
    max-width: 320px;
    max-height: calc(100vh - 8em);
    overflow-y: auto;
  }

  .controls-overlay.collapsed {
    max-width: auto;
  }

  .toggle-btn {
    background: rgba(var(--light-mode-background-color), 0.9);
    border: 1px solid rgba(var(--light-mode-text-color), 0.3);
    border-radius: 8px;
    padding: 0.5em 1em;
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    font-size: 0.9em;
    margin-bottom: 0.5em;
  }

  :global(body.dark-mode) .toggle-btn {
    background: rgba(var(--dark-mode-background-color), 0.9);
  }

  .controls-inner {
    background: rgba(var(--light-mode-background-color), 0.92);
    border-radius: 8px;
    backdrop-filter: blur(8px);
  }

  :global(body.dark-mode) .controls-inner {
    background: rgba(var(--dark-mode-background-color), 0.92);
  }

  .controls-content {
    padding: 0.5em;
  }

  h3 {
    font-family: Bombing;
    font-size: 1.3em;
    font-weight: lighter;
    margin: 0.5em 0 0.25em;
  }

  .system-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .system-btn {
    background: rgba(var(--light-mode-text-color), 0.1);
    border: 1px solid rgba(var(--light-mode-text-color), 0.2);
    border-radius: 6px;
    padding: 0.25em 0.5em;
    font-size: 0.75em;
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    transition: background 0.2s;
  }

  .system-btn:hover {
    background: rgba(var(--light-mode-text-color), 0.2);
  }

  .system-btn.active {
    background: rgba(var(--light-mode-text-color), 0.3);
    border-color: rgb(var(--light-mode-text-color));
    font-weight: 600;
  }

  .params {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .param-row {
    display: grid;
    grid-template-columns: 70px 1fr 60px;
    align-items: center;
    gap: 8px;
  }

  .param-row label {
    font-size: 0.8em;
    opacity: 0.8;
  }

  .param-row input[type="range"] {
    width: 100%;
    accent-color: rgb(var(--light-mode-text-color));
  }

  .param-value {
    font-size: 0.75em;
    font-family: monospace;
    text-align: right;
  }

  .reset-btn {
    background: rgba(var(--light-mode-text-color), 0.1);
    border: 1px solid rgba(var(--light-mode-text-color), 0.3);
    border-radius: 6px;
    padding: 0.4em 1em;
    cursor: pointer;
    color: inherit;
    font-family: inherit;
    font-size: 0.85em;
    margin-top: 0.5em;
  }

  .reset-btn:hover {
    background: rgba(var(--light-mode-text-color), 0.2);
  }

  .color-presets {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .color-btn {
    width: 48px;
    height: 24px;
    border: 2px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .color-btn:hover, .color-btn.active {
    border-color: rgb(var(--light-mode-text-color));
  }

  /* Scrollbar for controls */
  .controls-overlay::-webkit-scrollbar {
    width: 4px;
  }
  .controls-overlay::-webkit-scrollbar-thumb {
    background: rgba(var(--light-mode-text-color), 0.3);
    border-radius: 2px;
  }
</style>
