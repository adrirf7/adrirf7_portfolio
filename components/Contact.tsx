"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpIcon, ArrowUpRightIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { LINKS } from "@/lib/data";
import { UI } from "@/lib/i18n";
import { useApp } from "./Providers";
import { useScrollTo } from "./useScrollTo";

const EASE = [0.23, 1, 0.32, 1] as const;

const SOCIALS = [
  { label: { en: "LinkedIn", es: "LinkedIn" }, sub: "adrian-rodriguez-fernandez", href: LINKS.linkedin },
  { label: { en: "GitHub", es: "GitHub" }, sub: "adrirf7", href: LINKS.github },
  { label: UI.contact.resume, sub: "PDF", href: LINKS.cv, download: true },
];

function CopyEmail() {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${LINKS.email}`;
    }
  };

  return (
    <button
      onClick={copy}
      aria-label={t(copied ? UI.contact.copied : UI.contact.copyLabel)}
      className="press flex h-11 items-center gap-2 border border-paper/45 px-4 text-sm font-semibold transition-colors duration-200 hover:bg-paper hover:text-accent"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.25, bounce: 0 }}
          className="flex items-center gap-2"
        >
          {copied ? <CheckIcon size={16} weight="bold" /> : <CopyIcon size={16} weight="bold" />}
          {t(copied ? UI.contact.copied : UI.contact.copy)}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** "Let's talk." whose letter width follows the cursor across the panel. */
function Headline() {
  const { t } = useApp();
  const stretch = useMotionValue(80);
  const smooth = useSpring(stretch, { stiffness: 120, damping: 20 });
  const fontStretch = useTransform(smooth, (v) => `${v}%`);

  return (
    // The observer sits on the h2: the masked line itself starts fully clipped and never reports as visible
    <motion.h2
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        stretch.set(62 + ((e.clientX - r.left) / r.width) * 63);
      }}
      onPointerLeave={() => stretch.set(80)}
      style={{ fontStretch }}
      className="col-span-12 select-none whitespace-nowrap text-[clamp(4.5rem,15.5vw,17rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.02em]"
    >
      <span className="block overflow-hidden pb-[0.04em]">
        <motion.span
          className="block"
          variants={{ hidden: { y: "100%" }, show: { y: "0%", transition: { duration: 0.9, ease: EASE } } }}
        >
          {t(UI.contact.headline)}
        </motion.span>
      </span>
    </motion.h2>
  );
}

export default function Contact() {
  const { t } = useApp();
  const scrollTo = useScrollTo();
  const ref = useRef<HTMLElement>(null);

  // Same camera move as the gallery: the panel opens up from an inset frame
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const inset = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const clipPath = useTransform(() => `inset(0% ${inset.get()}% 0% ${inset.get()}%)`);

  return (
    <section id="connect" ref={ref}>
      <motion.div data-anchor style={{ clipPath }} className="bg-accent text-paper">
        <div className="page-grid gap-y-12 pb-10 pt-16 md:pt-24">
          <p className="col-span-6 text-sm">{t(UI.contact.label)}</p>
          <p className="col-span-6 flex items-center justify-end gap-2 text-sm">
            <span className="blink size-1.5 rounded-full bg-paper" />
            {t(UI.nav.available)}
          </p>

          <Headline />

          <div className="col-span-12 lg:col-span-6">
            <p className="mb-3 text-sm text-paper/70">{t(UI.contact.prompt)}</p>
            <a
              href={`mailto:${LINKS.email}`}
              className="group inline-flex items-center gap-3 text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium leading-tight"
            >
              <span className="draw-line break-all">{LINKS.email}</span>
              <ArrowUpRightIcon
                size={28}
                className="shrink-0 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
            <div className="mt-6">
              <CopyEmail />
            </div>
          </div>

          <ul className="col-span-12 border-b border-paper/25 lg:col-span-5 lg:col-start-8">
            {SOCIALS.map(({ label, sub, href, download }) => (
              <li key={label.en} className="border-t border-paper/25">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  download={download || undefined}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="text-2xl font-semibold uppercase tracking-[-0.01em]">{t(label)}</span>
                  <span className="flex items-center gap-3 text-sm text-paper/70">
                    <span className="hidden sm:inline">{sub}</span>
                    <ArrowUpRightIcon
                      size={20}
                      className="text-paper transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="col-span-12 mt-8 flex flex-col gap-3 border-t border-paper/25 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-paper/70">
              © {new Date().getFullYear()} Adrian Rodriguez
              <span className="ml-4 hidden text-paper/45 [@media(pointer:fine)]:inline">{t(UI.contact.grid)}</span>
            </p>
            <a href="#top" onClick={(e) => scrollTo(e, "#top")} className="group flex w-fit items-center gap-2 font-medium">
              <span className="draw-line">{t(UI.contact.top)}</span>
              <ArrowUpIcon size={14} weight="bold" className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
