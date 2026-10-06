"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDownIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import { LINKS } from "@/lib/data";
import { UI, type Lang } from "@/lib/i18n";
import { useApp } from "./Providers";
import { useScrollTo } from "./useScrollTo";
import LiquidImage from "./gl/LiquidImage";

const EASE = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
const INTERVAL = 2600;

/** Headline per language; `null` marks the line holding the rotating word */
const HEADLINE: Record<Lang, { lines: (string | null)[]; words: string[]; label: string }> = {
  en: { lines: ["I build", null, "apps."], words: ["web", "mobile", "full-stack"], label: "I build web and mobile apps." },
  es: { lines: ["Desarrollo", "apps", null], words: ["web.", "móviles.", "full-stack."], label: "Desarrollo apps web y móviles." },
};

/**
 * The swapping word sits in an inverted block. Letters leave upward and the next word
 * rises in; the block resizes smoothly to fit each word.
 */
function Rotator({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => setI(0), [words]);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), INTERVAL);
    return () => clearInterval(id);
  }, [words, reduce]);

  const word = words[i % words.length];
  return (
    <motion.span
      layout
      transition={{ layout: { duration: 0.5, ease: EASE_IN_OUT } }}
      className="relative inline-flex overflow-hidden bg-paper px-[0.08em] text-accent"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={word} className="inline-flex whitespace-pre">
          {word.split("").map((c, k) => (
            <motion.span
              key={k}
              className="inline-block"
              initial={{ y: "105%" }}
              animate={{ y: "0%", transition: { duration: 0.55, ease: EASE, delay: 0.12 + k * 0.03 } }}
              exit={{ y: "-105%", transition: { duration: 0.35, ease: EASE_IN_OUT, delay: k * 0.02 } }}
            >
              {c}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

export default function Hero() {
  const { t, lang } = useApp();
  const ref = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const head = HEADLINE[lang];

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section id="top" ref={ref} className="pt-14">
      <div className="relative overflow-hidden bg-accent text-paper lg:min-h-[calc(100dvh-56px)]">
        {/* Full-width text grid sits above the portrait: let the cursor through except on its own content */}
        <div className="page-grid pointer-events-none relative z-10 min-h-[inherit] grid-rows-[auto_1fr_auto] gap-y-10 pb-10 pt-6 lg:pb-12 [&>*]:pointer-events-auto">
          <motion.p {...fade(0.5)} className="col-span-6 text-sm lg:col-span-3">
            {t(UI.hero.role)}
          </motion.p>
          <motion.p {...fade(0.55)} className="col-span-6 text-right text-sm lg:col-span-4 lg:text-left">
            {t(UI.hero.location)}
          </motion.p>

          {/* Each line arrives wide and compresses into place along Archivo's width axis */}
          <motion.h1
            key={lang}
            aria-label={head.label}
            style={{ y: headlineY }}
            className="col-span-12 self-end text-[clamp(3.6rem,10.5vw,11.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.01em] lg:col-span-7"
          >
            {head.lines.map((line, i) => (
              <span key={i} aria-hidden className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block whitespace-nowrap"
                  initial={{ y: "100%", fontStretch: "125%" }}
                  animate={{ y: "0%", fontStretch: "62%" }}
                  transition={{
                    y: { duration: 0.9, ease: EASE, delay: 0.1 + i * 0.08 },
                    fontStretch: { duration: 1.3, ease: EASE_IN_OUT, delay: 0.1 + i * 0.08 },
                  }}
                >
                  {line ?? <Rotator words={head.words} />}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <div className="col-span-12 grid gap-8 lg:col-span-7 lg:grid-cols-7">
            <motion.p {...fade(0.7)} className="max-w-[40ch] text-lg leading-snug lg:col-span-4">
              {t(UI.hero.intro)}
            </motion.p>
            <motion.div {...fade(0.8)} className="flex flex-wrap items-end gap-2 lg:col-span-3 lg:justify-end">
              <a
                href="#connect"
                onClick={(e) => scrollTo(e, "#connect")}
                className="press group relative flex h-12 items-center gap-3 overflow-hidden bg-paper px-5 text-[15px] font-semibold text-accent"
              >
                {/* Ink sweeps across from the left on hover */}
                <span className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-x-100" />
                <span className="relative transition-colors duration-300 group-hover:text-paper">{t(UI.hero.cta)}</span>
                <ArrowDownIcon
                  size={16}
                  weight="bold"
                  className="relative transition-[transform,color] duration-300 ease-[var(--ease-out)] group-hover:translate-y-0.5 group-hover:text-paper"
                />
              </a>
              <a
                href={LINKS.cv}
                download
                className="press flex h-12 items-center gap-3 border border-paper/60 px-5 text-[15px] font-semibold transition-colors duration-200 hover:bg-paper hover:text-accent"
              >
                <DownloadSimpleIcon size={16} weight="bold" />
                {t(UI.hero.cv)}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Portrait: printed in two inks, the cursor reveals the real colours */}
        <motion.div
          initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.1, ease: EASE_IN_OUT, delay: 0.25 }}
          className="relative mx-4 mb-4 aspect-[4/5] sm:mx-6 lg:absolute lg:inset-y-0 lg:right-0 lg:m-0 lg:aspect-auto lg:w-[38%]"
        >
          <motion.div style={{ scale: portraitScale }} className="absolute inset-0 origin-bottom">
            <LiquidImage
              src="/adri.webp"
              alt="Adrian Rodriguez"
              axis="y"
              focus={[28, 30]}
              width={1920}
              aspect={4000 / 3856}
              quality={90}
              priority
              duotone={["#0b1356", "#f2f3f5"]}
              className="absolute inset-0"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
