<script lang="ts">
  import Card from "@components/Card.svelte"
  import RiveAnimation from "@components/RiveAnimation.svelte"

  let outerWidth: number;
  $: mobile = outerWidth < 1250;
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
