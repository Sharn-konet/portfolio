<script lang="ts">
    import {fade} from 'svelte/transition'

    import './global.css'
    import Navbar from '@components/Navbar.svelte'

    let { children } = $props();

    let show = $state(false);
    $effect(() => {
        show = true;
    });
</script>

<div id="background">
    {#if show}
        <div in:fade={{duration: 400, delay:1000}}>
            <Navbar/>
        </div>
    {/if}
    {@render children()}
</div>

<style>
</style>
