<script lang="ts">
  import rough from 'roughjs';

  let x = $state(0);
  let y = $state(0);
  let displayX = $state(0);
  let displayY = $state(0);
  let hovering = $state(false);
  let visible = $state(false);
  let svgEl: SVGSVGElement | undefined = $state(undefined);

  // Detect touch device
  let isTouch = $state(false);
  let prefersReduced = $state(false);

  $effect(() => {
    isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReduced) return;

    // Add custom-cursor class to body
    document.body.classList.add('custom-cursor');

    function handleMouseMove(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
      if (!visible) visible = true;
    }

    function handleMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        hovering = true;
      }
    }

    function handleMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        hovering = false;
      }
    }

    function handleMouseLeave() {
      visible = false;
    }

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Lerp animation loop
    let animId: number;
    function animate() {
      displayX += (x - displayX) * 0.15;
      displayY += (y - displayY) * 0.15;
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
      document.body.classList.remove('custom-cursor');
    };
  });

  // Draw sketchy circle
  $effect(() => {
    if (!svgEl || isTouch || prefersReduced) return;

    while (svgEl.firstChild) {
      svgEl.removeChild(svgEl.firstChild);
    }

    const rc = rough.svg(svgEl);
    const size = hovering ? 40 : 20;
    const half = size / 2;

    svgEl.setAttribute('width', String(size));
    svgEl.setAttribute('height', String(size));

    const circle = rc.circle(half, half, size - 4, {
      roughness: 1.5,
      stroke: 'rgb(var(--light-mode-text-color))',
      strokeWidth: 1.5,
      fill: hovering ? 'rgba(var(--light-mode-text-color), 0.1)' : 'none',
      bowing: 1,
    });
    svgEl.appendChild(circle);
  });

  let cursorSize = $derived(hovering ? 40 : 20);
</script>

{#if visible && !isTouch && !prefersReduced}
  <div
    class="custom-cursor"
    style="transform: translate({displayX - cursorSize / 2}px, {displayY - cursorSize / 2}px)"
  >
    <svg bind:this={svgEl}></svg>
  </div>
{/if}

<style>
  .custom-cursor {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
    will-change: transform;
    mix-blend-mode: difference;
  }
</style>
