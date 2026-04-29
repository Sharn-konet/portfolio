<script lang="ts">
	import RevealText from '$lib/components/RevealText.svelte';
	import About, { metadata } from '$content/about.md';

	const meta = metadata as Record<string, string>;
	const rows = [
		{ key: 'identifier', val: meta.identifier },
		{ key: 'role', val: meta.role },
		{ key: 'company', val: meta.company },
		{ key: 'location', val: meta.location },
		{ key: 'scope', val: meta.scope }
	];
</script>

<RevealText>
	<div class="rows">
		{#each rows as row (row.key)}
			<div class="row" data-reveal>
				<span class="key">{row.key}</span>
				<span class="val">{row.val}</span>
			</div>
		{/each}
	</div>
	<div class="divider" data-reveal></div>
	<div class="prose" data-reveal>
		<About />
	</div>
</RevealText>

<style>
	.rows {
		display: flex;
		flex-direction: column;
	}
	.row {
		display: flex;
		gap: 20px;
		padding: 6px 0;
	}
	.key {
		width: 150px;
		min-width: 150px;
		color: var(--phosphor-dim);
		font-size: var(--font-small);
		text-shadow: 0 0 2px rgba(80, 140, 160, 0.4);
	}
	.val {
		font-size: var(--font-base);
	}
	.divider {
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(140, 200, 220, 0.3) 30%,
			rgba(140, 200, 220, 0.3) 70%,
			transparent
		);
		margin: 28px 0;
	}
	.prose {
		font-size: var(--font-base);
		line-height: 1.7;
		max-width: 720px;
	}
	.prose :global(p) {
		margin: 0 0 1em 0;
	}
	.prose :global(p:last-child) {
		margin-bottom: 0;
	}
	@media (max-width: 1024px) {
		.key {
			width: 130px;
			min-width: 130px;
		}
	}
	@media (max-width: 600px) {
		.key {
			width: 110px;
			min-width: 110px;
			font-size: var(--font-tiny);
		}
		.val {
			font-size: var(--font-small);
		}
	}
</style>
