import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const KEY = 'sfx';

function load(): boolean {
	if (!browser) return true; // SSR — assume on, the bezel LED state is just visual
	try {
		const v = localStorage.getItem(KEY);
		// Default to ON when no prior preference. Off only when explicitly disabled.
		if (v === null) return true;
		return v === 'on';
	} catch {
		return true;
	}
}

export const soundEnabled = writable<boolean>(load());

if (browser) {
	soundEnabled.subscribe((v) => {
		try {
			localStorage.setItem(KEY, v ? 'on' : 'off');
		} catch {
			/* ignore */
		}
	});
}
