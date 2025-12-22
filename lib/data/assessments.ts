export interface Assessment {
  icon: string;
  category: string;
  title: string;
  topics: string[];
  duration: string;
  questionCount: number;
  taken: boolean;
  link?: string;
}

export const ASSESSMENTS_DATA: Assessment[] = [
  {
    icon: "material-symbols:flutter",
    category: "Software Development",
    title: "Test Framework Analysis: Performance & Scalability",
    topics: ["Technology", "Scalability", "Framework", "Analysis"],
    duration: "10 minutes",
    questionCount: 10,
    taken: false,
    link: "/assessments/test-framework-analysis",
  },
  {
    icon: "material-symbols:code",
    category: "Frontend Development",
    title: "React Component Design Fundamentals",
    topics: ["React", "Components", "UI", "Best Practices"],
    duration: "15 minutes",
    questionCount: 12,
    taken: false,
    link: "/assessments/react-components",
  },
  {
    icon: "material-symbols:javascript",
    category: "Web Development",
    title: "JavaScript ES6+ Concepts Check",
    topics: ["JavaScript", "ES6", "Functions", "Async"],
    duration: "12 minutes",
    questionCount: 8,
    taken: true,
    link: "/assessments/javascript-es6",
  },
  {
    icon: "material-symbols:database",
    category: "Backend Development",
    title: "REST API Design & HTTP Status Codes",
    topics: ["API", "REST", "HTTP", "Backend"],
    duration: "20 minutes",
    questionCount: 15,
    taken: false,
    link: "/assessments/rest-api-design",
  },
  {
    icon: "material-symbols:security",
    category: "Web Security",
    title: "Authentication & Authorization Basics",
    topics: ["JWT", "OAuth", "Security", "Auth"],
    duration: "18 minutes",
    questionCount: 14,
    taken: false,
    link: "/assessments/auth-basics",
  },
  {
    icon: "material-symbols:bug-report",
    category: "Quality Assurance",
    title: "Manual Testing & Bug Reporting",
    topics: ["Testing", "Bug Tracking", "QA", "SDLC"],
    duration: "10 minutes",
    questionCount: 9,
    taken: true,
    link: "/assessments/manual-testing",
  },
  {
    icon: "material-symbols:speed",
    category: "Performance Optimization",
    title: "Web Performance & Core Web Vitals",
    topics: ["Performance", "LCP", "CLS", "Optimization"],
    duration: "16 minutes",
    questionCount: 11,
    taken: false,
    link: "/assessments/web-performance",
  },
  {
    icon: "material-symbols:cloud",
    category: "DevOps",
    title: "CI/CD Pipeline Fundamentals",
    topics: ["CI/CD", "DevOps", "Automation", "Pipelines"],
    duration: "14 minutes",
    questionCount: 10,
    taken: false,
    link: "/assessments/cicd-basics",
  },
  {
    icon: "material-symbols:terminal",
    category: "Version Control",
    title: "Git & GitHub Workflow Assessment",
    topics: ["Git", "GitHub", "Branches", "PRs"],
    duration: "10 minutes",
    questionCount: 8,
    taken: true,
    link: "/assessments/git-workflow",
  },
  {
    icon: "material-symbols:palette",
    category: "UI / UX Design",
    title: "Design Systems & Component Consistency",
    topics: ["Design Systems", "UI", "UX", "Components"],
    duration: "14 minutes",
    questionCount: 10,
    taken: false,
    link: "/assessments/design-systems",
  },
  {
    icon: "material-symbols:responsive-layout",
    category: "Frontend Development",
    title: "Responsive Layouts with Flexbox & Grid",
    topics: ["CSS", "Flexbox", "Grid", "Responsive"],
    duration: "12 minutes",
    questionCount: 9,
    taken: true,
    link: "/assessments/css-layouts",
  },
  {
    icon: "material-symbols:integration-instructions",
    category: "API Integration",
    title: "Third-Party API Integration Strategies",
    topics: ["APIs", "Integration", "Webhooks", "SDK"],
    duration: "18 minutes",
    questionCount: 13,
    taken: false,
    link: "/assessments/api-integration",
  },
  {
    icon: "material-symbols:data-object",
    category: "Databases",
    title: "Database Modeling & Normalization",
    topics: ["Database", "Schema", "Normalization", "SQL"],
    duration: "20 minutes",
    questionCount: 15,
    taken: false,
    link: "/assessments/database-modeling",
  },
  {
    icon: "material-symbols:monitoring",
    category: "Application Monitoring",
    title: "Logging, Monitoring & Error Tracking",
    topics: ["Logs", "Monitoring", "Errors", "Debugging"],
    duration: "16 minutes",
    questionCount: 11,
    taken: false,
    link: "/assessments/app-monitoring",
  },
  {
    icon: "material-symbols:rocket-launch",
    category: "Project Management",
    title: "Agile & Scrum Methodology Essentials",
    topics: ["Agile", "Scrum", "Sprints", "Planning"],
    duration: "10 minutes",
    questionCount: 8,
    taken: true,
    link: "/assessments/agile-scrum",
  },
];

export function getAssessmentBySlug(slug: string): Assessment | undefined {
  return ASSESSMENTS_DATA.find((assessment) => {
    const assessmentSlug = assessment.link?.split("/").pop();
    return assessmentSlug === slug;
  });
}
