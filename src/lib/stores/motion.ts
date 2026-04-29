import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export const reducedMotion = readable<boolean>(false, (set) => {
	if (!browser) return;
	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	set(mq.matches);
	const handler = () => set(mq.matches);
	mq.addEventListener('change', handler);
	return () => mq.removeEventListener('change', handler);
});
