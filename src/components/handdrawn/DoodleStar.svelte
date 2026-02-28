<script lang="ts">
  import rough from 'roughjs';
  import { inview } from 'svelte-inview';
  import { fade } from 'svelte/transition';

  let {
    size = 40,
    stroke = 'rgb(var(--light-mode-text-color))',
    points = 5,
  }: {
    size?: number;
    stroke?: string;
    points?: number;
  } = $props();

  let svgEl: SVGSVGElement;
  let visible = $state(false);

  $effect(() => {
    if (!visible || !svgEl) return;

    while (svgEl.firstChild) {
      svgEl.removeChild(svgEl.firstChild);
    }

    const rc = rough.svg(svgEl);
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size * 0.45;
    const innerR = outerR * 0.4;

    // Build star path
    let path = '';
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      path += (i === 0 ? 'M' : 'L') + ` ${x} ${y} `;
    }
    path += 'Z';

    const star = rc.path(path, {
      roughness: 1.5,
      stroke,
      strokeWidth: 2,
      bowing: 1,
      fill: 'none',
    });
    svgEl.appendChild(star);
  });
</script>

<div class="doodle-star"
     use:inview={{ threshold: 0.5 }}
     oninview_enter={() => visible = true}>
  {#if visible}
    <div transition:fade={{ duration: 400 }}>
      <svg bind:this={svgEl} width={size} height={size}></svg>
    </div>
  {/if}
</div>

<style>
  .doodle-star {
    display: inline-block;
    pointer-events: none;
  }
</style>
