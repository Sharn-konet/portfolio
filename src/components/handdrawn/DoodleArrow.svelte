<script lang="ts">
  import rough from 'roughjs';
  import { inview } from 'svelte-inview';
  import { fade } from 'svelte/transition';

  let {
    direction = 'right',
    size = 60,
    stroke = 'rgb(var(--light-mode-text-color))',
  }: {
    direction?: 'left' | 'right' | 'up' | 'down';
    size?: number;
    stroke?: string;
  } = $props();

  let svgEl: SVGSVGElement;
  let visible = $state(false);

  $effect(() => {
    if (!visible || !svgEl) return;

    while (svgEl.firstChild) {
      svgEl.removeChild(svgEl.firstChild);
    }

    const rc = rough.svg(svgEl);
    const s = size;
    const half = s / 2;
    const head = s * 0.3;

    let linePath: string;
    let arrow1: string;
    let arrow2: string;

    if (direction === 'right') {
      linePath = `M 5 ${half} L ${s - 5} ${half}`;
      arrow1 = `M ${s - head} ${half - head * 0.6} L ${s - 5} ${half}`;
      arrow2 = `M ${s - head} ${half + head * 0.6} L ${s - 5} ${half}`;
    } else if (direction === 'left') {
      linePath = `M ${s - 5} ${half} L 5 ${half}`;
      arrow1 = `M ${head} ${half - head * 0.6} L 5 ${half}`;
      arrow2 = `M ${head} ${half + head * 0.6} L 5 ${half}`;
    } else if (direction === 'down') {
      linePath = `M ${half} 5 L ${half} ${s - 5}`;
      arrow1 = `M ${half - head * 0.6} ${s - head} L ${half} ${s - 5}`;
      arrow2 = `M ${half + head * 0.6} ${s - head} L ${half} ${s - 5}`;
    } else {
      linePath = `M ${half} ${s - 5} L ${half} 5`;
      arrow1 = `M ${half - head * 0.6} ${head} L ${half} 5`;
      arrow2 = `M ${half + head * 0.6} ${head} L ${half} 5`;
    }

    const opts = { roughness: 2, stroke, strokeWidth: 2.5, bowing: 2 };
    svgEl.appendChild(rc.path(linePath, opts));
    svgEl.appendChild(rc.path(arrow1, opts));
    svgEl.appendChild(rc.path(arrow2, opts));
  });
</script>

<div class="doodle-arrow"
     use:inview={{ threshold: 0.5 }}
     oninview_enter={() => visible = true}>
  {#if visible}
    <div transition:fade={{ duration: 400 }}>
      <svg bind:this={svgEl} width={size} height={size}></svg>
    </div>
  {/if}
</div>

<style>
  .doodle-arrow {
    display: inline-block;
    pointer-events: none;
  }
</style>
