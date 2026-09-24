'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { About } from '@/components/sections/About';
import { Certifications } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';
import { Education } from '@/components/sections/Education';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { SmoothScrollProvider } from '@/components/scene/SmoothScrollProvider';
import { NavigationHUD } from '@/components/ui/NavigationHUD';
import { PortfolioFooter } from '@/components/ui/PortfolioFooter';

const FunZone = dynamic(
  () =>
    import('@/components/sections/FunZone').then((module) => ({
      default: module.FunZone,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[55vh] w-full bg-void"
        aria-label="Loading interactive fun zone"
      />
    ),
  },
);

function LightPageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[99999] h-px overflow-hidden bg-white/[0.08]"
      aria-hidden="true"
    >
      <span className="block h-full w-1/3 animate-[pageLoader_700ms_ease-in-out_infinite] bg-[#E4623F] shadow-[0_0_12px_rgba(228,98,63,0.9)]" />
    </div>
  );
}

export default function Home() {
  return (
    <SmoothScrollProvider>
      <LightPageLoader />
      <NavigationHUD />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <FunZone />
        <Education />
        <Certifications />
        <Contact />
      </main>

      <PortfolioFooter />
    </SmoothScrollProvider>
  );
}
