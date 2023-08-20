<script lang='ts'>
    import {GithubBrand, LinkedinBrand} from 'svelte-awesome-icons'
    let sharnphoto = "/purple_me.jpeg"
    import Me from '@components/drawings/Me.svelte'

    let outerWidth: number = 800;

    $: mobile = outerWidth < 1150;
    $: desktop = !mobile;
</script>

<svelte:window bind:outerWidth/>

<div id="hero" class:desktop class:mobile>
    
  {#if mobile}
    <Me/>
  {/if}

    <div id = "title">
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
            <p> I want to make software that surprises people. </p>

            <p> Whether it's a Machine Learning system that gives a surprisingly good prediction, or a dashboard that uncovers a new perspective, I want people to question their understanding of the problems around us. </p>

            <p> I'm a Bachelor of Engineering (Hons) graduate from the University of Auckland specialising in Engineering Science. My studies focused on software development, optimisation, and mathematical modelling of real-world systems. </p>
            {/if}
        </div>
        <div id = networking-buttons>
            <a href="sharnkonet_reitsma_CV.pdf" download="SharnKonetReitsma_CV"><button id="resume-button">Download Resume</button></a>
            <a href="https://github.com/Sharn-konet"><GithubBrand size = 2.5em/></a>
            <a href="https://www.linkedin.com/in/sharn-konet-reitsma/"><LinkedinBrand size = 2.5em/></a>
        </div>
    </div>
</div>

<style>
    

    h1.desktop {
        font-size: clamp(50px, 4vw, 80px);
        margin-block-end: 0em;
        font-weight: 400;
    }

    h1.mobile {
      margin-top: clamp(10%, calc(20% - 100px), 15%);
      font-size: clamp(30px, 5vw, 200px);
      font-weight: 200;
    }

    h2 {
        color: var(--primary-color) !important;
        opacity: 0.5;
        margin-top: 0;
        line-height: 1.2;
    }

    h2.desktop {
        font-size: clamp(50px, 3.5vw, 60px);
        font-weight: 500;
        margin-bottom: 0.5rem;
    }

    h2.mobile{
      font-size: clamp(20px, 3.5vw, 80px);
      margin: 0 5% 7.5%;
    }

    p {
        font-size: 1.25em;
    }

    #title {
        align-items: center;
        display: grid
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
        ;
        margin: 5% 10%;
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
    }

    a {
        color: inherit;
    }

    img {
        grid-area: image;
        justify-self: right;
        border-radius: 50px;
        max-width: 75%;
        box-shadow: 0px 0px 80px rgba(var(--light-mode-box-shadow-color) );
        transition: box-shadow 1.5s;
    }

    img.mobile {
      max-width: clamp(50px, 40vmin, 300px);
      border-radius: 25px;
    }

    :global(body.dark-mode) img {
        box-shadow: 0px 0px 40px rgb(var(--light-mode-text-color));
    }

    :global(body.dark-mode) #resume-button {
        border-color: #ffffff;
    }

</style>
