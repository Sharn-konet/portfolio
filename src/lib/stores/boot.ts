import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const KEY = 'booted';

function alreadyBooted(): boolean {
	if (!browser) return false;
	try {
		return sessionStorage.getItem(KEY) === 'true';
	} catch {
		return false;
	}
}

export const booted = writable<boolean>(alreadyBooted());

export function markBooted() {
	if (!browser) return;
	try {
		sessionStorage.setItem(KEY, 'true');
	} catch {
		/* ignore */
	}
	booted.set(true);
}
