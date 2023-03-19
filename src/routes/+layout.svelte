<script>
    import {fade} from 'svelte/transition'
    import {onMount} from 'svelte'
    import Navbar from '@components/Navbar.svelte'
    import './global.css'

    let show = false;
    onMount(()=>
        show=true
    )
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet">
</svelte:head>

<div id="background">
    {#if show}
        <div in:fade={{duration: 400, delay:1000}}>
            <Navbar/>
        </div>
    {/if}
    <slot/>
</div>
