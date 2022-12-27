<script>
    import {GithubBrand, LinkedinBrand} from 'svelte-awesome-icons'
    let sharnphoto = "/purple_me.jpeg"
</script>

<div id="hero">
    <div id = "title">
        <h1>Sharn-Konet Reitsma</h1>
        <h2>Data Engineer</h2>
    </div>

    <img src={sharnphoto} alt = "Sharn-Konet Reitsma"/>

    <div>
        <div>
            <p> I want to make software that surprises people. </p>

            <p> Whether it's a Machine Learning system that gives a surprisingly good prediction, or a dashboard that uncovers a new perspective, I want people to question their understanding of the problems around us. </p>

            <p> I'm a Bachelor of Engineering (Hons) graduate from the University of Auckland specialising in Engineering Science. My studies focused on software development, optimisation, and mathematical modelling of real-world systems. </p>
        </div>
        <div id = networking-buttons>
            <a href="sharnkonet_reitsma_CV.pdf" download="SharnKonetReitsma_CV"><button id="resume-button">Download Resume</button></a>
            <a href="https://github.com/Sharn-konet"><GithubBrand size = 2.5em/></a>
            <a href="https://www.linkedin.com/in/sharn-konet-reitsma/"><LinkedinBrand size = 2.5em/></a>
        </div>
    </div>
</div>

<style>
    h1 {
        font-size: clamp(40px, 8vw, 80px);
        margin-block-end: 0em;
        font-weight: 400;
    }

    h2 {
        font-size: clamp(40px, 8vw, 60px);
        color: var(--primary-color) !important;
        opacity: 0.5;
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-weight: 500;
        line-height: 1.2;
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
        font-size: 1em;
    }

    #resume-button:hover {
        background-color: #ffffff40;
        cursor: pointer;
    }

    #hero {
        display: grid;
        grid-template-columns: 4fr 2fr;
        grid-template-rows: auto;
        align-items: center;
        grid-template-areas:
            "title image"
            "description image"
        ;
        margin: 10% 12.5%;
    }

    #networking-buttons {
        display: flex;
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
        box-shadow: 0px 0px 60px #460465f4;
        transition: box-shadow 1.5s;
    }

    :global(body.dark-mode) img {
        box-shadow: 0px 0px 40px rgb(var(--light-mode-text-color));
    }

    :global(body.dark-mode) #resume-button {
        border-color: #ffffff;
    }

</style>