<script lang='ts'>
	import Darkmode from "@components/Darkmode.svelte";

  let outerWidth: number = 800;
  
  let src: string = "/hamburger.svg"
  
  $: mobile = outerWidth < 800
</script>

<svelte:window bind:outerWidth/>

<nav>
    <a id="site-name" class:mobile href="/">sharnko.net</a>
    <div id="right-side-content" class:mobile>
      {#if mobile}
      <Darkmode/>
      <img {src} alt="Menu button"/>
      {:else}
      <ul id="navbar-content">
          <li>
              <a href="/">About</a>
          </li>
          <li>
              <a href="/projects">Projects</a>
          </li>
          <li>
              <a href="/gallery">Photos</a>
          </li>
      </ul>

      <Darkmode/>
      {/if}

    </div>
</nav>

<style>
    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(var(--light-mode-background-color), 0.95);
      border-radius: 6px;
      line-height: 1;
      text-align: left;
      box-sizing: border-box;
      padding-top: 1.5em;
      padding-bottom: 1.5em;
      z-index: 1030;

      position: fixed;
      top: 0;
      left: 0;
      width: 100%
    }

    :global(body.dark-mode) nav {
      background-color: rgba(var(--dark-mode-background-color), 0.95)
    }

    a {
      color: inherit;
      text-decoration: none;
      font-size: 1.5em;
    }

    #site-name {
      margin-left: 4em;
    }

    #site-name.mobile {
      margin-left: 10%;
    }

    #right-side-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-right: 3em;
    }

    #right-side-content.mobile {
      width: 100px;
      margin-right: clamp(5%, 7.5%, 10%);
    }

    #navbar-content {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-left: 0;
      list-style: none;
      width: 400px;

      padding-inline-start:0;
    }

    img {
      height: 2em;
    }
</style>
