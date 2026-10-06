"use client";

import { motion } from "motion/react";

const EASE = [0.77, 0, 0.175, 1] as const;

/**
 * Digits roll up to their value like a mechanical counter when scrolled into view.
 * Each column carries 0-9 and slides to its digit; columns further right spin longer.
 */
export default function Odometer({ value, className }: { value: string; className?: string }) {
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
      aria-label={value}
      className={`inline-flex overflow-hidden ${className ?? ""}`}
    >
      {value.split("").map((ch, i) => {
        const d = Number(ch);
        if (Number.isNaN(d)) return <span key={i} aria-hidden>{ch}</span>;
        // Spin at least one full turn before landing, more for later columns
        const turns = 10 + i * 10 + d;
        return (
          <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden leading-none">
            <span className="invisible">{ch}</span>
            <motion.span
              className="absolute left-0 top-0 flex flex-col"
              variants={{
                hidden: { y: "0em" },
                show: { y: `${-turns}em`, transition: { duration: 1.4 + i * 0.15, ease: EASE } },
              }}
            >
              {Array.from({ length: turns + 1 }, (_, k) => (
                <span key={k} className="h-[1em] leading-none">
                  {k % 10}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </motion.span>
  );
}
