<script lang="ts">
    import {fade, draw} from 'svelte/transition'
    import {onMount} from 'svelte'

    import './global.css'
    import Navbar from '@components/Navbar.svelte'
    import Drawings from '@components/Drawings.svelte'

    let show = false;
    onMount(()=>
        show=true
    )
</script>

<div id="background">
    {#if show}
        <div in:fade={{duration: 400, delay:1000}}>
            <Navbar/>
        </div>
        <Drawings/>
    {/if}
    <slot/>
</div>

<style>
</style>
