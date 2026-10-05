"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDownRightIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import { LINKS } from "@/lib/data";
import { useApp } from "./Providers";
import { useScrollTo } from "./useScrollTo";
import Magnetic from "./ui/Magnetic";

const EASE = [0.23, 1, 0.32, 1] as const;
const MIN_W = 250;
const MAX_W = 900;

/** One glyph whose weight swells as the cursor approaches it. */
function Letter({
  char,
  index,
  mx,
  my,
  play,
}: {
  char: string;
  index: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  play: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const center = useRef({ x: -1e5, y: -1e5, radius: 300 });

  useEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      center.current = {
        x: r.left + r.width / 2 + window.scrollX,
        y: r.top + r.height / 2 + window.scrollY,
        radius: Math.max(220, r.height * 1.4),
      };
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const target = useTransform(() => {
    const { x, y, radius } = center.current;
    const d = Math.hypot(mx.get() - x, my.get() - y);
    const falloff = Math.max(0, 1 - d / radius);
    // Ease the falloff so the swell feels round, not conical
    return MIN_W + (MAX_W - MIN_W) * falloff * falloff * (3 - 2 * falloff);
  });
  const weight = useSpring(target, { stiffness: 260, damping: 28, mass: 0.6 });
  const fvs = useMotionTemplate`'wght' ${weight}`;

  return (
    // Measure the untransformed mask, not the glyph mid-entrance
    <span ref={ref} className="inline-block overflow-hidden pb-[0.06em] -mb-[0.06em]">
      <motion.span
        className="inline-block will-change-transform"
        style={{ fontVariationSettings: fvs }}
        initial={{ y: "105%" }}
        animate={{ y: play ? "0%" : "105%" }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.05 + index * 0.035 }}
      >
        {char}
      </motion.span>
    </span>
  );
}

function Word({
  text,
  offset,
  ...rest
}: {
  text: string;
  offset: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  play: boolean;
}) {
  return (
    <span className="block whitespace-nowrap" aria-hidden>
      {text.split("").map((c, i) => (
        <Letter key={i} char={c} index={offset + i} {...rest} />
      ))}
    </span>
  );
}

export default function Hero() {
  const { introDone } = useApp();
  const ref = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();

  // Cursor in page coordinates (drives letter weights)
  const mx = useMotionValue(-1e5);
  const my = useMotionValue(-1e5);
  // Cursor in section coordinates (drives the glow)
  const gx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const gy = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(600px circle at ${gx}px ${gy}px, var(--glow), transparent 70%)`;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Once the letters land, a virtual cursor sweeps across the name so the
  // weight effect is discoverable (and visible at all on touch screens)
  const nameRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!introDone || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let controls: ReturnType<typeof animate> | undefined;
    const id = setTimeout(() => {
      const r = nameRef.current?.getBoundingClientRect();
      if (!r) return;
      my.set(r.top + window.scrollY + r.height / 2);
      controls = animate(mx, [r.left - 200, r.right + 200], {
        duration: 2.2,
        ease: [0.65, 0, 0.35, 1],
        onComplete: () => mx.set(-1e5),
      });
    }, 1300);
    return () => {
      clearTimeout(id);
      controls?.stop();
    };
  }, [introDone, mx, my]);

  useEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    if (r) {
      gx.jump(r.width * 0.7);
      gy.jump(r.height * 0.35);
    }
  }, [gx, gy]);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mx.stop();
    mx.set(e.pageX);
    my.set(e.pageY);
    const r = ref.current!.getBoundingClientRect();
    gx.set(e.clientX - r.left);
    gy.set(e.clientY - r.top);
  };

  const onLeave = () => {
    mx.set(-1e5);
    my.set(-1e5);
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: "blur(6px)" },
    animate: introDone ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden px-4 pb-8 pt-24 sm:px-6 md:pb-10"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      <div className="relative mx-auto w-full max-w-[1400px]">
        <motion.a
          {...fadeUp(0.1)}
          href={LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition-colors duration-200 hover:border-fg/30 hover:text-fg"
        >
          <span className="relative flex size-2">
            <span className="ping-soft absolute inset-0 rounded-full bg-accent" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          Available for projects
        </motion.a>
      </div>

      <motion.div style={{ y: nameY, scale: nameScale }} className="relative mx-auto w-full max-w-[1400px] origin-bottom-left">
        <h1
          ref={nameRef}
          aria-label="Adrian Rodriguez"
          className="select-none text-[clamp(3.2rem,17.6vw,19rem)] uppercase leading-[0.86] tracking-[-0.045em]"
          style={{ fontVariationSettings: `'wght' ${MIN_W}` }}
        >
          <Word text="Adrian" offset={0} mx={mx} my={my} play={introDone} />
          <Word text="Rodriguez" offset={6} mx={mx} my={my} play={introDone} />
        </h1>
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="relative mx-auto mt-10 grid w-full max-w-[1400px] gap-8 md:grid-cols-12 md:items-end"
      >
        <motion.div {...fadeUp(0.55)} className="md:col-span-5">
          <p className="text-lg font-medium tracking-tight sm:text-xl">
            Web Developer <span className="text-accent">&amp;</span> Mobile App Developer
          </p>
          <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-muted">
            Designing and building web and mobile applications, combining user experience, performance and clean code.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.7)} className="flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end">
          <Magnetic>
            <a
              href="#connect"
              onClick={(e) => scrollTo(e, "#connect")}
              className="press group flex h-12 items-center gap-2 rounded-full bg-fg pl-6 pr-2 text-sm font-medium text-bg"
            >
              Collaborate
              <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-fg transition-transform duration-300 ease-[var(--ease-out)] group-hover:-rotate-45">
                <ArrowDownRightIcon size={15} weight="bold" />
              </span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={LINKS.cv}
              download
              className="press flex h-12 items-center gap-2 rounded-full border border-line px-6 text-sm font-medium transition-colors duration-200 hover:bg-surface"
            >
              <DownloadSimpleIcon size={16} weight="bold" />
              Download CV
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
