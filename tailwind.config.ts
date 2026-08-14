import type { Config } from 'tailwindcss';

// Design tokens for "The Living Chronicle"
// Palette rationale (see /docs/design-notes.md):
// - void:     near-black with a faint violet undertone, not pure #000 — the world's base state
// - ember:    desaturated crimson — projects / energy / action states
// - spectral: muted violet — AI, system UI, skills codex states
// - signal:   warm gold — certifications / verified artifacts
// - bone:     warm off-white for primary text (never pure #FFF)
// - ash:      muted secondary text, borders, inactive HUD states
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#08070B',
          raised: '#0F0D14',
          line: '#1C1922',
        },
        ember: {
          DEFAULT: '#B8452E',
          dim: '#6E2A1D',
          bright: '#E4623F',
        },
        spectral: {
          DEFAULT: '#6C5CE0',
          dim: '#372E6E',
          bright: '#9585F5',
        },
        signal: {
          DEFAULT: '#D9A441',
          dim: '#7A5C24',
          bright: '#F2C365',
        },
        bone: {
          DEFAULT: '#E8E4DD',
          muted: '#B9B4AC',
        },
        ash: {
          DEFAULT: '#6B6874',
          dim: '#413F49',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.35em',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
