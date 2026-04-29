import { skillArt } from './skills-art.generated';

export type SkillCategory = 'languages' | 'cloud' | 'tools';
export type Proficiency = 1 | 2 | 3 | 4 | 5;

export const proficiencyLabel = (p: Proficiency): string =>
	['-', 'NOVICE', 'FAMILIAR', 'COMPETENT', 'FLUENT', 'EXPERT'][p];

export type Skill = {
	name: string;
	slug: string;
	category: SkillCategory;
	art?: string;

	classification: string;
	designation: string;
	firstContact: string;
	status: string;
	proficiency: Proficiency;
	notes: string;
};

const all: Omit<Skill, 'art'>[] = [
	{
		name: 'python',
		slug: 'python',
		category: 'languages',
		classification: 'LANGUAGE / DYNAMIC INTERPRETED',
		designation: 'PYTHON',
		firstContact: '2014 · university physics',
		status: 'ACTIVE · DAILY',
		proficiency: 5,
		notes:
			'Backend services, data pipelines, and scripting glue. The default starting environment for almost any new problem. Pairs with Rust for performance-critical extensions, R for statistics, and Bash for orchestration.'
	},
	{
		name: 'rust',
		slug: 'rust',
		category: 'languages',
		classification: 'LANGUAGE / SYSTEMS COMPILED',
		designation: 'RUST',
		firstContact: '2020',
		status: 'ACTIVE · OPPORTUNISTIC',
		proficiency: 3,
		notes:
			"Performance-sensitive paths, CLI tools, and anywhere I want compile-time guarantees over Python's runtime forgiveness. Reach for it when correctness and performance both matter. Used sparingly, since most problems don't need it."
	},
	{
		name: 'julia',
		slug: 'julia',
		category: 'languages',
		classification: 'LANGUAGE / DYNAMIC JIT',
		designation: 'JULIA',
		firstContact: '2018 · research code',
		status: 'DORMANT · ON-DEMAND',
		proficiency: 3,
		notes:
			'Numerical and scientific work where MATLAB feels dated and Python feels slow. The language MATLAB should have grown into. Excellent for simulation-heavy code, less obvious benefit for general-purpose work.'
	},
	{
		name: 'svelte',
		slug: 'svelte',
		category: 'languages',
		classification: 'FRAMEWORK / WEB UI',
		designation: 'SVELTE',
		firstContact: '2022',
		status: 'ACTIVE · CURRENT',
		proficiency: 4,
		notes:
			'Frontend for personal projects, including this site. The runes-era ergonomics finally feel right. Would still pick React for a team of strangers, but pick Svelte for myself or for internal tools where bundle size matters.'
	},
	{
		name: 'bash',
		slug: 'bash',
		category: 'languages',
		classification: 'LANGUAGE / SHELL',
		designation: 'BASH',
		firstContact: '2013',
		status: 'ACTIVE · BACKGROUND',
		proficiency: 4,
		notes:
			'Build scripts, deploy hooks, dev shortcuts. The layer between systems. set -euo pipefail at the top of every script. Reach for Python the moment control flow gets non-trivial.'
	},
	{
		name: 'r',
		slug: 'r',
		category: 'languages',
		classification: 'LANGUAGE / STATISTICAL',
		designation: 'R',
		firstContact: '2015 · graduate stats',
		status: 'DORMANT · ON-DEMAND',
		proficiency: 3,
		notes:
			'Exploratory analysis, model fitting, ggplot. Carryover from research that still wins when the answer is statistical. For everything else, Python with pandas or polars is fine.'
	},
	{
		name: 'matlab',
		slug: 'matlab',
		category: 'languages',
		classification: 'LANGUAGE / NUMERICAL · PROPRIETARY',
		designation: 'MATLAB',
		firstContact: '2014 · engineering courses',
		status: 'DORMANT · LEGACY',
		proficiency: 3,
		notes:
			'Signal processing and control-systems work. Mostly research-era code I occasionally revisit. For new work I default to Julia or Python.'
	},
	{
		name: 'excel',
		slug: 'excel',
		category: 'languages',
		classification: 'TOOL / SPREADSHEET',
		designation: 'EXCEL',
		firstContact: 'childhood',
		status: 'ACTIVE · STAKEHOLDER-FACING',
		proficiency: 4,
		notes:
			'When the deliverable needs to be a spreadsheet someone else can poke at. Underrated for shipping numbers to humans. The moment a script appears, it should be a script, but that moment is rarely when engineers think it is.'
	},
	{
		name: 'html',
		slug: 'html',
		category: 'languages',
		classification: 'LANGUAGE / MARKUP',
		designation: 'HTML',
		firstContact: 'circa 2008',
		status: 'ACTIVE · FOUNDATIONAL',
		proficiency: 4,
		notes:
			'The substrate. Everywhere a browser is involved. Reach for plain HTML when a framework would be overkill: most landing pages, status pages, and docs.'
	},
	{
		name: 'css',
		slug: 'css',
		category: 'languages',
		classification: 'LANGUAGE / STYLING',
		designation: 'CSS',
		firstContact: 'circa 2008',
		status: 'ACTIVE · FOUNDATIONAL',
		proficiency: 4,
		notes:
			'Vanilla CSS with custom properties and grid. This site is hand-written CSS top to bottom. Utility frameworks help small things and hurt big ones, in my experience.'
	},

	{
		name: 'aws',
		slug: 'aws',
		category: 'cloud',
		classification: 'PLATFORM / CLOUD INFRASTRUCTURE',
		designation: 'AMAZON WEB SERVICES',
		firstContact: '2018',
		status: 'ACTIVE · PRODUCTION',
		proficiency: 4,
		notes:
			'Most production systems I have shipped run on AWS. Comfortable across compute, storage, networking, and IAM. Default to managed services (RDS, ECS, Lambda) over self-hosting, with Terraform for anything that should outlive a console session.'
	},
	{
		name: 'gcp',
		slug: 'gcp',
		category: 'cloud',
		classification: 'PLATFORM / CLOUD INFRASTRUCTURE',
		designation: 'GOOGLE CLOUD PLATFORM',
		firstContact: '2024',
		status: 'ACTIVE · PRODUCTION',
		proficiency: 3,
		notes:
			'Production stack at Survesy: Cloud Run, BigQuery, Pub/Sub, Workflows. Cleaner primitives than AWS for the green-field case, less mature on the periphery. The right choice when the team already lives in Google Workspace.'
	},
	{
		name: 'snowflake',
		slug: 'snowflake',
		category: 'cloud',
		classification: 'PLATFORM / DATA WAREHOUSE',
		designation: 'SNOWFLAKE',
		firstContact: '2020',
		status: 'ACTIVE · ANALYTICS',
		proficiency: 3,
		notes:
			'Where analytics queries and ad-hoc investigation live. The source of truth for non-application data. Cheap to start, expensive to abuse. Always EXPLAIN before scaling a query.'
	},
	{
		name: 'new relic',
		slug: 'new-relic',
		category: 'cloud',
		classification: 'PLATFORM / OBSERVABILITY',
		designation: 'NEW RELIC',
		firstContact: '2019',
		status: 'ACTIVE · MONITORING',
		proficiency: 3,
		notes:
			'APM and dashboards for production services. First place I look when something feels off. Useful precisely when you are too sleepy to grep logs. Worth wiring up before you need it.'
	},

	{
		name: 'kubernetes',
		slug: 'kubernetes',
		category: 'tools',
		classification: 'PLATFORM / CONTAINER ORCHESTRATION',
		designation: 'KUBERNETES',
		firstContact: '2019',
		status: 'DORMANT · MANAGED',
		proficiency: 3,
		notes:
			'Container orchestration on prior services, managed offerings only (EKS, GKE). K8s pays off when you have multiple clusters and platform engineers; otherwise ECS or Fly is plenty.'
	},
	{
		name: 'docker',
		slug: 'docker',
		category: 'tools',
		classification: 'TOOL / CONTAINERIZATION',
		designation: 'DOCKER',
		firstContact: '2017',
		status: 'ACTIVE · DAILY',
		proficiency: 4,
		notes:
			'Container builds, dev/prod parity, deploy artifacts. Daily-driver tool. Treat Dockerfiles as production code: pinned bases, .dockerignore, multi-stage, no curl-bash inside builds.'
	},
	{
		name: 'git',
		slug: 'git',
		category: 'tools',
		classification: 'TOOL / VERSION CONTROL',
		designation: 'GIT',
		firstContact: '2013',
		status: 'ACTIVE · CONSTANT',
		proficiency: 5,
		notes:
			'Everywhere code is. Daily, hourly, hard to imagine working without it. Rebase before merging, commit messages as documentation, atomic commits over giant diffs. The history is the diary.'
	}
];

export const skills: Skill[] = all.map((s) => ({ ...s, art: skillArt[s.slug] }));

export const skillBySlug: Record<string, Skill> = Object.fromEntries(
	skills.map((s) => [s.slug, s])
);

export const skillGroups: { name: string; label: string; category: SkillCategory; items: Skill[] }[] = [
	{
		name: 'languages',
		label: '// languages',
		category: 'languages',
		items: skills.filter((s) => s.category === 'languages')
	},
	{
		name: 'cloud',
		label: '// cloud',
		category: 'cloud',
		items: skills.filter((s) => s.category === 'cloud')
	},
	{
		name: 'tools',
		label: '// tooling',
		category: 'tools',
		items: skills.filter((s) => s.category === 'tools')
	}
];
