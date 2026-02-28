<script lang='ts'>
	import ProjectCard from "@components/ProjectCard.svelte";

  let outerWidth = $state(0);
  let mobile = $derived(outerWidth < 1250);
</script>

<svelte:window bind:outerWidth />

<div id='section'>
    <h1>Projects</h1>
    <div id='projects' class:mobile>
        <ProjectCard
            src='/projects/lorenz-attractor.gif'
            imageDescription='A Lorenz Attractor in motion.'
            githubLink='https://github.com/Sharn-konet/Flo.jl'
            demoLink="/attractors"
        >
            {#snippet projectTitle()}
                <h2>Flo</h2>
            {/snippet}
            {#snippet projectDescription()}
                <p>
                    A simulation tool for visualising stunning,
                    3 dimensional differential equations
                </p>
            {/snippet}
        </ProjectCard>

        <ProjectCard
            src='/projects/plotly-dash-example.gif'
            imageDescription='A dashboard showing messaging statistics.'
            githubLink='https://github.com/Sharn-konet/messenger-analysis'
            demoLink="/projects"
        >
            {#snippet projectTitle()}
                <h2>Messenger Analysis</h2>
            {/snippet}
            {#snippet projectDescription()}
                <p>
                    A dashboard which breaks down your messaging history into insights.
                </p>
            {/snippet}
        </ProjectCard>
    </div>
</div>

<style>

    #section {
        margin: 10% clamp(5%, calc(50% - 150px - 20vh), 25%);
    }

    h1 {
        text-align: center;
        font-family: Bombing;
        font-size: var(--section-title-size);
        font-weight: lighter;
        margin-bottom: 0.5em;
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

    #projects.mobile {
        flex-direction: column;
    }
</style>
