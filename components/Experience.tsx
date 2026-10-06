"use client";

import { motion } from "motion/react";
import { EXPERIENCE } from "@/lib/data";
import { UI } from "@/lib/i18n";
import { useApp } from "./Providers";
import Odometer from "./ui/Odometer";
import Scramble from "./ui/Scramble";

const EASE = [0.23, 1, 0.32, 1] as const;

export default function Experience() {
  const { t } = useApp();

  return (
    <section id="experience" className="border-t border-line py-24 md:py-36">
      <div data-anchor className="page-grid gap-y-10">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <h2 className="section-name">
              <Scramble text={t(UI.experience.title)} onView />
            </h2>
            <p className="mt-6 max-w-[30ch] text-lg leading-snug text-muted">{t(UI.experience.intro)}</p>
          </div>
        </div>

        <ol className="col-span-12 flex flex-col gap-16 lg:col-span-8">
          {EXPERIENCE.map((exp) => (
            <motion.li
              key={exp.company}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.06 }}
            >
              <motion.div
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
                className="h-[2px] origin-left bg-fg"
              />
              <div className="grid gap-x-6 gap-y-8 pt-6 md:grid-cols-8">
                <div className="md:col-span-3">
                  {/* Year rolls up like a mechanical counter */}
                  <Odometer
                    value={exp.year}
                    className="w-cond text-[clamp(4rem,7vw,6.5rem)] font-bold leading-[0.82] text-accent tabular-nums"
                  />
                  <motion.div
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 0.4 } } }}
                  >
                    <p className="mt-4 text-sm text-muted">{t(exp.period)}</p>
                    <p className="text-sm text-muted">{t(exp.location)}</p>
                  </motion.div>
                </div>

                <div className="md:col-span-5">
                  <motion.h3
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                    className="text-[clamp(2rem,3.2vw,3rem)] font-semibold uppercase leading-none tracking-[-0.02em]"
                  >
                    {exp.company}
                  </motion.h3>
                  <motion.p
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }}
                    className="mt-2 font-medium"
                  >
                    {t(exp.role)}
                  </motion.p>

                  <ul className="mt-6 border-t border-line">
                    {exp.bullets.map((b) => (
                      <motion.li
                        key={b.en}
                        variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
                        className="group flex gap-3 border-b border-line py-3 text-[15px] leading-relaxed"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 bg-accent transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-45 group-hover:scale-125"
                        />
                        {t(b)}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.p
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }}
                    className="mt-4 text-sm text-muted"
                  >
                    {exp.tools.join(" / ")}
                  </motion.p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
