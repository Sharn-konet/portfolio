<script lang='ts'>
    import {GithubBrand} from 'svelte-awesome-icons'

    export let src: string;
    export let imageDescription: string;
    export let githubLink: string;
    export let demoLink: string;
</script>

<div id = 'project-card'>
    <img {src} alt = {imageDescription}>
    <div id = 'project-info'>
        <div id = 'chips'> <slot name='chips'/> </div>
        <div id = 'project-title'> <slot name = 'project-title'/> </div>
        <div id = 'project-description'> <slot name = 'project-description'/> </div>
        <div id = 'links'>
            <a href={githubLink}><GithubBrand size = 2.5em/></a>
            <div id='demo-link'>
                <a href={demoLink}>Demo</a>
            </div>
        </div>
    </div>
</div>

<style>
    #project-card {
        display: flex;
        flex-flow: column;
        box-shadow: 0px 0px 4em rgba(var(--light-mode-text-color), 0.30);
        border-radius: 25px;
    }



    img {
        max-width: 100%;
        border-radius: 25px 25px 0px 0px;
    }

    #project-info {
        padding: 0.5em 1.25em;
        border-radius: 0px 0px 25px 25px;
        background-color: #ffffff20;
        flex: 1 1 auto;
    }

    #links {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 2em;
        margin-bottom: 0.75em;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    #demo-link {
        border-color: rgb(var(--light-mode-text-color));
        border-radius: 15px;
        border-style: groove;

        padding: 0.5em 1em;
    }

    :global(body.dark-mode) #demo-link {
        border-color: rgb(var(--dark-mode-text-color));
    }

</style>