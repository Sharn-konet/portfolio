<script>
    import {fade} from 'svelte/transition'
    import {cubicIn} from 'svelte/easing'
    import {onMount} from 'svelte'

    let show = false
    onMount(() =>
        show=true
    )

	import Experience from "./Experience.svelte";
    import Education from "./Education.svelte";
    import Hero from "./Hero.svelte"
    import Introduction from "./Introduction.svelte"
    import Projects from "./Projects.svelte"
</script>

<svelte:head>
    <title>sharnko.net</title>
</svelte:head>

{#if show}
<div in:fade={{delay: 50}}>
    <div in:fade={{delay:50, duration: 600}}>
        <Hero/>
    </div>

    <div in:fade={{delay:300, duration: 600}}>
        <Experience/>
    </div>

    <Education/>

    <Projects/>
</div>
{/if}