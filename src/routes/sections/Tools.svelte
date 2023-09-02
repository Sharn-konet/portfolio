<script lang="ts">
  import Card from "@components/Card.svelte"

  let outerWidth: number;
  $: mobile = outerWidth < 1250;
</script>

<svelte:window bind:outerWidth />

<h1> Technical Skills </h1>

<p>
  I'm always looking to pick up
</p>

<div id="skills" class:mobile>
  <Card> 
    <h2> Programming Languages </h2>
    <ul>
      <li> Python </li>
      <li> Julia </li>
      <li> Rust </li>
      <li> Svelte </li>
      <li> Bash </li>
      <li> R </li> 
      <li> Matlab </li>
      <li> Excel </li>
      <li> HTML + CSS </li>
    </ul>
  </Card>

  <Card> 
    <h2> Cloud Tools </h2>
    <ul>
      <li> AWS </li>
      <li> Snowflake </li>
      <li> New Relic </li>
      <li> Sumologic </li>
      <li> Netlify </li>
    </ul>
  </Card>

  <Card> 
    <h2> Other </h2>
    <ul>
      <li> Kubernetes </li>
      <li> Docler </li>
      <li> Vim </li>
      <li> Git </li>
    </ul>
  </Card>
</div>

<style>
  h1 {
     text-align: center;
     font-family: Bombing;
     font-size: var(--section-title-size);
     font-weight: lighter;
     margin-bottom: 0.5em;
  }

  h2 {
    text-align: center;
    font-weight: 600;
  }

  p {
    text-align: center;
    font-size: 1.5rem;
  }

  ul {
    list-style-type: none;
    padding: 0;

  }

  li {
    text-align: center;
    font-size: 1.2rem;
  }

  #skills {
    /* Arrange contents */
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    /* Position box */
    margin: 0 12.5%;
  }

  #skills.mobile {
    margin: 0 2.5%;
  }

</style>
