"use client";

import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useApp } from "../Providers";

/**
 * Returns a toggle that spreads the new theme out from `origin` as a circle
 * (View Transitions API). Instant swap where unsupported or with reduced motion.
 */
export function useThemeSwitch() {
  const { theme, setTheme } = useApp();

  const toggle = useCallback(
    (origin?: HTMLElement | null) => {
      const next = theme === "dark" ? "light" : "dark";
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const root = document.documentElement;

      if (!document.startViewTransition || reduce || !origin) {
        root.classList.add("theme-switching");
        setTheme(next);
        requestAnimationFrame(() => root.classList.remove("theme-switching"));
        return;
      }

      const r = origin.getBoundingClientRect();
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
    },
    [theme, setTheme],
  );

  return { theme, toggle };
}
