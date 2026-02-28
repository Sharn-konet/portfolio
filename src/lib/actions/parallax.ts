// Svelte action that translates element based on mouse position
// Disabled on mobile + prefers-reduced-motion: reduce

export function parallax(node: HTMLElement, options: { strength?: number } = {}) {
  const strength = options.strength ?? 15;

  // Skip on mobile or reduced motion
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isMobile || prefersReduced) return {};

  function handleMouseMove(e: MouseEvent) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = ((e.clientX - centerX) / centerX) * strength;
    const offsetY = ((e.clientY - centerY) / centerY) * strength;

    node.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  function handleMouseLeave() {
    node.style.transform = 'translate(0px, 0px)';
    node.style.transition = 'transform 0.5s ease-out';
    setTimeout(() => {
      node.style.transition = '';
    }, 500);
  }

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);

  return {
    destroy() {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      node.style.transform = '';
    },
  };
}
