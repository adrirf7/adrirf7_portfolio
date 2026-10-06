import type { L } from "./i18n";

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

export const SKILL_GROUPS: { title: L; blurb: L; items: Tech[] }[] = [
  {
    title: { en: "Frontend", es: "Frontend" },
    blurb: {
      en: "Interfaces that load fast, read clearly and hold up on every screen size.",
      es: "Interfaces que cargan rápido, se leen con claridad y aguantan en cualquier pantalla.",
    },
    items: [t.html, t.css, t.js, t.ts, t.react, t.next, t.astro, t.tailwind, t.bootstrap, t.vite],
  },
  {
    title: { en: "Mobile", es: "Móvil" },
    blurb: { en: "Cross-platform apps shipped to real devices.", es: "Apps multiplataforma publicadas en dispositivos reales." },
    items: [t.rn, t.expo],
  },
  {
    title: { en: "Backend & Data", es: "Backend y datos" },
    blurb: { en: "APIs, auth and the databases behind them.", es: "APIs, autenticación y las bases de datos que hay detrás." },
    items: [t.node, t.java, t.mysql, t.mongo, t.firebase],
  },
  {
    title: { en: "Tools & AI", es: "Herramientas e IA" },
    blurb: { en: "Version control and LLM integrations.", es: "Control de versiones e integraciones con LLMs." },
    items: [t.git, t.openrouter],
  },
];

export type Category = "Web" | "Mobile";

export type Project = {
  slug: string;
  category: Category;
  title: string;
  description: L;
  href: string;
  github: string;
  techs: Tech[];
};

export const PROJECTS: Project[] = [
  {
    slug: "piggybank",
    category: "Mobile",
    title: "PiggyBank",
    description: {
      en: "Cross-platform mobile finance app with AI assistant, real-time analytics, multi-account support and production builds via EAS.",
      es: "App móvil de finanzas multiplataforma con asistente de IA, analíticas en tiempo real, varias cuentas y builds de producción con EAS.",
    },
    href: "https://github.com/adrirf7/piggybank",
    github: "https://github.com/adrirf7/piggybank",
    techs: [t.rn, t.expo, t.tailwind, t.firebase, t.openrouter, t.ts],
  },
  {
    slug: "marketly",
    category: "Web",
    title: "Marketly",
    description: {
      en: "Full-stack e-commerce platform with authenticated admin panel, content CRUD, competition API integration and GitHub API as CMS.",
      es: "Plataforma e-commerce full-stack con panel de administración autenticado, CRUD de contenido, integración con una API externa y la API de GitHub como CMS.",
    },
    href: "https://marketly-adrirf7.vercel.app/",
    github: "https://github.com/adrirf7/Marketly",
    techs: [t.ts, t.astro, t.react, t.node, t.mongo, t.tailwind],
  },
  {
    slug: "next-step",
    category: "Web",
    title: "NextStep",
    description: {
      en: "Minimalist Kanban board for managing projects and tasks in real time, with Google authentication, independent project organization and drag-and-drop between states.",
      es: "Tablero Kanban minimalista para gestionar proyectos y tareas en tiempo real, con login de Google, proyectos independientes y arrastrar y soltar entre estados.",
    },
    href: "https://nextsstep.vercel.app/",
    github: "https://github.com/adrirf7/NextStep",
    techs: [t.react, t.ts, t.vite, t.tailwind, t.firebase],
  },
  {
    slug: "react-shop",
    category: "Web",
    title: "React Shop",
    description: {
      en: "Shopping cart app with product catalog, context API state management and dynamic filtering.",
      es: "Carrito de compra con catálogo de productos, estado gestionado con Context API y filtros dinámicos.",
    },
    href: "https://shopping-cart-gy9z.vercel.app/",
    github: "https://github.com/adrirf7/Shopping-Cart",
    techs: [t.astro, t.js, t.css],
  },
  {
    slug: "black-jack",
    category: "Web",
    title: "Black Jack",
    description: {
      en: "Browser-based blackjack game with full card logic, bet system and responsive layout.",
      es: "Blackjack en el navegador con toda la lógica de cartas, sistema de apuestas y diseño responsive.",
    },
    href: "https://black-jack-adrirf7.vercel.app/",
    github: "https://github.com/adrirf7/Black-Jack",
    techs: [t.js, t.vite, t.css],
  },
  {
    slug: "snake-game",
    category: "Web",
    title: "Snake Game",
    description: {
      en: "Classic snake game built with canvas API, keyboard controls and increasing difficulty.",
      es: "El clásico Snake hecho con la API de canvas, controles de teclado y dificultad creciente.",
    },
    href: "https://snake-adrirf7.vercel.app/",
    github: "https://github.com/adrirf7/Snake",
    techs: [t.js, t.vite, t.css],
  },
  {
    slug: "todo",
    category: "Web",
    title: "Todo App",
    description: {
      en: "Task manager with status filters, local storage persistence and smooth UI transitions.",
      es: "Gestor de tareas con filtros por estado, persistencia en local storage y transiciones suaves.",
    },
    href: "https://todo-adrirf7.vercel.app/",
    github: "https://github.com/adrirf7/Todo",
    techs: [t.js, t.astro],
  },
];

export const EXPERIENCE: {
  period: L;
  year: string;
  location: L;
  company: string;
  role: L;
  bullets: L[];
  tools: string[];
}[] = [
  {
    period: { en: "Feb 2026 - Jun 2026", es: "Feb 2026 - Jun 2026" },
    year: "2026",
    location: { en: "Madrid, Spain", es: "Madrid, España" },
    company: "UD SANSE",
    role: { en: "Internship, Web Development", es: "Prácticas, Desarrollo Web" },
    bullets: [
      {
        en: "Built the club's official website with React 19, Vite and Tailwind CSS 4.",
        es: "Desarrollé el sitio web oficial del club con React 19, Vite y Tailwind CSS 4.",
      },
      {
        en: "Implemented an authenticated admin panel with full content CRUD and image management.",
        es: "Implementé un panel de administración autenticado con CRUD completo de contenido y gestión de imágenes.",
      },
      {
        en: "Integrated the official competition API and automated publishing through the GitHub API as a CMS.",
        es: "Integré la API oficial de competición y automaticé la publicación vía GitHub API como CMS.",
      },
    ],
    tools: ["React 19", "Vite", "Tailwind CSS 4", "GitHub API"],
  },
  {
    period: { en: "Jun 2025", es: "Jun 2025" },
    year: "2025",
    location: { en: "Madrid, Spain", es: "Madrid, España" },
    company: "SEIDOR",
    role: { en: "Internship, Software Development", es: "Prácticas, Desarrollo de Software" },
    bullets: [
      {
        en: "Developed a store management system with Java and MySQL: database, business logic and full CRUD.",
        es: "Desarrollé un sistema de gestión para tienda con Java y MySQL: base de datos, lógica de negocio y CRUD completo.",
      },
      {
        en: "Integrated AI features through an external API and built a desktop interface with Swing.",
        es: "Integré funciones de IA mediante API externa y construí una interfaz gráfica con Swing.",
      },
      {
        en: "Applied layered architecture, JDBC data access and REST API consumption.",
        es: "Apliqué programación por capas, acceso a datos con JDBC y consumo de APIs REST.",
      },
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
