"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUpRightIcon, GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import { LINKS, NAV } from "@/lib/data";
import { useApp } from "./Providers";
import { useScrollTo } from "./useScrollTo";
import ThemeToggle from "./ui/ThemeToggle";

const EASE = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = NAV.map((n) => document.querySelector(n.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export default function Navbar() {
  const { introDone } = useApp();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const scrollTo = useScrollTo();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 400 && !open);
  });

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    // Release the menu's scroll lock now (overflow: clip blocks programmatic scroll too)
    lenis?.start();
    scrollTo(e, href);
  };

  return (
    <>
      <motion.header
        initial={{ y: "-110%" }}
        animate={{ y: introDone && !hidden ? "0%" : "-110%" }}
        transition={{ duration: 0.6, ease: EASE, delay: introDone && !scrolled ? 0.9 : 0 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4"
      >
        <nav
          className={`mx-auto flex h-14 max-w-[1400px] items-center justify-between rounded-full border pl-5 pr-2 transition-[background-color,border-color,backdrop-filter] duration-300 ${
            scrolled || open ? "border-line bg-bg/70 backdrop-blur-xl" : "border-transparent bg-transparent"
          }`}
        >
          <a href="#top" onClick={(e) => go(e, "#top")} className="group flex items-baseline gap-2" aria-label="Back to top">
            <span className="text-[15px] font-semibold tracking-tight">Adrian Rodriguez</span>
            <span className="hidden font-mono text-[11px] text-muted transition-colors duration-200 group-hover:text-accent sm:inline">
              /dev
            </span>
          </a>

          <ul className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
            {NAV.map((n) => (
              <li key={n.href} className="relative">
                <a
                  href={n.href}
                  onClick={(e) => go(e, n.href)}
                  onPointerEnter={() => setHovered(n.href)}
                  className={`relative z-10 block px-4 py-2 text-sm transition-colors duration-200 ${
                    active === n.href ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {n.label}
                  {active === n.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent"
                      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                    />
                  )}
                </a>
                {hovered === n.href && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-surface"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#connect"
              onClick={(e) => go(e, "#connect")}
              className="press hidden h-10 items-center gap-1.5 rounded-full bg-fg px-5 text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-85 md:flex"
            >
              Collaborate
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="press relative flex size-10 items-center justify-center rounded-full bg-fg text-bg md:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ease-[var(--ease-out)] ${open ? "rotate-45" : "-translate-y-[3px]"}`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ease-[var(--ease-out)] ${open ? "-rotate-45" : "translate-y-[3px]"}`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE_IN_OUT }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-6 pb-8 pt-28 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((n, i) => (
                <li key={n.href} className="overflow-hidden">
                  <motion.a
                    href={n.href}
                    onClick={(e) => go(e, n.href)}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%", transition: { duration: 0.25 } }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.2 + i * 0.05 }}
                    className="flex items-baseline gap-3 text-5xl font-semibold tracking-tighter"
                  >
                    <span className={active === n.href ? "text-accent" : ""}>{n.label}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between border-t border-line pt-6 text-sm text-muted"
            >
              <a href={`mailto:${LINKS.email}`} className="flex items-center gap-1 text-fg">
                Email <ArrowUpRightIcon size={14} />
              </a>
              <div className="flex gap-4">
                <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedinLogoIcon size={22} />
                </a>
                <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <GithubLogoIcon size={22} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
