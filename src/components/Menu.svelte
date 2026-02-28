<script lang="ts">
  import { fade } from 'svelte/transition'

  let { children } = $props();

  let showMenu = $state(false);

  function toggleMenu() {
    showMenu = !showMenu;
    document.body.style.overflow = '';
  }

  function closeMenu() {
    showMenu = false;
    document.body.style.overflow = '';
  }
</script>

<img src="/hamburger.svg" alt="Menu button" onclick={toggleMenu}/>

{#if showMenu}
  <div id="menu-overlay" onclick={closeMenu} role="button" tabindex="-1"
       in:fade={{duration: 150}} out:fade={{duration: 100}}>
    <div id="exit-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </div>
    <div id="list">{@render children()}</div>
  </div>
{/if}

<style>
  #exit-button {
    position: fixed;
    top: 0;
    right: 0;
    padding: 2rem;
    cursor: pointer;
  }

  img {
    cursor: pointer;
    height: 2em;
  }

  #menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(var(--dark-mode-background-color), 0.975);
    z-index: 2000;
  }

  #list {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
  }

  #list :global(ul) {
    list-style: none;
    padding-inline-start: 0;
    text-align: center;
  }

  #list :global(li) {
    font-size: 2em;
    margin-top: 20%;
    margin-bottom: 20%;
  }

</style>
