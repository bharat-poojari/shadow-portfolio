'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  HeroCanvas,
  type HeroCanvasHandle,
} from '../scene/HeroCanvas';

import { HeroArtifacts } from './../hero/HeroArtifacts';

import { profile } from '@/lib/content';

const socials = [
  {
    label: 'GitHub',
    short: 'GH',
    href: 'https://github.com/bharat-poojari',
    path: `
      M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37
      6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.71
      -2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.52-1.11-1.52
      -.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05
      .89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37
      -2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75
      -.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05
      a9.3 9.3 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34
      1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72
      .64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06
      .36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81
      0 .28.18.61.69.5A10.26 10.26 0 0 0 22 12.25
      C22 6.58 17.52 2 12 2Z
    `,
  },

  {
    label: 'LinkedIn',
    short: 'IN',
    href: 'https://linkedin.com/in/bharat-poojari',
    path: `
      M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.2 8.75h3.5V21H3.2V8.75Zm6.2
      0h3.36v1.68h.05c.47-.88 1.6-1.8 3.3-1.8 3.53 0 4.18 2.32
      4.18 5.34V21h-3.5v-5.42c0-1.3-.02-2.96-1.8-2.96-1.82
      0-2.1 1.42-2.1 2.87V21H9.4V8.75Z
    `,
  },

  {
    label: 'Instagram',
    short: 'IG',
    href: 'https://instagram.com/bharat.poojari',
    path: `
      M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.41
      .56.21.96.47 1.38.89.42.42.68.82.89 1.38.17.42.36
      1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07
      4.85c-.05 1.17-.24 1.8-.41 2.22-.21.56-.47.96-.89
      1.38-.42.42-.82.68-1.38.89-.42.17-1.05.36-2.22.41
      -1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05
      -1.8-.24-2.22-.41a3.74 3.74 0 0 1-1.38-.89 3.74 3.74
      0 0 1-.89-1.38c-.17-.42-.36-1.05-.41-2.22-.06-1.27
      -.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.5
      .41-2.22.21-.56.47-.96.89-1.38.42-.42.82-.68 1.38-.89
      .42-.17.88-.3 2.22-.41C8.42 2.17 8.8 2.16 12 2.16Zm0
      1.8c-3.14 0-3.5.01-4.74.07-.97.04-1.5.2-1.85.34
      -.46.18-.79.39-1.14.74-.35.35-.56.68-.74 1.14-.14.35
      -.3.88-.34 1.85-.06 1.24-.07 1.6-.07 4.74s.01 3.5
      .07 4.74c.04.97.2 1.5.34 1.85.18.46.39.79.74 1.14
      .35.35.68.56 1.14.74.35.14.88.3 1.85.34 1.24.06
      1.6.07 4.74.07s3.5-.01 4.74-.07c.97-.04 1.5-.2 1.85-.34
      .46-.18.79-.39 1.14-.74.35-.35.56-.68.74-1.14.14-.35
      .3-.88.34-1.85.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74
      c-.04-.97-.2-1.5-.34-1.85a3.06 3.06 0 0 0-.74-1.14
      3.06 3.06 0 0 0-1.14-.74c-.35-.14-.88-.3-1.85-.34
      -1.24-.06-1.6-.07-4.74-.07Zm0 3.06a5 5 0 1 1 0 9.99
      5 5 0 0 1 0-9.99Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2
      0 0 0 0-6.4Zm5.2-1.99a1.17 1.17 0 1 1-2.33 0
      1.17 1.17 0 0 1 2.33 0Z
    `,
  },
];

export function Hero() {
  const [muted, setMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(true);

  const [hoveredSocial, setHoveredSocial] =
    useState<string | null>(null);

  const [pressed, setPressed] = useState(false);

  const heroCanvasRef =
    useRef<HeroCanvasHandle>(null);

  const heroRef =
    useRef<HTMLElement>(null);

  /*
   * ============================================================
   * MOUSE / POINTER PARALLAX
   * ============================================================
   */

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    let raf = 0;

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const rect =
          hero.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;

        const px = (x - 0.5) * 2;
        const py = (y - 0.5) * 2;

        hero.style.setProperty(
          '--mx',
          px.toFixed(4),
        );

        hero.style.setProperty(
          '--my',
          py.toFixed(4),
        );

        hero.style.setProperty(
          '--mx-px',
          `${(px * 18).toFixed(2)}px`,
        );

        hero.style.setProperty(
          '--my-px',
          `${(py * 12).toFixed(2)}px`,
        );
      });
    };

    const handlePointerLeave = () => {
      hero.style.setProperty('--mx', '0');
      hero.style.setProperty('--my', '0');
      hero.style.setProperty(
        '--mx-px',
        '0px',
      );
      hero.style.setProperty(
        '--my-px',
        '0px',
      );
    };

    hero.addEventListener(
      'pointermove',
      handlePointerMove,
    );

    hero.addEventListener(
      'pointerleave',
      handlePointerLeave,
    );

    return () => {
      cancelAnimationFrame(raf);

      hero.removeEventListener(
        'pointermove',
        handlePointerMove,
      );

      hero.removeEventListener(
        'pointerleave',
        handlePointerLeave,
      );
    };
  }, []);

  return (
    <>
      <section
        ref={heroRef}
        id="hero"
        className="
          hero-awakening
          relative
          min-h-screen
          w-full
          overflow-hidden
          bg-void
          text-bone
          [--mx:0]
          [--my:0]
          [--mx-px:0px]
          [--my-px:0px]
        "
      >
        {/* =====================================================
            WORLD
            ===================================================== */}

        <HeroCanvas
          ref={heroCanvasRef}
          muted={muted}
          onPlayingChange={setVideoPlaying}
        />

        {/* =====================================================
            REAL DATA ARTIFACT SYSTEM

            This replaces the old dummy:
            SYSTEM / SPIRIT CORE / QUEST cards.
            ===================================================== */}

        <HeroArtifacts profile={profile} />

        {/* =====================================================
            GLOBAL CINEMATIC LIGHT
            ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-10
            bg-gradient-to-b
            from-void/50
            via-transparent
            to-void/75
          "
        />

        {/* =====================================================
            TOP LEFT IDENTITY
            ===================================================== */}

        <div
          className="
            hero-enter
            absolute
            left-6
            top-6
            z-40
            flex
            items-center
            gap-3
            sm:left-10
            sm:top-8
          "
          style={{
            animationDelay: '150ms',
          }}
        >
          <span
            className="
              font-display
              text-lg
              font-medium
              sm:text-xl
            "
          >
            {profile.name}
          </span>

          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded
              border
              border-[#E4623F]/60
              bg-[#E4623F]/10
              text-xs
              text-[#E4623F]
              shadow-[0_0_20px_rgba(228,98,63,0.12)]
              transition-all
              duration-500
              hover:rotate-12
              hover:scale-110
              hover:bg-[#E4623F]/20
            "
          >
            識
          </span>
        </div>

        {/* =====================================================
            WORLD CONTROL
            ===================================================== */}

        <button
          type="button"
          onClick={() => {
            heroCanvasRef.current?.toggleVideo();
          }}
          aria-label={
            videoPlaying
              ? 'Freeze background animation'
              : 'Resume background animation'
          }
          aria-pressed={!videoPlaying}
          className="
            group
            absolute
            right-6
            top-6
            z-40
            flex
            h-10
            w-10
            items-center
            justify-center
            text-bone
            transition-all
            duration-500
            ease-[cubic-bezier(0.16,1,0.3,1)]
            hover:scale-110
            active:scale-90
            sm:right-10
            sm:top-8
          "
        >
          {/* OUTER ARTIFACT */}

          <span
            className="
              pointer-events-none
              absolute
              inset-0
              rotate-45
              border
              border-bone/20
              bg-black/20
              backdrop-blur-md
              transition-all
              duration-500
              group-hover:rotate-[135deg]
              group-hover:border-[#E4623F]/60
              group-hover:bg-[#E4623F]/5
            "
            style={{
              clipPath:
                'polygon(50% 0%, 92% 20%, 100% 50%, 92% 80%, 50% 100%, 8% 80%, 0% 50%, 8% 20%)',
            }}
          />

          {/* INNER SEAL */}

          <span
            className={`
              pointer-events-none
              absolute
              inset-[5px]
              rounded-full
              border
              transition-all
              duration-700
              ${
                videoPlaying
                  ? 'animate-[artifactPulse_2.4s_ease-in-out_infinite] border-[#E4623F]/35'
                  : 'scale-90 border-[#5FC6E8]/30'
              }
            `}
          />

          {/* ROTATING ENERGY ARC */}

          <span
            className={`
              pointer-events-none
              absolute
              inset-[2px]
              rounded-full
              border
              border-transparent
              transition-all
              duration-700
              ${
                videoPlaying
                  ? 'animate-[artifactSpin_5s_linear_infinite] border-t-[#E4623F] border-r-[#E4623F]/30'
                  : 'rotate-180 border-b-[#5FC6E8]/60'
              }
            `}
          />

          {/* CROSSHAIR */}

          <span className="pointer-events-none absolute inset-0">
            <span
              className="
                absolute
                left-1/2
                top-0
                h-1.5
                w-px
                -translate-x-1/2
                bg-[#E4623F]/70
                transition-all
                duration-300
                group-hover:h-2
                group-hover:bg-[#E4623F]
              "
            />

            <span
              className="
                absolute
                bottom-0
                left-1/2
                h-1.5
                w-px
                -translate-x-1/2
                bg-[#E4623F]/70
                transition-all
                duration-300
                group-hover:h-2
                group-hover:bg-[#E4623F]
              "
            />

            <span
              className="
                absolute
                left-0
                top-1/2
                h-px
                w-1.5
                -translate-y-1/2
                bg-[#E4623F]/70
              "
            />

            <span
              className="
                absolute
                right-0
                top-1/2
                h-px
                w-1.5
                -translate-y-1/2
                bg-[#E4623F]/70
              "
            />
          </span>

          {/* CORE GLYPH */}

          <span
            className={`
              relative
              z-10
              flex
              h-4
              w-4
              items-center
              justify-center
              font-mono
              text-[8px]
              transition-all
              duration-500
              ${
                videoPlaying
                  ? 'text-[#E4623F] drop-shadow-[0_0_8px_rgba(228,98,63,0.8)]'
                  : 'text-[#5FC6E8] drop-shadow-[0_0_8px_rgba(95,198,232,0.8)]'
              }
            `}
          >
            {videoPlaying ? (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect
                  x="6"
                  y="5"
                  width="4"
                  height="14"
                  rx="0.5"
                />

                <rect
                  x="14"
                  y="5"
                  width="4"
                  height="14"
                  rx="0.5"
                />
              </svg>
            ) : (
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.3-6.86a1 1 0 0 0 0-1.66L9.53 4.29A1 1 0 0 0 8 5.14Z" />
              </svg>
            )}
          </span>

          {/* MICRO GLYPH */}

          <span
            className="
              pointer-events-none
              absolute
              -bottom-2
              left-1/2
              -translate-x-1/2
              font-mono
              text-[6px]
              tracking-widest
              text-ash/50
              transition-all
              duration-300
              group-hover:text-[#E4623F]
            "
          >
            識
          </span>

          {/* HOVER SCAN LINE */}

          <span
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-px
              w-0
              -translate-x-1/2
              bg-[#E4623F]
              opacity-0
              transition-all
              duration-500
              group-hover:w-7
              group-hover:opacity-60
            "
          />

          {/* TOOLTIP */}

          <span
            className="
              pointer-events-none
              absolute
              right-[calc(100%+10px)]
              top-1/2
              -translate-y-1/2
              translate-x-2
              whitespace-nowrap
              border
              border-bone/10
              bg-black/60
              px-2
              py-1
              font-mono
              text-[7px]
              tracking-[0.18em]
              text-bone/60
              opacity-0
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:translate-x-0
              group-hover:opacity-100
            "
          >
            {videoPlaying
              ? 'FREEZE // WORLD'
              : 'AWAKEN // WORLD'}
          </span>
        </button>

        {/* =====================================================
            MAIN HERO COPY
            ===================================================== */}

        <div
          className="
            relative
            z-30
            flex
            min-h-screen
            items-center
            px-6
            sm:px-10
            md:px-16
            lg:px-[10vw]
          "
        >
          <div
            className="
              hero-copy
              max-w-2xl
              transition-transform
              duration-700
              ease-out
            "
            style={{
              transform:
                'translate3d(calc(var(--mx-px) * -0.22), calc(var(--my-px) * -0.22), 0)',
            }}
          >
            {/* EYEBROW */}

            <div
              className="hero-enter flex items-center gap-3"
              style={{
                animationDelay: '300ms',
              }}
            >
              <span className="relative h-px w-12 overflow-hidden bg-[#E4623F]">
                <span className="absolute inset-0 animate-[heroScan_2.5s_ease-in-out_infinite] bg-white/80" />
              </span>

              <p className="hud-label text-xs tracking-[0.3em] text-ash sm:text-sm">
                WELCOME TO MY{' '}
                <span className="text-[#E4623F]">
                  PORTFOLIO
                </span>
              </p>
            </div>

            {/* NAME */}

            <h1
              className="
                hero-enter
                mt-5
                font-display
                text-5xl
                font-medium
                leading-[0.84]
                tracking-wide
                sm:text-7xl
                md:text-8xl
                lg:text-[7.5rem]
              "
              style={{
                animationDelay: '450ms',
              }}
            >
              <span className="block">
                {profile.name.split(' ')[0]}
              </span>

              <span
                className="
                  relative
                  block
                  text-[#E4623F]
                  drop-shadow-[0_0_30px_rgba(228,98,63,0.15)]
                "
              >
                {profile.name
                  .split(' ')
                  .slice(1)
                  .join(' ') || profile.name}
              </span>
            </h1>

            {/* ROLE */}

            <div
              className="
                hero-enter
                mt-7
                flex
                items-center
                gap-3
              "
              style={{
                animationDelay: '600ms',
              }}
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#E4623F] shadow-[0_0_15px_#E4623F]" />

              <span className="hud-label text-xs tracking-[0.25em] text-bone sm:text-sm">
                {profile.title.toUpperCase()}
              </span>

              <span className="flex h-6 w-6 items-center justify-center rounded border border-[#E4623F]/50 bg-[#E4623F]/10 text-[10px] text-[#E4623F]">
                識
              </span>
            </div>

            {/* STATEMENT */}

            <p
              className="
                hero-enter
                mt-6
                max-w-lg
                font-body
                text-base
                leading-relaxed
                text-bone-muted
                sm:text-lg
              "
              style={{
                animationDelay: '750ms',
              }}
            >
              {profile.heroLine}
            </p>

            {/* CTA */}

            <a
              href="#about"
              onPointerDown={() =>
                setPressed(true)
              }
              onPointerUp={() =>
                setPressed(false)
              }
              onPointerCancel={() =>
                setPressed(false)
              }
              className={`
                hero-enter
                group
                relative
                mt-8
                inline-flex
                items-center
                gap-5
                overflow-hidden
                border
                border-bone/25
                bg-black/20
                px-6
                py-4
                backdrop-blur-md
                transition-all
                duration-500
                hover:border-[#E4623F]/70
                hover:bg-[#E4623F]/10
                hover:shadow-[0_0_35px_rgba(228,98,63,0.12)]
                ${
                  pressed
                    ? 'scale-[0.96]'
                    : 'scale-100'
                }
              `}
              style={{
                animationDelay: '900ms',
              }}
            >
              <span className="absolute inset-y-0 left-0 w-px bg-[#E4623F] transition-all duration-500 group-hover:w-full group-hover:opacity-10" />

              <span className="relative hud-label text-xs tracking-[0.2em] sm:text-sm">
                EXPLORE MY WORLD
              </span>

              <span className="relative text-lg text-[#E4623F] transition-transform duration-500 group-hover:translate-x-2">
                →
              </span>
            </a>
          </div>
        </div>

        {/* =====================================================
            SOCIAL ORBIT
            ===================================================== */}

        <div
          className="
            absolute
            bottom-7
            left-6
            z-40
            flex
            items-center
            gap-3
            sm:left-10
          "
        >
          <span className="mr-1 hidden text-[8px] tracking-[0.25em] text-ash/70 sm:block">
            CONNECT
          </span>

          {socials.map(
            (social, index) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                onMouseEnter={() =>
                  setHoveredSocial(
                    social.label,
                  )
                }
                onMouseLeave={() =>
                  setHoveredSocial(null)
                }
                className="
                  social-orbit
                  group
                  relative
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-bone/20
                  bg-black/25
                  text-bone
                  backdrop-blur-md
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:scale-110
                  hover:border-[#E4623F]/70
                  hover:text-[#E4623F]
                  hover:shadow-[0_0_30px_rgba(228,98,63,0.18)]
                  active:scale-90
                "
                style={{
                  animationDelay: `${
                    index * 120 + 950
                  }ms`,
                }}
              >
                <span className="absolute inset-1 rounded-full border border-transparent transition-all duration-500 group-hover:rotate-180 group-hover:border-[#E4623F]/20" />

                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="relative transition-transform duration-500 group-hover:scale-110"
                >
                  <path d={social.path} />
                </svg>

                <span
                  className={`
                    pointer-events-none
                    absolute
                    -top-8
                    left-1/2
                    -translate-x-1/2
                    whitespace-nowrap
                    text-[8px]
                    tracking-[0.2em]
                    text-[#E4623F]
                    transition-all
                    duration-300
                    ${
                      hoveredSocial ===
                      social.label
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-2 opacity-0'
                    }
                  `}
                >
                  {social.label.toUpperCase()}
                </span>
              </a>
            ),
          )}
        </div>

        {/* =====================================================
            SCROLL PORTAL
            ===================================================== */}

        <a
          href="#about"
          className="
            absolute
            bottom-7
            left-1/2
            z-40
            hidden
            -translate-x-1/2
            flex-col
            items-center
            gap-3
            md:flex
          "
        >
          <span className="relative flex h-12 w-7 items-center justify-center rounded-full border border-bone/25 transition-all duration-500 hover:scale-110 hover:border-[#E4623F]/70">
            <span className="absolute h-1.5 w-1.5 animate-bounce rounded-full bg-[#E4623F] shadow-[0_0_12px_#E4623F]" />
          </span>

          <span className="hud-label flex items-center gap-2 text-[9px] tracking-[0.25em] text-ash transition-colors hover:text-bone">
            <span className="text-[#E4623F]">
              ◇
            </span>

            SCROLL TO DIVE

            <span className="text-[#E4623F]">
              ◇
            </span>
          </span>
        </a>
      </section>

      {/* =======================================================
          HERO ANIMATION SYSTEM
          ======================================================= */}

      <style jsx>{`
        @keyframes heroScan {
          0% {
            transform: translateX(-100%);
          }

          50%,
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes artifactPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.94);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes artifactSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes artifactSpinReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes hudWave {
          from {
            transform: scaleY(0.35);
            opacity: 0.35;
          }

          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes energyPulse {
          0%,
          100% {
            opacity: 0.55;
            transform: scaleX(0.92);
            transform-origin: left;
          }

          50% {
            opacity: 1;
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translateY(24px);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes socialReveal {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.75);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .hero-enter {
          opacity: 0;
          animation:
            heroReveal
            900ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .social-orbit {
          animation:
            socialReveal
            900ms
            cubic-bezier(0.16, 1, 0.3, 1)
            both;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-enter,
          .social-orbit {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}