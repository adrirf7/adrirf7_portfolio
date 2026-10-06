"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { getScrollVelocity } from "@/lib/scrollVelocity";

/**
 * Display heading whose letters widen with scroll speed and snap back when the page
 * settles. Drives the font's real width axis (rest -> fast), not a scale transform,
 * so the glyphs are redrawn rather than stretched.
 */
export default function KineticTitle({
  children,
  className = "",
  as = "h2",
  rest = 62,
  fast = 100,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "p" | "span" | "div";
  /** font-stretch % at rest and at full scroll speed */
  rest?: number;
  fast?: number;
}) {
  const reduce = useReducedMotion();
  const speed = useMotionValue(0);
  const smooth = useSpring(speed, { stiffness: 220, damping: 22, mass: 0.6 });
  const stretch = useTransform(smooth, [0, 60], [rest, fast], { clamp: true });
  const fontStretch = useTransform(stretch, (v) => `${v}%`);
  const skewX = useTransform(smooth, [0, 60], [0, -6], { clamp: true });

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const tick = () => {
      speed.set(Math.abs(getScrollVelocity()));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, speed]);

  const Tag = motion[as];
  return (
    <Tag className={`origin-left ${className}`} style={reduce ? undefined : { fontStretch, skewX }}>
      {children}
    </Tag>
  );
}
