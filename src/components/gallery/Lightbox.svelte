<script lang="ts">
  import { fade } from 'svelte/transition';
  import FilmStrip from './FilmStrip.svelte';

  let {
    images,
    currentIndex = $bindable(0),
    open = $bindable(false),
  }: {
    images: string[];
    currentIndex: number;
    open: boolean;
  } = $props();

  let scale = $state(1);
  let translateX = $state(0);
  let translateY = $state(0);
  let isDragging = $state(false);
  let dragStartX = $state(0);
  let dragStartY = $state(0);
  let dragStartTranslateX = $state(0);
  let dragStartTranslateY = $state(0);

  // Touch state for swipe
  let touchStartX = $state(0);
  let touchStartY = $state(0);

  // Pinch state
  let initialPinchDist = $state(0);
  let initialPinchScale = $state(1);

  function close() {
    open = false;
    resetTransform();
    document.body.style.overflow = '';
  }

  function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
  }

  function navigate(direction: number) {
    resetTransform();
    currentIndex = (currentIndex + direction + images.length) % images.length;
  }

  function jumpTo(index: number) {
    resetTransform();
    currentIndex = index;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(1, Math.min(5, scale + delta));

    if (newScale === 1) {
      translateX = 0;
      translateY = 0;
    }

    scale = newScale;
  }

  function handlePointerDown(e: PointerEvent) {
    if (scale <= 1) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartTranslateX = translateX;
    dragStartTranslateY = translateY;
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    translateX = dragStartTranslateX + (e.clientX - dragStartX);
    translateY = dragStartTranslateY + (e.clientY - dragStartY);
  }

  function handlePointerUp() {
    isDragging = false;
  }

  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      // Pinch start
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDist = Math.hypot(dx, dy);
      initialPinchScale = scale;
    } else if (e.touches.length === 1 && scale <= 1) {
      // Swipe start
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const newScale = Math.max(1, Math.min(5, initialPinchScale * (dist / initialPinchDist)));
      scale = newScale;
      if (newScale === 1) {
        translateX = 0;
        translateY = 0;
      }
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    if (e.changedTouches.length === 1 && scale <= 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 50) {
        navigate(deltaX > 0 ? -1 : 1);
      }
    }
  }

  // Focus management
  let overlayEl: HTMLDivElement | undefined = $state(undefined);
  let previouslyFocused: HTMLElement | null = $state(null);

  // Lock body scroll and manage focus when open
  $effect(() => {
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      // Focus the overlay after mount
      requestAnimationFrame(() => {
        overlayEl?.focus();
      });
    } else if (previouslyFocused) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }
    return () => {
      document.body.style.overflow = '';
    };
  });

  // Focus trap: tab cycles through lightbox buttons
  function handleTab(e: KeyboardEvent) {
    if (!open || e.key !== 'Tab' || !overlayEl) return;
    const focusable = overlayEl.querySelectorAll<HTMLElement>('button, [tabindex]');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  let imageTransform = $derived(
    `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`
  );
</script>

<svelte:window onkeydown={(e) => { handleKeydown(e); handleTab(e); }} />

{#if open}
  <div
    class="lightbox-overlay"
    bind:this={overlayEl}
    transition:fade={{ duration: 200 }}
    role="dialog"
    aria-label="Image lightbox — photo {currentIndex + 1} of {images.length}"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Backdrop -->
    <div class="backdrop" onclick={close}></div>

    <!-- Close button -->
    <button class="close-btn" onclick={close} aria-label="Close lightbox">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>

    <!-- Navigation arrows -->
    <button class="nav-btn prev" onclick={() => navigate(-1)} aria-label="Previous image">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
      </svg>
    </button>
    <button class="nav-btn next" onclick={() => navigate(1)} aria-label="Next image">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </button>

    <!-- Main image -->
    <div
      class="image-container"
      onwheel={handleWheel}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointerleave={handlePointerUp}
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      ontouchend={handleTouchEnd}
      role="img"
      aria-label={`Photo ${currentIndex + 1} of ${images.length}`}
    >
      <picture>
        <source type="image/AVIF" srcset="{images[currentIndex]}.avif"/>
        <source type="image/webp" srcset="{images[currentIndex]}.webp"/>
        <img
          src="{images[currentIndex]}.jpg"
          alt="Gallery photo {currentIndex + 1}"
          style="transform: {imageTransform}"
          class:dragging={isDragging}
          draggable="false"
        />
      </picture>
    </div>

    <!-- Film strip -->
    <FilmStrip
      {images}
      activeIndex={currentIndex}
      onSelect={jumpTo}
    />
  </div>
{/if}

<style>
  .lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.92);
  }

  .close-btn {
    position: absolute;
    top: 1em;
    right: 1em;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    z-index: 10;
    padding: 0.5em;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    z-index: 10;
    padding: 0.75em;
    border-radius: 50%;
    opacity: 0.6;
    transition: opacity 0.2s, background 0.2s;
  }

  .nav-btn:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
  }

  .nav-btn.prev {
    left: 1em;
  }

  .nav-btn.next {
    right: 1em;
  }

  .image-container {
    position: relative;
    z-index: 5;
    width: 100%;
    height: calc(100% - 100px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    touch-action: none;
  }

  .image-container img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    transition: transform 0.1s ease-out;
    user-select: none;
  }

  .image-container img.dragging {
    transition: none;
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    .nav-btn {
      padding: 0.5em;
    }
    .nav-btn.prev {
      left: 0.5em;
    }
    .nav-btn.next {
      right: 0.5em;
    }
  }
</style>
