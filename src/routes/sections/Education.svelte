<div id = 'education'>
<h1>Education</h1>
<div id = 'content'>
    <h2>Bachelor of Engineering (Honours) in Engineering Science</h2>
    <h3>University of Auckland</h3>
    <p>
        My studies focused on the application of mathematics and computing technology to model and solve complex engineering, business, and industrial problems.
        I primarily explored the theory of data analytics, optimisation, and machine learning, while also dabbling in computational mechanics and software engineering principles.
    </p>
    <p>Graduated with First Class Honours</p>
</div>
</div>

<style>
    #education {
        margin: 10% clamp(5%, calc(30% - 100px), 25%);
    }

    #content {
        background-color: rgb(var(--light-mode-background-color));
        border-radius: 15px;
        border-color: rgb(var(--light-mode-text-color));
        padding: 1em 3em;
        box-shadow: 0px 0px 60px rgba(var(--light-mode-box-shadow-color), 0.2);
        transition: box-shadow 3s;
        margin-top: 3em;
    }

    :global(body.dark-mode) #content {
        background-color:   #ffffff20;
        border-radius: 15px;
        box-shadow: 0px 0px 80px rgba(var(--light-mode-text-color), 0.20);
        border-color: rgb(var(--dark-mode-text-color))
    }

    h1 {
        text-align: center;
        font-family: Bombing;
        font-size: 5em;
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
