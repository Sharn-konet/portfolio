<script lang="ts">
	import RevealText from '$lib/components/RevealText.svelte';

	const rows = [
		{ key: 'email', val: 'hello@sharnko.net', href: 'mailto:hello@sharnko.net' },
		{ key: 'github', val: 'sharn-konet', href: 'https://github.com/sharn-konet' },
		{
			key: 'linkedin',
			val: '/in/sharn-konet-reitsma',
			href: 'https://www.linkedin.com/in/sharn-konet-reitsma'
		},
		{ key: 'photos', val: '@sharnsphotos', href: 'https://instagram.com/sharnsphotos' }
	];
</script>

<svelte:head>
	<title>contact — sharnko.net</title>
</svelte:head>

<RevealText>
	<div class="rows">
		{#each rows as row (row.key)}
			<div class="row" data-reveal>
				<span class="key">{row.key}</span>
				<a class="val" href={row.href} target={row.href.startsWith('http') ? '_blank' : undefined} rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{row.val}</a>
			</div>
		{/each}
	</div>
	<div class="divider" data-reveal></div>
	<div class="prose muted" data-reveal>
		// signal received. response within two business days.
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
		padding: 5px 0;
	}
	.key {
		width: 130px;
		min-width: 130px;
		color: var(--phosphor-dim);
		font-size: 13px;
		text-shadow: 0 0 2px rgba(80, 140, 160, 0.4);
	}
	.val {
		font-size: 14px;
		border-bottom: 1px dashed transparent;
		transition: color 100ms, border-color 100ms, text-shadow 100ms;
	}
	.val:hover {
		color: var(--accent);
		border-bottom-color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
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
		margin: 20px 0;
	}
	.prose {
		font-size: 14px;
		line-height: 1.8;
		max-width: 600px;
	}
	.muted {
		color: var(--phosphor-mid);
		text-shadow: 0 0 2px rgba(80, 140, 160, 0.3);
	}
	@media (max-width: 720px) {
		.key {
			width: 90px;
			min-width: 90px;
			font-size: 11px;
		}
		.val {
			font-size: 13px;
		}
	}
</style>
