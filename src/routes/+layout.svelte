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
        --light-mode-text-color: 0, 132, 245;
        --light-mode-background-color: 242, 238, 226;

        --dark-mode-text-color: 228, 230, 235;
        --dark-mode-background-color: 24, 25, 26;
    }

   :global(*) {
        font-family: "Alata", sans-serif;
        font-size: 1rem;
    }

    :global(body) {
        background-color: rgb(var(--light-mode-background-color));
        transition: background-color 0.3s;
        color: rgb(var(--light-mode-text-color));
        border-color: rgb(var(--light-mode-text-color));
        transition: color 0.1s;

        line-height: 1.5;
        text-align: left;
    }

    :global(body.dark-mode) {
        background-color: rgb(var(--dark-mode-background-color));
        color: rgb(var(--dark-mode-text-color));
    }

    #background {}
</style>

