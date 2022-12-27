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

    :global(:root) {
        --light-mode-text-color: #0084f5;
        --light-mode-background-color: #f2eee2;

        --dark-mode-text-color: #e4e6eb;
        --dark-mode-background-color: #18191a;
    }

   :global(*) {
        font-family: "Alata", sans-serif;
        font-size: 1rem;
    }

    :global(body) {
        background-color: var(--light-mode-background-color);
        transition: background-color 0.3s;
        color: var(--light-mode-text-color);
        border-color: var(--light-mode-text-color);
        transition: color 0.1s;

        line-height: 1.5;
        text-align: left;
    }

    :global(body.dark-mode) {
        background-color: var(--dark-mode-background-color);
        color: var(--dark-mode-text-color);
    }

    #background {}
</style>

