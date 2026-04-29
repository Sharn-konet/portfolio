<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { tabs, activeTab } from '$lib/nav';

	async function clickSound() {
		try {
			const { sound } = await import('$lib/sound/engine');
			sound.click();
		} catch {
			/* sound module not yet loaded */
		}
	}

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			// Skip when typing into an input or with modifier keys.
			const target = e.target as HTMLElement;
			if (
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.isContentEditable ||
				e.metaKey ||
				e.ctrlKey ||
				e.altKey
			) {
				return;
			}

			// Tab jumps via number keys — same click as a real tab press
			if (/^[1-9]$/.test(e.key)) {
				const tab = tabs[parseInt(e.key, 10) - 1];
				if (tab) {
					const current = activeTab(page.url.pathname).slug;
					if (tab.slug !== current) clickSound();
					goto(tab.href);
					e.preventDefault();
				}
				return;
			}

			// j/k or arrow keys to move within list views
			if (e.key === 'j' || e.key === 'k' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				const items = Array.from(
					document.querySelectorAll<HTMLAnchorElement>('main .list a, main ul a')
				);
				if (!items.length) return;
				const idx = items.findIndex((el) => el === document.activeElement);
				const dir = e.key === 'j' || e.key === 'ArrowDown' ? 1 : -1;
				const next = items[Math.max(0, Math.min(items.length - 1, (idx === -1 ? -1 : idx) + dir))];
				if (next) {
					next.focus();
					e.preventDefault();
				}
			}

			// Esc to go back from detail views
			if (e.key === 'Escape') {
				const p = page.url.pathname;
				if (p.startsWith('/work/') && p !== '/work') {
					goto('/work');
					e.preventDefault();
				} else if (p.startsWith('/writing/') && p !== '/writing') {
					goto('/writing');
					e.preventDefault();
				} else if (p.startsWith('/photos/') && p !== '/photos') {
					goto('/photos');
					e.preventDefault();
				} else if (p.startsWith('/videos/') && p !== '/videos') {
					goto('/videos');
					e.preventDefault();
				}
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>
