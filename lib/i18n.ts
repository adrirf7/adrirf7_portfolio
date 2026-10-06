export type Lang = "en" | "es";

/** A string in both languages */
export type L = { en: string; es: string };

export const LANGS: Lang[] = ["en", "es"];

/** Interface copy. Content (projects, experience...) lives in data.ts as `L` values. */
export const UI = {
  nav: {
    about: { en: "About", es: "Sobre mí" },
    skills: { en: "Skills", es: "Skills" },
    work: { en: "Work", es: "Proyectos" },
    experience: { en: "Experience", es: "Experiencia" },
    contact: { en: "Contact", es: "Contacto" },
    available: { en: "Available for projects", es: "Disponible para proyectos" },
    menu: { en: "Menu", es: "Menú" },
    close: { en: "Close", es: "Cerrar" },
    light: { en: "Light", es: "Claro" },
    dark: { en: "Dark", es: "Oscuro" },
    toLight: { en: "Switch to light theme", es: "Cambiar a tema claro" },
    toDark: { en: "Switch to dark theme", es: "Cambiar a tema oscuro" },
    lang: { en: "Language", es: "Idioma" },
  },
  hero: {
    role: { en: "Web & Mobile Developer", es: "Desarrollador Web y Móvil" },
    location: { en: "Madrid, Spain", es: "Madrid, España" },
    intro: {
      en: "Designing and building web and mobile applications, combining user experience, performance and clean code.",
      es: "Diseño y desarrollo aplicaciones web y móviles que combinan experiencia de usuario, rendimiento y código limpio.",
    },
    cta: { en: "Collaborate", es: "Colaboremos" },
    cv: { en: "CV", es: "CV" },
  },
  about: {
    title: { en: "About", es: "Sobre mí" },
    statement: {
      en: "Clean code, solid product, real impact. I build fast, scale well and prioritize the user without sacrificing technical quality.",
      es: "Código limpio, producto sólido, impacto real. Construyo rápido, escalo bien y priorizo al usuario sin sacrificar la calidad técnica.",
    },
    /** How many leading words of the statement are printed in the accent */
    keyWords: { en: "6", es: "6" },
    support: {
      en: "Adaptable and always focused on writing clean, maintainable code that drives real value.",
      es: "Adaptable y siempre centrado en escribir código limpio y mantenible que aporte valor real.",
    },
    projects: { en: "Projects", es: "Proyectos" },
    technologies: { en: "Technologies", es: "Tecnologías" },
    internships: { en: "Internships", es: "Prácticas" },
    basedIn: { en: "Based in", es: "Desde" },
  },
  skills: {
    title: { en: "Skills", es: "Skills" },
    intro: {
      en: "{n} technologies, grouped by where I use them. Hover one to see where it shipped.",
      es: "{n} tecnologías, agrupadas según dónde las uso. Pasa el ratón por una para ver dónde la he usado.",
    },
    project: { en: "project", es: "proyecto" },
    projects: { en: "projects", es: "proyectos" },
    internship: { en: "internship", es: "empresa" },
    internships: { en: "internships", es: "empresas" },
    toolkit: { en: "Toolkit", es: "En mi día a día" },
    none: { en: "Not in a featured project yet", es: "Aún no en un proyecto destacado" },
    usedIn: { en: "used in", es: "usado en" },
  },
  work: {
    selected: { en: "Selected", es: "Proyectos" },
    work: { en: "Work", es: "Destacados" },
    intro: {
      en: "Web apps, mobile apps and games. Click a screenshot to open it live.",
      es: "Apps web, apps móviles y juegos. Pulsa una captura para abrirla en directo.",
    },
    count: { en: "{n} projects", es: "{n} proyectos" },
    web: { en: "Web app", es: "App web" },
    mobile: { en: "Mobile app", es: "App móvil" },
    open: { en: "Open site", es: "Abrir web" },
    openLabel: { en: "Open {name}", es: "Abrir {name}" },
    repoLabel: { en: "{name} repository on GitHub", es: "Repositorio de {name} en GitHub" },
    more: { en: "More on GitHub", es: "Más en GitHub" },
    drag: { en: "Drag to browse", es: "Arrastra para navegar" },
    slider: { en: "Scroll through projects", es: "Recorrer los proyectos" },
  },
  experience: {
    title: { en: "Experience", es: "Experiencia" },
    intro: {
      en: "Internships where I shipped real software for real users.",
      es: "Prácticas en las que entregué software real para usuarios reales.",
    },
  },
  contact: {
    label: { en: "Contact", es: "Contacto" },
    headline: { en: "Let's talk.", es: "Hablemos." },
    prompt: { en: "Have a project in mind? Write me.", es: "¿Tienes un proyecto en mente? Escríbeme." },
    copy: { en: "Copy email", es: "Copiar email" },
    copied: { en: "Copied", es: "Copiado" },
    copyLabel: { en: "Copy email address", es: "Copiar dirección de email" },
    resume: { en: "Resume", es: "Currículum" },
    top: { en: "Back to top", es: "Volver arriba" },
    grid: { en: "Press G to see the grid", es: "Pulsa G para ver la rejilla" },
  },
} satisfies Record<string, Record<string, L>>;

/** Fill `{name}` style placeholders */
export function fmt(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
