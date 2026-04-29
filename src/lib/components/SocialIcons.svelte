<script lang="ts">
	import { contactArt } from '$lib/contact-art.generated';

	type Item = { slug: keyof typeof contactArt; label: string; href: string };
	let { items }: { items: Item[] } = $props();
</script>

<div class="row">
	{#each items as item (item.slug)}
		<a
			class="icon"
			href={item.href}
			target={item.href.startsWith('http') ? '_blank' : undefined}
			rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
			aria-label={item.label}
		>
			<pre class="art" aria-hidden="true">{contactArt[item.slug] ?? ''}</pre>
			<span class="label">{item.label}</span>
		</a>
	{/each}
</div>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 28px;
		align-items: flex-end;
	}
	.icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		text-decoration: none;
		color: var(--phosphor-mid);
		transition: color 120ms, text-shadow 120ms, transform 120ms;
	}
	.icon:hover {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}
	.icon:hover .art {
		color: var(--accent);
		text-shadow: 0 0 4px var(--accent-glow), 0 0 10px var(--accent-glow);
	}
	.art {
		font-family: var(--font-mono);
		font-size: 10px;
		line-height: 1.05;
		white-space: pre;
		margin: 0;
		color: var(--phosphor);
		text-shadow: 0 0 3px var(--glow-soft), 0 0 8px rgba(80, 160, 180, 0.25);
		min-height: 10ch;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}
	.label {
		font-size: var(--font-tiny);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-shadow: 0 0 3px var(--glow-soft);
	}
	@media (max-width: 600px) {
		.row {
			gap: 18px;
		}
		.art {
			font-size: 9px;
		}
	}
</style>
