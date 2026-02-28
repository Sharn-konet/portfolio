<script lang="ts">
  import rough from 'roughjs';
  import { inview } from 'svelte-inview';

  let {
    roughness = 2,
    stroke = 'rgb(var(--light-mode-text-color))',
    accent = 'none',
  }: {
    roughness?: number;
    stroke?: string;
    accent?: 'none' | 'star' | 'squiggle';
  } = $props();

  let svgEl: SVGSVGElement;
  let container: HTMLDivElement;
  let visible = $state(false);

  $effect(() => {
    if (!visible || !svgEl || !container) return;

    const w = container.offsetWidth;
    svgEl.setAttribute('width', String(w));
    svgEl.setAttribute('height', '40');

    while (svgEl.firstChild) {
      svgEl.removeChild(svgEl.firstChild);
    }

    const rc = rough.svg(svgEl);

    // Main line
    const line = rc.line(20, 20, w - 20, 20, {
      roughness,
      stroke,
      strokeWidth: 1.5,
      bowing: 1.5,
    });
    svgEl.appendChild(line);

    // Center accent
    if (accent === 'star') {
      const cx = w / 2;
      const size = 8;
      // Draw a small star shape
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 4;
        const x1 = cx + Math.cos(angle) * size;
        const y1 = 20 + Math.sin(angle) * size;
        const x2 = cx - Math.cos(angle) * size;
        const y2 = 20 - Math.sin(angle) * size;
        const star = rc.line(x1, y1, x2, y2, {
          roughness: 1.5,
          stroke,
          strokeWidth: 1.5,
        });
        svgEl.appendChild(star);
      }
    } else if (accent === 'squiggle') {
      const cx = w / 2;
      const squiggle = rc.path(
        `M ${cx - 15} 20 Q ${cx - 8} 10 ${cx} 20 Q ${cx + 8} 30 ${cx + 15} 20`,
        {
          roughness: 1,
          stroke,
          strokeWidth: 1.5,
          fill: 'none',
        }
      );
      svgEl.appendChild(squiggle);
    }
  });
</script>

<div class="sketchy-divider" bind:this={container}
     use:inview={{ threshold: 0.3 }}
     oninview_enter={() => visible = true}>
  <svg bind:this={svgEl}></svg>
</div>

<style>
  .sketchy-divider {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 1em 0;
    pointer-events: none;
  }

  svg {
    display: block;
  }
</style>
