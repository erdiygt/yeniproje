"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function SmoothScrollProvider() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.14,
      duration: 0.85,
      wheelMultiplier: 1.12,
      touchMultiplier: 1.05,
      syncTouch: true,
      syncTouchLerp: 0.12,
      smoothWheel: true,
      autoRaf: true,
      anchors: {
        duration: 0.85,
      },
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    lenis.resize();
    lenis.scrollTo(0, { duration: 0.85, lock: false });
  }, [pathname]);

  return null;
}
