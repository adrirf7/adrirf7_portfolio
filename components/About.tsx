"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { EXPERIENCE, PROJECTS, SKILL_GROUPS } from "@/lib/data";
import { UI } from "@/lib/i18n";
import { useApp } from "./Providers";
import Scramble from "./ui/Scramble";

const EASE = [0.23, 1, 0.32, 1] as const;

const TECH_COUNT = new Set(SKILL_GROUPS.flatMap((g) => g.items.map((i) => i.label))).size;

const FACTS = [
  { label: UI.about.projects, value: String(PROJECTS.length) },
  { label: UI.about.technologies, value: String(TECH_COUNT) },
  { label: UI.about.internships, value: String(EXPERIENCE.length) },
  { label: UI.about.basedIn, value: "Madrid" },
];

function Word({
  word,
  i,
  n,
  accent,
  progress,
}: {
  word: string;
  i: number;
  n: number;
  accent: boolean;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [i / n, (i + 1) / n], [0.13, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? "text-accent" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

/** The statement inks itself in, word by word, as it travels up the screen. */
function Statement() {
  const { t } = useApp();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = t(UI.about.statement).split(" ");
  const keyCount = Number(t(UI.about.keyWords));
  return (
    <p ref={ref} className="text-[clamp(1.9rem,3.7vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.02em]">
      {words.map((w, i) => (
        <Word key={i} word={w} i={i} n={words.length} accent={i < keyCount} progress={scrollYProgress} />
      ))}
    </p>
  );
}

export default function About() {
  const { t } = useApp();
  return (
    <section id="about" className="py-24 md:py-36">
      <div data-anchor className="page-grid gap-y-10">
        <div className="col-span-12 lg:col-span-4">
          <h2 className="section-name lg:sticky lg:top-24">
            <Scramble text={t(UI.about.title)} onView />
          </h2>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Statement />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-10 max-w-[48ch] text-lg leading-relaxed text-muted"
          >
            {t(UI.about.support)}
          </motion.p>

          <dl className="mt-16 grid grid-cols-2 border-t border-line md:grid-cols-4">
            {FACTS.map((f, i) => (
              <motion.div
                key={f.label.en}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
                className={`flex flex-col justify-between gap-8 border-b border-line py-5 pr-4 md:border-b-0 ${
                  i % 2 === 1 ? "pl-4 md:pl-5" : "md:pl-5"
                } ${i > 0 ? "md:border-l" : "md:pl-0"} ${i % 2 === 1 ? "border-l" : ""}`}
              >
                <dt className="text-sm text-muted">{t(f.label)}</dt>
                <dd className="w-cond text-[clamp(2.8rem,4.8vw,4.75rem)] font-bold uppercase leading-[0.85] tabular-nums">
                  {f.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
