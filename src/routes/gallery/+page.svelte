<script lang='ts'>
	import {fade} from "svelte/transition";
  import Lightbox from '@components/gallery/Lightbox.svelte';

  let show = $state(false)
  $effect(() => {
      show = true
  })

  function shuffle(array: string[]) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }

  const imageImports = import.meta.glob("/static/gallery/*/*.jpg");
  const images = Object.keys(imageImports)
    .map(imageName => imageName.replace("/static/", "").replace(".jpg", ""));
  shuffle(images);

  let outerWidth = $state(0);
  let threeColumns = $derived(outerWidth >= 1600);
  let oneColumn = $derived(outerWidth < 600);
  let twoColumns = $derived(!threeColumns && !oneColumn);

  // Lightbox state
  let lightboxOpen = $state(false);
  let lightboxIndex = $state(0);

  function openLightbox(index: number) {
    lightboxIndex = index;
    lightboxOpen = true;
  }
</script>

<svelte:window bind:outerWidth/>

<svelte:head>
    <title>sharnko.net | Gallery</title>
</svelte:head>

<div id="content">
    <h1>Gallery</h1>
    {#if show}
    <div id="gallery" class:threeColumns class:twoColumns class:oneColumn>
            {#each images as image, i}
                <picture in:fade={{delay: (i%10)*100}}>
                    <source type="image/AVIF" srcset="{image}.avif"/>
                    <source type="image/webp" srcset="{image}.webp"/>
                    <button
                      class="gallery-img-btn"
                      aria-label="View photo {i + 1} in lightbox"
                      onclick={() => openLightbox(i)}
                    >
                      <img
                        src="{image}.jpg"
                        alt="Photography example {i + 1}"
                        loading="lazy"
                      />
                    </button>
                </picture>
            {/each}
    </div>
    {/if}
</div>

<Lightbox
  {images}
  bind:currentIndex={lightboxIndex}
  bind:open={lightboxOpen}
/>


<style>

    :root {
        --row-gap: clamp(10px, 0.8vw, 1.5em);
        --column-gap: 1.5em;
    }

    h1 {
        font-size: clamp(40px, 10vw, 80px);
    }

    /* Define photo structure */

    #gallery {
        line-height: 0;
        -webkit-column-gap: var(--column-gap);
        -moz-column-gap: var(--column-gap);
        column-gap: var(--column-gap);
    }

    #gallery.threeColumns {
        -webkit-column-count: 3;
        column-count: 3;
        -moz-column-count: 3;
    }

    #gallery.twoColumns {
        -webkit-column-count: 2;
        column-count: 2;
        -moz-column-count: 2;
    }

    #gallery.oneColumn {
        -webkit-column-count: 1;
        column-count: 1;
        -moz-column-count: 1;
    }

    .gallery-img-btn {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: block;
        width: 100%;
        margin-top: var(--row-gap);
    }

    .gallery-img-btn:focus-visible {
        outline: 3px solid rgb(var(--light-mode-text-color));
        outline-offset: 2px;
        border-radius: clamp(0px, 1vw, 20px);
    }

    #gallery img {
        width: 100% !important;
        height: auto !important;
        border-radius: clamp(0px, 1vw, 20px);
        display: block;
    }

    .gallery-img-btn:hover img {
        transform: scale(1.025);
        transition: all .3s ease-in-out;
    }

    #gallery {
        display:inline-block;
        padding-right: var(--row-gap);
        padding-left: var(--row-gap);
        padding-bottom: var(--row-gap);
        margin: clamp(20px, 5%, 3em) clamp(1%, calc(30% - 100px), 5%) 5%;
        border-radius: 10px;
        border-style: double;
        border-width: clamp(5px, 1vw, 1em);
        border-color: rgb(var(--light-mode-text-color));
        transition: background-color 5s;
        box-shadow: 0px 0px 200px rgba(var(--light-mode-box-shadow-color), 0.3);
        transition: box-shadow 1s;
    }

    :global(body.dark-mode) #gallery {
        background-color: rgba(45, 45, 52, 0.39);
        box-shadow: 0px 0px 200px rgba(var(--light-mode-text-color), 0.2);
    }

    #content {
        margin-top: clamp(6em, 20%, 8em);
        text-align: center;
    }

</style>
