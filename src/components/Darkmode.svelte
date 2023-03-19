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

<Switch size="md" on:change={() => {isDark = !isDark}} checked={isDark}/>
