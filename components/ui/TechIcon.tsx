"use client";

import { techSrc, type Tech } from "@/lib/data";
import { useApp } from "../Providers";

/** Tech logo with a label on hover. `onDark` forces the light-coloured icon variants. */
export default function TechIcon({ tech, size = 18, onDark = false }: { tech: Tech; size?: number; onDark?: boolean }) {
  const { theme } = useApp();
  const src = techSrc(tech, onDark ? "dark" : theme);
  if (!src) return null;

  return (
    <span className="group/tech relative flex items-center" tabIndex={0} aria-label={tech.label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" style={{ height: size, width: "auto" }} className="block shrink-0" loading="lazy" />
      <span
        role="tooltip"
        className={`pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 translate-y-1 whitespace-nowrap px-2 py-1 text-xs font-medium opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover/tech:translate-y-0 group-hover/tech:opacity-100 group-focus-visible/tech:translate-y-0 group-focus-visible/tech:opacity-100 ${
          onDark ? "bg-paper text-ink" : "bg-fg text-bg"
        }`}
      >
        {tech.label}
      </span>
    </span>
  );
}
