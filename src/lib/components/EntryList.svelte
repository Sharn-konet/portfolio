<script lang="ts">
	type Item = {
		href: string;
		title: string;
		meta?: string;
		external?: boolean;
		icon?: string;
	};
	let { items, label }: { items: Item[]; label?: string } = $props();

	async function onSelect() {
		try {
			const { sound } = await import('$lib/sound/engine');
			sound.kachunk();
		} catch {
			/* sound module may not be ready */
		}
	}
</script>

{#if label}
	<div class="label" data-reveal>{label}</div>
{/if}
<ul class="list">
	{#each items as item (item.href)}
		<li data-reveal>
			<a
				href={item.href}
				target={item.external ? '_blank' : undefined}
				rel={item.external ? 'noopener noreferrer' : undefined}
				onclick={onSelect}
			>
				<span class="arr" aria-hidden="true">{item.icon ?? '▸'}</span>
				<span class="title">{item.title}</span>
				<span class="meta">{item.meta ?? ''}</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.label {
		font-size: var(--font-tiny);
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--phosphor-dim);
		margin: 28px 0 14px;
		text-shadow: 0 0 4px var(--glow-soft);
	}
	.label:first-child {
		margin-top: 4px;
	}
	.list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	li {
		border-bottom: 1px dashed rgba(140, 200, 220, 0.2);
	}
	a {
		display: grid;
		grid-template-columns: 28px 1fr 140px;
		gap: 18px;
		padding: 14px 16px;
		align-items: baseline;
		transition: background 100ms;
	}
	a:hover {
		background: rgba(140, 200, 220, 0.08);
	}
	a:hover .arr {
		opacity: 1;
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}
	a:hover .title {
		text-shadow: 0 0 4px var(--glow), 0 0 12px var(--glow-soft);
	}
	.arr {
		opacity: 0.35;
		font-size: var(--font-small);
		transition: opacity 100ms, color 100ms, text-shadow 100ms;
	}
	.title {
		font-size: var(--font-base);
	}
	.meta {
		font-size: var(--font-small);
		color: var(--phosphor-dim);
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.06em;
		text-align: right;
		white-space: nowrap;
	}
	@media (max-width: 1024px) {
		a {
			grid-template-columns: 24px 1fr 120px;
			gap: 14px;
			padding: 12px 12px;
		}
	}
	@media (max-width: 600px) {
		a {
			grid-template-columns: 22px 1fr;
			gap: 12px;
			padding: 12px 8px;
		}
		.meta {
			grid-column: 2;
			text-align: left;
			margin-top: 2px;
			color: var(--phosphor-mid);
			opacity: 0.75;
		}
	}
</style>
