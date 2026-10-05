"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis } from "lenis/react";

type Theme = "light" | "dark";

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  /** True once the preloader has handed the stage to the hero */
  introDone: boolean;
  finishIntro: () => void;
};

const AppCtx = createContext<Ctx>({
  theme: "dark",
  setTheme: () => {},
  introDone: false,
  finishIntro: () => {},
});

export const useApp = () => useContext(AppCtx);

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [introDone, setIntroDone] = useState(false);
  const reduce = useReducedMotion();

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

  const finishIntro = useCallback(() => setIntroDone(true), []);

  return (
    <AppCtx.Provider value={{ theme, setTheme, introDone, finishIntro }}>
      <MotionConfig reducedMotion="user">
        {reduce ? (
          children
        ) : (
          <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
            {children}
          </ReactLenis>
        )}
      </MotionConfig>
    </AppCtx.Provider>
  );
}
