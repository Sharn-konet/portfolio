<script>
  import {fade} from 'svelte/transition'

  let show = $state(false)
  $effect(() => {
      show = true
  })

  import Experience from "./sections/Experience.svelte";
  import Education from "./sections/Education.svelte";
  import Hero from "./sections/Hero.svelte";
  import Projects from "./sections/Projects.svelte";
  import Tools from "./sections/Tools.svelte";
  import SketchyDivider from "@components/handdrawn/SketchyDivider.svelte";
</script>

<svelte:head>
    <title>sharnko.net</title>
</svelte:head>

{#if show}
<div in:fade={{delay:50, duration: 600}}>
    <Hero/>
</div>

<div class="divider-container">
    <SketchyDivider accent="star" />
</div>

<div in:fade={{delay:300, duration: 600}}>
<Tools/>
</div>

<div class="divider-container">
    <SketchyDivider accent="squiggle" />
</div>

<Experience/>

<div class="divider-container">
    <SketchyDivider accent="star" />
</div>

<Education/>

<div class="divider-container">
    <SketchyDivider accent="squiggle" />
</div>

<Projects/>
{/if}

<style>
    .divider-container {
        margin: 0 10%;
    }
</style>
