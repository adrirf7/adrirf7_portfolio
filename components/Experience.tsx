"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { EXPERIENCE } from "@/lib/data";
import RevealText from "./ui/RevealText";

const EASE = [0.23, 1, 0.32, 1] as const;

function Node({ progress, at }: { progress: MotionValue<number>; at: number }) {
  const scale = useTransform(progress, [at - 0.02, at + 0.04], [0.5, 1]);
  const fill = useTransform(progress, [at - 0.02, at + 0.04], [0, 1]);
  return (
    <span className="absolute -left-[5px] top-2 flex size-[11px] items-center justify-center rounded-full border border-line bg-bg">
      <motion.span style={{ scale, opacity: fill }} className="size-[11px] rounded-full bg-accent shadow-[0_0_0_4px_var(--glow)]" />
    </span>
  );
}

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.65", "end 0.65"] });

  return (
    <section id="experience" className="relative px-4 py-28 sm:px-6 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <RevealText
              as="h2"
              text="Work & Impact"
              className="text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-tighter"
            />
            <p className="mt-5 max-w-[38ch] text-base leading-relaxed text-muted">
              Internships where I shipped real software for real users.
            </p>
          </div>
        </div>

        <ol ref={listRef} className="relative ml-1 flex flex-col gap-20 border-l border-line pl-8 sm:pl-12 md:col-span-7 md:pb-8">
          <motion.span
            aria-hidden
            style={{ scaleY: scrollYProgress }}
            className="absolute -left-px top-0 h-full w-px origin-top bg-accent"
          />

          {EXPERIENCE.map((exp, i) => (
            <motion.li
              key={exp.company}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              transition={{ staggerChildren: 0.07 }}
              className="relative"
            >
              <span className="absolute -left-8 sm:-left-12">
                <Node progress={scrollYProgress} at={i / EXPERIENCE.length} />
              </span>

              {[
                <p key="meta" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-wider text-muted">
                  <span>{exp.period}</span>
                  <span>{exp.location}</span>
                </p>,
                <h3 key="co" className="mt-4 text-4xl font-semibold tracking-tighter sm:text-5xl">
                  {exp.company}
                </h3>,
                <p key="role" className="mt-2 text-base font-medium text-accent">
                  {exp.role}
                </p>,
              ].map((el) => (
                <motion.div
                  key={el.key}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
                >
                  {el}
                </motion.div>
              ))}

              <ul className="mt-6 flex flex-col gap-3">
                {exp.bullets.map((b) => (
                  <motion.li
                    key={b}
                    variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } } }}
                    className="flex max-w-[60ch] gap-3 text-[15px] leading-relaxed text-muted"
                  >
                    <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-faint" />
                    {b}
                  </motion.li>
                ))}
              </ul>

              <motion.ul
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {exp.tools.map((tool) => (
                  <li key={tool} className="rounded-full bg-surface px-3 py-1 font-mono text-xs">
                    {tool}
                  </li>
                ))}
              </motion.ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
