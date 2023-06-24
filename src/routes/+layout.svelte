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

<div id="background">
    {#if show}
        <div in:fade={{duration: 400, delay:1000}}>
            <Navbar/>
        </div>
    {/if}
    <slot/>
</div>
