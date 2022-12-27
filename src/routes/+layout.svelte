<script>
    import Navbar from './Navbar.svelte'
    import './global.css'
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet">
</svelte:head>

<div id="background">
    <Navbar/>
    <slot/>
</div>