<script lang='ts'>
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
    <div id="gallery">
        {#each images as image}
            <picture>
                <source type="image/AVIF" srcset="{image}.avif"/>
                <source type="image/webp" srcset="{image}.webp"/>
                <img src="{image}.jpg" alt = "An example of my photography" loading="eager"/>
            </picture>
        {/each}
    </div>
</div>


<style>

    h1 {
        font-size: 5em
    }

    #gallery {
        line-height: 0;
        -webkit-column-count: 3;
        -webkit-column-gap: 0px;
        -moz-column-count: 3;
        -moz-column-gap: 0px;
        column-count: 3;
        column-gap: 3px;
    }
    #gallery img {
        width: 100% !important;
        height: auto !important;
    }

    #gallery {
        display:inline-block;
        margin-right: auto;
        margin-left: auto;
    }

    #content {
        margin-top: 8em;
        text-align: center;
    }

</style>