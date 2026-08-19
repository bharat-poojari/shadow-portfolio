'use client';

import {
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

import Lenis from 'lenis';
import { useReducedMotion } from '@/lib/useReducedMotion';

type SmoothScrollProviderProps = {
  children: ReactNode;
};

/**
 * High-performance inertial scrolling layer.
 *
 * Design goals:
 * - Butter-smooth wheel scrolling
 * - Stable frame pacing
 * - No React state updates during scrolling
 * - Native scrolling fallback under reduced motion
 * - Proper background-tab throttling
 * - Single RAF loop
 * - Compositor-friendly configuration
 * - Touch scrolling remains responsive
 *
 * If GSAP ScrollTrigger is used elsewhere, subscribe to Lenis's
 * scroll event there rather than creating another animation loop.
 */
export function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const reduced = useReducedMotion();

  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    if (reduced) {
      return;
    }

    /*
     * ============================================================
     * LENIS
     * ============================================================
     *
     * `lerp` gives a very smooth interpolation without making
     * scrolling feel excessively floaty.
     *
     * A value around 0.085–0.11 works particularly well for
     * portfolio / cinematic websites.
     */
    const lenis = new Lenis({
  lerp: 0.095,
  wheelMultiplier: 0.92,
  touchMultiplier: 1.05,
  smoothWheel: true,
  syncTouch: true,
  duration: 1.05,
  easing: (t: number) => 1 - Math.pow(1 - t, 3),
});

    lenisRef.current = lenis;

    /*
     * ============================================================
     * RAF LOOP
     * ============================================================
     *
     * One animation clock drives Lenis.
     *
     * Do not use setInterval / setTimeout for scrolling.
     * requestAnimationFrame keeps updates synchronized with
     * browser rendering.
     */
    let lastTime = 0;

    const raf = (time: number) => {
      if (!runningRef.current) {
        return;
      }

      /*
       * Guard against unusually large frame gaps.
       *
       * This prevents a background-tab resume or temporary
       * browser stall from producing a huge interpolation jump.
       */
      if (lastTime !== 0) {
        const delta = time - lastTime;

        if (delta > 100) {
          lastTime = time;
          rafRef.current = requestAnimationFrame(raf);
          return;
        }
      }

      lastTime = time;

      lenis.raf(time);

      rafRef.current = requestAnimationFrame(raf);
    };

    /*
     * ============================================================
     * START
     * ============================================================
     */
    const start = () => {
      if (runningRef.current) {
        return;
      }

      runningRef.current = true;
      lastTime = 0;

      rafRef.current = requestAnimationFrame(raf);
    };

    /*
     * ============================================================
     * STOP
     * ============================================================
     */
    const stop = () => {
      runningRef.current = false;

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      lastTime = 0;
    };

    /*
     * ============================================================
     * VISIBILITY OPTIMIZATION
     * ============================================================
     *
     * There is no reason to continuously run Lenis while the
     * browser tab is hidden.
     *
     * This matters on a portfolio with several animated layers,
     * because it prevents unnecessary CPU/GPU work when the user
     * switches tabs.
     */
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
      { passive: true }
    );

    /*
     * ============================================================
     * START ANIMATION
     * ============================================================
     */
    start();

    /*
     * ============================================================
     * CLEANUP
     * ============================================================
     */
    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

      stop();

      lenis.stop();
      lenis.destroy();

      lenisRef.current = null;
    };
  }, [reduced]);

  return <>{children}</>;
}