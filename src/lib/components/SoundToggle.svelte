<script lang="ts">
	import { onMount } from 'svelte';
	import { soundEnabled } from '$lib/stores/sound';
	import { browser } from '$app/environment';

	let powering = $state(false);
	let armed = $state(false);

	onMount(() => {
		if (browser) {
			document.body.dataset.sound = $soundEnabled ? 'on' : 'off';
		}

		const unsub = soundEnabled.subscribe((v) => {
			document.body.dataset.sound = v ? 'on' : 'off';
		});

		// "Sound on by default" pattern: if the store is on but AudioContext
		// hasn't been resumed yet (no user gesture), arm a one-shot listener
		// to start the engine on the next click/keydown anywhere.
		const armIfNeeded = async () => {
			if (armed) return;
			if (!$soundEnabled) return;
			armed = true;
			try {
				const { sound } = await import('$lib/sound/engine');
				if (!sound.enabled) {
					await sound.enable();
				}
			} catch {
				/* ignore */
			}
		};
		const onFirstGesture = () => {
			armIfNeeded();
			document.removeEventListener('click', onFirstGesture);
			document.removeEventListener('keydown', onFirstGesture);
			document.removeEventListener('touchstart', onFirstGesture);
		};
		if ($soundEnabled) {
			document.addEventListener('click', onFirstGesture, { once: false });
			document.addEventListener('keydown', onFirstGesture, { once: false });
			document.addEventListener('touchstart', onFirstGesture, { once: false });
		}

		return () => {
			unsub();
			document.removeEventListener('click', onFirstGesture);
			document.removeEventListener('keydown', onFirstGesture);
			document.removeEventListener('touchstart', onFirstGesture);
		};
	});

	async function toggle() {
		if (!$soundEnabled) {
			powering = true;
			try {
				const { sound } = await import('$lib/sound/engine');
				await sound.enable();
				soundEnabled.set(true);
				armed = true;
			} finally {
				powering = false;
			}
		} else {
			const { sound } = await import('$lib/sound/engine');
			sound.disable();
			soundEnabled.set(false);
		}
	}
</script>

<button class="toggle" class:on={$soundEnabled} onclick={toggle} aria-pressed={$soundEnabled}>
	{#if powering}<span aria-hidden="true">▶</span> powering on…
	{:else if $soundEnabled}<span aria-hidden="true">●</span> sound on
	{:else}<span aria-hidden="true">◌</span> sound off
	{/if}
</button>

<style>
	.toggle {
		font-size: var(--font-tiny);
		letter-spacing: 0.14em;
		color: var(--phosphor-dim);
		text-shadow: 0 0 3px var(--glow-soft);
		transition: color 100ms, text-shadow 100ms;
	}
	.toggle:hover {
		color: var(--phosphor);
		text-shadow: 0 0 6px var(--glow);
	}
	.toggle.on {
		color: var(--phosphor);
		text-shadow: 0 0 4px var(--glow), 0 0 10px var(--glow-soft);
	}
</style>
