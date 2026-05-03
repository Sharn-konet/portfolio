<script lang="ts">
	import AttractorSim from '$lib/components/AttractorSim.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.pageTitle}</title>
</svelte:head>

<div class="page">
	<aside class="side">
		<div class="tag">// Projects</div>
		<div class="title">Flo · 3D Differential Equation Visualiser</div>
		<div class="desc">
			<p>
				A strange-attractor sandbox, written to investigate differential equations with three
				dimenssions.
			</p>
			<p>
				Here I have recreated the project using JavaScript, and have embedded six of the chaotic
				systems from the original project.
			</p>
			<p class="dim">
				Originally, this project was written using Python and served using Plotly. However, Python's
				interpreted nature left a lot to be desired when it came to performance.
			</p>
			<p class="dim">
				Subsequently, the project I rewrote the project using Julia, which resolved a lot of the
				performance issues which were found in the Python version. In addition to rewriting the
				solving of the equations, I also used the languages metaprogramming features to build a
				custom language for reading the expressions, and used this to extend the project to many
				different kinds of attractors.
			</p>
			<p class="dim">
				Click any system on the right to switch. Same equations, tiny perturbations in initial
				conditions, divergent paths. Classic chaos.
			</p>
		</div>
	</aside>
	<main class="content">
		<AttractorSim />
	</main>
</div>

<style>
	.page {
		height: 100%;
		display: grid;
		grid-template-columns: minmax(220px, 280px) 1fr;
		gap: 32px;
		overflow: hidden;
	}
	.side {
		display: flex;
		flex-direction: column;
		gap: 14px;
		min-height: 0;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(140, 200, 220, 0.3) transparent;
	}
	.side::-webkit-scrollbar {
		width: 6px;
	}
	.side::-webkit-scrollbar-thumb {
		background: rgba(140, 200, 220, 0.25);
	}
	.tag {
		font-size: var(--font-tiny);
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--phosphor-mid);
	}
	.title {
		font-size: var(--font-base);
		color: var(--phosphor);
		text-shadow:
			0 0 4px var(--glow),
			0 0 12px var(--glow-soft);
		line-height: 1.4;
	}
	.desc {
		padding-top: 10px;
		border-top: 1px dashed rgba(140, 200, 220, 0.18);
		font-size: var(--font-small);
		color: var(--phosphor-mid);
		line-height: 1.6;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.desc p {
		margin: 0;
	}
	.desc .dim {
		color: var(--phosphor-dim);
		font-size: var(--font-tiny);
		line-height: 1.7;
	}
	.desc a {
		color: var(--accent);
		text-decoration: none;
		text-shadow: 0 0 6px var(--accent-glow);
	}
	.desc a:hover {
		text-decoration: underline;
	}
	.content {
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	@media (max-width: 760px) {
		.page {
			grid-template-columns: 1fr;
			height: auto;
			overflow: visible;
		}
		.content {
			height: 60vh;
		}
	}
</style>
