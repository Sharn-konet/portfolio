<script>
	import ProjectCard from "./ProjectCard.svelte";
    import { Chip } from "@svelteuidev/core"
</script>

<div id='section'>
    <h1>Projects</h1>
    <div id ='projects'>
        <ProjectCard
            src='/projects/lorenz-attractor.gif'
            imageDescription='A Lorenz Attractor in motion.'
            githubLink='https://github.com/Sharn-konet/Flo.jl'
            demoLink="/projects"
        >
            <h2 slot='project-title'>Flo</h2>
            <p slot='project-description'>
                A simulation tool for visualising stunning,
                3 dimensional differential equations
            </p>
        </ProjectCard>

        <ProjectCard
            src='/projects/plotly-dash-example.gif'
            imageDescription='A Lorenz Attractor in motion.'
            githubLink='https://github.com/Sharn-konet/messenger-analysis'
            demoLink="/projects"
        >
            <h2 slot='project-title'>Messenger Analysis</h2>
            <p slot='project-description'>
                A dashboard which breaks down your messaging history into insights.
            </p>
        </ProjectCard>
    </div>
</div>

<style>

    #section {
        margin: 10% 25%;
    }

    h1 {
        text-align: center;
        font-size: 3em;
        margin-bottom: 1.5em;
    }

    h2 {
        font-size: 1.25em;

    }

    #projects {
        display: flex;
        flex-direction: row;
        gap: 3em;

        border-color: rgb(var(--light-mode-text-color));
        border-radius: 90px;
    }
</style>