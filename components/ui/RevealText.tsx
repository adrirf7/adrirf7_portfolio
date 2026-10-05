"use client";

import { motion, type Variants } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

/**
 * Splits text into words, each rising out of its own mask.
 * Plays on scroll into view, or when `play` flips true if provided.
 */
export default function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  play,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  play?: boolean;
  as?: "span" | "h2" | "h3" | "p";
}) {
  const Tag = motion[as];
  const controlled = play !== undefined;

  return (
    <Tag
      className={className}
      initial="hidden"
      animate={controlled ? (play ? "show" : "hidden") : undefined}
      whileInView={controlled ? undefined : "show"}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span variants={word} className="inline-block will-change-transform">
            {w}
            {" "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
