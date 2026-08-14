# The Living Chronicle

Immersive anime-adventure-styled portfolio for **Bharat Chandru Poojari** —
Full Stack Developer · Node.js & React.js · AI Integration.

This is a **Phase 1–2 scaffold** (see master plan §29 Implementation
Roadmap): visual foundation, design tokens, information architecture, and
the reusable component skeletons are in place and content is wired to real
resume data. The full cinematic engine (GSAP ScrollTrigger choreography,
CameraRig, WorldShift/SlashReveal/GlitchShift transitions, the 3D Skills
Codex, ProjectScene dives) is intentionally left as clearly marked
extension points rather than fully built out — build those next, on top of
this structure, rather than restarting it.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.tsx        Root layout, font loading (Space Grotesk / IBM Plex Sans / JetBrains Mono)
  page.tsx           Assembles the world sequence: Hero → About → Skills → Projects → Education → Certifications → Contact
  globals.css        Design tokens, reduced-motion base rules

components/
  scene/
    SmoothScrollProvider.tsx   Lenis inertial scrolling (skipped under reduced motion)
    ParticleField.tsx          Reusable R3F particle primitive
    HeroCanvas.tsx              Hero/Awakening WebGL layer
  ui/
    NavigationHUD.tsx          Persistent floating section nav
  sections/
    Hero.tsx            01 — The Awakening
    About.tsx            02 — The Origin (education/internship timeline)
    Skills.tsx            03 — The Codex (interactive capability groups)
    Projects.tsx          04 — The Campaigns (project case files)
    Education.tsx        05 — The Training Arc
    Certifications.tsx   06 — The Artifact Vault
    Contact.tsx            07 — The Next Arc

lib/
  content.ts              Single source of truth for all resume-grounded content
  useReducedMotion.ts     Shared accessibility hook
```

## Design tokens

See the rationale comments at the top of `tailwind.config.ts`. Palette:
`void` (background), `ember` (projects/energy), `spectral` (AI/system UI),
`signal` (certifications/verified artifacts), `bone` (text), `ash` (muted
text/borders). Typography: Space Grotesk (display), IBM Plex Sans (body),
JetBrains Mono (data/HUD labels).

## Known content gap

The resume states six independently built applications; only five are
named in the source resume (Furniqo, OffyAI, PrimeNews, CodePolish,
personal portfolio). `lib/content.ts` and the Projects section leave a
labeled reserved slot — do not invent the sixth project, add it once
Bharat supplies the name/details.

Other inputs still needed before final content pass (master plan §32):
professional portrait, demo videos/GIFs, additional project metrics,
credential verification URLs, GitHub/LinkedIn profile URLs, preferred
resume file, personal logo/monogram.

## Next implementation steps (§29 Phase 2–3)

1. Add GSAP + ScrollTrigger timelines per section, mapped to normalized
   scroll progress (§18).
2. Build out `CinematicTransition` primitives (FadeThrough, SlashReveal,
   GlitchShift, ParticleDissolve, Morph, InkSpread, WorldShift).
3. Expand `HeroCanvas` into a full `PersistentScene` + `CameraRig` so the
   3D world persists and moves across sections instead of resetting.
4. Turn the Skills section's active-group state into a 3D/particle
   visualization per capability group.
5. Turn each Projects card into a `ProjectScene` — a dedicated
   environment entered on click, per §17/§25.
