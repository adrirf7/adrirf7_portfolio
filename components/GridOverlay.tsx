"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.77, 0, 0.175, 1] as const;
const COLS = Array.from({ length: 12 }, (_, i) => i);

/**
 * The 12-column grid every section is set on. It draws itself once on load, then
 * fades away; pressing G brings it back (and hides it again).
 */
export default function GridOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => setVisible(false), reduce ? 0 : 1500);

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      clearTimeout(id);
      setVisible((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="grid"
          aria-hidden
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="pointer-events-none fixed inset-0 z-[55]"
        >
          <div className="page-grid h-full">
            {COLS.map((i) => (
              <motion.span
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.035 }}
                className={`h-full origin-top border-x border-accent/25 bg-accent/[0.04] ${i >= 6 ? "hidden md:block" : ""}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
