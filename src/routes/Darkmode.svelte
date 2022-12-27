<script lang='ts'>
    import {Switch} from '@svelteuidev/core'
    import { onMount } from 'svelte'

    let isDark: boolean;


    onMount(() => {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    $: if (typeof isDark === 'undefined') {
            //pass
        } else if (isDark) {
            window.document.body.classList.add('dark-mode')
        } else {
            window.document.body.classList.remove('dark-mode')
        }

</script>

<Switch on:change={() => {isDark = !isDark}} checked={isDark}/>

<style>
    button {
        background-color: #f76027;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem;
        text-transform: uppercase;

    }
    :global(body.dark-mode) button {
        background-color: #0084f6;
        color: white;
    }
</style>