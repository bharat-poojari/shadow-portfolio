'use client';

import { useCallback, useEffect, useState } from 'react';

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

/* ============================================================================
   FIRST VISIT PORTAL
   ========================================================================== */

const FIRST_VISIT_KEY = 'portfolio-first-visit-completed-v1';

const OLDER_PORTFOLIO_URL =
  'https://bharat-poojari-portfolio.vercel.app';

type DeviceType = 'desktop' | 'mobile';

type PortalData = {
  ip: string;
  device: DeviceType;
  browser: string;
  os: string;
};

function detectDevice(): DeviceType {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const userAgent = navigator.userAgent.toLowerCase();

  const mobilePattern =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;

  const isMobileUA = mobilePattern.test(userAgent);

  const isTablet =
    /ipad|tablet|playbook|silk/i.test(userAgent) ||
    (/android/i.test(userAgent) && !/mobile/i.test(userAgent));

  const hasTouch =
    'maxTouchPoints' in navigator &&
    navigator.maxTouchPoints > 1;

  /*
   * Touch support alone does NOT make a device mobile.
   * Many laptops have touch screens, so the UA/mobile viewport
   * signals are given priority.
   */
  if (isMobileUA || isTablet) {
    return 'mobile';
  }

  if (
    hasTouch &&
    Math.min(window.innerWidth, window.innerHeight) < 700
  ) {
    return 'mobile';
  }

  return 'desktop';
}

function detectBrowser(): string {
  if (typeof navigator === 'undefined') {
    return 'UNKNOWN';
  }

  const ua = navigator.userAgent;

  if (/edg/i.test(ua)) return 'EDGE';
  if (/opr|opera/i.test(ua)) return 'OPERA';
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) return 'CHROME';
  if (/firefox/i.test(ua)) return 'FIREFOX';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'SAFARI';

  return 'BROWSER';
}

function detectOS(): string {
  if (typeof navigator === 'undefined') {
    return 'UNKNOWN';
  }

  const ua = navigator.userAgent;

  if (/windows/i.test(ua)) return 'WINDOWS';
  if (/macintosh|mac os x/i.test(ua)) return 'MACOS';
  if (/android/i.test(ua)) return 'ANDROID';
  if (/iphone|ipad|ipod/i.test(ua)) return 'IOS';
  if (/linux/i.test(ua)) return 'LINUX';

  return 'UNKNOWN OS';
}

function FirstVisitPortal() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10);

  const [portalData, setPortalData] = useState<PortalData>({
    ip: 'SCANNING...',
    device: 'desktop',
    browser: 'SCANNING',
    os: 'SCANNING',
  });

  const completePortal = useCallback(() => {
    try {
      localStorage.setItem(FIRST_VISIT_KEY, 'true');
    } catch {
      /*
       * localStorage can be blocked in privacy/restricted
       * browser modes. The site should still continue.
       */
    }

    setProgress(100);
    setEntered(true);

    window.setTimeout(() => {
      setVisible(false);
    }, 500);
  }, []);

  useEffect(() => {
    let shouldShow = true;

    try {
      shouldShow =
        localStorage.getItem(FIRST_VISIT_KEY) !== 'true';
    } catch {
      /*
       * If localStorage is unavailable, show the portal for
       * this page load rather than failing the application.
       */
      shouldShow = true;
    }

    if (!shouldShow) {
      return;
    }

    setVisible(true);

    const device = detectDevice();

    setPortalData((current) => ({
      ...current,
      device,
      browser: detectBrowser(),
      os: detectOS(),
    }));

    let cancelled = false;

    /*
     * Fetch public IP without blocking the 3-second portal.
     * If the service fails, the UI simply shows unavailable.
     */
    const controller = new AbortController();

    const timeout = window.setTimeout(() => {
      controller.abort();
    }, 2500);

    fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('IP lookup failed');
        }

        return response.json() as Promise<{ ip?: string }>;
      })
      .then((data) => {
        if (cancelled) return;

        setPortalData((current) => ({
          ...current,
          ip: data.ip || 'UNAVAILABLE',
        }));
      })
      .catch(() => {
        if (cancelled) return;

        setPortalData((current) => ({
          ...current,
          ip: 'UNAVAILABLE',
        }));
      })
      .finally(() => {
        window.clearTimeout(timeout);
      });

    /*
     * Three-second portal sequence.
     *
     * Using requestAnimationFrame gives a smoother progress
     * animation than repeatedly changing the width with a
     * coarse interval.
     */
    const startTime = performance.now();
    const duration = 10000;

    let animationFrame = 0;

    const animate = (now: number) => {
      if (cancelled) return;

      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / duration, 1);

      setProgress(ratio * 100);

      const remaining = Math.max(
        0,
        Math.ceil((duration - elapsed) / 1000),
      );

      setSecondsLeft(remaining);

      if (ratio >= 1) {
        completePortal();
        return;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [completePortal]);

  if (!visible) {
    return null;
  }

  const isMobile = portalData.device === 'mobile';

  return (
    <div
      className={`
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-[#020305]
        transition-all
        duration-700
        ${entered ? 'pointer-events-none opacity-0' : 'opacity-100'}
      `}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio system initialization"
    >
      {/* ================================================================
          BACKGROUND SYSTEM GRID
          ================================================================ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.16]
          [background-image:linear-gradient(rgba(95,198,232,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(95,198,232,0.08)_1px,transparent_1px)]
          [background-size:42px_42px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#5fc6e8]/[0.035]
          blur-[100px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[20%]
          top-[15%]
          h-48
          w-48
          rounded-full
          bg-[#9b74ff]/[0.025]
          blur-[90px]
        "
      />

      {/* ================================================================
          SCANLINES
          ================================================================ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)]
          [background-size:100%_4px]
        "
      />

      {/* ================================================================
          TOP SYSTEM STATUS
          ================================================================ */}

      <div
        className="
          absolute
          left-5
          right-5
          top-5
          flex
          items-center
          justify-between
          sm:left-8
          sm:right-8
          sm:top-8
        "
      >
        <div className="flex items-center gap-3">
          <span
            className="
              h-2
              w-2
              animate-pulse
              rounded-full
              bg-[#5fc6e8]
              shadow-[0_0_14px_rgba(95,198,232,1)]
            "
          />

          <span
            className="
              font-mono
              text-[8px]
              font-semibold
              tracking-[0.28em]
              text-[#5fc6e8]/70
              sm:text-[9px]
            "
          >
            PORTFOLIO // SYSTEM INIT
          </span>
        </div>

        <div
          className="
            font-mono
            text-[7px]
            tracking-[0.2em]
            text-white/20
            sm:text-[8px]
          "
        >
          SECURE SESSION
        </div>
      </div>

      {/* ================================================================
          MAIN PORTAL
          ================================================================ */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-[720px]
          px-5
          sm:px-8
        "
      >
        {/* Portal frame */}

        <div
          className="
            relative
            overflow-hidden
            border
            border-[#5fc6e8]/20
            bg-[#05080d]/90
            shadow-[0_0_100px_rgba(0,0,0,0.65),0_0_50px_rgba(95,198,232,0.04)]
            backdrop-blur-xl
          "
        >
          {/* Corner brackets */}

          <span className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l border-t border-[#5fc6e8]/70" />
          <span className="pointer-events-none absolute right-0 top-0 h-5 w-5 border-r border-t border-[#5fc6e8]/70" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b border-l border-[#5fc6e8]/70" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b border-r border-[#5fc6e8]/70" />

          {/* Top bar */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-white/[0.06]
              bg-black/30
              px-4
              py-3
              sm:px-6
            "
          >
            <span
              className="
                font-mono
                text-[7px]
                tracking-[0.24em]
                text-white/25
              "
            >
              CONNECTION PROTOCOL
            </span>

            <span
              className="
                font-mono
                text-[7px]
                tracking-[0.2em]
                text-[#5fc6e8]/50
              "
            >
              {entered ? 'ENTERING' : 'ACTIVE'}
            </span>
          </div>

          <div className="px-5 py-8 sm:px-10 sm:py-12">
            {/* ============================================================
                PORTAL CORE
                ============================================================ */}

            <div className="mb-9 text-center">
              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  border
                  border-[#5fc6e8]/30
                  bg-[#5fc6e8]/[0.04]
                  shadow-[0_0_35px_rgba(95,198,232,0.08)]
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    border
                    border-[#5fc6e8]/20
                    font-mono
                    text-sm
                    font-bold
                    tracking-[-0.08em]
                    text-[#5fc6e8]
                  "
                >
                  BP
                </div>
              </div>

              <div
                className="
                  font-mono
                  text-[8px]
                  font-semibold
                  tracking-[0.4em]
                  text-[#5fc6e8]
                "
              >
                {isMobile
                  ? 'MOBILE BROWSER DETECTED'
                  : 'OPENING PORTAL'}
              </div>

              <h1
                className="
                  mt-3
                  font-display
                  text-3xl
                  font-bold
                  uppercase
                  tracking-[-0.04em]
                  text-white
                  sm:text-5xl
                "
              >
                {isMobile
                  ? 'DESKTOP RECOMMENDED'
                  : 'WELCOME TO THE VOID'}
              </h1>

              <p
                className="
                  mx-auto
                  mt-4
                  max-w-lg
                  font-mono
                  text-[9px]
                  leading-6
                  tracking-[0.12em]
                  text-white/30
                  sm:text-[10px]
                "
              >
                {isMobile
                  ? 'This portfolio is optimized for a larger display. For the complete visual experience, a desktop or laptop browser is recommended.'
                  : 'Synchronizing interface layers. Establishing secure session. Preparing portfolio environment.'}
              </p>
            </div>

            {/* ============================================================
                SCAN TERMINAL
                ============================================================ */}

            <div
              className="
                overflow-hidden
                border
                border-white/[0.07]
                bg-black/30
              "
            >
              <div
                className="
                  border-b
                  border-white/[0.06]
                  px-4
                  py-2.5
                  font-mono
                  text-[7px]
                  tracking-[0.22em]
                  text-white/25
                "
              >
                USER ENVIRONMENT SCAN
              </div>

              <div className="grid sm:grid-cols-3">
                {/* IP */}

                <div
                  className="
                    border-b
                    border-white/[0.06]
                    px-4
                    py-4
                    sm:border-b-0
                    sm:border-r
                  "
                >
                  <div
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-white/20
                    "
                  >
                    PUBLIC IP
                  </div>

                  <div
                    className="
                      mt-2
                      break-all
                      font-mono
                      text-[10px]
                      tracking-[0.08em]
                      text-[#5fc6e8]/80
                    "
                  >
                    {portalData.ip}
                  </div>
                </div>

                {/* Device */}

                <div
                  className="
                    border-b
                    border-white/[0.06]
                    px-4
                    py-4
                    sm:border-b-0
                    sm:border-r
                  "
                >
                  <div
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-white/20
                    "
                  >
                    DEVICE
                  </div>

                  <div
                    className="
                      mt-2
                      font-mono
                      text-[10px]
                      tracking-[0.08em]
                      text-white/65
                    "
                  >
                    {portalData.device.toUpperCase()}
                  </div>
                </div>

                {/* Browser */}

                <div className="px-4 py-4">
                  <div
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-white/20
                    "
                  >
                    BROWSER
                  </div>

                  <div
                    className="
                      mt-2
                      font-mono
                      text-[10px]
                      tracking-[0.08em]
                      text-white/65
                    "
                  >
                    {portalData.browser}
                  </div>
                </div>
              </div>

              {/* OS line */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/[0.06]
                  px-4
                  py-2.5
                "
              >
                <span
                  className="
                    font-mono
                    text-[7px]
                    tracking-[0.2em]
                    text-white/20
                  "
                >
                  OPERATING SYSTEM
                </span>

                <span
                  className="
                    font-mono
                    text-[7px]
                    tracking-[0.18em]
                    text-white/40
                  "
                >
                  {portalData.os}
                </span>
              </div>
            </div>

            {/* ============================================================
                MOBILE WARNING
                ============================================================ */}

            {isMobile && (
              <div
                className="
                  mt-4
                  flex
                  items-start
                  gap-3
                  border
                  border-[#f5d76e]/15
                  bg-[#f5d76e]/[0.025]
                  px-4
                  py-3
                "
              >
                <span
                  className="
                    mt-0.5
                    font-mono
                    text-[10px]
                    text-[#f5d76e]
                  "
                >
                  !
                </span>

                <div>
                  <div
                    className="
                      font-mono
                      text-[7px]
                      font-semibold
                      tracking-[0.18em]
                      text-[#f5d76e]/80
                    "
                  >
                    DISPLAY RECOMMENDATION
                  </div>

                  <p
                    className="
                      mt-1.5
                      font-mono
                      text-[8px]
                      leading-5
                      text-white/30
                    "
                  >
                    Desktop or laptop browser recommended for
                    animations, interactive sections and the full
                    portfolio experience.
                  </p>
                </div>
              </div>
            )}

            {/* ============================================================
                COUNTDOWN
                ============================================================ */}

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="
                    font-mono
                    text-[7px]
                    tracking-[0.2em]
                    text-white/20
                  "
                >
                  {isMobile
                    ? 'CONTINUING IN'
                    : 'PORTAL OPENING'}
                </span>

                <span
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.15em]
                    text-[#5fc6e8]/60
                  "
                >
                  {secondsLeft > 0
                    ? `0${secondsLeft}`
                    : '00'}
                  {' '}SEC
                </span>
              </div>

              <div
                className="
                  h-[2px]
                  w-full
                  overflow-hidden
                  bg-white/[0.06]
                "
              >
                <div
                  className="
                    h-full
                    origin-left
                    bg-[#5fc6e8]
                    shadow-[0_0_12px_rgba(95,198,232,0.9)]
                    transition-[width]
                    duration-75
                    ease-linear
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {/* ============================================================
                OLD PORTFOLIO
                ============================================================ */}

            <div className="mt-7 text-center">
              <a
                href={OLDER_PORTFOLIO_URL}
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  border
                  border-white/[0.09]
                  bg-white/[0.025]
                  px-5
                  py-3
                  font-mono
                  text-[8px]
                  font-semibold
                  tracking-[0.18em]
                  text-white/45
                  transition-all
                  duration-300
                  hover:border-[#5fc6e8]/30
                  hover:bg-[#5fc6e8]/[0.05]
                  hover:text-[#5fc6e8]
                "
              >
                <span>OLDER PORTFOLIO</span>

                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </a>

              <div
                className="
                  mt-3
                  font-mono
                  text-[7px]
                  tracking-[0.16em]
                  text-white/15
                "
              >
                {isMobile
                  ? 'OPEN PREVIOUS VERSION'
                  : 'ALTERNATE SYSTEM INSTANCE'}
              </div>
            </div>
          </div>

          {/* ================================================================
              BOTTOM SYSTEM BAR
              ================================================================ */}

          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-white/[0.06]
              bg-black/30
              px-4
              py-3
              sm:px-6
            "
          >
            <span
              className="
                font-mono
                text-[7px]
                tracking-[0.18em]
                text-white/15
              "
            >
              SESSION // INITIALIZING
            </span>

            <span
              className="
                font-mono
                text-[7px]
                tracking-[0.18em]
                text-[#5fc6e8]/35
              "
            >
              {progress >= 100 ? 'READY' : 'SCANNING'}
            </span>
          </div>
        </div>

        {/* External system label */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-3
            font-mono
            text-[7px]
            tracking-[0.2em]
            text-white/15
          "
        >
          <span className="h-px w-8 bg-white/[0.08]" />
          PORTFOLIO SYSTEM
          <span className="h-px w-8 bg-white/[0.08]" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   HOME
   ========================================================================== */

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
 * Fun Zone / Optional Instances
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

      {/* ================================================================
          FIRST-VISIT SYSTEM PORTAL
          ================================================================ */}

      <FirstVisitPortal />

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