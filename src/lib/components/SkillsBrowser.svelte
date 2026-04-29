<script lang="ts">
	import { skills, skillGroups, proficiencyLabel, type Skill } from '$lib/skills';

	let selected = $state<Skill>(skills[0]);

	const today = new Date().toISOString().slice(0, 10).replace(/-/g, '·');
	const totalSubjects = skills.length;

	async function clickSound() {
		try {
			const { sound } = await import('$lib/sound/engine');
			sound.click();
		} catch {
			/* sound not ready */
		}
	}

	function select(skill: Skill) {
		if (selected.slug === skill.slug) return;
		selected = skill;
		clickSound();
	}

	function onKey(e: KeyboardEvent) {
		const idx = skills.findIndex((s) => s.slug === selected.slug);
		if (e.key === 'ArrowDown' || e.key === 'j') {
			e.preventDefault();
			selected = skills[(idx + 1) % skills.length];
			clickSound();
		} else if (e.key === 'ArrowUp' || e.key === 'k') {
			e.preventDefault();
			selected = skills[(idx - 1 + skills.length) % skills.length];
			clickSound();
		}
	}

	const placeholder = `· · · · · · · · · ·
·
·   no logo yet     ·
·
· · · · · · · · · ·`;

	const art = $derived(
		selected.art && selected.art.trim().length > 0 ? selected.art : placeholder
	);

	const dashesTop = $derived('─'.repeat(Math.max(0, 42 - selected.name.length - 4)));

	function bar(p: number): string {
		const FILL = p * 4;
		return '█'.repeat(FILL) + '░'.repeat(20 - FILL);
	}
</script>

<section class="skills-page">
	<header class="masthead">
		<div class="topline">
			<span class="mark">// FIELD INTELLIGENCE — TECHNOLOGY DOSSIERS</span>
			<span class="dim">SKR·KIT · INTERNAL</span>
		</div>
		<div class="topline">
			<span class="dim">{totalSubjects} SKILLS</span>
			<span class="dim">UPDATED {today}</span>
		</div>
	</header>

	<div class="browser">
		<div
			class="list"
			role="listbox"
			tabindex="0"
			aria-label="Skills"
			onkeydown={onKey}
		>
			<div class="list-header">SKILL INDEX</div>
			{#each skillGroups as group (group.name)}
				<div class="group-label">{group.label}</div>
				<div class="group-items">
					{#each group.items as s (s.slug)}
						<button
							class="row"
							class:active={selected.slug === s.slug}
							onclick={() => select(s)}
							role="option"
							aria-selected={selected.slug === s.slug}
						>
							<span class="caret">{selected.slug === s.slug ? '>' : ' '}</span>
							<span class="name">{s.name}</span>
						</button>
					{/each}
				</div>
			{/each}
		</div>

		<div class="vrule" aria-hidden="true"></div>

		<article class="dossier" aria-live="polite">
			{#key selected.slug}
				<div class="dossier-inner">
					<div class="dossier-head">
						<div class="dossier-title">
							SKILL FILE → <span class="subject">{selected.name}</span>
						</div>
					</div>

					<div class="top-row">
						<div class="logo">
							<div class="border-top">
								┌─[&nbsp;{selected.name}&nbsp;]─{dashesTop}┐
							</div>
							<pre class="art">{art}</pre>
							<div class="border-bot">└{'─'.repeat(44)}┘</div>
						</div>

						<div class="data">
							<div class="data-row">
								<span class="data-key">DESIGNATION</span>
								<span class="data-val">{selected.designation}</span>
							</div>
							<div class="data-row">
								<span class="data-key">CLASSIFICATION</span>
								<span class="data-val">{selected.classification}</span>
							</div>
							<div class="data-row">
								<span class="data-key">FIRST CONTACT</span>
								<span class="data-val">{selected.firstContact}</span>
							</div>
							<div class="data-row">
								<span class="data-key">STATUS</span>
								<span class="data-val">{selected.status}</span>
							</div>
							<div class="data-row">
								<span class="data-key">PROFICIENCY</span>
								<span class="data-val proficiency">
									<span class="bar">[{bar(selected.proficiency)}]</span>
									<span class="bar-label">{proficiencyLabel(selected.proficiency)}</span>
								</span>
							</div>
						</div>
					</div>

					<section class="block">
						<div class="block-head">Notes</div>
						<p>{selected.notes}</p>
					</section>
				</div>
			{/key}
		</article>
	</div>
</section>

<style>
	.skills-page {
		display: flex;
		flex-direction: column;
		gap: 22px;
		height: 100%;
		min-height: 0;
	}

	.masthead {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 0 0 auto;
		padding-bottom: 14px;
		border-bottom: 1px solid rgba(140, 200, 220, 0.18);
		animation: fade-in 280ms ease-out both;
	}
	.topline {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		font-family: var(--font-mono);
		font-size: var(--font-tiny);
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--phosphor-dim);
		text-shadow: 0 0 4px var(--glow-soft);
	}
	.mark,
	.dim {
		color: inherit;
	}

	.browser {
		flex: 1 1 0;
		min-height: 0;
		display: grid;
		grid-template-columns: 220px 1px 1fr;
		gap: 28px;
		overflow: hidden;
		animation: fade-in 380ms ease-out 80ms both;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.list {
		overflow-y: auto;
		min-height: 0;
		padding-right: 6px;
		font-family: var(--font-mono);
		font-size: var(--font-small);
		color: var(--phosphor-mid);
		outline: none;
		scrollbar-width: thin;
		scrollbar-color: rgba(140, 200, 220, 0.3) transparent;
	}
	.list::-webkit-scrollbar {
		width: 6px;
	}
	.list::-webkit-scrollbar-thumb {
		background: rgba(140, 200, 220, 0.25);
		border-radius: 3px;
	}
	.list:focus-visible {
		outline: 1px solid var(--accent);
		outline-offset: 4px;
	}
	.list-header {
		font-size: var(--font-tiny);
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--phosphor-dim);
		margin: 0 0 12px;
		text-shadow: 0 0 4px var(--glow-soft);
	}

	.group-label {
		font-size: var(--font-tiny);
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--phosphor-dim);
		margin: 14px 0 6px;
		text-shadow: 0 0 4px var(--glow-soft);
	}
	.group-items {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: grid;
		grid-template-columns: 16px 1fr;
		align-items: center;
		text-align: left;
		padding: 4px 0;
		color: var(--phosphor-mid);
		background: transparent;
		border: none;
		font: inherit;
		transition: color 120ms, text-shadow 120ms;
	}
	.row:hover {
		color: var(--phosphor);
	}
	.row.active {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}
	.row .caret {
		color: var(--accent);
		width: 16px;
		text-align: center;
	}

	.vrule {
		width: 1px;
		align-self: stretch;
		background: linear-gradient(
			180deg,
			transparent 0%,
			var(--phosphor-dim) 6%,
			var(--phosphor-dim) 94%,
			transparent 100%
		);
		opacity: 0.35;
	}

	.dossier {
		overflow-y: auto;
		min-height: 0;
		padding-right: 8px;
		scrollbar-width: thin;
		scrollbar-color: rgba(140, 200, 220, 0.3) transparent;
	}
	.dossier::-webkit-scrollbar {
		width: 6px;
	}
	.dossier::-webkit-scrollbar-thumb {
		background: rgba(140, 200, 220, 0.25);
		border-radius: 3px;
	}

	.dossier-inner {
		display: flex;
		flex-direction: column;
		gap: 22px;
		padding-bottom: 32px;
		animation: fade-up 360ms ease-out both;
	}
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.dossier-head {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.dossier-title {
		font-family: var(--font-mono);
		font-size: var(--font-small);
		color: var(--phosphor-dim);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		text-shadow: 0 0 4px var(--glow-soft);
	}
	.dossier-title .subject {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
	}

	.top-row {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 36px;
		align-items: start;
		padding-bottom: 18px;
		border-bottom: 1px solid rgba(140, 200, 220, 0.18);
	}

	.logo {
		font-family: var(--font-mono);
		color: var(--phosphor);
		text-shadow:
			0 0 4px var(--glow-soft),
			0 0 10px rgba(80, 160, 180, 0.25);
		font-size: 10px;
		line-height: 1.1;
		width: max-content;
	}
	.border-top,
	.border-bot {
		color: var(--accent);
		opacity: 0.85;
		white-space: pre;
	}
	.art {
		margin: 4px 0;
		padding: 0 1ch;
		font-family: var(--font-mono);
		font-size: 10px;
		line-height: 1.1;
		white-space: pre;
		overflow: hidden;
		animation: scan-in 700ms steps(44, end) both;
	}
	@keyframes scan-in {
		0% {
			clip-path: inset(0 100% 0 0);
		}
		100% {
			clip-path: inset(0 0 0 0);
		}
	}

	.data {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.data-row {
		display: grid;
		grid-template-columns: 160px 1fr;
		gap: 16px;
		font-family: var(--font-mono);
		font-size: var(--font-small);
		line-height: 1.5;
		align-items: baseline;
	}
	.data-key {
		color: var(--phosphor-dim);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-shadow: 0 0 3px var(--glow-soft);
	}
	.data-val {
		color: var(--phosphor);
	}
	.proficiency {
		display: flex;
		gap: 14px;
		align-items: baseline;
		flex-wrap: wrap;
	}
	.bar {
		color: var(--accent);
		text-shadow: 0 0 6px var(--accent-glow);
		letter-spacing: 0;
	}
	.bar-label {
		color: var(--phosphor-mid);
		font-size: var(--font-tiny);
		letter-spacing: 0.22em;
	}

	.block {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.block-head {
		font-family: var(--font-mono);
		font-size: var(--font-tiny);
		letter-spacing: 0.22em;
		color: var(--phosphor-dim);
		text-shadow: 0 0 4px var(--glow-soft);
		text-transform: uppercase;
	}
	.block p {
		margin: 0;
		color: var(--phosphor);
		font-size: var(--font-base);
		line-height: 1.65;
		max-width: 70ch;
	}

	@media (prefers-reduced-motion: reduce) {
		.art,
		.dossier-inner,
		.masthead,
		.browser {
			animation: none;
		}
	}

	@media (max-width: 900px) {
		.skills-page {
			height: auto;
			min-height: 0;
		}
		.browser {
			grid-template-columns: 1fr;
			gap: 22px;
			overflow: visible;
		}
		.vrule {
			display: none;
		}
		.list {
			max-height: 240px;
			padding-right: 6px;
		}
		.dossier {
			overflow-y: visible;
			padding-right: 0;
		}
		.top-row {
			grid-template-columns: 1fr;
			gap: 18px;
		}
		.data-row {
			grid-template-columns: 140px 1fr;
		}
		.topline {
			flex-direction: column;
			gap: 4px;
		}
	}

	@media (max-width: 520px) {
		.data-row {
			grid-template-columns: 1fr;
			gap: 0;
		}
		.data-key {
			font-size: var(--font-tiny);
		}
		.logo {
			font-size: 9px;
		}
		.art {
			font-size: 9px;
		}
	}
</style>
