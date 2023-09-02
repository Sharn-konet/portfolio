<div id='content'>
  <slot/>
</div>

<style>

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
</style>
