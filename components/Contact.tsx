"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "motion/react";
import {
  ArrowUpIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react";
import { LINKS } from "@/lib/data";
import { useScrollTo } from "./useScrollTo";
import Magnetic from "./ui/Magnetic";
import RevealText from "./ui/RevealText";

const EASE = [0.23, 1, 0.32, 1] as const;

const ROWS = [
  { label: "Email", sub: LINKS.email, href: `mailto:${LINKS.email}`, Icon: EnvelopeSimpleIcon },
  { label: "LinkedIn", sub: "adrian-rodriguez-fernandez", href: LINKS.linkedin, Icon: LinkedinLogoIcon },
  { label: "GitHub", sub: "adrirf7", href: LINKS.github, Icon: GithubLogoIcon },
  { label: "Resume", sub: "PDF", href: LINKS.cv, Icon: FileTextIcon, download: true },
];

function CopyEmail() {
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
      aria-label={copied ? "Email copied" : "Copy email address"}
      className="press flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium transition-colors duration-200 hover:bg-surface"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className="flex items-center gap-2"
        >
          {copied ? <CheckIcon size={15} weight="bold" className="text-accent" /> : <CopyIcon size={15} weight="bold" />}
          {copied ? "Copied" : "Copy email"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function WordmarkLetter({ char, i, n, progress }: { char: string; i: number; n: number; progress: MotionValue<number> }) {
  // Letters arrive slightly out of phase, like a wave settling
  const start = (i / n) * 0.35;
  const y = useTransform(progress, [start, start + 0.55], ["90%", "0%"]);
  const rotate = useTransform(progress, [start, start + 0.55], [8, 0]);
  return (
    <motion.span style={{ y, rotate }} className="inline-block origin-bottom-left">
      {char}
    </motion.span>
  );
}

function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const text = "ADRIRF7";
  return (
    <div ref={ref} aria-hidden className="overflow-hidden">
      <div className="flex justify-between text-[clamp(4rem,21.5vw,22rem)] font-semibold leading-[0.78] tracking-[-0.06em] text-fg">
        {text.split("").map((c, i) => (
          <WordmarkLetter key={i} char={c} i={i} n={text.length} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}

export default function Contact() {
  const scrollTo = useScrollTo();

  return (
    <section id="connect" className="relative overflow-hidden px-4 pt-28 sm:px-6 md:pt-40">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.18em] text-muted">Available for work</p>

        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <RevealText
              as="h2"
              text="Have a project in mind? Let's build it."
              stagger={0.05}
              className="text-[clamp(2.75rem,7.5vw,7.5rem)] font-semibold leading-[0.95] tracking-tighter"
            />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${LINKS.email}`}
                className="text-lg font-medium underline decoration-line decoration-1 underline-offset-[6px] transition-colors duration-200 hover:decoration-accent sm:text-xl"
              >
                {LINKS.email}
              </a>
              <CopyEmail />
            </div>
          </div>

          <div className="flex md:col-span-4 md:justify-end">
            <Magnetic strength={0.4}>
              <motion.a
                href={`mailto:${LINKS.email}`}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                className="press group relative flex size-40 items-center justify-center overflow-hidden rounded-full bg-accent text-accent-fg sm:size-48"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-fg transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0" />
                <span className="relative flex flex-col items-center gap-1 text-base font-semibold transition-colors duration-300 group-hover:text-bg">
                  <ArrowUpRightIcon size={26} weight="bold" className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-45" />
                  Collaborate
                </span>
              </motion.a>
            </Magnetic>
          </div>
        </div>

        <ul className="mt-24 border-t border-line">
          {ROWS.map(({ label, sub, href, Icon, download }, i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
              className="border-b border-line"
            >
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                download={download || undefined}
                className="group relative flex items-center justify-between gap-6 overflow-hidden py-6 sm:py-8"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-y-100" />
                <span className="relative flex items-center gap-5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-3">
                  <Icon size={24} className="text-muted transition-colors duration-300 group-hover:text-accent" />
                  <span className="text-3xl font-semibold tracking-tight sm:text-5xl">{label}</span>
                </span>
                <span className="relative flex items-center gap-4 pr-1 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-x-3">
                  <span className="hidden text-sm text-muted sm:inline">{sub}</span>
                  <ArrowUpRightIcon
                    size={22}
                    className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-45"
                  />
                </span>
              </a>
            </motion.li>
          ))}
        </ul>

        <footer className="flex flex-col gap-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Adrian Rodriguez. All rights reserved.</p>
          <a href="#top" onClick={(e) => scrollTo(e, "#top")} className="group flex w-fit items-center gap-2 text-fg">
            Back to top
            <span className="flex size-8 items-center justify-center rounded-full border border-line transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1">
              <ArrowUpIcon size={14} weight="bold" />
            </span>
          </a>
        </footer>
      </div>

      <Wordmark />
    </section>
  );
}
