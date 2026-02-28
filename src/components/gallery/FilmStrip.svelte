<script lang="ts">
  let {
    images,
    activeIndex,
    onSelect,
  }: {
    images: string[];
    activeIndex: number;
    onSelect: (index: number) => void;
  } = $props();

  let scrollContainer: HTMLDivElement;

  // Auto-scroll to keep active thumbnail centered
  $effect(() => {
    if (!scrollContainer) return;
    const thumb = scrollContainer.children[activeIndex] as HTMLElement | undefined;
    if (thumb) {
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
</script>

<div class="filmstrip" bind:this={scrollContainer}>
  {#each images as image, i}
    <button
      class="thumb"
      class:active={i === activeIndex}
      onclick={() => onSelect(i)}
      aria-label="Go to photo {i + 1}"
    >
      <img
        src="{image}.jpg"
        alt="Thumbnail {i + 1}"
        loading="lazy"
        draggable="false"
      />
    </button>
  {/each}
</div>

<style>
  .filmstrip {
    position: relative;
    z-index: 10;
    display: flex;
    gap: 4px;
    padding: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.3) transparent;
  }

  .filmstrip::-webkit-scrollbar {
    height: 4px;
  }

  .filmstrip::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  .thumb {
    flex-shrink: 0;
    border: 2px solid transparent;
    border-radius: 4px;
    padding: 0;
    background: none;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s, border-color 0.2s;
    height: 60px;
  }

  .thumb:hover {
    opacity: 0.8;
  }

  .thumb.active {
    opacity: 1;
    border-color: white;
  }

  .thumb img {
    height: 100%;
    width: auto;
    display: block;
    border-radius: 2px;
  }

  @media (min-width: 768px) {
    .thumb {
      height: 80px;
    }
  }
</style>
