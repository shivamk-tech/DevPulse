"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/** Read the active Lenis instance — e.g. `lenis?.scrollTo("#pricing")`. */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Smooth scrolling for the whole site.
 *
 * Lenis takes over the wheel/touch event and interpolates the scroll position
 * itself, so it has to be the only thing driving the viewport:
 *
 *  - Native `scroll-behavior: smooth` would fight it, so the CSS in globals
 *    forces `auto` while Lenis is mounted.
 *  - Any inner scroll container (the dashboard's <main>) must opt out with
 *    `data-lenis-prevent`, or the wheel event gets swallowed by the page and
 *    that panel stops scrolling.
 *  - `prefers-reduced-motion` disables it outright. Interpolated scrolling is
 *    exactly the kind of motion that setting exists to turn off.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduced.matches) return;

    const instance = new Lenis({
      // ~0.1s time-constant feel: quick enough to stay glued to the wheel,
      // slow enough to read as eased rather than snapped.
      lerp: 0.11,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Touch devices already have momentum scrolling in the OS; layering
      // Lenis on top makes them feel laggy.
      syncTouch: false,
      autoRaf: false,
      // Hash links (the navbar's #features / #pricing) would otherwise jump
      // natively while Lenis holds a different position, which reads as a
      // glitch. Letting Lenis own them keeps one animator in charge.
      anchors: { offset: -80 },
    });

    const raf = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);
    setLenis(instance);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // App Router restores scroll on navigation, but Lenis keeps its own
  // animated position — without this it eases back down from the old offset.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
