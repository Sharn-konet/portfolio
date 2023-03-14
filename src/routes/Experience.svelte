<script>
    import {Timeline} from '@svelteuidev/core'
</script>

<div id = 'experience'>
<h1>Experience</h1>
<Timeline active={4} lineWidth={4}>
    <Timeline.Item>
        <div class = title>
            <h3>Data Applications Engineer at Xero</h3>
            <h4>Feb 2023 - present</h4>
        </div>
        <p>As a full-time Data Applications Engineer, I am a part of the functional team that serves ML and AI products to the world. At the moment, I'm working to making our internal analysts lives easier using Python.</p>
    </Timeline.Item>
    <Timeline.Item>
        <div class = title>
            <h3>Data Scientist Graduate at Xero</h3>
            <h4>Feb 2022 - Feb 2023</h4>
        </div>
        <p>In the graduate program at Xero I rotated through multiple disciplines.</p>

        <ul>
        <li>As a Data Applications Engineer I was learning to serve production-ready Machine Learning systems. I also worked on internal tooling for orchestrating complex data pipelines.</li>

        <li>As an Applied Scientist I was engaged in developing better predictions for Bank Reconciliation. This gave me the opportunity to experience how experiments are conducted in large organisations improving existing products.</li>

        <li>As a Data Enrichment Engineer, I implemented business logic using the Data Vault 2.0 modelling standard. As a part of this, I worked on improving standardisation and compliance across Xero's data warehouse.</li>
        </ul>
    </Timeline.Item>

    <Timeline.Item>
        <div class = title>
            <h3>AI Software Developer at Spark 64</h3>
            <h4>Nov 2020 - Feb 2021</h4>
        </div>
        <p>
            Through my internship at ElementX, previously Spark64, I gained the opportunity to branch out from analytics and develop AI solutions for a wide range of areas. During this internship I took on the responsibility of developing computer vision solutions for optical character recognition, object recognition and audio event detection.
        </p>
    </Timeline.Item>

    <Timeline.Item>
        <div class = title>
            <h3>Research Assistant at the University of Auckland</h3>
            <h4>Sep 2020 - Jan 2022</h4>
        </div>
        <p>As a research assistant at the University of Auckland my research was focused on continuing work done by previous students in the field of Image Classification, working with four channel satellite imagery.</p>
    </Timeline.Item>

    <Timeline.Item>
        <div class = title>
            <h3>Data Scientist Intern at Harmonic Analytics</h3>
            <h4>Dec 2019 - Mar 2020</h4>
        </div>
        <p>
            My internship at Harmonic was my first exposure to analytics and optimisation in a professional environment. I primarily worked as a contractor for Watercare which involved analytics of wastewater overflow, and application of computer vision to asset management.
        </p>
    </Timeline.Item>
</Timeline>
</div>

<style>
    #experience {
        margin: 10% 25%;
    }

    h1 {
        text-align: center;
        font-size: 3em;
        margin-bottom: 1.5em;
    }

    h3, h4 {
        margin-block-start: 0px;
        font-size: 1.25em;
        color: #ffffff89
    }

    p, li {
        font-size: 1.25em;
        margin-top: 0
    }

    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    :global(body) p,
    :global(body) li {
        color: rgb(var(--light-mode-text-color));
    }

    :global(body) h3,
    :global(body) h4 {
        color: rgba(var(--light-mode-text-color), 0.70);
    }

    :global(body.dark-mode) p,
    :global(body.dark-mode) li {
        color: rgb(var(--dark-mode-text-color));
    }

    :global(body.dark-mode) h3,
    :global(body.dark-mode) h4 {
        color: rgba(var(--dark-mode-text-color), 0.70);
    }
</style>