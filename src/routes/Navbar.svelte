<script>
	import Darkmode from "./Darkmode.svelte";
</script>

<nav>
    <a id="site-name" href="/">sharnko.net</a>
    <div id="right-side-content">
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

    #right-side-content {
        display: flex;
        flex-direction: row;
        gap: 3em;
        margin-right: 3em;
    }

    #navbar-content {
        gap: 3em;
        display: flex;
        flex-direction: row;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
        list-style: none;
    }
</style>