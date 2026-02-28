<script lang="ts">
  import RiveAnimation from "@components/RiveAnimation.svelte"
  import SkillDetail from "@components/SkillDetail.svelte"
  import { getSkillByEvent, type SkillInfo } from "@data/skillExperience"

  let outerWidth = $state(0);
  let mobile = $derived(outerWidth < 1250);

  // Skill detail drawer state
  let selectedSkill: SkillInfo | null = $state(null);
  let drawerOpen = $state(false);

  function handleRiveEvent(eventName: string) {
    const skill = getSkillByEvent(eventName);
    if (skill) {
      selectedSkill = skill;
      drawerOpen = true;
    }
  }
</script>

<svelte:window bind:outerWidth />

<h1> Technical Skills </h1>

<RiveAnimation
  src="/tools.riv"
  autoplay={true}
  artboard="Viewport"
  stateMachines="Main State Machine"
  onRiveEvent={handleRiveEvent}
/>

<SkillDetail bind:skill={selectedSkill} bind:open={drawerOpen} />

<style>
  h1 {
     text-align: center;
     font-family: Bombing;
     font-size: var(--section-title-size);
     font-weight: lighter;
     margin-bottom: 0.5em;
  }
</style>
