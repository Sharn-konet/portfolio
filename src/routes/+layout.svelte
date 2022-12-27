<nav>
    <a class="site-name" href="/">sharnko.net</a>
    <ul class="navbar-content">
        <li>
            <a href="/">About</a>
        </li>
        <li>
            <a href="/project">Projects</a>
        </li>
    </ul>
</nav>

<style>
    nav {
        position: relative;
        display: flex;
        gap: 1em;
        background-color: #ffeedd;
        border-radius: 2px;
        font-family: "Alata", sans-serif;
        padding-top: 1rem;
        padding-bottom: 1rem;
        margin-right: 1rem;
        font-size: 1.25rem;
        text-decoration: none;
        font-weight: 400;
        line-height: 1.5;
        text-align: left;
        animation: fade-up 0.5s ease-in;
    }

    .site-name {
        margin-left: 4em;
    }

    .navbar-content {
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
        margin-left: auto!important;
        display: flex;
        flex-direction: row;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
    }
</style>

<slot/>