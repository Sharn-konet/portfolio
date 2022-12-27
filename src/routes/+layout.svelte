<script>
    import Navbar from './Navbar.svelte'
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet">
</svelte:head>

<div id="background">
    <Navbar/>
    <slot/>
</div>

<style>

    :root {
        --light-mode-text-color: #0084f5
    }

   :global(*) {
        font-family: "Alata", sans-serif;
        font-size: 1rem;
    }

    :global(body) {
        background-color: #f2eee2;
        transition: background-color 0.3s;
        color: var(--light-mode-text-color);
        border-color: var(--light-mode-text-color);
        transition: color 0.1s;

        line-height: 1.5;
        text-align: left;
    }

    :global(body.dark-mode) {
        background-color: #18191a;
        color: #e4e6eb;
    }

    #background {}
</style>

