"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import { setScrollVelocity } from "@/lib/scrollVelocity";
import type { L, Lang } from "@/lib/i18n";

type Theme = "light" | "dark";

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Pick the current language out of a bilingual value */
  t: (v: L) => string;
};

const AppCtx = createContext<Ctx>({
  theme: "light",
  setTheme: () => {},
  lang: "en",
  setLang: () => {},
  t: (v) => v.en,
});

export const useApp = () => useContext(AppCtx);

/** Publishes Lenis velocity for render loops that live outside React. */
function VelocityBridge() {
  useLenis((lenis) => setScrollVelocity(lenis.velocity));
  return null;
}

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("en");
  const reduce = useReducedMotion();

  // Language: saved choice, else the browser's preference
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("lang");
    } catch {}
    const initial: Lang = stored === "es" || stored === "en" ? stored : navigator.language.startsWith("es") ? "es" : "en";
    setLangState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem("lang", l);
    } catch {}
  }, []);

  const t = useCallback((v: L) => v[lang], [lang]);

  // The inline script in layout.tsx already set the class before paint
  useEffect(() => {
    setThemeState(readTheme());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {}
      if (stored) return;
      document.documentElement.classList.toggle("dark", mq.matches);
      setThemeState(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.classList.toggle("dark", t === "dark");
    setThemeState(t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, []);

  return (
    <AppCtx.Provider value={{ theme, setTheme, lang, setLang, t }}>
      <MotionConfig reducedMotion="user">
        {reduce ? (
          children
        ) : (
          <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
            <VelocityBridge />
            {children}
          </ReactLenis>
        )}
      </MotionConfig>
    </AppCtx.Provider>
  );
}
