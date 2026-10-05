"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { AsteriskIcon } from "@phosphor-icons/react";
import { MARQUEE_WORDS } from "@/lib/data";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Row({ speed, outline = false }: { speed: number; outline?: boolean }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(velocity, [-3000, 3000], [10, -10]);
  const x = useTransform(base, (v) => `${wrap(-25, -50, v)}%`);
  const spin = useTransform(base, (v) => v * 18);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    // Scrolling up reverses the band; scrolling down sends it forward again
    if (b < 0) dir.current = -1;
    else if (b > 0) dir.current = 1;
    let move = dir.current * speed * (delta / 1000);
    move += dir.current * move * Math.abs(b);
    base.set(base.get() + move);
  });

  const words = [...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0" style={{ x, skewX }}>
        {[0, 1, 2, 3].map((k) => (
          <span key={k} className="flex shrink-0 items-center" aria-hidden={k > 0}>
            {words.map((w, i) => (
              <span key={i} className="flex items-center">
                <span
                  className={`px-5 text-[clamp(2rem,6vw,5.5rem)] font-semibold uppercase leading-none tracking-tighter sm:px-8 ${
                    outline ? "text-outline" : ""
                  }`}
                >
                  {w}
                </span>
                <motion.span style={{ rotate: spin }} className="flex text-accent">
                  <AsteriskIcon weight="bold" className="size-[clamp(1.25rem,3vw,2.5rem)]" />
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="Focus areas" className="relative flex flex-col gap-3 overflow-hidden border-y border-line py-8 sm:gap-5 sm:py-10">
      <Row speed={-2} />
      <Row speed={2} outline />
    </section>
  );
}
