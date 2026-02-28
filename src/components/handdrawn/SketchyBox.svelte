<script lang="ts">
  import type { Snippet } from 'svelte';
  import rough from 'roughjs';

  let {
    roughness = 1.5,
    stroke = 'rgb(var(--light-mode-text-color))',
    fill = 'none',
    bowing = 1,
    padding = 0,
    children
  }: {
    roughness?: number;
    stroke?: string;
    fill?: string;
    bowing?: number;
    padding?: number;
    children: Snippet;
  } = $props();

  let container: HTMLDivElement;
  let svgEl: SVGSVGElement;

  $effect(() => {
    if (!container || !svgEl) return;

    const observer = new ResizeObserver(() => {
      draw();
    });
    observer.observe(container);
    draw();

    return () => observer.disconnect();
  });

  function draw() {
    if (!svgEl || !container) return;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    svgEl.setAttribute('width', String(w));
    svgEl.setAttribute('height', String(h));

    // Clear previous
    while (svgEl.firstChild) {
      svgEl.removeChild(svgEl.firstChild);
    }

    const rc = rough.svg(svgEl);
    const rect = rc.rectangle(padding, padding, w - padding * 2, h - padding * 2, {
      roughness,
      stroke,
      fill: fill !== 'none' ? fill : undefined,
      bowing,
      strokeWidth: 2,
    });
    svgEl.appendChild(rect);
  }
</script>

<div class="sketchy-box" bind:this={container}>
  <svg class="sketchy-svg" bind:this={svgEl}></svg>
  <div class="sketchy-content" style="padding: {padding + 12}px">
    {@render children()}
  </div>
</div>

<style>
  .sketchy-box {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .sketchy-svg {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 0;
  }

  .sketchy-content {
    position: relative;
    z-index: 1;
  }
</style>
