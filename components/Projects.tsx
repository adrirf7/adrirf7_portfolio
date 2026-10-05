"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRightIcon, CaretDownIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { PROJECTS, projectImage, type Category, type Project } from "@/lib/data";
import { useApp } from "./Providers";
import RevealText from "./ui/RevealText";
import TechIcon from "./ui/TechIcon";

const EASE = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
const INITIAL_COUNT = 4;
const FILTERS: ("All" | Category)[] = ["All", "Web", "Mobile"];

/** The screenshot: tilts toward the cursor, pans inside its frame, and opens the live site. */
function ProjectMedia({ project }: { project: Project }) {
  const { theme } = useApp();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovering, setHovering] = useState(false);

  // Normalised cursor position inside the frame (0..1)
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 150, damping: 18, mass: 0.6 });

  const rotateY = useTransform(sx, [0, 1], [-8, 8]);
  const rotateX = useTransform(sy, [0, 1], [7, -7]);
  const imgX = useTransform(sx, [0, 1], ["3%", "-3%"]);
  const imgY = useTransform(sy, [0, 1], ["3%", "-3%"]);
  const glareX = useTransform(sx, (v) => v * 100);
  const glareY = useTransform(sy, (v) => v * 100);
  const glare = useMotionTemplate`radial-gradient(480px circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.2), transparent 60%)`;

  const hover = useSpring(0, { stiffness: 200, damping: 22 });
  const imgScale = useTransform(hover, [0, 1], [1.02, 1.1]);

  // Cursor-following label, in px
  const lx = useSpring(0, { stiffness: 380, damping: 30 });
  const ly = useSpring(0, { stiffness: 380, damping: 30 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    lx.set(e.clientX - r.left);
    ly.set(e.clientY - r.top);
  };

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    lx.jump(e.clientX - r.left);
    ly.jump(e.clientY - r.top);
    hover.set(1);
    setHovering(true);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
    setHovering(false);
  };

  return (
    <div style={{ perspective: 1100 }}>
      <motion.a
        ref={ref}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title}`}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative block aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface"
      >
        <motion.div style={{ x: imgX, y: imgY, scale: imgScale }} className="absolute -inset-[4%]">
          <Image
            key={theme}
            src={projectImage(project.slug, theme)}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />

        <AnimatePresence>
          {hovering && (
            <motion.span
              aria-hidden
              style={{ x: lx, y: ly }}
              className="pointer-events-none absolute left-0 top-0 z-10"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
                transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
                className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg shadow-lg"
              >
                Visit site <ArrowUpRightIcon size={14} weight="bold" />
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Touch devices get a static affordance instead of the cursor label */}
        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-bg/80 text-fg backdrop-blur [@media(hover:hover)]:hidden">
          <ArrowUpRightIcon size={16} weight="bold" />
        </span>
      </motion.a>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 2) * 0.1 }}
      className={`flex flex-col ${index % 2 === 1 ? "md:pt-28" : ""}`}
    >
      {/* Reveal ends slightly outside the frame so the 3D tilt never gets its corners shaved */}
      <motion.div
        initial={{ clipPath: "inset(12% 12% 12% 12% round 24px)" }}
        whileInView={{ clipPath: "inset(-6% -6% -6% -6% round 16px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: EASE_IN_OUT }}
      >
        <ProjectMedia project={project} />
      </motion.div>

      <div className="flex flex-col pt-6">
        <div className="flex items-center justify-between gap-4 text-sm text-muted">
          <span>{project.category === "Mobile" ? "Mobile app" : "Web app"}</span>
        </div>
        <h3 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          <a href={project.href} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-accent">
            {project.title}
          </a>
        </h3>
        <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-muted">{project.description}</p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
          <ul className="flex flex-wrap items-center gap-3.5">
            {project.techs.map((t) => (
              <li key={t.label}>
                <TechIcon tech={t} size={20} />
              </li>
            ))}
          </ul>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} repository on GitHub`}
            className="press group/repo relative flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-full border border-line px-4 text-sm font-medium"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-fg transition-transform duration-300 ease-[var(--ease-out)] group-hover/repo:scale-y-100" />
            <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover/repo:text-bg">
              <GithubLogoIcon size={16} weight="bold" />
              Repo
            </span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  return (
    <section id="projects" className="relative px-4 py-28 sm:px-6 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <RevealText as="h2" text="Featured Works" className="text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-tighter" />
            <p className="max-w-[46ch] text-base leading-relaxed text-muted">
              Web apps, mobile apps and games. Click any screenshot to open it live.
            </p>
          </div>

          <div role="tablist" aria-label="Filter projects" className="flex w-fit gap-1 rounded-full border border-line p-1">
            {FILTERS.map((f) => {
              const count = f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;
              const active = filter === f;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFilter(f);
                    setShowAll(false);
                  }}
                  className={`press relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? "text-bg" : "text-muted hover:text-fg"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative">{f}</span>
                  <span className="relative font-mono text-[11px] opacity-60 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <motion.div layout className="mt-20 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="press group flex h-12 items-center gap-3 rounded-full border border-line pl-6 pr-2 text-sm font-medium transition-colors duration-200 hover:bg-surface"
            >
              {showAll ? "Show less" : `View ${filtered.length - INITIAL_COUNT} more`}
              <span
                className={`flex size-8 items-center justify-center rounded-full bg-fg text-bg transition-transform duration-300 ease-[var(--ease-out)] ${
                  showAll ? "rotate-180" : ""
                }`}
              >
                <CaretDownIcon size={14} weight="bold" />
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
