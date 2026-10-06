"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRightIcon, ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { LINKS, PROJECTS, projectImage, type Project } from "@/lib/data";
import { useLenis } from "lenis/react";
import { UI, fmt } from "@/lib/i18n";
import { useApp } from "./Providers";
import TechIcon from "./ui/TechIcon";
import KineticTitle from "./ui/KineticTitle";
import LiquidImage from "./gl/LiquidImage";

const EASE = [0.23, 1, 0.32, 1] as const;
// Card width is bounded by the viewport height too: image (w / 1.6) + text block + rail + nav must fit
const CARD_W = "w-full lg:w-[max(300px,min(40vw,calc((100dvh-480px)*1.6),680px))]";

/**
 * Screenshot that drifts toward the cursor and opens the live site. The picture itself is
 * drawn by a shader: it ripples from the cursor and bends with the gallery's speed.
 */
function Media({ project }: { project: Project }) {
  const { theme, t } = useApp();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovering, setHovering] = useState(false);

  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 140, damping: 16, mass: 0.6 });
  const sy = useSpring(ny, { stiffness: 140, damping: 16, mass: 0.6 });
  const frameX = useTransform(sx, [-1, 1], [-16, 16]);
  const frameY = useTransform(sy, [-1, 1], [-12, 12]);
  const frameRot = useTransform(sx, [-1, 1], [-1.6, 1.6]);

  const lx = useSpring(0, { stiffness: 400, damping: 32 });
  const ly = useSpring(0, { stiffness: 400, damping: 32 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    nx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    ny.set(((e.clientY - r.top) / r.height) * 2 - 1);
    lx.set(e.clientX - r.left);
    ly.set(e.clientY - r.top);
  };

  return (
    <motion.a
      ref={ref}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={fmt(t(UI.work.openLabel), { name: project.title })}
      onPointerMove={onMove}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        lx.jump(e.clientX - r.left);
        ly.jump(e.clientY - r.top);
        setHovering(true);
      }}
      onPointerLeave={() => {
        nx.set(0);
        ny.set(0);
        setHovering(false);
      }}
      style={{ x: frameX, y: frameY, rotate: frameRot }}
      className="relative block aspect-[16/10] cursor-pointer overflow-hidden"
    >
      <LiquidImage
        key={theme}
        src={projectImage(project.slug, theme)}
        alt={`${project.title} screenshot`}
        axis="x"
        className="absolute inset-0"
      />

      <AnimatePresence>
        {hovering && (
          <motion.span aria-hidden style={{ x: lx, y: ly }} className="pointer-events-none absolute left-0 top-0 z-10">
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
              className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 bg-accent px-4 py-2.5 text-sm font-semibold text-paper"
            >
              {t(UI.work.open)}
              <ArrowUpRightIcon size={16} weight="bold" />
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>

      <span className="absolute right-0 top-0 flex size-10 items-center justify-center bg-accent text-paper [@media(hover:hover)]:hidden">
        <ArrowUpRightIcon size={18} weight="bold" />
      </span>
    </motion.a>
  );
}

function Card({ project, index }: { project: Project; index: number }) {
  const { t } = useApp();
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE }}
      data-card={project.title}
      className={`flex shrink-0 flex-col ${CARD_W}`}
    >
      <Media project={project} />

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-paper/20 pt-4">
        <h3 className="w-cond text-[clamp(2.4rem,3.4vw,3.4rem)] font-bold uppercase leading-[0.9]">{project.title}</h3>
        <span className="shrink-0 text-sm text-paper/55 tabular-nums">
          {String(index + 1).padStart(2, "0")} / {t(project.category === "Mobile" ? UI.work.mobile : UI.work.web)}
        </span>
      </div>
      <p className="mt-3 max-w-[58ch] text-base leading-relaxed text-paper/65 lg:line-clamp-3">{t(project.description)}</p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <ul className="flex flex-wrap items-center gap-3.5">
          {project.techs.map((t) => (
            <li key={t.label}>
              <TechIcon tech={t} size={22} onDark />
            </li>
          ))}
        </ul>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={fmt(t(UI.work.repoLabel), { name: project.title })}
          className="press flex h-10 shrink-0 items-center gap-2 border border-paper/35 px-4 text-sm font-semibold transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink"
        >
          <GithubLogoIcon size={16} weight="bold" />
          Repo
        </a>
      </div>
    </motion.article>
  );
}

type Tick = { label: string; at: number };

/**
 * Draggable progress rail for the pinned gallery. Drag or click anywhere to scrub,
 * clicks near a project mark snap to it, arrow keys step project by project.
 */
function Scrubber({
  progress,
  ticks,
  onSeek,
}: {
  progress: MotionValue<number>;
  ticks: Tick[];
  onSeek: (p: number, live?: boolean) => void;
}) {
  const { t } = useApp();
  const railRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pct, setPct] = useState(0);
  const [current, setCurrent] = useState<string>("");
  const left = useTransform(progress, (v) => `${v * 100}%`);

  useMotionValueEvent(progress, "change", (v) => {
    const rounded = Math.round(v * 100);
    setPct((p) => (p === rounded ? p : rounded));
    // The project whose mark is closest to the playhead
    let best = "";
    let bestD = Infinity;
    for (const t of ticks) {
      const d = Math.abs(t.at - v);
      if (d < bestD) {
        bestD = d;
        best = t.label;
      }
    }
    setCurrent((c) => (c === best ? c : best));
  });

  const pointToProgress = (clientX: number, snap: boolean) => {
    const r = railRef.current!.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    if (snap) {
      const hit = ticks.find((t) => Math.abs(t.at - p) * r.width < 14);
      if (hit) return hit.at;
    }
    return p;
  };

  const step = (dir: 1 | -1) => {
    const p = progress.get();
    const marks = ticks.map((t) => t.at);
    const next =
      dir > 0 ? (marks.find((a) => a > p + 0.005) ?? 1) : ([...marks].reverse().find((a) => a < p - 0.005) ?? 0);
    onSeek(next);
  };

  return (
    <div className="page-grid w-full shrink-0 items-center">
      <span className="col-span-2 truncate text-sm font-semibold" aria-live="polite">
        {current}
      </span>
      <div
        ref={railRef}
        role="slider"
        tabIndex={0}
        aria-label={t(UI.work.slider)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={current}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          onSeek(pointToProgress(e.clientX, true));
        }}
        onPointerMove={(e) => dragging && onSeek(pointToProgress(e.clientX, false), true)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            step(-1);
          } else if (e.key === "Home") onSeek(0);
          else if (e.key === "End") onSeek(1);
        }}
        className={`group relative col-span-8 h-10 touch-none select-none ${dragging ? "cursor-grabbing" : "cursor-pointer"}`}
      >
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper/25" />
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 origin-left bg-paper" />
        {ticks.map((t) => (
          <span
            key={t.label}
            style={{ left: `${t.at * 100}%` }}
            className="group/tick absolute top-1/2 flex h-5 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <span className="h-3 w-px bg-paper/50 transition-transform duration-200 group-hover/tick:scale-y-150" />
            <span className="pointer-events-none absolute bottom-full mb-2 translate-y-1 whitespace-nowrap bg-paper px-2 py-1 text-xs font-medium text-ink opacity-0 transition-[opacity,transform] duration-150 group-hover/tick:translate-y-0 group-hover/tick:opacity-100">
              {t.label}
            </span>
          </span>
        ))}
        <motion.span
          style={{ left }}
          animate={{ scale: dragging ? 1.3 : 1 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className="pointer-events-none absolute top-1/2 -ml-2.5 -mt-2.5 size-5 border-2 border-paper bg-accent group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent"
        />
      </div>
      <span className="col-span-2 hidden text-right text-sm text-paper/55 xl:inline">{t(UI.work.drag)}</span>
    </div>
  );
}

export default function Projects() {
  const outerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [distance, setDistance] = useState(0);
  const [ticks, setTicks] = useState<Tick[]>([]);
  const distanceMV = useMotionValue(0);
  const lenis = useLenis();
  const { t } = useApp();

  // Horizontal pan only on wide screens with motion allowed; otherwise a plain vertical list
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pinned || !trackRef.current) {
      setDistance(0);
      distanceMV.set(0);
      return;
    }
    const track = trackRef.current;
    const measure = () => {
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      setDistance(d);
      distanceMV.set(d);
      // Progress value at which each card sits centred on screen
      const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-card]"));
      setTicks(
        cards.map((c) => ({
          label: c.dataset.card!,
          at: d ? Math.min(1, Math.max(0, (c.offsetLeft + c.offsetWidth / 2 - window.innerWidth / 2) / d)) : 0,
        })),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, distanceMV]);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * distanceMV.get());

  // Camera move on entry: the dark room arrives as an inset frame and opens up to fill the screen
  const { scrollYProgress: enter } = useScroll({ target: outerRef, offset: ["start end", "start start"] });
  const inset = useTransform(enter, [0, 1], [8, 0]);
  const clipPath = useTransform(() => `inset(${inset.get()}% ${inset.get() * 0.7}% 0% ${inset.get() * 0.7}%)`);

  // Map a 0..1 gallery position back to a page scroll offset
  const seek = (p: number, live = false) => {
    const el = outerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + p * (el.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(y, live ? { lerp: 0.3 } : { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: live ? "auto" : "smooth" });
  };

  return (
    <section
      id="projects"
      ref={outerRef}
      data-snap="start"
      className="relative"
      style={pinned ? { height: `calc(100dvh + ${distance}px)` } : undefined}
    >
      {/* Rail lives in its own row under the cards, so it can never overlap them */}
      <motion.div
        style={pinned ? { clipPath } : undefined}
        className={`bg-ink text-paper dark:bg-surface ${
          pinned ? "sticky top-0 flex h-[100dvh] flex-col gap-6 overflow-hidden pb-8 pt-20" : "py-24"
        }`}
      >
        <div className={pinned ? "flex min-h-0 flex-1 items-center" : ""}>
          <motion.div
            ref={trackRef}
            style={pinned ? { x } : undefined}
            className={pinned ? "relative flex w-max items-start gap-12 pl-9 pr-[12vw]" : "flex flex-col gap-20 px-4 sm:px-6"}
          >
            {/* Sized so the longest title ("DESTACADOS") still fits its column at full scroll stretch */}
            <div className="flex shrink-0 flex-col justify-center lg:w-[34vw] lg:self-center">
              <KineticTitle rest={62} fast={74} className="w-cond text-[clamp(3.5rem,6.2vw,7.5rem)] font-extrabold uppercase leading-[0.84]">
                {t(UI.work.selected)}
                <br />
                <span className="text-accent">{t(UI.work.work)}</span>
              </KineticTitle>
              <p className="mt-6 max-w-[32ch] text-lg leading-snug text-paper/65">
                {t(UI.work.intro)}
              </p>
              <p className="mt-8 hidden items-center gap-3 text-sm text-paper/55 lg:flex">
                <span className="tabular-nums">{fmt(t(UI.work.count), { n: PROJECTS.length })}</span>
                <ArrowRightIcon size={15} />
              </p>
            </div>

            {PROJECTS.map((p, i) => (
              <Card key={p.slug} project={p} index={i} />
            ))}

            <motion.a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="press group flex aspect-square w-full shrink-0 flex-col justify-between bg-accent p-7 text-paper lg:w-[min(24vw,calc(100dvh-400px))] lg:self-center"
            >
              <GithubLogoIcon size={36} weight="bold" />
              <span>
                <span className="block text-sm">{t(UI.work.more)}</span>
                <span className="w-cond mt-1 flex items-center gap-2 text-[clamp(3rem,4.5vw,4.5rem)] font-bold uppercase leading-[0.9]">
                  adrirf7
                  <ArrowUpRightIcon size={40} weight="bold" className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
              </span>
            </motion.a>
          </motion.div>
        </div>

        {pinned && <Scrubber progress={scrollYProgress} ticks={ticks} onSeek={seek} />}
      </motion.div>
    </section>
  );
}
