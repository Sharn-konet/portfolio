<script lang="ts">
	import { onMount } from 'svelte';
	import { soundEnabled } from '$lib/stores/sound';

	let { onDone }: { onDone: () => void } = $props();

	const PORTAL = `
                     ░░░░░░░░░                       
                   ░░░░░░░░░                         
                 ▒░░░░░░░░░                          
               ▒░░░░░░░░░░                           
              ░░░░░░░░░░░░░            ░             
            ▒░░░░░░░▒▒▒░░░   ▒▓▒                     
          ▒░░░░░░░▒▒▒▒▒░░░░▒▓▓▓▓▓▒       ░░          
        ▒▒▒▒░▒▒▒▒▓▓▒▒▒▒░░▒▒▒▓▓▓▓▓▓▓▒     ░░░▒        
      ▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒░░░░▒▓▓▓▓▓▓▓░   ░░░░▒▒      
    ▓▒▒▒▒▒▒▒▒▓█▓▓▓▓▒▒▒▒░░░ ░░░▒▓▓▓▓▓▓▓▓░ ░░░▒▒▒▒▓    
  ▓▒▒▒▒▒▒▒▒▓███▓▓▓▓▓▒░ ░░    ░░░▒▓▓▓▓▓▓▓▓░░░▒▒▒▒▓▓   
▓▒▒▒▒▒▒▒▒▓█████▓▓▓▒░░░░        ░░░▒▓▓▓▓▒▓▓▒░▒▒▒▒▓▓▓▓ 
▓▒▒▒▒▒▒▒▓██████▓▓▒░░░            ░░░▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓
▓▓▓▒▒▒▒▒▒▒▓███▓▒░░░                ░░░▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓
▓▓▓▓▒▒▒▒▒▒▒▒▓▒░░░                   ░░░▒▓▒▒▒▒▒▒▒▒▓▓▓▓
▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒░░░░                ░░░▓███▓▒▒▒▒▒▒▒▓▓▓
▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒░░░             ░░░▒▓██████▓▒▒▒▒▒▒▒▓
 ▓▓▓▓▒▒▒▒░▒▓▓▓▓▒▓▒▒░░░         ░░░▒▓▓▓█████▓▒▒▒▒▒▒▒▒▓
  ▓▓▓▒▒▒▒░░░▓▓▓▓▓▓▓▓▒░░░     ░░ ░▒▓▓▓▓███▓▒▒▒▒▒▒▒▒▓  
    ▓▒▒▒▒░░░ ░▓▓▓▓▓▓▓▓▒░░░ ░░░░▒▒▓▓▓▓▓█▓▒▒▒▒▒▒▒▒▒    
      ▒▒▒░░░   ░▓▓▓▓▓▓▓▒░░░░░▒▒▒▒▓▓▓▓▓▒▒▒▒▒▒▒▒▒      
        ▒░░░     ▒▓▓▓▓▓▓▓▒░░░░▒▒▒▒▓▓▒▒▒▒▒▒▒▒▒        
          ░░       ▓▓▓▓▓▓▒░░░░▒▒▒▒▒░░░░░░░▒          
            ░        ▒▓▒░  ░░░▒▒▒░░░░░░░░            
             ░             ░░░▒░░░░░░░░▒             
                           ░░░░░░░░░░▒               
                          ░░░░░░░░░▒                 
                         ░░░░░░░░░                   
                       ░░░░░░░░░                     `;

	const BAR_LEN = 32;
	const BAR_MS = 1700;

	let portalVisible = $state(false);
	let filled = $state(0);
	let ready = $state(false);
	let cancelled = false;
	let armed = false;

	function barFilled(n: number) {
		return '█'.repeat(n);
	}
	function barEmpty(n: number) {
		return '█'.repeat(BAR_LEN - n);
	}
	function pctText(n: number) {
		return Math.round((n / BAR_LEN) * 100)
			.toString()
			.padStart(3, ' ') + '%';
	}

	function sleep(ms: number) {
		return new Promise<void>((r) => setTimeout(r, ms));
	}

	async function armSound() {
		if (armed) return;
		if (!$soundEnabled) return;
		armed = true;
		try {
			const { sound } = await import('$lib/sound/engine');
			if (!sound.enabled) await sound.enable();
			else await sound.resume();
		} catch {
			/* ignore */
		}
	}

	async function sfx(name: 'bootBeep' | 'bootTick' | 'bootReady') {
		if (!$soundEnabled) return;
		try {
			const { sound } = await import('$lib/sound/engine');
			sound[name]();
		} catch {
			/* ignore */
		}
	}

	onMount(() => {
		armSound();

		(async () => {
			await sleep(60);
			if (cancelled) return;
			portalVisible = true;
			sfx('bootBeep');

			await sleep(420);
			const step = BAR_MS / BAR_LEN;
			for (let i = 1; i <= BAR_LEN; i++) {
				if (cancelled) return;
				filled = i;
				if (i % 2 === 1) sfx('bootTick');
				await sleep(step);
			}

			await sleep(180);
			if (cancelled) return;
			ready = true;
			sfx('bootReady');

			await sleep(420);
			if (!cancelled) onDone();
		})();

		// Skip on user gesture — but the same gesture also arms audio.
		// Defer skip until after audio has had a chance to arm so the first
		// click on a fresh page resumes the AudioContext rather than just bailing.
		const skip = (e: Event) => {
			armSound();
			if (cancelled) return;
			cancelled = true;
			onDone();
			e.preventDefault?.();
		};
		window.addEventListener('keydown', skip, { once: true });
		window.addEventListener('click', skip, { once: true });

		return () => {
			cancelled = true;
			window.removeEventListener('keydown', skip);
			window.removeEventListener('click', skip);
		};
	});
</script>

<div class="boot" role="status" aria-live="polite">
	<div class="stack">
		<pre class="portal" class:show={portalVisible} aria-hidden="true">{PORTAL}</pre>
		<div class="label">SHARNKO.NET / PORTFOLIO</div>
		<div class="bar-row">
			<span class="bar-glyph"
				><span class="bar-fill">{barFilled(filled)}</span><span class="bar-empty"
					>{barEmpty(filled)}</span
				></span
			>
			<span class="bar-pct">{pctText(filled)}</span>
		</div>
		<div class="status" class:ready>{ready ? '> READY.' : '> LOADING…'}</div>
	</div>
</div>

<style>
	.boot {
		position: absolute;
		inset: 0;
		z-index: 20;
		background: var(--screen);
		color: var(--phosphor);
		font-family: var(--font-mono);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		text-shadow:
			0 0 4px var(--glow),
			0 0 12px var(--glow-soft);
		overflow: hidden;
	}
	.stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		max-width: 100%;
	}
	.portal {
		margin: 0;
		font-family: var(--font-mono);
		font-size: clamp(4.5px, 1.4vw, 10px);
		line-height: 1;
		letter-spacing: 0;
		white-space: pre;
		opacity: 0;
		transition: opacity 320ms ease-out;
		color: var(--phosphor);
		text-shadow:
			0 0 6px var(--glow),
			0 0 18px var(--glow-soft);
	}
	.portal.show {
		opacity: 1;
	}
	.label {
		font-size: 12px;
		letter-spacing: 0.3em;
		color: var(--phosphor-mid);
		margin-top: 4px;
	}
	.bar-row {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: baseline;
		gap: 12px;
		width: 100%;
		font-size: clamp(12px, 1.5vw, 14px);
		font-variant-numeric: tabular-nums;
	}
	.bar-glyph {
		grid-column: 2;
		white-space: pre;
	}
	.bar-empty {
		opacity: 0.18;
	}
	.bar-pct {
		grid-column: 3;
		justify-self: start;
	}
	.status {
		font-size: 12px;
		color: var(--phosphor-dim);
		letter-spacing: 0.15em;
	}
	.status.ready {
		color: var(--phosphor);
	}
</style>
