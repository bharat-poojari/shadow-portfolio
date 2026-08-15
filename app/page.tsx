import { SmoothScrollProvider } from '@/components/scene/SmoothScrollProvider';
import { NavigationHUD } from '@/components/ui/NavigationHUD';

import { PortfolioFooter } from '@/components/ui/PortfolioFooter';

import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { FunZone } from '@/components/sections/FunZone';
import { Education } from '@/components/sections/Education';
import { Certifications } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';


/*
 * THE VOID
 *    ↓
 * Hero / Awakening
 *    ↓
 * About / Origin
 *    ↓
 * Skills / Codex
 *    ↓
 * Projects / Campaigns
 *    ↓
 * Education / Training Arc
 *    ↓
 * Certifications / Artifact Vault
 *    ↓
 * Contact / Next Arc
 *    ↓
 * Portfolio Footer / System Terminal
 *    ↓
 * THE VOID
 */

export default function Home() {
  return (
    <SmoothScrollProvider>

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