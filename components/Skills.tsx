"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { EXPERIENCE, PROJECTS, SKILL_GROUPS, projectImage, techSrc, type Project, type Tech } from "@/lib/data";
import { UI, fmt } from "@/lib/i18n";
import { useApp } from "./Providers";
import { optimized } from "./gl/LiquidImage";
import Scramble from "./ui/Scramble";

const EASE = [0.23, 1, 0.32, 1] as const;

const ALL_TECH = SKILL_GROUPS.flatMap((g) => g.items.map((i) => i.label));
const TOTAL = new Set(ALL_TECH).size;

/** Where each technology shows up: real projects, plus internships whose tool list names it */
const USED_IN = new Map<string, { projects: Project[]; jobs: string[] }>();
const entry = (label: string) => {
  if (!USED_IN.has(label)) USED_IN.set(label, { projects: [], jobs: [] });
  return USED_IN.get(label)!;
};
for (const p of PROJECTS) for (const t of p.techs) entry(t.label).projects.push(p);
for (const e of EXPERIENCE)
  for (const tool of e.tools) {
    // "Tailwind CSS 4" -> Tailwind, "React 19" -> React
    const match = ALL_TECH.find((l) => tool === l || tool.startsWith(`${l} `));
    if (match && !entry(match).jobs.includes(e.company)) entry(match).jobs.push(e.company);
  }

function Row({ tech, onHover }: { tech: Tech; onHover: (label: string | null) => void }) {
  const { theme, t } = useApp();
  const src = techSrc(tech, theme);
  // On the blue hover fill, the dark-theme (light-coloured) icon variants read best
  const srcOnBlue = techSrc(tech, "dark");
  const { projects, jobs } = USED_IN.get(tech.label) ?? { projects: [], jobs: [] };
  const places = [...projects.map((p) => p.title), ...jobs];
  const count = (n: number, one: { en: string; es: string }, many: { en: string; es: string }) =>
    `${n} ${t(n > 1 ? many : one)}`;
  const summary =
    [
      projects.length && count(projects.length, UI.skills.project, UI.skills.projects),
      jobs.length && count(jobs.length, UI.skills.internship, UI.skills.internships),
    ]
      .filter(Boolean)
      .join(", ") || t(UI.skills.toolkit);

  return (
    <motion.li
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
      tabIndex={0}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(tech.label)}
      onPointerLeave={() => onHover(null)}
      aria-label={`${tech.label}${places.length ? `, ${t(UI.skills.usedIn)} ${places.join(", ")}` : ""}`}
      className="group relative flex h-14 items-center gap-3 overflow-hidden border-b border-line px-3 outline-none"
    >
      {/* Blue fill sweeps in from the left */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
      <span className="relative size-5 shrink-0">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="absolute inset-0 m-auto h-5 w-auto transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0" />
        )}
        {srcOnBlue && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={srcOnBlue} alt="" className="absolute inset-0 m-auto h-5 w-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
        )}
      </span>
      <span className="relative text-[17px] font-medium transition-[color,transform] duration-300 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-paper group-focus-visible:text-paper">
        {tech.label}
      </span>
      {/* Count swaps to the actual places on hover */}
      <span className="relative ml-auto h-5 min-w-0 flex-1 overflow-hidden text-right text-sm">
        <span className="block truncate text-muted transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
          {summary}
        </span>
        <span className="absolute inset-x-0 top-full block truncate text-paper transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
          {places.length ? places.join(", ") : t(UI.skills.none)}
        </span>
      </span>
    </motion.li>
  );
}

/** Stack of screenshots from the projects that use the hovered technology, trailing the cursor. */
function Preview({ label, x, y }: { label: string | null; x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring> }) {
  const { theme } = useApp();
  const projects = (label && USED_IN.get(label)?.projects.slice(0, 3)) || [];

  return (
    <motion.div aria-hidden style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-40 hidden [@media(pointer:fine)]:block">
      <AnimatePresence>
        {projects.map((p, i) => (
          <motion.div
            key={`${label}-${p.slug}`}
            initial={{ opacity: 0, scale: 0.85, rotate: 0, x: 36, y: -150 }}
            animate={{ opacity: 1, scale: 1, rotate: (i - 1) * 5, x: 36 + i * 18, y: -150 + i * 12 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: EASE, delay: i * 0.05 }}
            style={{ zIndex: 3 - i }}
            className="absolute left-0 top-0 aspect-[16/10] w-48 overflow-hidden border border-paper bg-surface shadow-[0_18px_40px_-18px_rgb(14_15_18/0.5)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={optimized(projectImage(p.slug, theme), 384)} alt="" className="h-full w-full object-cover" />
            <span className="absolute bottom-0 left-0 bg-accent px-2 py-1 text-[11px] font-semibold text-paper">{p.title}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Skills() {
  const { t } = useApp();
  const [hovered, setHovered] = useState<string | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 350, damping: 35, mass: 0.5 });
  const y = useSpring(my, { stiffness: 350, damping: 35, mass: 0.5 });

  return (
    <section
      id="skills"
      className="border-t border-line py-24 md:py-36"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
    >
      <Preview label={hovered} x={x} y={y} />
      <div data-anchor className="page-grid gap-y-10">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <h2 className="section-name">
              <Scramble text={t(UI.skills.title)} onView />
            </h2>
            <p className="mt-6 max-w-[30ch] text-lg leading-snug text-muted">{fmt(t(UI.skills.intro), { n: TOTAL })}</p>
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-14 lg:col-span-8">
          {SKILL_GROUPS.map((g) => (
            <motion.div key={g.title.en} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              <motion.div
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
                className="h-[2px] origin-left bg-fg"
              />
              <div className="flex items-baseline justify-between gap-6 pb-4 pt-4">
                <h3 className="text-2xl font-semibold tracking-[-0.01em]">{t(g.title)}</h3>
                <p className="hidden max-w-[40ch] flex-1 text-sm text-muted sm:block">{t(g.blurb)}</p>
                <span className="w-cond text-3xl font-bold tabular-nums text-accent">{String(g.items.length)}</span>
              </div>
              <motion.ul
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } } }}
                className="grid border-t border-line sm:grid-cols-2 sm:gap-x-6"
              >
                {g.items.map((tech) => (
                  <Row key={tech.label} tech={tech} onHover={setHovered} />
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
