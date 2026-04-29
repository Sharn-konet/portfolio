<script lang="ts">
	import { page } from '$app/state';
	import { tabs, activeTab } from '$lib/nav';

	let active = $derived(activeTab(page.url.pathname).slug);

	async function onTabClick(slug: string) {
		if (slug === active) return;
		try {
			const { sound } = await import('$lib/sound/engine');
			sound.click();
		} catch {
			/* sound module may not be ready */
		}
	}
</script>

<nav aria-label="Primary">
	{#each tabs as tab (tab.slug)}
		<a
			class="tab"
			class:active={active === tab.slug}
			href={tab.href}
			data-sveltekit-preload-data="hover"
			aria-current={active === tab.slug ? 'page' : undefined}
			onclick={() => onTabClick(tab.slug)}
		>
			<span class="bracket left" aria-hidden="true">[&nbsp;</span>
			<span class="label">{tab.label}</span>
			<span class="bracket right" aria-hidden="true">&nbsp;]</span>
		</a>
	{/each}
</nav>

<style>
	nav {
		display: flex;
		padding: 0 12px;
		border-bottom: 1px solid rgba(140, 200, 220, 0.22);
		background: rgba(140, 200, 220, 0.04);
		flex-shrink: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}
	nav::-webkit-scrollbar {
		display: none;
	}
	.tab {
		padding: 16px 18px;
		font-size: var(--font-small);
		letter-spacing: 0.1em;
		color: var(--phosphor-dim);
		border-right: 1px solid rgba(140, 200, 220, 0.1);
		transition: color 100ms, background 100ms, text-shadow 100ms;
		white-space: nowrap;
		display: inline-flex;
		align-items: center;
	}
	/* Brackets always occupy space; hidden when inactive so width never changes */
	.bracket {
		display: inline-block;
		visibility: hidden;
		color: var(--phosphor-mid);
	}
	.tab.active .bracket {
		visibility: visible;
	}
	.tab:hover {
		color: var(--phosphor-mid);
		background: rgba(140, 200, 220, 0.07);
		text-shadow: 0 0 6px var(--glow-soft);
	}
	.tab.active {
		color: var(--phosphor);
		background: rgba(140, 200, 220, 0.1);
		text-shadow: 0 0 4px var(--glow), 0 0 12px var(--glow-soft), 0 0 20px var(--glow-soft);
	}
	@media (max-width: 1024px) {
		.tab {
			padding: 14px 14px;
		}
	}
	@media (max-width: 600px) {
		.tab {
			padding: 12px 10px;
		}
	}
</style>
