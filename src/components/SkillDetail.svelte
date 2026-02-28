<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import type { SkillInfo } from '@data/skillExperience';
  import SketchyBox from './handdrawn/SketchyBox.svelte';

  let {
    skill = $bindable(null),
    open = $bindable(false),
  }: {
    skill: SkillInfo | null;
    open: boolean;
  } = $props();

  function close() {
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (open && e.key === 'Escape') close();
  }

  const proficiencyColors: Record<string, string> = {
    expert: '#22c55e',
    advanced: '#3b82f6',
    intermediate: '#f59e0b',
  };
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open && skill}
  <div class="backdrop" transition:fade={{ duration: 200 }} onclick={close} onkeydown={(e) => e.key === 'Enter' && close()} role="presentation"></div>
  <div
    class="drawer"
    transition:fly={{ x: 300, duration: 300 }}
    role="dialog"
    aria-label="Skill details for {skill.name}"
    aria-modal="true"
  >
    <button class="close-btn" onclick={close} aria-label="Close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>

    <SketchyBox roughness={1.2} padding={4}>
      <div class="content">
        <h2>{skill.name}</h2>

        <div class="meta">
          <span class="badge" style="background: {proficiencyColors[skill.proficiency]}">
            {skill.proficiency}
          </span>
          <span class="badge category">{skill.category}</span>
          <span class="years">{skill.years} year{skill.years !== 1 ? 's' : ''}</span>
        </div>

        <p class="description">{skill.description}</p>

        <h3>Highlights</h3>
        <ul>
          {#each skill.highlights as highlight}
            <li>{highlight}</li>
          {/each}
        </ul>
      </div>
    </SketchyBox>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1500;
  }

  .drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: min(400px, 85vw);
    height: 100%;
    z-index: 1600;
    padding: 2em 1.5em;
    overflow-y: auto;
    background: rgb(var(--light-mode-background-color));
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  }

  :global(body.dark-mode) .drawer {
    background: rgb(var(--dark-mode-background-color));
  }

  .close-btn {
    position: absolute;
    top: 1em;
    right: 1em;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    opacity: 0.7;
    padding: 0.5em;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .content {
    padding: 1em;
  }

  h2 {
    font-family: Bombing;
    font-size: 2em;
    font-weight: lighter;
    margin: 0 0 0.5em;
  }

  h3 {
    font-size: 1.1em;
    margin: 1.5em 0 0.5em;
  }

  .meta {
    display: flex;
    gap: 0.5em;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1em;
  }

  .badge {
    padding: 0.2em 0.6em;
    border-radius: 6px;
    font-size: 0.75em;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }

  .badge.category {
    background: rgba(var(--light-mode-text-color), 0.2);
    color: inherit;
  }

  .years {
    font-size: 0.85em;
    opacity: 0.7;
  }

  .description {
    font-size: 1em;
    line-height: 1.6;
  }

  ul {
    padding-left: 1.25em;
  }

  li {
    margin-bottom: 0.5em;
    font-size: 0.95em;
    line-height: 1.5;
  }
</style>
