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
		status: 'ACTIVE',
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
		status: 'DORMANT',
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
		status: 'DORMANT',
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
		status: 'ACTIVE',
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
		firstContact: '2019 · statics courses',
		status: 'DORMANT',
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
		firstContact: '2018 · engineering courses',
		status: 'DORMANT',
		proficiency: 3,
		notes:
			'Signal processing and control-systems work. Mostly research-era code I occasionally revisit. For new work I default to Julia or Python.'
	},
	{
		name: 'react',
		slug: 'react',
		category: 'languages',
		classification: 'FRAMEWORK / WEB UI',
		designation: 'REACT',
		firstContact: '2023 · working at survesy',
		status: 'DORMANT',
		proficiency: 1,
		notes: ''
	},

	{
		name: 'javascript',
		slug: 'javascript',
		category: 'languages',
		classification: 'LANGUAGE / WEB',
		designation: 'JS',
		firstContact: '2023 · working at survesy',
		status: 'ACTIVE',
		proficiency: 2,
		notes: ''
	},
	{
		name: 'aws',
		slug: 'aws',
		category: 'cloud',
		classification: 'PLATFORM / CLOUD INFRASTRUCTURE',
		designation: 'AMAZON WEB SERVICES',
		firstContact: '2022 - working at xero',
		status: 'DORMANT',
		proficiency: 3,
		notes:
			'Most of the infrastructure I worked with at Xero was on AWS. Comfortable across compute, storage, networking, and IAM. Default to managed services (RDS, ECS, Lambda) over self-hosting, with Terraform for anything that should outlive a console session.'
	},
	{
		name: 'terraform',
		slug: 'terraform',
		category: 'languages',
		classification: 'LANGUAGE - INFRA AS CODE',
		firstContact: '2022 - working at xero',
		designation: 'TERRAFORM',
		status: 'ACTIVE',
		proficiency: 4,
		notes:
			'Most of the infrastructure I worked with at Xero was on AWS. Comfortable across compute, storage, networking, and IAM. Default to managed services (RDS, ECS, Lambda) over self-hosting, with Terraform for anything that should outlive a console session.'
	},
	{
		name: 'gcp',
		slug: 'gcp',
		category: 'cloud',
		classification: 'PLATFORM / CLOUD INFRASTRUCTURE',
		designation: 'GOOGLE CLOUD PLATFORM',
		firstContact: '2024',
		status: 'ACTIVE',
		proficiency: 4,
		notes:
			'I built and maintained the production stack at Survesy which ran on GCP. Familiar with Cloud Run, Cloud SQL, Pub/Sub, Workflows, and VertexAI'
	},
	{
		name: 'snowflake',
		slug: 'snowflake',
		category: 'cloud',
		classification: 'PLATFORM / DATA WAREHOUSE',
		designation: 'SNOWFLAKE',
		firstContact: '2022 - working at xero',
		status: 'DORMANT',
		proficiency: 3,
		notes:
			'Where analytics queries and ad-hoc investigation live. At Xero, I worked with Snowflake significantly, both for conducting analysis on production AI features as well as orchestrating ELT jobs with dbt.'
	},
	{
		name: 'new relic',
		slug: 'new-relic',
		category: 'cloud',
		classification: 'PLATFORM / OBSERVABILITY',
		designation: 'NEW RELIC',
		firstContact: '2019',
		status: 'DORMANT',
		proficiency: 3,
		notes:
			'Observability of choice at Xero, I instrumented internal data orchestration services using APM, and focusing on useful dashboards, and effective thresholds for finding out how things are going.'
	},

	{
		name: 'kubernetes',
		slug: 'kubernetes',
		category: 'tools',
		classification: 'PLATFORM / CONTAINER ORCHESTRATION',
		designation: 'KUBERNETES',
		firstContact: '2022 - working at xero',
		status: 'DORMANT',
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
		status: 'ACTIVE',
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
		firstContact: '2019',
		status: 'ACTIVE',
		proficiency: 5,
		notes:
			'Heavily invested in good version control practices. I prioritise delivering my work in small units which are easy to review. Strongly believe in reviewing your own changes before passing them on for review. Recently been looking into stacked diffs.'
	}
];

export const skills: Skill[] = all.map((s) => ({ ...s, art: skillArt[s.slug] }));

export const skillBySlug: Record<string, Skill> = Object.fromEntries(
	skills.map((s) => [s.slug, s])
);

export const skillGroups: {
	name: string;
	label: string;
	category: SkillCategory;
	items: Skill[];
}[] = [
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
