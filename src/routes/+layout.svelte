<script lang="ts">
    import {fade} from 'svelte/transition'
    import { page } from '$app/stores';

    import './global.css'
    import Navbar from '@components/Navbar.svelte'
    import CustomCursor from '@components/CustomCursor.svelte'

    let { children } = $props();

    let show = $state(false);
    $effect(() => {
        show = true;
    });
</script>

<CustomCursor />

<div id="background">
    {#if show}
        <div in:fade={{duration: 400, delay:1000}}>
            <Navbar/>
        </div>
    {/if}
    {#key $page.url.pathname}
        <div class="page-transition" in:fade={{ duration: 300, delay: 100 }} out:fade={{ duration: 200 }}>
            {@render children()}
        </div>
    {/key}
</div>

<style>
    .page-transition {
        min-height: 100vh;
    }
</style>
