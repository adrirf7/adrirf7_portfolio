export type Tech = {
  label: string;
  /** Same icon for both themes */
  icon?: string;
  /** Icon shown on the light theme */
  light?: string;
  /** Icon shown on the dark theme */
  dark?: string;
};

const t = {
  html: { label: "HTML5", icon: "html5.svg" },
  css: { label: "CSS", icon: "css_old.svg" },
  js: { label: "JavaScript", icon: "javascript.svg" },
  ts: { label: "TypeScript", icon: "typescript.svg" },
  node: { label: "Node.js", icon: "nodejs.svg" },
  java: { label: "Java", icon: "java.svg" },
  react: { label: "React", light: "react_light.svg", dark: "react_dark.svg" },
  next: { label: "Next.js", icon: "nextjs_icon_dark.svg" },
  rn: { label: "React Native", light: "react_light.svg", dark: "react_dark.svg" },
  astro: { label: "Astro", light: "astro-icon-light.svg", dark: "astro-icon-dark.svg" },
  tailwind: { label: "Tailwind", icon: "tailwindcss.svg" },
  bootstrap: { label: "Bootstrap", icon: "bootstrap.svg" },
  expo: { label: "Expo", light: "expo.svg", dark: "expo_light.svg" },
  mysql: { label: "MySQL", light: "mysql-icon-light.svg", dark: "mysql-icon-dark.svg" },
  mongo: { label: "MongoDB", icon: "mongodb-icon-dark.svg" },
  firebase: { label: "Firebase", icon: "firebase.svg" },
  vite: { label: "Vite", icon: "vite.svg" },
  git: { label: "Git", icon: "git.svg" },
  openrouter: { label: "OpenRouter", light: "OpenRouter_light.svg", dark: "OpenRouter_dark.svg" },
} satisfies Record<string, Tech>;

export const LINKS = {
  email: "rodriguezfadrian7@gmail.com",
  linkedin: "https://www.linkedin.com/in/adrian-rodriguez-fernandez/",
  github: "https://github.com/adrirf7",
  cv: "/_CV_AdrianRodriguez.pdf",
};

export const NAV = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Connect", href: "#connect" },
];

export const MARQUEE_WORDS = [
  "Frontend Developer",
  "Web Developer",
  "React",
  "TypeScript",
  "React Native",
  "Clean Code",
  "Available for Work",
  "Mobile Apps",
  "Node.js",
  "UI / UX",
];

export const QUICK_TAGS = ["React", "TypeScript", "Node.js", "React Native", "MySQL"];

export const SKILL_GROUPS: { title: string; blurb: string; items: Tech[] }[] = [
  {
    title: "Frontend",
    blurb: "Interfaces that load fast, read clearly and hold up on every screen size.",
    items: [t.html, t.css, t.js, t.ts, t.react, t.next, t.astro, t.tailwind, t.bootstrap, t.vite],
  },
  {
    title: "Mobile",
    blurb: "Cross-platform apps shipped to real devices.",
    items: [t.rn, t.expo],
  },
  {
    title: "Backend & Data",
    blurb: "APIs, auth and the databases behind them.",
    items: [t.node, t.java, t.mysql, t.mongo, t.firebase],
  },
  {
    title: "Tools & AI",
    blurb: "Version control and LLM integrations.",
    items: [t.git, t.openrouter],
  },
];

export type Category = "Web" | "Mobile";

export type Project = {
  slug: string;
  category: Category;
  title: string;
  description: string;
  href: string;
  github: string;
  techs: Tech[];
};

export const PROJECTS: Project[] = [
  {
    slug: "piggybank",
    category: "Mobile",
    title: "PiggyBank",
    description:
      "Cross-platform mobile finance app with AI assistant, real-time analytics, multi-account support and production builds via EAS.",
    href: "https://github.com/adrirf7/piggybank",
    github: "https://github.com/adrirf7/piggybank",
    techs: [t.rn, t.expo, t.tailwind, t.firebase, t.openrouter, t.ts],
  },
  {
    slug: "marketly",
    category: "Web",
    title: "Marketly",
    description:
      "Full-stack e-commerce platform with authenticated admin panel, content CRUD, competition API integration and GitHub API as CMS.",
    href: "https://marketly-adrirf7.vercel.app/",
    github: "https://github.com/adrirf7/Marketly",
    techs: [t.ts, t.astro, t.react, t.node, t.mongo, t.tailwind],
  },
  {
    slug: "next-step",
    category: "Web",
    title: "NextStep",
    description:
      "Minimalist Kanban board for managing projects and tasks in real time, with Google authentication, independent project organization and drag-and-drop between states.",
    href: "https://nextsstep.vercel.app/",
    github: "https://github.com/adrirf7/NextStep",
    techs: [t.react, t.ts, t.vite, t.tailwind, t.firebase],
  },
  {
    slug: "react-shop",
    category: "Web",
    title: "React Shop",
    description: "Shopping cart app with product catalog, context API state management and dynamic filtering.",
    href: "https://shopping-cart-gy9z.vercel.app/",
    github: "https://github.com/adrirf7/Shopping-Cart",
    techs: [t.astro, t.js, t.css],
  },
  {
    slug: "black-jack",
    category: "Web",
    title: "Black Jack",
    description: "Browser-based blackjack game with full card logic, bet system and responsive layout.",
    href: "https://black-jack-adrirf7.vercel.app/",
    github: "https://github.com/adrirf7/Black-Jack",
    techs: [t.js, t.vite, t.css],
  },
  {
    slug: "snake-game",
    category: "Web",
    title: "Snake Game",
    description: "Classic snake game built with canvas API, keyboard controls and increasing difficulty.",
    href: "https://snake-adrirf7.vercel.app/",
    github: "https://github.com/adrirf7/Snake",
    techs: [t.js, t.vite, t.css],
  },
  {
    slug: "todo",
    category: "Web",
    title: "Todo App",
    description: "Task manager with status filters, local storage persistence and smooth UI transitions.",
    href: "https://todo-adrirf7.vercel.app/",
    github: "https://github.com/adrirf7/Todo",
    techs: [t.js, t.astro],
  },
];

export const EXPERIENCE = [
  {
    period: "Feb 2026 - Jun 2026",
    location: "Madrid, Spain",
    company: "UD SANSE",
    role: "Internship, Web Development",
    bullets: [
      "Built the club's official website with React 19, Vite and Tailwind CSS 4.",
      "Implemented an authenticated admin panel with full content CRUD and image management.",
      "Integrated the official competition API and automated publishing through the GitHub API as a CMS.",
    ],
    tools: ["React 19", "Vite", "Tailwind CSS 4", "GitHub API"],
  },
  {
    period: "Jun 2024",
    location: "Madrid, Spain",
    company: "SEIDOR",
    role: "Internship, Software Development",
    bullets: [
      "Developed a store management system with Java and MySQL: database, business logic and full CRUD.",
      "Integrated AI features through an external API and built a desktop interface with Swing.",
      "Applied layered architecture, JDBC data access and REST API consumption.",
    ],
    tools: ["Java", "MySQL", "Swing", "JDBC", "REST API"],
  },
];

export function projectImage(slug: string, theme: "light" | "dark") {
  return `/projects/${theme}/${slug}-${theme}.webp`;
}

export function techSrc(tech: Tech, theme: "light" | "dark") {
  const file = tech.icon ?? (theme === "dark" ? tech.dark : tech.light);
  return file ? `/icons/${file}` : undefined;
}
