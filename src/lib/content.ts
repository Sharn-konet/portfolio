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

export type VideoMeta = {
	slug: string;
	title: string;
	year: number;
	kind: string;
	platform: 'youtube' | 'vimeo';
	embedId: string;
	embedHash?: string;
	order: number;
	description?: string;
};

export type AboutMeta = {
	identifier: string;
	role: string;
	company: string;
	location: string;
	scope: string;
	email: string;
	github: string;
	linkedin: string;
	instagram: string;
};

type Module = { default: Component; metadata?: Record<string, unknown> };

function asMeta<T>(m: Module, slug: string): T {
	return { ...(m.metadata ?? {}), slug } as T;
}

const workModules = import.meta.glob<Module>('/src/content/work/*.md', { eager: true });
const writingModules = import.meta.glob<Module>('/src/content/writing/*.md', { eager: true });
const videoModules = import.meta.glob<Module>('/src/content/videos/*.md', { eager: true });

function slugFromPath(path: string): string {
	const parts = path.split('/');
	return parts[parts.length - 1].replace(/\.md$/, '');
}

function sortKey(date: string): string {
	if (!date || date === '~' || date === 'now') return '9999-99';
	return date;
}

export function getWorkList(): WorkMeta[] {
	return Object.entries(workModules)
		.map(([path, mod]) => asMeta<WorkMeta>(mod, slugFromPath(path)))
		.sort((a, b) => {
			const endCmp = sortKey(b.end).localeCompare(sortKey(a.end));
			if (endCmp !== 0) return endCmp;
			return sortKey(b.start).localeCompare(sortKey(a.start));
		});
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

export function getVideoList(): VideoMeta[] {
	return Object.entries(videoModules)
		.map(([path, mod]) => asMeta<VideoMeta>(mod, slugFromPath(path)))
		.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export function getVideoComponent(slug: string): { Component: Component; meta: VideoMeta } | null {
	const entry = Object.entries(videoModules).find(([path]) => slugFromPath(path) === slug);
	if (!entry) return null;
	const [, mod] = entry;
	return { Component: mod.default, meta: asMeta<VideoMeta>(mod, slug) };
}

export function formatRange(start: string, end: string): string {
	const fmt = (s: string) => {
		if (!s || s === '~' || s === 'now') return 'Now';
		const [y] = s.split('-');
		return y;
	};
	return `${fmt(start)} → ${fmt(end)}`;
}
