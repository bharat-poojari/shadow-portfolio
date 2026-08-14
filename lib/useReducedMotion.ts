'use client';

import { useEffect, useState } from 'react';

/**
 * ReducedMotionFallback primitive (see master plan §25 / §26).
 * Every GSAP timeline and R3F animation loop should check this before
 * running continuous motion, and fall back to static/instant states.
 *
 * Unchanged from the previous pass — included here only so the full hero
 * file set is complete in one place.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return reduced;
}
