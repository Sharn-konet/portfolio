<script>
  import {fade} from 'svelte/transition'
  import {cubicIn} from 'svelte/easing'
  import {onMount} from 'svelte'

  let show = false
  onMount(() =>
      show=true
  )

	import Experience from "./sections/Experience.svelte";
  import Education from "./sections/Education.svelte";
  import Hero from "./sections/Hero.svelte";
  import Introduction from "./sections/Introduction.svelte";
  import Projects from "./sections/Projects.svelte";
  import Tools from "./sections/Tools.svelte";
  import Network from "./sections/Network.svelte";
</script>

<svelte:head>
    <title>sharnko.net</title>
</svelte:head>

<Network/>

{#if show}
<div in:fade={{delay:50, duration: 600}}>
    <Hero/>
</div>

<div in:fade={{delay:300, duration: 600}}>
    <Tools/>
</div>

<Experience/>

<Education/>

<Projects/>
{/if}
