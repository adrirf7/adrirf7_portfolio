"use client";

import { useRef } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useApp } from "../Providers";

/**
 * The new theme spreads out from the button as a circle (View Transitions API).
 * Falls back to an instant swap where unsupported or with reduced motion.
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const ref = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    if (!document.startViewTransition || reduce || !ref.current) {
      root.classList.add("theme-switching");
      setTheme(next);
      requestAnimationFrame(() => root.classList.remove("theme-switching"));
      return;
    }

    const r = ref.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const vt = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.77, 0, 0.175, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return (
    <button
      ref={ref}
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="press relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-line text-fg transition-colors duration-200 hover:bg-surface"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, scale: 0.6, rotate: -90, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.6, rotate: 90, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
          className="flex"
        >
          {theme === "dark" ? <MoonIcon size={16} weight="bold" /> : <SunIcon size={16} weight="bold" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
