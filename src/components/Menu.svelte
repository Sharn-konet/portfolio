<script lang="ts">
  import {XmarkSolid} from 'svelte-awesome-icons'
  import { fade } from 'svelte/transition'
  let src: string = "/hamburger.svg"

  let showMenu = false;

  function toggleMenu() {
    showMenu = !showMenu;
    document.body.style.overflow = '';
  }

  function closeMenu() {
    showMenu = false;
    document.body.style.overflow = '';
  }

</script>


<img {src} alt="Menu button" on:click={toggleMenu}/>

{#if showMenu}
  <div id="menu-overlay" on:click={closeMenu} in:fade="{{duration: 150}}" out:fade="{{duration: 100}}">
    <div id="exit-button"><XmarkSolid/></div>
    <div id="list"><slot/></div>
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

  img {
    height: 2em;
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
