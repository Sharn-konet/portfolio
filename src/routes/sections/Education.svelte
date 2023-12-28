<script lang='ts'>
  import Card from '@components/Card.svelte'
  import Uoa from '@components/drawings/Uoa.svelte'
</script>

<div id = 'education'>
<h1>Education</h1>
<Card>
    <div class="spread-container">
      <div class="image">
        <Uoa/>
      </div>
      <div>
        <h2>Bachelor of Engineering (Honours) in Engineering Science</h2>
        <h3>University of Auckland</h3>
        <p>
            My studies focused on the application of mathematics and computing technology to model and solve complex engineering, business, and industrial problems.
            I primarily explored the theory of data analytics, optimisation, and machine learning, while also dabbling in computational mechanics and software engineering principles.
        </p>
        <p>Graduated with First Class Honours</p>
      </div>
    </div>
</Card>

<Card>
  <div class="spread-container">
    <img src="/aws-certification.png" alt="AWS Certification badge" class="image"/>
    <div>
      <h2>Certified AWS Developer Associate</h2>
      <p>
        My skill in AWS has been officially accredited. Achieving the developer certification requires in-depth knowledge around implementing AWS services into code-bases.  
      </p>
      <p>
        This certification is backed up by two years of experience as a heavy user of AWS in an enterprise account. In particular, I have a lot of experience in using:
      </p>
      <ul>
          <li>S3</li>
          <li>EC2</li>
          <li>EKS</li>
          <li>DynamoDB</li>
          <li>Secrets Manager</li>
          <li>IAM</li>
    </div>
  </div>
</Card>

</div>

<style>

    .spread-container {
      display: flex;
      flex: auto;
    }

    .image {
      height: 200px;
      margin: auto 5% auto auto;
    }

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
