"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/** Smooth-scrolls to an in-page anchor through Lenis, with a native fallback. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      const target = href === "#top" ? 0 : href;
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
      else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", href === "#top" ? location.pathname : href);
    },
    [lenis],
  );
}
