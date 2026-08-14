'use client';

import {
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

type ArtifactProps = {
  profile: {
    name: string;
    title: string;
  };
};

/* =========================================================
   RESUME-GROUNDED DATA
   ========================================================= */

const education = [
  {
    id: 'BCA',
    level: 'UNDERGRADUATE',
    title: 'BACHELOR OF COMPUTER APPLICATIONS',
    institution: 'JMJ BCA COLLEGE, CHIPGI, SIRSI',
    period: '2023 — 2026',
    score: '9.02',
    scoreLabel: 'CGPA',
    accent: '#5FC6E8',
  },
  {
    id: 'PU',
    level: 'PRE-UNIVERSITY',
    title: 'PRE-UNIVERSITY COURSE',
    institution: 'SHREE MARIKAMBA GOVERNMENT PU COLLEGE, SIRSI',
    period: '2021 — 2023',
    score: '87.3',
    scoreLabel: '%',
    accent: '#9585F5',
  },
  {
    id: 'SSLC',
    level: 'SECONDARY',
    title: 'SECONDARY SCHOOL LEAVING CERTIFICATE',
    institution: 'SURYA NARAYANA HIGH SCHOOL, BISALAKOPPA, SIRSI',
    period: '2018 — 2021',
    score: '93',
    scoreLabel: '%',
    accent: '#E4623F',
  },
] as const;

const capabilities = [
  {
    name: 'FRONTEND',
    value: 'REACT',
    detail: 'React.js · HTML5 · CSS3 · Tailwind CSS · Bootstrap',
    accent: '#5FC6E8',
  },
  {
    name: 'BACKEND',
    value: 'NODE',
    detail: 'Node.js · Express.js · REST APIs',
    accent: '#E4623F',
  },
  {
    name: 'AI',
    value: 'LLM',
    detail: 'Prompt Engineering · LLMs · AI Integration',
    accent: '#9585F5',
  },
  {
    name: 'DATABASE',
    value: 'DATA',
    detail: 'MongoDB · MySQL',
    accent: '#5FC6E8',
  },
  {
    name: 'LANGUAGES',
    value: 'CODE',
    detail: 'JavaScript · PHP · Python · C',
    accent: '#E4623F',
  },
  {
    name: 'TOOLS',
    value: 'DEV',
    detail: 'Git · GitHub · VS Code · Postman · Figma',
    accent: '#9585F5',
  },
] as const;

const certifications = [
  {
    id: '01',
    name: 'Prompt Engineering – Web Development',
    issuer: 'ProEdge Learning',
    date: 'JUN 2026',
    code: 'PE-WD',
  },
  {
    id: '02',
    name: 'Frontend Developer',
    issuer: 'SIDH & Reliance Foundation Skilling Academy',
    date: 'JUL 2025',
    code: 'FD',
  },
  {
    id: '03',
    name: 'IoT Network Specialist',
    issuer: 'SIDH & Reliance Foundation Skilling Academy',
    date: 'JUL 2025',
    code: 'IOT',
  },
] as const;

/* =========================================================
   SHARED ARTIFACT FRAME
   ========================================================= */

function ArtifactFrame({
  children,
  className = '',
  accent = '#E4623F',
}: {
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <section
      className={`artifact-frame ${className}`}
      style={{ '--artifact-accent': accent } as CSSProperties}
    >
      <span className="artifact-corner artifact-tl" aria-hidden="true" />
      <span className="artifact-corner artifact-tr" aria-hidden="true" />
      <span className="artifact-corner artifact-bl" aria-hidden="true" />
      <span className="artifact-corner artifact-br" aria-hidden="true" />
      <span className="artifact-scan" aria-hidden="true" />
      <span className="artifact-noise" aria-hidden="true" />
      {children}
    </section>
  );
}

/* =========================================================
   FOUNDATION MATRIX
   ========================================================= */

function FoundationMatrix() {
  const [active, setActive] = useState(0);
  const record = education[active];

  return (
    <ArtifactFrame className="foundation-matrix" accent={record.accent}>
      <div className="artifact-header">
        <span>FOUNDATION MATRIX</span>
        <span className="artifact-code">{record.id}</span>
      </div>

      <div className="foundation-main">
        <div className="foundation-copy">
          <span className="foundation-level">{record.level}</span>
          <h3>{record.title}</h3>
          <p>{record.institution}</p>
          <small>{record.period}</small>
        </div>

        <div
          className="foundation-score"
          aria-label={`${record.score} ${record.scoreLabel}`}
        >
          <strong>{record.score}</strong>
          <span>{record.scoreLabel}</span>
        </div>
      </div>

      <div
        className="foundation-tabs"
        role="tablist"
        aria-label="Education records"
      >
        {education.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={
              active === index
                ? 'foundation-tab active'
                : 'foundation-tab'
            }
          >
            <span>{item.id}</span>
            <small>{item.id === 'BCA' ? 'DEGREE' : item.id}</small>
          </button>
        ))}
      </div>
    </ArtifactFrame>
  );
}

/* =========================================================
   CODEX / ABILITIES
   ========================================================= */

function CodexAbilities() {
  const [active, setActive] = useState(0);
  const ability = capabilities[active];

  return (
    <ArtifactFrame
      className="codex-matrix"
      accent={ability.accent}
    >
      <div className="artifact-header">
        <span>CODEX / ABILITIES</span>
        <span className="artifact-code">
          {String(active + 1).padStart(2, '0')} / {capabilities.length}
        </span>
      </div>

      <div
        className="codex-main codex-content-reveal"
        key={ability.name}
      >
        <div className="codex-core">
          <div
            className="codex-ring"
            style={{
              borderColor: ability.accent,
              boxShadow: `0 0 24px ${ability.accent}22`,
            }}
          >
            <span>{ability.value}</span>
          </div>
        </div>

        <div className="codex-copy">
          <span>{ability.name}</span>
          <p>{ability.detail}</p>
        </div>
      </div>

      <div
        className="codex-tabs"
        role="tablist"
        aria-label="Ability categories"
      >
        {capabilities.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={
              active === index
                ? 'codex-tab active'
                : 'codex-tab'
            }
          >
            {item.name}
          </button>
        ))}
      </div>
    </ArtifactFrame>
  );
}

/* =========================================================
   ARTIFACT VAULT
   ========================================================= */

function ArtifactVault() {
  const [active, setActive] = useState(0);
  const certificate = certifications[active];

  return (
    <ArtifactFrame
      className="artifact-vault"
      accent="#E4623F"
    >
      <div className="artifact-header">
        <span>ARTIFACT VAULT</span>
        <span className="artifact-code">
          {certificate.id} / {certifications.length}
        </span>
      </div>

      <div
        className="vault-main vault-content-reveal"
        key={certificate.id}
      >
        <div className="vault-emblem" aria-hidden="true">
          <span>識</span>
        </div>

        <div className="vault-copy">
          <span>CREDENTIAL {certificate.code}</span>
          <h3>{certificate.name}</h3>
          <p>{certificate.issuer}</p>
          <small>{certificate.date}</small>
        </div>
      </div>

      <div
        className="vault-selector"
        role="tablist"
        aria-label="Certifications"
      >
        {certifications.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={
              active === index
                ? 'vault-option active'
                : 'vault-option'
            }
          >
            <span>{item.id}</span>
            <small>{item.code}</small>
          </button>
        ))}
      </div>
    </ArtifactFrame>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export function HeroArtifacts({ profile: _profile }: ArtifactProps) {
  return (
    <aside
      className="hero-artifacts"
      aria-label="Portfolio information artifacts"
    >
      <div className="hero-artifact-stack">
        <FoundationMatrix />
        <CodexAbilities />
        <ArtifactVault />
      </div>

      <style jsx global>{`
        /* =====================================================
           HERO FIT
           Three artifacts only. No internal scrolling and no
           vertical centering that can push the first card above
           the hero.
           ===================================================== */

        .hero-artifacts {
          position: absolute;
          top: 5.75rem;
          right: clamp(1.5rem, 4vw, 5rem);
          bottom: 1.5rem;
          z-index: 40;
          width: clamp(320px, 24vw, 380px);
          pointer-events: auto;
          overflow: visible;
          perspective: 1400px;
        }

        .hero-artifact-stack {
          display: grid;
          grid-template-rows: repeat(3, minmax(0, 1fr));
          gap: 10px;
          width: 100%;
          height: 100%;
          min-height: 0;
          padding: 2px 6px 2px 2px;
        }

        /* Every interactive descendant is explicitly clickable. */
        .hero-artifacts button,
        .hero-artifacts a {
          pointer-events: auto;
        }

        /* =====================================================
           BASE FRAME
           ===================================================== */

        .artifact-frame {
          --artifact-accent: #E4623F;
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          padding: clamp(14px, 1.2vw, 18px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 2px;
          background: linear-gradient(
            135deg,
            rgba(11, 10, 17, 0.95),
            rgba(8, 8, 13, 0.84)
          );
          backdrop-filter: blur(16px) saturate(135%);
          -webkit-backdrop-filter: blur(16px) saturate(135%);
          box-shadow:
            0 18px 42px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.045);
          transform: translate3d(0, 0, 0);
          transform-style: preserve-3d;
          animation: artifactFloat 6.5s ease-in-out infinite;
          will-change: transform, box-shadow;
          transition:
            transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 300ms ease,
            box-shadow 350ms ease,
            background 350ms ease;
        }

        .artifact-frame::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            circle at 10% 0%,
            var(--artifact-accent),
            transparent 48%
          );
          opacity: 0.045;
        }

        .artifact-frame:hover {
          animation-play-state: paused;
          transform: translate3d(-7px, -3px, 12px) scale(1.012)
            rotateX(0.5deg);
          border-color: var(--artifact-accent);
          box-shadow:
            0 24px 55px rgba(0, 0, 0, 0.36),
            0 0 25px color-mix(
              in srgb,
              var(--artifact-accent) 9%,
              transparent
            ),
            inset 0 0 30px rgba(255, 255, 255, 0.02);
        }

        .artifact-corner {
          position: absolute;
          width: 9px;
          height: 9px;
          border-color: var(--artifact-accent);
          opacity: 0.75;
          pointer-events: none;
          transition:
            width 250ms ease,
            height 250ms ease,
            opacity 250ms ease;
        }

        .artifact-frame:hover .artifact-corner {
          width: 14px;
          height: 14px;
          opacity: 1;
        }

        .artifact-tl {
          top: 0;
          left: 0;
          border-top: 1px solid;
          border-left: 1px solid;
        }

        .artifact-tr {
          top: 0;
          right: 0;
          border-top: 1px solid;
          border-right: 1px solid;
        }

        .artifact-bl {
          bottom: 0;
          left: 0;
          border-bottom: 1px solid;
          border-left: 1px solid;
        }

        .artifact-br {
          right: 0;
          bottom: 0;
          border-right: 1px solid;
          border-bottom: 1px solid;
        }

        .artifact-scan,
        .artifact-noise {
          pointer-events: none;
        }

        .artifact-scan {
          position: absolute;
          top: 0;
          left: -120%;
          width: 42%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--artifact-accent),
            transparent
          );
          opacity: 0.65;
          animation: artifactScan 3.8s linear infinite;
          animation-delay: -1.2s;
        }

        .artifact-frame:hover .artifact-scan {
          animation-duration: 1.45s;
        }

        .artifact-noise {
          position: absolute;
          inset: 0;
          opacity: 0.02;
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.8) 0.5px,
            transparent 0.5px
          );
          background-size: 4px 4px;
          mix-blend-mode: screen;
          animation: artifactNoise 7s steps(8) infinite;
        }

        /* =====================================================
           HEADER
           ===================================================== */

        .artifact-header {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 0 0 auto;
          font-family: monospace;

          /* +1px */
          font-size: clamp(10px, 0.68vw, 12px);

          font-weight: 600;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.48);
        }

        .artifact-code {
          color: var(--artifact-accent);
        }

        /* =====================================================
           FOUNDATION
           ===================================================== */

        .foundation-main {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex: 1 1 auto;
          min-height: 0;
          margin-top: 7px;
        }

        .foundation-copy {
          min-width: 0;
        }

        .foundation-level {
          display: block;
          font-family: monospace;

          /* 9px → 10px */
          font-size: 10px;

          letter-spacing: 0.13em;
          color: var(--artifact-accent);
        }

        .foundation-copy h3 {
          margin-top: 4px;
          max-width: 245px;
          font-family: var(--font-display, sans-serif);

          /* 16–20px → 17–21px */
          font-size: clamp(17px, 1.18vw, 21px);

          line-height: 1.08;
          letter-spacing: 0.025em;
          color: rgba(255, 255, 255, 0.92);
        }

        .foundation-copy p {
          margin-top: 5px;
          max-width: 250px;
          font-family: monospace;

          /* 9px → 10px */
          font-size: 10px;

          line-height: 1.4;
          color: rgba(255, 255, 255, 0.55);
        }

        .foundation-copy small {
          display: block;
          margin-top: 3px;
          font-family: monospace;

          /* 8px → 9px */
          font-size: 9px;

          color: rgba(255, 255, 255, 0.38);
        }

        .foundation-score {
          display: flex;
          animation: scorePulse 3.2s ease-in-out infinite;
          flex: 0 0 auto;
          width: 58px;
          height: 58px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 1px solid var(--artifact-accent);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            color-mix(
              in srgb,
              var(--artifact-accent) 13%,
              transparent
            ),
            transparent 70%
          );
        }

        .foundation-score strong {
          font-family: var(--font-display, sans-serif);

          /* 21px → 22px */
          font-size: 22px;

          color: var(--artifact-accent);
        }

        .foundation-score span {
          margin-top: 1px;
          font-family: monospace;

          /* 8px → 9px */
          font-size: 9px;

          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.48);
        }

        .foundation-tabs {
          position: relative;
          z-index: 4;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          flex: 0 0 auto;
          margin-top: 7px;
        }

        .foundation-tab,
        .codex-tab,
        .vault-option {
          appearance: none;
          -webkit-appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
          color: rgba(255, 255, 255, 0.36);
          font-family: monospace;
          cursor: pointer;
          touch-action: manipulation;
          transition:
            transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 220ms ease,
            background 220ms ease,
            color 220ms ease,
            box-shadow 220ms ease;
        }

        .foundation-tab {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 6px 7px;
          text-align: left;
        }

        .foundation-tab:hover,
        .foundation-tab.active,
        .codex-tab:hover,
        .codex-tab.active,
        .vault-option:hover,
        .vault-option.active {
          transform: translateY(-2px) scale(1.015);
          border-color: var(--artifact-accent);
          background: color-mix(
            in srgb,
            var(--artifact-accent) 7%,
            transparent
          );
          color: var(--artifact-accent);
          box-shadow:
            0 0 18px color-mix(
              in srgb,
              var(--artifact-accent) 12%,
              transparent
            ),
            inset 0 0 16px color-mix(
              in srgb,
              var(--artifact-accent) 6%,
              transparent
            );
        }

        .foundation-tab:active,
        .codex-tab:active,
        .vault-option:active {
          transform: translateY(0) scale(0.96);
        }

        .foundation-tab span {
          /* 10px → 11px */
          font-size: 11px;

          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .foundation-tab small {
          margin-top: 2px;

          /* 7px → 8px */
          font-size: 8px;

          opacity: 0.78;
        }

        /* =====================================================
           CODEX
           ===================================================== */

        .codex-main {
          display: grid;
          grid-template-columns: 64px 1fr;
          align-items: center;
          gap: 12px;
          flex: 1 1 auto;
          min-height: 0;
          margin-top: 7px;
        }

        .codex-content-reveal,
        .vault-content-reveal {
          animation: artifactContentReveal 420ms
            cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .codex-core {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .codex-ring {
          position: relative;
          animation: codexFloat 4.8s ease-in-out infinite;
          display: flex;
          width: 58px;
          height: 58px;
          align-items: center;
          justify-content: center;
          border: 1px dashed;
          border-radius: 50%;
          transition:
            transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .artifact-frame:hover .codex-ring {
          animation-play-state: paused;
          transform: rotate(10deg) scale(1.08);
        }

        .codex-ring::before {
          content: '';
          position: absolute;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
        }

        .codex-ring span {
          position: relative;
          z-index: 2;
          font-family: monospace;

          /* 7px → 8px */
          font-size: 8px;

          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--artifact-accent);
        }

        .codex-copy span {
          display: block;
          font-family: monospace;

          /* 9px → 10px */
          font-size: 10px;

          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--artifact-accent);
        }

        .codex-copy p {
          margin-top: 5px;
          font-family: monospace;

          /* 7px → 8px */
          font-size: 8px;

          line-height: 1.45;
          color: rgba(255, 255, 255, 0.68);
        }

        .codex-tabs {
          position: relative;
          z-index: 4;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          flex: 0 0 auto;
          margin-top: 6px;
        }

        .codex-tab {
          padding: 5px 6px;

          /* 5.5px → 6.5px */
          font-size: 6.5px;

          letter-spacing: 0.06em;
        }

        /* =====================================================
           ARTIFACT VAULT
           ===================================================== */

        .vault-main {
          display: grid;
          grid-template-columns: 58px 1fr;
          align-items: center;
          gap: 12px;
          flex: 1 1 auto;
          min-height: 0;
          margin-top: 7px;
        }

        .vault-emblem {
          display: flex;
          animation: vaultFloat 5.4s ease-in-out infinite;
          width: 54px;
          height: 54px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(228, 98, 63, 0.55);
          background: radial-gradient(
            circle,
            rgba(228, 98, 63, 0.1),
            transparent 68%
          );
          color: #E4623F;
          transform: rotate(45deg);
          transition:
            transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .artifact-frame:hover .vault-emblem {
          animation-play-state: paused;
          transform: rotate(135deg) scale(1.08);
        }

        .vault-emblem span {
          /* 15px → 16px */
          font-size: 16px;

          transform: rotate(-45deg);
        }

        .vault-copy {
          min-width: 0;
        }

        .vault-copy > span {
          display: block;
          font-family: monospace;

          /* 6px → 7px */
          font-size: 7px;

          letter-spacing: 0.12em;
          color: #E4623F;
        }

        .vault-copy h3 {
          margin-top: 4px;
          font-family: var(--font-display, sans-serif);

          /* 14–17px → 15–18px */
          font-size: clamp(15px, 1.02vw, 18px);

          line-height: 1.12;
        }

        .vault-copy p {
          margin-top: 4px;
          font-family: monospace;

          /* 6px → 7px */
          font-size: 7px;

          line-height: 1.35;
          color: rgba(255, 255, 255, 0.66);
        }

        .vault-copy small {
          display: block;
          margin-top: 3px;
          font-family: monospace;

          /* 6px → 7px */
          font-size: 7px;

          color: rgba(255, 255, 255, 0.3);
        }

        .vault-selector {
          position: relative;
          z-index: 4;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          flex: 0 0 auto;
          margin-top: 6px;
        }

        .vault-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 7px;

          /* 8px → 9px */
          font-size: 9px;
        }

        .vault-option span {
          /* 7px → 8px */
          font-size: 8px;

          font-weight: 700;
        }

        .vault-option small {
          /* 5px → 6px */
          font-size: 6px;

          letter-spacing: 0.06em;
          opacity: 0.7;
        }

        /* =====================================================
           FOCUS + SMALL VIEWPORTS
           ===================================================== */

        .artifact-frame button:focus-visible {
          outline: 1px solid var(--artifact-accent);
          outline-offset: 2px;
        }

        @media (max-height: 760px) and (min-width: 1280px) {
          .hero-artifacts {
            top: 5rem;
            bottom: 1rem;
            width: 340px;
          }

          .artifact-frame {
            padding: 10px 12px;
          }

          .foundation-copy h3 {
            /* 12px → 13px */
            font-size: 13px;
          }

          .foundation-score,
          .codex-ring {
            width: 50px;
            height: 50px;
          }

          .vault-emblem {
            width: 48px;
            height: 48px;
          }
        }

        @media (max-width: 1279px) {
          .hero-artifacts {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .artifact-frame,
          .artifact-frame:hover,
          .codex-ring,
          .vault-emblem,
          .foundation-score {
            transform: none !important;
            transition: none !important;
          }

          .artifact-scan,
          .artifact-noise,
          .codex-content-reveal,
          .vault-content-reveal {
            animation: none !important;
            display: none;
          }
        }

        @keyframes artifactFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -3px, 0);
          }
        }

        @keyframes artifactScan {
          0% {
            left: -120%;
            opacity: 0;
          }

          12% {
            opacity: 0.65;
          }

          50% {
            opacity: 0.9;
          }

          88% {
            opacity: 0.45;
          }

          100% {
            left: 130%;
            opacity: 0;
          }
        }

        @keyframes artifactNoise {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }

          20% {
            transform: translate3d(-1%, 1%, 0);
          }

          40% {
            transform: translate3d(1%, -1%, 0);
          }

          60% {
            transform: translate3d(0.5%, 1%, 0);
          }

          80% {
            transform: translate3d(-0.5%, -1%, 0);
          }
        }

        @keyframes scorePulse {
          0%, 100% {
            box-shadow:
              0 0 0 rgba(228, 98, 63, 0),
              inset 0 0 14px color-mix(
                in srgb,
                var(--artifact-accent) 5%,
                transparent
              );
          }

          50% {
            box-shadow:
              0 0 24px color-mix(
                in srgb,
                var(--artifact-accent) 15%,
                transparent
              ),
              inset 0 0 24px color-mix(
                in srgb,
                var(--artifact-accent) 10%,
                transparent
              );
          }
        }

        @keyframes codexFloat {
          0%, 100% {
            transform: rotate(-2deg) scale(1);
          }

          50% {
            transform: rotate(3deg) scale(1.035);
          }
        }

        @keyframes vaultFloat {
          0%, 100% {
            transform: rotate(45deg) translateY(0);
          }

          50% {
            transform: rotate(51deg) translateY(-3px);
          }
        }

        @keyframes artifactContentReveal {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </aside>
  );
}