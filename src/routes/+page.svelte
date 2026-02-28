<script>
  import { fade, fly, scale } from 'svelte/transition'
  import { inview } from 'svelte-inview'

  let show = $state(false)
  $effect(() => {
      show = true
  })

  import Experience from "./sections/Experience.svelte";
  import Education from "./sections/Education.svelte";
  import Hero from "./sections/Hero.svelte";
  import Projects from "./sections/Projects.svelte";
  import Tools from "./sections/Tools.svelte";
  import SketchyDivider from "@components/handdrawn/SketchyDivider.svelte";

  // Per-section scroll visibility flags
  let toolsVisible = $state(false);
  let experienceVisible = $state(false);
  let educationVisible = $state(false);
  let projectsVisible = $state(false);

  // Easter egg: Konami code
  const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIndex = $state(0);
  let konamiActivated = $state(false);

  function handleKonami(e) {
    if (konamiActivated) return;
    if (e.key === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiActivated = true;
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  }

  // Easter egg: Portrait click counter
  let portraitClicks = $state(0);
  let speechBubble = $state(false);
</script>

<svelte:window onkeydown={handleKonami} />

<svelte:head>
    <title>sharnko.net</title>
</svelte:head>

<div class:konami={konamiActivated}>

{#if show}
<div in:fade={{delay:50, duration: 600}}>
    <div
      onclick={() => { portraitClicks++; if (portraitClicks >= 10) speechBubble = true; }}
      role="presentation"
    >
      <Hero/>
    </div>
    {#if speechBubble}
      <div class="speech-bubble" transition:scale={{ duration: 300 }}>
        <p>You found me! Thanks for clicking 10 times.</p>
      </div>
    {/if}
</div>

<div class="divider-container">
    <SketchyDivider accent="star" />
</div>

<div
  use:inview={{ threshold: 0.15 }}
  oninview_enter={() => toolsVisible = true}
>
  {#if toolsVisible}
    <div in:fly={{ y: 40, duration: 600 }}>
      <Tools/>
    </div>
  {:else}
    <div class="placeholder"></div>
  {/if}
</div>

<div class="divider-container">
    <SketchyDivider accent="squiggle" />
</div>

<div
  use:inview={{ threshold: 0.1 }}
  oninview_enter={() => experienceVisible = true}
>
  {#if experienceVisible}
    <div in:fade={{ duration: 800 }}>
      <Experience/>
    </div>
  {:else}
    <div class="placeholder"></div>
  {/if}
</div>

<div class="divider-container">
    <SketchyDivider accent="star" />
</div>

<div
  use:inview={{ threshold: 0.15 }}
  oninview_enter={() => educationVisible = true}
>
  {#if educationVisible}
    <div in:fly={{ x: -40, duration: 600 }}>
      <Education/>
    </div>
  {:else}
    <div class="placeholder"></div>
  {/if}
</div>

<div class="divider-container">
    <SketchyDivider accent="squiggle" />
</div>

<div
  use:inview={{ threshold: 0.1 }}
  oninview_enter={() => projectsVisible = true}
>
  {#if projectsVisible}
    <div in:scale={{ start: 0.95, duration: 500 }}>
      <Projects/>
    </div>
  {:else}
    <div class="placeholder"></div>
  {/if}
</div>

{/if}

</div>

{#if konamiActivated}
  <div class="konami-toast" transition:fly={{ y: 50, duration: 400 }}>
    Konami Code activated! Extra sketchy mode enabled.
  </div>
{/if}

<style>
    .divider-container {
        margin: 0 10%;
    }

    .placeholder {
        min-height: 200px;
    }

    /* Konami easter egg: extra sketchy style */
    .konami :global(svg path),
    .konami :global(svg line),
    .konami :global(svg rect),
    .konami :global(svg circle) {
        filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='w'%3E%3CfeTurbulence baseFrequency='0.03' numOctaves='3' seed='2'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='4'/%3E%3C/filter%3E%3C/svg%3E#w");
    }

    .konami :global(*) {
        font-variation-settings: 'wght' 300 !important;
    }

    .konami-toast {
        position: fixed;
        bottom: 2em;
        left: 50%;
        transform: translateX(-50%);
        background: rgb(var(--light-mode-text-color));
        color: rgb(var(--light-mode-background-color));
        padding: 0.75em 1.5em;
        border-radius: 8px;
        font-size: 0.9em;
        z-index: 1000;
        pointer-events: none;
    }

    :global(body.dark-mode) .konami-toast {
        background: rgb(var(--dark-mode-text-color));
        color: rgb(var(--dark-mode-background-color));
    }

    .speech-bubble {
        text-align: center;
        background: rgba(var(--light-mode-text-color), 0.1);
        border: 2px solid rgba(var(--light-mode-text-color), 0.3);
        border-radius: 16px;
        padding: 0.75em 1.5em;
        margin: -1em auto 2em;
        max-width: 400px;
        font-size: 0.95em;
    }

    .speech-bubble p {
        margin: 0;
    }
</style>
