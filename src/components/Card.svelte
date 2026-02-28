<script lang="ts">
  import type { Snippet } from 'svelte';
  import SketchyBox from './handdrawn/SketchyBox.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="card-wrapper">
  <SketchyBox roughness={1.5} padding={4}>
    <div id='content'>
      {@render children()}
    </div>
  </SketchyBox>
</div>

<style>
    .card-wrapper {
        margin-top: 3em;
    }

    #content {
        padding: 1em 2em;
    }

    :global(body.dark-mode) .card-wrapper {
        filter: brightness(1.1);
    }
</style>
