"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function SmoothScrollProvider() {
  const pathname = usePathname();
  const lenisRef = useRef<{
    resize: () => void;
    scrollTo: (target: number, options?: { duration?: number; lock?: boolean }) => void;
    destroy: () => void;
  } | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    let cancelled = false;

    async function initLenis() {
      const [{ default: Lenis }] = await Promise.all([
        import("lenis"),
        import("lenis/dist/lenis.css"),
      ]);

      if (cancelled) return;

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
    }

    void initLenis();

    return () => {
      cancelled = true;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const lenis = lenisRef.current;
    if (!lenis) return;

    lenis.resize();
    lenis.scrollTo(0, { duration: 0.85, lock: false });
  }, [pathname]);

  return null;
}
