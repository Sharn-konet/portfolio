import type { Component } from 'svelte';

export type WorkMeta = {
	slug: string;
	title: string;
	org: string;
	start: string;
	end: string;
	order: number;
	kind?: 'experience' | 'project';
	description?: string;
};

export type WritingMeta = {
	slug: string;
	title: string;
	date: string;
	description?: string;
	draft?: boolean;
	readingTime?: number;
	external?: string;
};

export type AboutMeta = {
	identifier: string;
	role: string;
	company: string;
	location: string;
	scope: string;
};

type Module = { default: Component; metadata?: Record<string, unknown> };

function asMeta<T>(m: Module, slug: string): T {
	return { ...(m.metadata ?? {}), slug } as T;
}

const workModules = import.meta.glob<Module>('/src/content/work/*.md', { eager: true });
const writingModules = import.meta.glob<Module>('/src/content/writing/*.md', { eager: true });

function slugFromPath(path: string): string {
	const parts = path.split('/');
	return parts[parts.length - 1].replace(/\.md$/, '');
}

export function getWorkList(): WorkMeta[] {
	return Object.entries(workModules)
		.map(([path, mod]) => asMeta<WorkMeta>(mod, slugFromPath(path)))
		.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function getWorkComponent(slug: string): { Component: Component; meta: WorkMeta } | null {
	const entry = Object.entries(workModules).find(([path]) => slugFromPath(path) === slug);
	if (!entry) return null;
	const [, mod] = entry;
	return { Component: mod.default, meta: asMeta<WorkMeta>(mod, slug) };
}

export function getWritingList(): WritingMeta[] {
	return Object.entries(writingModules)
		.map(([path, mod]) => asMeta<WritingMeta>(mod, slugFromPath(path)))
		.filter((m) => !m.draft)
		.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

export function getWritingComponent(
	slug: string
): { Component: Component; meta: WritingMeta } | null {
	const entry = Object.entries(writingModules).find(([path]) => slugFromPath(path) === slug);
	if (!entry) return null;
	const [, mod] = entry;
	return { Component: mod.default, meta: asMeta<WritingMeta>(mod, slug) };
}

export function formatRange(start: string, end: string): string {
	const fmt = (s: string) => {
		if (!s || s === '~' || s === 'now') return 'Now';
		const [y] = s.split('-');
		return y;
	};
	return `${fmt(start)} → ${fmt(end)}`;
}
