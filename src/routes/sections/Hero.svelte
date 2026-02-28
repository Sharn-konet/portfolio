<script lang='ts'>
    import Me from '@components/drawings/Me.svelte'

    let outerWidth = $state(800);

    let mobile = $derived(outerWidth < 1150);
    let desktop = $derived(!mobile);
</script>

<svelte:window bind:outerWidth/>

<div id="hero" class:desktop class:mobile>

  {#if mobile}
    <Me/>
  {/if}

    <div id="title">
        <h1 class:desktop class:mobile>Sharn-Konet Reitsma</h1>
        {#if mobile}
        <h2 class:desktop class:mobile>Data Engineer making software that surprises people.</h2>
        {:else}
        <h2 class:desktop class:mobile>Data Engineer</h2>
        {/if}
    </div>

    {#if desktop}
      <Me/>
    {/if}

    <div>
        <div>
            {#if desktop}
            <p> I'm a Bachelor of Engineering graduate with First Class Honours in Engineering Science with four years of work expeirence. I studied at the University of Auckland and developed a skill-set which spanned AI development, optimisation, and mathematical modelling. </p>

            <p> Through my work experience, this skill-set expanded to include knowledge in software development best-practices, data ETL, and cloud infrastructure. </p>

            <p> More than anything, I love working on complex problems. </p>

            <p> I fill my spare time with photography and other miscellaneous software projects in areas that I'm interested in such as graphics programming, front-end development, and data visualisation. </p>

            {/if}
        </div>
        <div id="networking-buttons">
            <a href="sharnkonet_reitsma_CV.pdf" download="SharnKonetReitsma_CV"><button id="resume-button">Download Resume</button></a>
            <a href="https://github.com/Sharn-konet" aria-label="GitHub">
                <svg width="2.5em" height="2.5em" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
            <a href="https://www.linkedin.com/in/sharn-konet-reitsma/" aria-label="LinkedIn">
                <svg width="2.5em" height="2.5em" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            </a>
        </div>
    </div>
</div>

<style>

    h1.desktop {
        font-size: clamp(50px, 4vw, 80px);
        margin-block-end: 0em;
        font-weight: 500;
    }

    h1.mobile {
      margin-top: clamp(10%, calc(20% - 100px), 15%);
      font-size: clamp(30px, 5vw, 200px);
      font-weight: 600;
    }

    h2 {
        color: var(--primary-color) !important;
        opacity: 0.5;
        margin-top: 0;
        line-height: 1.2;
    }

    h2.desktop {
        font-size: clamp(50px, 3.5vw, 60px);
        font-weight: 400;
        margin-bottom: 0.5rem;
    }

    h2.mobile{
      font-size: clamp(20px, 3.5vw, 80px);
      margin: 0 5% 7.5%;
    }

    p {
        font-size: 1.25em;
        padding-left: 0.5%;
    }

    #title {
        display: grid;
        margin-bottom: 2em;
    }

    #resume-button {
        background-color: #ffffff00;
        color: inherit;
        border-color: #0084f5;
        border-radius: 15px;
        border-style: groove;
        padding: 0.8rem 1.75rem;
        font-family: 'Alata', sans-serif;
        font-size: clamp(0.8em, 3.5vw, 1em);
    }

    #resume-button:hover {
        background-color: #ffffff40;
        cursor: pointer;
    }

    #hero.desktop {
        display: grid;
        grid-template-columns: 4fr 3fr;
        grid-template-rows: auto;
        align-items: center;
        grid-template-areas:
            "title image"
            "description image"
            "description image"
        ;
        margin: 6.5% 10%;
    }

    #hero.mobile {
      text-align: center;
      margin: clamp(110px, 17.5vh,33%) 5% 30%;
      display: block;
      justify-content: center;
      align-items: center;
    }

    #networking-buttons {
        display: inline-flex;
        align-items: center;
        gap: 2em;
        margin-top: 1em;
    }

    a {
        color: inherit;
    }

    :global(body.dark-mode) #resume-button {
        border-color: #ffffff;
    }

</style>
