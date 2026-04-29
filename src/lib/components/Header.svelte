<script lang="ts">
	import SoundToggle from './SoundToggle.svelte';
</script>

<header>
	<span class="ident">
		<span class="brand">Sharn-Konet Reitsma</span>
		<span class="sep">·</span>
		<span class="role">Founding Engineer</span>
	</span>
	<span class="right">
		<SoundToggle />
	</span>
</header>

<style>
	header {
		padding: 22px 36px 18px;
		border-bottom: 1px solid rgba(140, 200, 220, 0.22);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--font-tiny);
		letter-spacing: 0.22em;
		color: var(--phosphor-mid);
		text-transform: uppercase;
		text-shadow: 0 0 4px var(--glow-soft);
		flex-shrink: 0;
	}
	.brand {
		color: var(--phosphor);
		text-shadow: 0 0 6px var(--glow), 0 0 12px var(--glow-soft);
	}
	.role {
		color: var(--phosphor-mid);
	}
	.sep {
		margin: 0 8px;
		opacity: 0.5;
	}
	.right {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	@media (max-width: 1024px) {
		header {
			padding: 18px 26px 14px;
		}
	}
	@media (max-width: 600px) {
		header {
			padding: 14px 16px 10px;
			font-size: 10px;
			letter-spacing: 0.16em;
		}
		.role {
			display: none;
		}
		.sep {
			display: none;
		}
	}
</style>
