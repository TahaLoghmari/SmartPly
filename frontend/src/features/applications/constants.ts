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

export const ApplicationStatusToColor: Record<ApplicationStatusLabel, string> =
  {
    Interview:
      "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30",
    Applied:
      "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30",
    Rejected:
      "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30",
    Ghosted:
      "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800/20 dark:text-gray-300 dark:border-gray-700/30",
    Offer:
      "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30",
    WishList:
      "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30",
  };

export const applicationsLevelOptionsConstant: Readonly<
  {
    value: ApplicationLevel;
    label: ApplicationLevelLabel;
  }[]
> = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
] as const;

export const applicationsStatusOptionsConstant: Readonly<
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

export const applicationsTypeOptionsConstant: Readonly<
  {
    value: ApplicationType;
    label: ApplicationTypeLabel;
  }[]
> = [
  { value: "remote", label: "Remote" },
  { value: "onSite", label: "OnSite" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const applicationsJobTypeOptionsConstant: Readonly<
  {
    value: ApplicationJobType;
    label: ApplicationJobTypeLabel;
  }[]
> = [
  { value: "fullTime", label: "Full Time" },
  { value: "partTime", label: "Part Time" },
  { value: "internship", label: "Internship" },
] as const;

export const steps = [
  { label: "WishList" },
  { label: "Applied" },
  { label: "Interview" },
] as const;

export const statusToDateKey: Record<string, keyof ApplicationRequestDto> = {
  wishList: "wishListDate",
  applied: "appliedDate",
  interview: "interviewDate",
  offer: "offerDate",
  rejected: "rejectedDate",
  ghost: "offerDate",
};

export const statusToValue: Record<string, number> = {
  WishList: 0,
  Applied: 1,
  Interview: 2,
  Offer: 3,
  Ghosted: 3,
  Rejected: 4,
};

export const frameworks: Readonly<{ value: string; label: string }[]> = [
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
