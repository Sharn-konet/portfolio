<script lang="ts">
  import RiveAnimation from "@components/RiveAnimation.svelte"

  let outerWidth = $state(0);
  let mobile = $derived(outerWidth < 1250);
</script>

<svelte:window bind:outerWidth />

<h1> Technical Skills </h1>

<RiveAnimation
  src="/tools.riv"
  autoplay={true}
  artboard="Viewport"
  stateMachines="Main State Machine"
/>

<style>
  h1 {
     text-align: center;
     font-family: Bombing;
     font-size: var(--section-title-size);
     font-weight: lighter;
     margin-bottom: 0.5em;
  }
</style>
