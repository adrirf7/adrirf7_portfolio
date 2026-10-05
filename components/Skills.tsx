"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { SKILL_GROUPS, techSrc, type Tech } from "@/lib/data";
import { useApp } from "./Providers";
import RevealText from "./ui/RevealText";

const EASE = [0.23, 1, 0.32, 1] as const;
const TOTAL = new Set(SKILL_GROUPS.flatMap((g) => g.items.map((i) => i.label))).size;

// Bento placement: 4 groups -> 4 cells, no gaps
const LAYOUT = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2 md:col-start-4 md:row-start-1",
  "md:col-span-1 md:row-span-1 md:col-start-3 md:row-start-2",
];

function Chip({ tech, large }: { tech: Tech; large?: boolean }) {
  const { theme } = useApp();
  const src = techSrc(tech, theme);
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 14, scale: 0.94 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.6, bounce: 0.25 } },
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`flex items-center gap-2.5 rounded-xl border border-line bg-bg/60 backdrop-blur-sm ${
        large ? "px-4 py-3 text-[15px]" : "px-3 py-2 text-sm"
      }`}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className={`${large ? "h-6" : "h-5"} w-auto shrink-0`} loading="lazy" />
      )}
      <span className="font-medium">{tech.label}</span>
    </motion.li>
  );
}

function Decor({ index }: { index: number }) {
  const { theme } = useApp();
  if (index === 1) {
    // Mobile: a slow-orbiting React atom bleeding off the corner
    return (
      <motion.img
        aria-hidden
        src={theme === "dark" ? "/icons/react_dark.svg" : "/icons/react_light.svg"}
        alt=""
        className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 opacity-[0.12]"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      />
    );
  }
  if (index === 2) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,var(--glow),transparent)] opacity-60"
      />
    );
  }
  if (index === 3) {
    return <div aria-hidden className="dot-pattern pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent)]" />;
  }
  return null;
}

export default function Skills() {
  const gridRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !gridRef.current) return;
    for (const card of gridRef.current.querySelectorAll<HTMLElement>(".spot-card")) {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - r.left}px`);
      card.style.setProperty("--y", `${e.clientY - r.top}px`);
    }
  };

  return (
    <section id="skills" className="relative px-4 py-28 sm:px-6 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 flex flex-col gap-4">
          <RevealText as="h2" text="Tech Stack" className="text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-tighter" />
          <p className="max-w-[46ch] text-base leading-relaxed text-muted">
            {TOTAL} technologies I use to take products from first commit to production.
          </p>
        </div>

        <div
          ref={gridRef}
          onPointerMove={onMove}
          className="spot-grid grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-3 md:grid-cols-4"
        >
          {SKILL_GROUPS.map((g, gi) => (
            <motion.article
              key={g.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: EASE, delay: gi * 0.08 }}
              className={`spot-card ${LAYOUT[gi]}`}
            >
              <div className="spot-inner flex flex-col justify-between gap-8 p-6 sm:p-7">
                <Decor index={gi} />
                <header className="relative">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className={`${gi === 0 ? "text-3xl sm:text-4xl" : "text-2xl"} font-semibold tracking-tight`}>{g.title}</h3>
                    <span className="font-mono text-xs text-muted tabular-nums">{g.items.length}</span>
                  </div>
                  <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-muted">{g.blurb}</p>
                </header>
                <motion.ul
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ staggerChildren: 0.045, delayChildren: 0.2 + gi * 0.08 }}
                  className="relative flex flex-wrap gap-2"
                >
                  {g.items.map((t) => (
                    <Chip key={t.label} tech={t} large={gi === 0} />
                  ))}
                </motion.ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
