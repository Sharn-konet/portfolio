<script lang="ts">
  import type { Snippet } from 'svelte';
  import rough from 'roughjs';
  import { inview } from 'svelte-inview';

  let {
    roughness = 3,
    stroke = 'rgb(var(--light-mode-text-color))',
    children
  }: {
    roughness?: number;
    stroke?: string;
    children: Snippet;
  } = $props();

  let container: HTMLDivElement;
  let svgEl: SVGSVGElement;
  let visible = $state(false);

  $effect(() => {
    if (!visible || !container || !svgEl) return;

    const w = container.offsetWidth;
    svgEl.setAttribute('width', String(w));
    svgEl.setAttribute('height', '12');

    while (svgEl.firstChild) {
      svgEl.removeChild(svgEl.firstChild);
    }

    const rc = rough.svg(svgEl);
    const line = rc.line(0, 6, w, 6, {
      roughness,
      stroke,
      strokeWidth: 2.5,
      bowing: 2,
    });
    svgEl.appendChild(line);
  });
</script>

<div class="sketchy-underline-wrapper" bind:this={container}
     use:inview={{ threshold: 0.3 }}
     oninview_enter={() => visible = true}>
  {@render children()}
  {#if visible}
    <svg class="sketchy-underline" bind:this={svgEl}></svg>
  {/if}
</div>

<style>
  .sketchy-underline-wrapper {
    display: inline-block;
    position: relative;
  }

  .sketchy-underline {
    display: block;
    margin-top: -4px;
    pointer-events: none;
  }
</style>
