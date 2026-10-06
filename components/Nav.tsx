"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { LINKS } from "@/lib/data";
import { LANGS, UI, type Lang } from "@/lib/i18n";
import { useApp } from "./Providers";
import { useScrollTo } from "./useScrollTo";
import { useThemeSwitch } from "./ui/ThemeToggle";
import Scramble from "./ui/Scramble";

const EASE = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

const ITEMS = [
  { href: "#about", label: UI.nav.about },
  { href: "#skills", label: UI.nav.skills },
  { href: "#projects", label: UI.nav.work },
  { href: "#experience", label: UI.nav.experience },
  { href: "#connect", label: UI.nav.contact },
];

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ["#top", ...ITEMS.map((n) => n.href)].map((h) => document.querySelector(h)).filter(Boolean) as Element[];
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

/** Swaps language behind a left-to-right wipe, like a page being reprinted. */
function useLangSwitch() {
  const { lang, setLang } = useApp();
  return (next: Lang) => {
    if (next === lang) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      setLang(next);
      return;
    }
    const vt = document.startViewTransition(() => {
      flushSync(() => setLang(next));
    });
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] },
        { duration: 650, easing: "cubic-bezier(0.77, 0, 0.175, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };
}

export default function Nav() {
  const { t, lang } = useApp();
  const active = useActiveSection();
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const { theme, toggle } = useThemeSwitch();
  const switchLang = useLangSwitch();
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.3 });

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
    lenis?.start(); // the menu's scroll lock would swallow the jump otherwise
    scrollTo(e, href);
  };

  const langSwitch = (
    <div role="group" aria-label={t(UI.nav.lang)} className="flex items-center gap-1.5">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-faint">/</span>}
          <button
            onClick={() => switchLang(l)}
            aria-pressed={lang === l}
            className={`uppercase transition-colors ${lang === l ? "text-fg" : "text-muted hover:text-fg"}`}
          >
            <span className={lang === l ? "border-b border-current" : ""}>{l}</span>
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
        <nav className="page-grid h-14 items-center text-[13px]">
          <a href="#top" onClick={(e) => go(e, "#top")} className="col-span-6 font-semibold md:col-span-3">
            <Scramble text="Adrian Rodriguez" hover />
          </a>

          <ul className="col-span-6 hidden items-center gap-6 md:flex lg:col-span-5">
            {ITEMS.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={(e) => go(e, n.href)} className="relative flex items-center gap-2">
                  <span className="relative flex size-2 items-center justify-center">
                    {active === n.href && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 bg-accent"
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                      />
                    )}
                  </span>
                  <span className={active === n.href ? "text-fg" : "text-muted transition-colors hover:text-fg"}>
                    <Scramble text={t(n.label)} hover />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="col-span-6 flex items-center justify-end gap-5 md:col-span-3 lg:col-span-4">
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 text-muted transition-colors hover:text-fg xl:flex"
            >
              <span className="blink size-1.5 rounded-full bg-accent" />
              {t(UI.nav.available)}
            </a>
            {langSwitch}
            <button
              onClick={(e) => toggle(e.currentTarget)}
              className="min-w-[3.25rem] text-right text-muted transition-colors hover:text-fg"
              aria-label={t(theme === "dark" ? UI.nav.toLight : UI.nav.toDark)}
            >
              <Scramble text={t(theme === "dark" ? UI.nav.light : UI.nav.dark)} />
            </button>
            <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="font-semibold md:hidden">
              {t(open ? UI.nav.close : UI.nav.menu)}
            </button>
          </div>
        </nav>

        {/* Reading progress along the bottom edge of the bar */}
        <motion.div aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-accent" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: EASE_IN_OUT }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-accent px-4 pb-10 pt-20 text-paper md:hidden"
          >
            <ul>
              {ITEMS.map((n, i) => (
                <li key={n.href} className="overflow-hidden border-t border-paper/25">
                  <motion.a
                    href={n.href}
                    onClick={(e) => go(e, n.href)}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
                    className="w-cond block py-2 text-[15vw] font-bold uppercase leading-[0.9]"
                  >
                    {t(n.label)}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
