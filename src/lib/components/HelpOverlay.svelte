<script lang="ts">
	import { onMount } from 'svelte';

	let open = $state(false);

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.isContentEditable
			)
				return;
			if (e.key === '?' || (e.shiftKey && e.key === '/')) {
				open = !open;
				e.preventDefault();
			}
			if (e.key === 'Escape' && open) {
				open = false;
				e.preventDefault();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if open}
	<div class="overlay" role="dialog" aria-modal="true" aria-label="keyboard shortcuts">
		<div class="panel">
			<div class="title">// keyboard shortcuts</div>
			<dl>
				<dt>1 – 5</dt>
				<dd>jump to tabs (about · work · writing · photos · contact)</dd>
				<dt>j / k</dt>
				<dd>move selection in lists</dd>
				<dt>↑ / ↓</dt>
				<dd>same as j / k</dd>
				<dt>↵ enter</dt>
				<dd>open the focused item</dd>
				<dt>esc</dt>
				<dd>back / close</dd>
				<dt>← / →</dt>
				<dd>(in the projection room) reverse / forward slide</dd>
				<dt>f</dt>
				<dd>(in the projection room) focus easter egg</dd>
				<dt>?</dt>
				<dd>this help</dd>
			</dl>
			<button class="close" onclick={() => (open = false)} data-interactive>close (esc)</button>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(2px);
		z-index: 100;
		padding: 24px;
	}
	.panel {
		max-width: 520px;
		width: 100%;
		padding: 28px 32px;
		background: var(--screen-deep);
		border: 1px solid rgba(140, 200, 220, 0.4);
		box-shadow: 0 0 30px var(--glow-soft), 0 12px 40px rgba(0, 0, 0, 0.6);
		font-family: var(--font-mono);
		color: var(--phosphor);
		text-shadow: 0 0 3px var(--glow-soft);
	}
	.title {
		font-size: 12px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--phosphor-mid);
		margin-bottom: 18px;
	}
	dl {
		display: grid;
		grid-template-columns: 90px 1fr;
		gap: 6px 18px;
		margin: 0 0 22px;
		font-size: 13px;
	}
	dt {
		color: var(--accent);
		text-shadow: 0 0 4px var(--accent-glow);
		font-variant-numeric: tabular-nums;
	}
	dd {
		margin: 0;
		color: var(--phosphor);
	}
	.close {
		font-size: 11px;
		letter-spacing: 0.16em;
		color: var(--phosphor-dim);
		border-top: 1px solid rgba(140, 200, 220, 0.18);
		padding-top: 14px;
		width: 100%;
		text-align: left;
	}
	.close:hover {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}
</style>
