"use client";

import { techSrc, type Tech } from "@/lib/data";
import { useApp } from "../Providers";

export default function TechIcon({ tech, size = 18 }: { tech: Tech; size?: number }) {
  const { theme } = useApp();
  const src = techSrc(tech, theme);
  if (!src) return null;

  return (
    <span className="group/tech relative flex items-center" tabIndex={0} aria-label={tech.label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" style={{ height: size, width: "auto" }} className="block shrink-0" loading="lazy" />
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 origin-bottom scale-95 whitespace-nowrap rounded-full border border-line bg-bg px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fg opacity-0 shadow-sm transition-[opacity,transform] duration-150 ease-out group-hover/tech:scale-100 group-hover/tech:opacity-100 group-focus-visible/tech:scale-100 group-focus-visible/tech:opacity-100"
      >
        {tech.label}
      </span>
    </span>
  );
}
