'use client';

import { useState } from 'react';
import { siteSections } from '@/lib/content';

/**
 * NavigationHUD primitive (master plan §19/§25). Compact floating HUD
 * instead of a conventional header — collapsed to numbers by default,
 * expands to labels on hover/focus. Always recoverable: never trap the
 * visitor inside a scroll sequence.
 */
export function NavigationHUD() {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 z-50 -translate-y-1/2 md:right-8"
    >
      <ul className="flex flex-col items-end gap-3">
        {siteSections.map((section) => (
          <li key={section.id} className="flex items-center gap-3">
            <a
              href={`#${section.id}`}
              className={`hud-label text-[10px] text-ash transition-all duration-300 ease-cinematic hover:text-bone ${
                expanded ? 'max-w-[140px] opacity-100' : 'max-w-0 overflow-hidden opacity-0'
              }`}
            >
              {section.label}
            </a>
            <a
              href={`#${section.id}`}
              className="hud-label flex h-6 w-6 items-center justify-center rounded-full border border-void-line text-[10px] text-ash transition-colors duration-300 hover:border-spectral-bright hover:text-spectral-bright"
            >
              {section.num}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
