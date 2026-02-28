<script lang="ts">
	let outerWidth = $state(0);
	let inlineDates = $derived(outerWidth >= 1100);
	let mobile = $derived(outerWidth < 450);
	let newlineDates = $derived(!inlineDates && !mobile);

	const items = [
		{
			title: 'AI Engineer at Survesy',
			date: 'Nov 2023 - present',
			description: "Currently, I'm working in a startup developing a novel tool for survey design. My responsibility is the delivery and design of our AI features. But in addition to that, I also look after the back-end, database, and infrastructure for the application."
		},
		{
			title: 'Data Applications Engineer at Xero',
			date: 'Feb 2023 - Apr 2024',
			description: 'As a full-time Data Applications Engineer, I am a part of the functional team that serves ML and AI products to the world. At the moment, I\'m working to making our internal analysts lives easier using Python.'
		},
		{
			title: 'Data Scientist Graduate at Xero',
			date: 'Feb 2022 - Feb 2023',
			description: 'rotations',
		},
		{
			title: 'AI Software Developer at Spark 64',
			date: 'Nov 2020 - Feb 2021',
			description: 'Through my internship at ElementX, previously Spark64, I gained the opportunity to branch out from analytics and develop AI solutions for a wide range of areas. During this internship I took on the responsibility of developing computer vision solutions for optical character recognition, object recognition and audio event detection.'
		},
		{
			title: 'Research Assistant at the University of Auckland',
			date: 'Sep 2020 - Jan 2022',
			description: 'As a research assistant at the University of Auckland my research was focused on continuing work done by previous students in the field of Image Classification, working with four channel satellite imagery.'
		},
		{
			title: 'Data Scientist Intern at Harmonic Analytics',
			date: 'Dec 2019 - Mar 2020',
			description: 'My internship at Harmonic was my first exposure to analytics and optimisation in a professional environment. I primarily worked as a contractor for Watercare which involved analytics of wastewater overflow, and application of computer vision to asset management.'
		}
	];

	const activeIndex = 5;
</script>

<svelte:window bind:outerWidth />

<div id="experience">
	<h1>Experience</h1>
	<div class="timeline">
		{#each items as item, i}
			<div class="timeline-item" class:active={i < activeIndex}>
				<div class="timeline-dot" class:active={i < activeIndex}></div>
				<div class="timeline-content">
					<div class="title" class:inlineDates class:newlineDates class:mobile>
						<h3>{item.title}</h3>
						<h4>{item.date}</h4>
					</div>
					{#if !mobile}
						{#if item.description === 'rotations'}
							<p>In the graduate program at Xero I rotated through multiple disciplines.</p>
							<ul>
								<li>
									As a Data Applications Engineer I was learning to serve production-ready Machine
									Learning systems. I also worked on internal tooling for orchestrating complex data
									pipelines.
								</li>
								<li>
									As an Applied Scientist I was engaged in developing better predictions for Bank
									Reconciliation. This gave me the opportunity to experience how experiments are conducted
									in large organisations improving existing products.
								</li>
								<li>
									As a Data Enrichment Engineer, I implemented business logic using the Data Vault 2.0
									modelling standard. As a part of this, I worked on improving standardisation and
									compliance across Xero's data warehouse.
								</li>
							</ul>
						{:else}
							<p>{item.description}</p>
						{/if}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	#experience {
		margin: 10% clamp(10%, calc(25% - 100px), 20%);
	}

	h1 {
		text-align: center;
		font-family: Bombing;
		font-size: var(--section-title-size);
		font-weight: lighter;
		margin-bottom: 0.5em;
	}

	.timeline {
		position: relative;
		padding-left: 2em;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 0.45em;
		top: 0.5em;
		bottom: 0.5em;
		width: 4px;
		background-color: rgba(var(--light-mode-text-color), 0.2);
	}

	:global(body.dark-mode) .timeline::before {
		background-color: rgba(var(--dark-mode-text-color), 0.2);
	}

	.timeline-item {
		position: relative;
		padding-bottom: 2em;
	}

	.timeline-item:last-child {
		padding-bottom: 0;
	}

	.timeline-dot {
		position: absolute;
		left: -1.75em;
		top: 0.35em;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: rgba(var(--light-mode-text-color), 0.2);
		border: 2px solid rgba(var(--light-mode-text-color), 0.3);
	}

	.timeline-dot.active {
		background-color: rgb(var(--light-mode-text-color));
		border-color: rgb(var(--light-mode-text-color));
	}

	:global(body.dark-mode) .timeline-dot {
		background-color: rgba(var(--dark-mode-text-color), 0.2);
		border-color: rgba(var(--dark-mode-text-color), 0.3);
	}

	:global(body.dark-mode) .timeline-dot.active {
		background-color: rgb(var(--dark-mode-text-color));
		border-color: rgb(var(--dark-mode-text-color));
	}

	h3,
	h4 {
		margin-block-start: 0px;
		font-size: 1.25em;
		position: relative;
		top: -4px;
	}

	p,
	li {
		font-size: 1.25em;
		margin-top: 0;
		position: relative;
		top: -10px;
	}

	li {
		margin-top: 20px;
	}

	.title {
		display: flex;
		justify-content: space-between;
	}

	.inlineDates {
		flex-direction: row;
		align-items: center;
	}

	.newlineDates {
		flex-direction: column;
		align-items: start;
	}

	.mobile {
		flex-direction: column;
		align-items: start;
	}

	:global(body) p,
	:global(body) li {
		color: rgb(var(--light-mode-text-color));
	}

	:global(body) h3,
	:global(body) h4 {
		color: rgba(var(--light-mode-text-color), 0.7);
	}

	:global(body.dark-mode) p,
	:global(body.dark-mode) li {
		color: rgb(var(--dark-mode-text-color));
	}

	:global(body.dark-mode) h3,
	:global(body.dark-mode) h4 {
		color: rgba(var(--dark-mode-text-color), 0.7);
	}
</style>
