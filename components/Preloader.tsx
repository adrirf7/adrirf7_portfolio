"use client";

import { useEffect, useState } from "react";
import { animate, motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useApp } from "./Providers";

const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export default function Preloader() {
  const { finishIntro } = useApp();
  const [visible, setVisible] = useState(true);
  const progress = useMotionValue(0);
  const rounded = useTransform(progress, (v) => Math.round(v).toString().padStart(3, "0"));
  const scaleX = useTransform(progress, [0, 100], [0, 1]);
  const lenis = useLenis();

  useEffect(() => {
    const seen = document.documentElement.dataset.intro === "seen";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setVisible(false);
      finishIntro();
      return;
    }

    window.scrollTo(0, 0);
    const controls = animate(progress, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        try {
          sessionStorage.setItem("intro", "seen");
        } catch {}
        setVisible(false);
        finishIntro();
      },
    });
    return () => controls.stop();
  }, [finishIntro, progress]);

  // Hold the page still while the curtain is down
  useEffect(() => {
    if (!lenis) return;
    if (visible) lenis.stop();
    else lenis.start();
  }, [lenis, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[70] flex flex-col justify-between bg-fg p-4 text-bg sm:p-8"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: EASE_IN_OUT }}
        >
          <div className="flex items-start justify-between font-mono text-xs uppercase tracking-wider opacity-60">
            <span>Adrian Rodriguez</span>
            <span>Portfolio</span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <p className="max-w-[18ch] text-sm leading-snug opacity-60 sm:text-base">
              Web &amp; mobile developer.
            </p>
            <motion.span className="font-mono text-[22vw] font-light leading-[0.8] tracking-tighter tabular-nums sm:text-[16vw]">
              {rounded}
            </motion.span>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-1 w-full origin-left bg-accent"
            style={{ scaleX }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
