"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/** Height of the fixed top navigation bar */
const NAV_SPACE = 56;
const TOP_GAP = 32;

/**
 * Where to scroll so a section's content sits in the middle of the visible area
 * (below the nav bar). Content taller than that is aligned to the top instead.
 * Sections marked `data-snap="start"` (the pinned gallery) go straight to their start.
 */
function targetFor(href: string): number | null {
  if (href === "#top") return 0;
  const section = document.querySelector<HTMLElement>(href);
  if (!section) return null;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  if (section.dataset.snap === "start") return Math.min(sectionTop, max);

  const content = section.querySelector<HTMLElement>("[data-anchor]") ?? section;
  const r = content.getBoundingClientRect();
  const top = r.top + window.scrollY;
  const avail = window.innerHeight - NAV_SPACE;

  const y =
    r.height <= avail - TOP_GAP * 2 ? top - NAV_SPACE - (avail - r.height) / 2 : top - NAV_SPACE - TOP_GAP;
  return Math.max(0, Math.min(y, max));
}

/** Smooth-scrolls to an in-page anchor through Lenis, with a native fallback. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      const y = targetFor(href);
      if (y === null) return;
      if (lenis) lenis.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y, behavior: "smooth" });
      history.replaceState(null, "", href === "#top" ? location.pathname : href);
    },
    [lenis],
  );
}
