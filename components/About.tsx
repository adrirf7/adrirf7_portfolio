"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { QUICK_TAGS } from "@/lib/data";

const EASE = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

const STATEMENT =
  "Clean code, solid product, real impact. I build fast, scale well and prioritize the user without sacrificing technical quality.";

function ScrubWord({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / n, (i + 1) / n], [0.14, 1]);
  return (
    <motion.span style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
}

/** Words light up one by one as the paragraph travels through the viewport. */
function ScrubText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.12] tracking-tight">
      {words.map((w, i) => (
        <ScrubWord key={i} word={w} i={i} n={words.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}

export default function About() {
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" className="relative px-4 py-28 sm:px-6 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5 lg:col-span-4">
          {/* The observer lives on the unclipped wrapper: a fully clipped element never reports as visible */}
          <motion.div
            ref={photoRef}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="w-full max-w-md md:sticky md:top-28"
          >
            <motion.div
              variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, show: { clipPath: "inset(0% 0% 0% 0%)" } }}
              transition={{ duration: 1.2, ease: EASE_IN_OUT }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface"
            >
              <motion.div
                style={{ y: imgY }}
                variants={{ hidden: { scale: 1.3 }, show: { scale: 1 } }}
                transition={{ duration: 1.6, ease: EASE_IN_OUT }}
                className="absolute -inset-[10%]"
              >
                <Image
                  src="/adri.webp"
                  alt="Adrian Rodriguez"
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 100vw"
                  className="object-cover object-[30%_30%]"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex flex-col md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          <h2 className="mb-8 font-mono text-xs uppercase tracking-[0.18em] text-muted">What I do</h2>

          <ScrubText text={STATEMENT} />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-10 max-w-[52ch] text-base leading-relaxed text-muted"
          >
            Adaptable and always focused on writing clean, maintainable code that drives real value.
          </motion.p>

          <dl className="mt-14 grid max-w-xl grid-cols-2 gap-6 border-t border-line pt-8">
            {[
              ["Location", "Madrid, Spain"],
              ["Status", "Open to work"],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
              >
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="mt-1 text-xl font-medium tracking-tight">{v}</dd>
              </motion.div>
            ))}
          </dl>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.05 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {QUICK_TAGS.map((tag) => (
              <motion.li
                key={tag}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: { opacity: 1, scale: 1, transition: { type: "spring", duration: 0.5, bounce: 0.25 } },
                }}
                className="rounded-full border border-line px-4 py-1.5 text-sm"
              >
                {tag}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
