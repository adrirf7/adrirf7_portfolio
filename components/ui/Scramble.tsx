"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*+=<>";

/**
 * Text that decodes itself: characters cycle through random glyphs and lock in
 * left to right. Plays when the text changes (e.g. a language switch), when it
 * first scrolls into view, and (optionally) when the parent element is hovered.
 */
export default function Scramble({
  text,
  className,
  hover = false,
  onView = false,
  duration = 450,
}: {
  text: string;
  className?: string;
  /** Replay when the parent element is hovered */
  hover?: boolean;
  /** Play once when first scrolled into view */
  onView?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const first = useRef(true);

  const play = (target: string) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (el) el.textContent = target;
      return;
    }
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const n = target.length;
    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      let out = "";
      for (let i = 0; i < n; i++) {
        const c = target[i];
        // Each character locks in a little after the one before it
        const lockAt = (i / n) * 0.7 + 0.3;
        out += c === " " || p >= lockAt ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  };

  // Replay on text change, but not on mount (unless asked to play on view)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (ref.current) ref.current.textContent = text;
      return;
    }
    play(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanups: (() => void)[] = [];
    if (hover && el.parentElement) {
      const parent = el.parentElement;
      const onEnter = (e: PointerEvent) => e.pointerType === "mouse" && play(el.getAttribute("aria-label") ?? "");
      parent.addEventListener("pointerenter", onEnter);
      cleanups.push(() => parent.removeEventListener("pointerenter", onEnter));
    }
    if (onView) {
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          play(el.getAttribute("aria-label") ?? "");
          io.disconnect();
        },
        { threshold: 0.6 },
      );
      io.observe(el);
      cleanups.push(() => io.disconnect());
    }
    return () => {
      cleanups.forEach((c) => c());
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover, onView]);

  return (
    <span ref={ref} aria-label={text} className={className}>
      {text}
    </span>
  );
}
