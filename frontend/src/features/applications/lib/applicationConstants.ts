import {
  type ApplicationLevel,
  type ApplicationStatus,
  type ApplicationType,
  type ApplicationJobType,
  type ApplicationLevelLabel,
  type ApplicationStatusLabel,
  type ApplicationTypeLabel,
  type ApplicationJobTypeLabel,
  type ApplicationRequestDto,
} from "#/applications";

export const APPLICATIONS_LEVEL_OPTIONS: Readonly<
  {
    value: ApplicationLevel;
    label: ApplicationLevelLabel;
  }[]
> = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
] as const;

export const APPLICATIONS_STATUS_OPTIONS: Readonly<
  {
    value: ApplicationStatus;
    label: ApplicationStatusLabel;
  }[]
> = [
  { value: "wishList", label: "WishList" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "ghosted", label: "Ghosted" },
] as const;

export const APPLICATIONS_TYPE_OPTIONS: Readonly<
  {
    value: ApplicationType;
    label: ApplicationTypeLabel;
  }[]
> = [
  { value: "remote", label: "Remote" },
  { value: "onSite", label: "OnSite" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const APPLICATIONS_JOB_TYPE_OPTIONS: Readonly<
  {
    value: ApplicationJobType;
    label: ApplicationJobTypeLabel;
  }[]
> = [
  { value: "fullTime", label: "Full Time" },
  { value: "partTime", label: "Part Time" },
  { value: "internship", label: "Internship" },
] as const;

export const STEPS = ["WishList", "Applied", "Interview"] as const;

export const STATUS_TO_DATE_KEY: Record<string, keyof ApplicationRequestDto> = {
  wishList: "wishListDate",
  applied: "appliedDate",
  interview: "interviewDate",
  offer: "offerDate",
  rejected: "rejectedDate",
  ghosted: "ghostedDate",
};

export const STATUS_TO_VALUE: Record<string, number> = {
  WishList: 0,
  Applied: 1,
  Interview: 2,
  Offer: 3,
  Ghosted: 4,
  Rejected: 5,
};

export const TECHNOLOGIES: Readonly<{ value: string; label: string }[]> = [
  // Programming Languages
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c#", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },

  // Frontend Frameworks
  { value: "react", label: "React" },
  { value: "vue.js", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "next.js", label: "Next.js" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "astro", label: "Astro" },

  // Backend Frameworks
  { value: "node.js", label: "Node.js" },
  { value: "express.js", label: "Express.js" },
  { value: "nest.js", label: "NestJS" },
  { value: "django", label: "Django" },
  { value: "flask", label: "Flask" },
  { value: "fastapi", label: "FastAPI" },
  { value: "spring-boot", label: "Spring Boot" },
  { value: "asp.net", label: "ASP.NET" },
  { value: "ruby-on-rails", label: "Ruby on Rails" },
  { value: "laravel", label: "Laravel" },

  // Mobile & Desktop Frameworks
  { value: "react-native", label: "React Native" },
  { value: "flutter", label: "Flutter" },
  { value: "electron", label: "Electron" },
  { value: "tauri", label: "Tauri" },

  // Databases
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "mongodb", label: "MongoDB" },
  { value: "redis", label: "Redis" },
  { value: "supabase", label: "Supabase" },
  { value: "firebase", label: "Firebase" },

  // Database Tools
  { value: "prisma", label: "Prisma" },
  { value: "drizzle", label: "Drizzle" },

  // CSS Frameworks
  { value: "tailwindcss", label: "Tailwind CSS" },
  { value: "bootstrap", label: "Bootstrap" },
  { value: "sass", label: "Sass" },
  { value: "material-ui", label: "Material-UI" },
  { value: "chakra-ui", label: "Chakra UI" },

  // DevOps & Infrastructure
  { value: "docker", label: "Docker" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "terraform", label: "Terraform" },
  { value: "aws", label: "AWS" },
  { value: "gcp", label: "Google Cloud Platform" },
  { value: "azure", label: "Azure" },
  { value: "vercel", label: "Vercel" },
  { value: "netlify", label: "Netlify" },
  { value: "jenkins", label: "Jenkins" },
  { value: "github-actions", label: "GitHub Actions" },
  { value: "gitlab-ci", label: "GitLab CI" },

  // Testing Tools
  { value: "jest", label: "Jest" },
  { value: "vitest", label: "Vitest" },
  { value: "cypress", label: "Cypress" },
  { value: "playwright", label: "Playwright" },
  { value: "testing-library", label: "Testing Library" },
  { value: "storybook", label: "Storybook" },
];
