<script lang='ts'>
  import Card from '@components/Card.svelte'
</script>

<div id = 'education'>
<h1>Education</h1>
<Card>
    <h2>Bachelor of Engineering (Honours) in Engineering Science</h2>
    <h3>University of Auckland</h3>
    <p>
        My studies focused on the application of mathematics and computing technology to model and solve complex engineering, business, and industrial problems.
        I primarily explored the theory of data analytics, optimisation, and machine learning, while also dabbling in computational mechanics and software engineering principles.
    </p>
    <p>Graduated with First Class Honours</p>
</Card>
</div>

<style>
    #education {
        margin: 10% clamp(5%, calc(30% - 100px), 25%);
    }

    h1 {
        text-align: center;
        font-family: Bombing;
        font-size: var(--section-title-size);
        font-weight: lighter;
        margin-bottom: 0.5em;
    }

    h2 {
        font-size: 1.5em;
    }

    h3 {
        font-size: 1.25em;
    }

</style>
