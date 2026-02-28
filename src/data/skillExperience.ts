// Skill experience data — maps each Rive skill ball to detailed experience info.
// Update the `riveEventName` values once the .riv file has click events added.

export interface SkillInfo {
  name: string;
  riveEventName: string; // e.g. "skill_python_clicked" — set in Rive editor
  category: 'language' | 'tool' | 'platform';
  proficiency: 'expert' | 'advanced' | 'intermediate';
  years: number;
  description: string;
  highlights: string[];
}

export const skills: SkillInfo[] = [
  {
    name: 'Python',
    riveEventName: 'skill_python_clicked',
    category: 'language',
    proficiency: 'expert',
    years: 6,
    description: 'Primary language for data science, ML pipelines, and backend development.',
    highlights: [
      'Production ML systems at Xero',
      'AI features at Survesy (FastAPI, LangChain)',
      'Data ETL pipelines and automation',
      'Pandas, NumPy, scikit-learn, PyTorch',
    ],
  },
  {
    name: 'Rust',
    riveEventName: 'skill_rust_clicked',
    category: 'language',
    proficiency: 'intermediate',
    years: 2,
    description: 'Systems programming and performance-critical applications.',
    highlights: [
      'Personal projects in graphics and CLI tools',
      'Memory-safe concurrent programming',
    ],
  },
  {
    name: 'Julia',
    riveEventName: 'skill_julia_clicked',
    category: 'language',
    proficiency: 'advanced',
    years: 3,
    description: 'Scientific computing and mathematical modeling.',
    highlights: [
      'Flo.jl — 3D differential equation visualizer',
      'University research in numerical methods',
      'High-performance computing for simulations',
    ],
  },
  {
    name: 'Svelte',
    riveEventName: 'skill_svelte_clicked',
    category: 'language',
    proficiency: 'advanced',
    years: 3,
    description: 'Frontend framework for building this portfolio and other web apps.',
    highlights: [
      'This portfolio site (SvelteKit 2 + Svelte 5)',
      'Interactive 3D visualizations with Threlte',
      'Component architecture and animations',
    ],
  },
  {
    name: 'Bash',
    riveEventName: 'skill_bash_clicked',
    category: 'language',
    proficiency: 'advanced',
    years: 5,
    description: 'Shell scripting for automation and DevOps workflows.',
    highlights: [
      'CI/CD pipeline scripting',
      'Server provisioning and automation',
      'Data processing pipelines',
    ],
  },
  {
    name: 'R',
    riveEventName: 'skill_r_clicked',
    category: 'language',
    proficiency: 'intermediate',
    years: 3,
    description: 'Statistical analysis and data visualization.',
    highlights: [
      'University coursework in statistics',
      'ggplot2 visualizations',
      'Statistical modeling and hypothesis testing',
    ],
  },
  {
    name: 'MATLAB',
    riveEventName: 'skill_matlab_clicked',
    category: 'language',
    proficiency: 'intermediate',
    years: 4,
    description: 'Engineering computation and optimization.',
    highlights: [
      'University engineering coursework',
      'Numerical methods and optimization',
      'Signal processing and control systems',
    ],
  },
  {
    name: 'Excel',
    riveEventName: 'skill_excel_clicked',
    category: 'tool',
    proficiency: 'advanced',
    years: 5,
    description: 'Data analysis, reporting, and business intelligence.',
    highlights: [
      'Advanced formulas and pivot tables',
      'VBA automation',
      'Financial modeling',
    ],
  },
  {
    name: 'HTML',
    riveEventName: 'skill_html_clicked',
    category: 'language',
    proficiency: 'expert',
    years: 6,
    description: 'Semantic markup and web standards.',
    highlights: [
      'Accessible, semantic HTML5',
      'SVG graphics and animations',
      'SEO-optimized markup',
    ],
  },
  {
    name: 'CSS',
    riveEventName: 'skill_css_clicked',
    category: 'language',
    proficiency: 'expert',
    years: 6,
    description: 'Styling, layout, and responsive design.',
    highlights: [
      'CSS Grid and Flexbox layouts',
      'Custom properties and animations',
      'Responsive design with clamp()',
    ],
  },
  {
    name: 'AWS',
    riveEventName: 'skill_aws_clicked',
    category: 'platform',
    proficiency: 'advanced',
    years: 3,
    description: 'Cloud infrastructure and services.',
    highlights: [
      'Certified AWS Developer Associate',
      'S3, EC2, EKS, DynamoDB, IAM',
      'Production workloads at Xero',
      'Infrastructure as Code',
    ],
  },
  {
    name: 'Snowflake',
    riveEventName: 'skill_snowflake_clicked',
    category: 'platform',
    proficiency: 'advanced',
    years: 2,
    description: 'Cloud data warehouse and analytics.',
    highlights: [
      'Data Vault 2.0 modeling at Xero',
      'Complex SQL queries and optimization',
      'Data pipeline orchestration',
    ],
  },
  {
    name: 'Kubernetes',
    riveEventName: 'skill_kubernetes_clicked',
    category: 'platform',
    proficiency: 'intermediate',
    years: 2,
    description: 'Container orchestration for production services.',
    highlights: [
      'EKS cluster management at Xero',
      'Service deployment and scaling',
      'Helm charts and manifests',
    ],
  },
  {
    name: 'Docker',
    riveEventName: 'skill_docker_clicked',
    category: 'platform',
    proficiency: 'advanced',
    years: 3,
    description: 'Containerization for development and deployment.',
    highlights: [
      'Multi-stage builds for ML services',
      'Docker Compose for local development',
      'Container optimization and security',
    ],
  },
  {
    name: 'New Relic',
    riveEventName: 'skill_newrelic_clicked',
    category: 'tool',
    proficiency: 'intermediate',
    years: 2,
    description: 'Application performance monitoring.',
    highlights: [
      'APM dashboards and alerting',
      'Performance bottleneck identification',
      'Custom instrumentation',
    ],
  },
  {
    name: 'Sumo Logic',
    riveEventName: 'skill_sumologic_clicked',
    category: 'tool',
    proficiency: 'intermediate',
    years: 2,
    description: 'Log management and analytics.',
    highlights: [
      'Log aggregation and search',
      'Custom dashboards for monitoring',
      'Alert configuration',
    ],
  },
  {
    name: 'Netlify',
    riveEventName: 'skill_netlify_clicked',
    category: 'platform',
    proficiency: 'advanced',
    years: 3,
    description: 'Static site hosting and edge deployment.',
    highlights: [
      'This portfolio deployed on Netlify',
      'Continuous deployment from Git',
      'Edge functions and redirects',
    ],
  },
  {
    name: 'Git',
    riveEventName: 'skill_git_clicked',
    category: 'tool',
    proficiency: 'expert',
    years: 6,
    description: 'Version control and collaboration.',
    highlights: [
      'Daily use across all projects',
      'Branch strategies and code review',
      'Complex merge/rebase workflows',
    ],
  },
  {
    name: 'TeamCity',
    riveEventName: 'skill_teamcity_clicked',
    category: 'tool',
    proficiency: 'intermediate',
    years: 2,
    description: 'CI/CD pipeline management.',
    highlights: [
      'Build pipeline configuration at Xero',
      'Automated testing and deployment',
      'Build agent management',
    ],
  },
];

// Lookup by Rive event name
export function getSkillByEvent(eventName: string): SkillInfo | undefined {
  return skills.find(s => s.riveEventName === eventName);
}

// Lookup by skill name
export function getSkillByName(name: string): SkillInfo | undefined {
  return skills.find(s => s.name.toLowerCase() === name.toLowerCase());
}
