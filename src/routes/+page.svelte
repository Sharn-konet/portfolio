<script lang="ts">
	import RevealText from '$lib/components/RevealText.svelte';
	import SocialIcons from '$lib/components/SocialIcons.svelte';
	import About, { metadata } from '$content/about.md';

	const meta = metadata as Record<string, string>;

	const idRows = [
		{ key: 'Identifier', val: meta.identifier },
		{ key: 'Role', val: meta.role },
		{ key: 'Company', val: meta.company },
		{ key: 'Location', val: meta.location },
		{ key: 'Scope', val: meta.scope }
	];

	const socials = [
		{ slug: 'email' as const, label: 'Email', href: `mailto:${meta.email}` },
		{ slug: 'github' as const, label: 'GitHub', href: `https://github.com/${meta.github}` },
		{
			slug: 'linkedin' as const,
			label: 'LinkedIn',
			href: `https://www.linkedin.com/in/${meta.linkedin}`
		},
		{
			slug: 'instagram' as const,
			label: 'Instagram',
			href: `https://instagram.com/${meta.instagram}`
		}
	];
</script>

<RevealText>
	<div class="rows">
		{#each idRows as row (row.key)}
			<div class="row" data-reveal>
				<span class="key">{row.key}</span>
				<span class="val">{row.val}</span>
			</div>
		{/each}
	</div>

	<div class="divider" data-reveal></div>

	<div data-reveal>
		<SocialIcons items={socials} />
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
