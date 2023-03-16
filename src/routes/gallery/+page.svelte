<script lang='ts'>
	import {fade} from "svelte/transition";
  import {onMount} from 'svelte'

    let show = false
    onMount(() => {
        show=true
    })

    function shuffle(array: string[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const imageImports = import.meta.glob("/static/gallery/*/*.jpg");
    let images = Object.keys(imageImports)
    images = images.map(imageName => imageName.replace("/static/", "").replace(".jpg", ""))
    shuffle(images)
</script>


<svelte:head>
    <title>sharnko.net | Gallery</title>
</svelte:head>

<div id = "content">
    <h1>Gallery</h1>
    {#if show}
    <div id="gallery">
            {#each images as image, i}
                <picture in:fade={{delay: (i%10)*100}}>
                    <source type="image/AVIF" srcset="{image}.avif"/>
                    <source type="image/webp" srcset="{image}.webp"/>
                    <img src="{image}.jpg" alt = "An example of my photography" loading="eager"/>
                </picture>
            {/each}
    </div>
    {/if}
</div>


<style>

    :root {
        --row-gap: 1.5em;
        --column-gap: 1.5em;
        --column-count: 3;
    }

    h1 {
        font-size: 5em
    }

    #gallery {
        line-height: 0;
        -webkit-column-count: var(--column-count);
        -webkit-column-gap: var(--column-gap);
        -moz-column-count: var(--column-count);
        -moz-column-gap: var(--column-gap);
        column-count: var(--column-count);
        column-gap: var(--column-gap);
    }
    #gallery img {
        width: 100% !important;
        height: auto !important;
        margin-top: var(--row-gap);
        border-radius: 20px;
    }

    #gallery img:hover {
        transform: scale(1.025);
        transition: all .3s ease-in-out;
        cursor: pointer;
    }

    #gallery {
        display:inline-block;
        padding-right: var(--row-gap);
        padding-left: var(--row-gap);
        padding-bottom: var(--row-gap);
        margin-left: 5%;
        margin-right: 5%;
        margin-top: 5em;
        margin-bottom: 5%;
        border-radius: 10px;
        border-style: double;
        border-width: 1em;
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
        margin-top: 8em;
        text-align: center;
    }

</style>