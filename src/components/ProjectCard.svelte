<script lang='ts'>
    import type { Snippet } from 'svelte';

    let {
        src,
        imageDescription,
        githubLink,
        demoLink,
        chips,
        projectTitle,
        projectDescription
    }: {
        src: string;
        imageDescription: string;
        githubLink: string;
        demoLink: string;
        chips?: Snippet;
        projectTitle?: Snippet;
        projectDescription?: Snippet;
    } = $props();
</script>

<div id='project-card'>
    <img {src} alt={imageDescription}>
    <div id='project-info'>
        <div id='chips'>{#if chips}{@render chips()}{/if}</div>
        <div id='project-title'>{#if projectTitle}{@render projectTitle()}{/if}</div>
        <div id='project-description'>{#if projectDescription}{@render projectDescription()}{/if}</div>
        <div id='links'>
            <a href={githubLink}>
                <svg width="2.5em" height="2.5em" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
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
        box-shadow: 0px 0px 4em #46046534;
        border-radius: 25px;
        transition: box-shadow 2s
    }

    :global(body.dark-mode) #project-card {
        box-shadow: 0px 0px 4em rgba(var(--light-mode-text-color), 0.30);
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
