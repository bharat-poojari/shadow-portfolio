'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from '@/lib/useReducedMotion';

/* =========================================================
   PUBLIC HANDLE
   ========================================================= */

export type HeroCanvasHandle = {
  toggleVideo: () => boolean;
  pauseVideo: () => void;
  playVideo: () => void;
};

/* =========================================================
   PROPS
   ========================================================= */

type HeroCanvasProps = {
  muted?: boolean;
  onPlayingChange?: (playing: boolean) => void;
};

/* =========================================================
   TYPES
   ========================================================= */

type Shot = {
  id: number;
};

/* =========================================================
   CONSTANTS
   ========================================================= */

const LONG_PRESS_DELAY = 360;
const AUTO_FIRE_INTERVAL = 560;

/*
 * The reticle is deliberately positioned toward the right side
 * of the composition. This makes it read as the castle/demon
 * target rather than a generic centered cursor.
 */
const TARGET_X = 67;
const TARGET_Y = 43;

/*
 * Cannon origin.
 *
 * This represents the hero's attack direction:
 *
 *       HERO / CANNON
 *             \
 *              \
 *               ---> DEMON CASTLE
 */
const CANNON_X = 25;
const CANNON_Y = 72;

/* =========================================================
   COMPONENT
   ========================================================= */

export const HeroCanvas = forwardRef<
  HeroCanvasHandle,
  HeroCanvasProps
>(function HeroCanvas(
  {
    muted = true,
    onPlayingChange,
  },
  ref
) {
  const reduced = useReducedMotion();

  const videoRef = useRef<HTMLVideoElement>(null);

  /* =======================================================
     VIDEO CONTROL
     ======================================================= */

  useImperativeHandle(
    ref,
    () => ({
      toggleVideo() {
        const video = videoRef.current;

        if (!video) return false;

        if (video.paused) {
          void video.play();
          onPlayingChange?.(true);
          return true;
        }

        video.pause();
        onPlayingChange?.(false);

        return false;
      },

      pauseVideo() {
        const video = videoRef.current;

        if (!video) return;

        video.pause();
        onPlayingChange?.(false);
      },

      playVideo() {
        const video = videoRef.current;

        if (!video) return;

        void video.play();
        onPlayingChange?.(true);
      },
    }),
    [onPlayingChange]
  );

  /* =======================================================
     WEAPON STATE
     ======================================================= */

  const [armed, setArmed] = useState(false);
  const [charging, setCharging] = useState(false);
  const [firing, setFiring] = useState(false);
  const [impact, setImpact] = useState(false);

  const [shots, setShots] = useState<Shot[]>([]);

  const [chargeProgress, setChargeProgress] = useState(0);

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const fireIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const chargeRafRef = useRef<number | null>(null);

  const pointerDownRef = useRef(false);

  const shotIdRef = useRef(0);

  /* =======================================================
     CLEANUP
     ======================================================= */

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }

      if (fireIntervalRef.current) {
        clearInterval(fireIntervalRef.current);
      }

      if (chargeRafRef.current) {
        cancelAnimationFrame(chargeRafRef.current);
      }
    };
  }, []);

  /* =======================================================
     FIRE SOUND
     
     Generated locally with Web Audio.
     No external audio file required.
     ======================================================= */

  const playFireSound = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) return;

      const context = new AudioContextClass();

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = 'sawtooth';

      oscillator.frequency.setValueAtTime(
        95,
        context.currentTime
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        38,
        context.currentTime + 0.18
      );

      gain.gain.setValueAtTime(
        0.0001,
        context.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.12,
        context.currentTime + 0.015
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.2
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();

      oscillator.stop(context.currentTime + 0.21);

      window.setTimeout(() => {
        void context.close();
      }, 300);
    } catch {
      /*
       * Audio is purely additive.
       * Failing to create it must never break firing.
       */
    }
  }, []);

  /* =======================================================
     IMPACT
     ======================================================= */

  const triggerImpact = useCallback(() => {
    setImpact(true);

    window.setTimeout(() => {
      setImpact(false);
    }, 380);
  }, []);

  /* =======================================================
     FIRE ONE CANNON SHOT
     ======================================================= */

  const fireShot = useCallback(() => {
    if (reduced) return;

    const id = shotIdRef.current++;

    setArmed(true);
    setFiring(true);

    setShots((current) => [
      ...current.slice(-2),
      {
        id,
      },
    ]);

    playFireSound();

    /*
     * The projectile animation is CSS driven.
     * Impact is deliberately delayed to approximately match
     * the visual travel from hero → target.
     */
    window.setTimeout(() => {
      triggerImpact();
    }, 420);

    /*
     * Remove completed projectile.
     */
    window.setTimeout(() => {
      setShots((current) =>
        current.filter((shot) => shot.id !== id)
      );
    }, 700);

    /*
     * Let the firing state breathe between shots.
     */
    window.setTimeout(() => {
      setFiring(false);
    }, 220);
  }, [
    playFireSound,
    reduced,
    triggerImpact,
  ]);

  /* =======================================================
     START CHARGE
     ======================================================= */

  const startCharge = useCallback(() => {
    pointerDownRef.current = true;

    setArmed(true);
    setCharging(false);
    setChargeProgress(0);

    /*
     * First distinguish a normal click from a long press.
     */
    pressTimerRef.current = setTimeout(() => {
      if (!pointerDownRef.current) return;

      setCharging(true);

      const startedAt = performance.now();

      const updateCharge = (now: number) => {
        if (!pointerDownRef.current) return;

        const elapsed =
          now - startedAt;

        const progress = Math.min(
          elapsed / 900,
          1
        );

        setChargeProgress(progress);

        if (progress < 1) {
          chargeRafRef.current =
            requestAnimationFrame(updateCharge);
        }
      };

      chargeRafRef.current =
        requestAnimationFrame(updateCharge);

      /*
       * First charged shot.
       */
      fireShot();

      /*
       * Then continue firing while held.
       */
      fireIntervalRef.current =
        setInterval(() => {
          if (!pointerDownRef.current) return;

          fireShot();
        }, AUTO_FIRE_INTERVAL);
    }, LONG_PRESS_DELAY);
  }, [fireShot]);

  /* =======================================================
     END CHARGE / CLICK
     ======================================================= */

  const stopCharge = useCallback(() => {
    const wasCharging = charging;

    pointerDownRef.current = false;

    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    if (fireIntervalRef.current) {
      clearInterval(fireIntervalRef.current);
      fireIntervalRef.current = null;
    }

    if (chargeRafRef.current) {
      cancelAnimationFrame(chargeRafRef.current);
      chargeRafRef.current = null;
    }

    /*
     * Normal click:
     *
     * If the long-press timer never activated,
     * this is a single cannon shot.
     */
    if (!wasCharging) {
      fireShot();
    }

    setCharging(false);
    setChargeProgress(0);

    window.setTimeout(() => {
      setArmed(false);
    }, 500);
  }, [charging, fireShot]);

  /* =======================================================
     REDUCED MOTION
     ======================================================= */

  if (reduced) {
    return (
      <div
        className="absolute inset-0"
        aria-hidden
      />
    );
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      className={`
        absolute
        inset-0
        overflow-hidden
        bg-black
        ${
          impact
            ? 'hero-cannon-impact'
            : ''
        }
      `}
      aria-hidden={false}
    >
      {/* ===================================================
          BACKGROUND VIDEO
          =================================================== */}

      <video
        ref={videoRef}
        className="
          absolute
          inset-0
          z-0
          h-full
          w-full
          object-cover
          scale-[1.015]
          contrast-[1.08]
          saturate-[1.1]
          brightness-[0.96]
          transition-[filter,transform]
          duration-[1400ms]
          ease-[cubic-bezier(0.16,1,0.3,1)]
        "
        src="/bg.mp4"
        autoPlay
        loop
        muted={muted}
        playsInline
        preload="auto"
        onPlay={() => onPlayingChange?.(true)}
        onPause={() => onPlayingChange?.(false)}
      />

      {/* ===================================================
          CINEMATIC DEPTH
          =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-gradient-to-b
          from-black/10
          via-transparent
          to-black/25
        "
      />

      {/* LEFT SHADOW */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-[2]
          w-[65%]
          bg-gradient-to-r
          from-black/35
          via-black/10
          to-transparent
        "
      />

      {/* ===================================================
          ANIME SCAN
          =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[3]
          opacity-[0.045]
          [background:repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(255,255,255,0.18)_4px)]
        "
      />

      {/* ===================================================
          WEBGL ATMOSPHERE

          IMPORTANT:
          pointer-events-none prevents Canvas from blocking
          the weapon target interaction layer.
          =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
        "
      >
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 50,
          }}
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <ambientLight intensity={0.3} />
        </Canvas>
      </div>

      {/* ===================================================
          CANNON SYSTEM
          =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[20]
        "
      >
        {/* ===============================================
            CANNON ORIGIN
            =============================================== */}

        <div
          className={`
            cannon-origin
            ${
              firing
                ? 'cannon-origin-fire'
                : ''
            }
          `}
        >
          <span className="cannon-origin-core" />
          <span className="cannon-origin-ring cannon-origin-ring-a" />
          <span className="cannon-origin-ring cannon-origin-ring-b" />

          {firing && (
            <>
              <span className="cannon-muzzle muzzle-a" />
              <span className="cannon-muzzle muzzle-b" />
              <span className="cannon-muzzle muzzle-c" />
            </>
          )}
        </div>

        {/* ===============================================
            PROJECTILES
            =============================================== */}

        {shots.map((shot) => (
          <span
            key={shot.id}
            className="cannon-projectile"
          >
            <span className="cannon-projectile-core" />
          </span>
        ))}

        {/* ===============================================
            TARGET IMPACT
            =============================================== */}

        <div
          className={`
            cannon-impact
            ${
              impact
                ? 'cannon-impact-active'
                : ''
            }
          `}
        >
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Invisible firing interaction zone. The visual aim marker is removed. */}
      <button
        type="button"
        aria-label={charging ? 'Charging cannon' : 'Fire cannon at target'}
        className="cannon-fire-zone"
        style={{ left: `${TARGET_X}%`, top: `${TARGET_Y}%` }}
        onPointerDown={(event) => {
          event.preventDefault();
          try { event.currentTarget.setPointerCapture(event.pointerId); } catch {}
          startCharge();
        }}
        onPointerUp={(event) => {
          event.preventDefault();
          try {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          } catch {}
          stopCharge();
        }}
        onPointerCancel={stopCharge}
        onContextMenu={(event) => event.preventDefault()}
      />

      {/* ===================================================
          CHARGE HUD
          =================================================== */}

      <div
        className={`
          cannon-charge-hud
          ${
            charging
              ? 'cannon-charge-hud-visible'
              : ''
          }
        `}
        style={{
          left: `${TARGET_X}%`,
          top: `calc(${TARGET_Y}% + 58px)`,
        }}
      >
        <span>SPIRIT CANNON</span>

        <div>
          <i
            style={{
              width: `${Math.max(
                chargeProgress * 100,
                4
              )}%`,
            }}
          />
        </div>

        <small>
          HOLD TO CONTINUE FIRE
        </small>
      </div>

      {/* ===================================================
          IMPACT FLASH
          =================================================== */}

      <div
        className={`
          cannon-screen-flash
          ${
            impact
              ? 'cannon-screen-flash-active'
              : ''
          }
        `}
      />

      {/* ===================================================
          VIGNETTE
          =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[40]
          bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.22)_100%)]
        "
      />

      {/* ===================================================
          COMPONENT STYLES
          =================================================== */}

      <style jsx>{`
        /* ===================================================
           CANNON ORIGIN
           =================================================== */

        .cannon-origin {
          position: absolute;

          left: ${CANNON_X}%;
          top: ${CANNON_Y}%;

          width: 20px;
          height: 20px;

          transform:
            translate(-50%, -50%);

          border:
            1px solid
            rgba(228, 98, 63, 0.35);

          border-radius: 50%;

          background:
            rgba(0, 0, 0, 0.25);

          box-shadow:
            0 0 20px
              rgba(228, 98, 63, 0.1);

          transition:
            transform 350ms
              cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 350ms ease;
        }

        .cannon-origin-fire {
          transform:
            translate(-50%, -50%)
            scale(1.5);

          box-shadow:
            0 0 45px
              rgba(228, 98, 63, 0.55);
        }

        .cannon-origin-core {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 6px;
          height: 6px;

          transform:
            translate(-50%, -50%);

          border-radius: 50%;

          background:
            #e4623f;

          box-shadow:
            0 0 15px
              #e4623f;
        }

        .cannon-origin-ring {
          position: absolute;

          inset: 3px;

          border:
            1px dashed
            rgba(228, 98, 63, 0.45);

          border-radius: 50%;
        }

        .cannon-origin-ring-a {
          animation:
            cannonSpin 4s
            linear infinite;
        }

        .cannon-origin-ring-b {
          inset: -3px;

          border-color:
            rgba(95, 198, 232, 0.25);

          animation:
            cannonSpinReverse 6s
            linear infinite;
        }

        /* ===================================================
           MUZZLE
           =================================================== */

        .cannon-muzzle {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 5px;
          height: 26px;

          transform-origin:
            center bottom;

          border-radius: 999px;

          background:
            linear-gradient(
              to top,
              transparent,
              #e4623f,
              #fff
            );

          filter:
            blur(1px);

          opacity: 0;

          animation:
            muzzleBlast 220ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .muzzle-a {
          transform:
            translate(-50%, -50%)
            rotate(-20deg);
        }

        .muzzle-b {
          transform:
            translate(-50%, -50%)
            rotate(0deg);
        }

        .muzzle-c {
          transform:
            translate(-50%, -50%)
            rotate(20deg);
        }

        /* ===================================================
           PROJECTILE
           =================================================== */

        .cannon-projectile {
          position: absolute;

          left: ${CANNON_X}%;

          top: ${CANNON_Y}%;

          width: 120px;
          height: 3px;

          transform-origin: left center;

          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              #fff,
              #e4623f 18%,
              rgba(228, 98, 63, 0.55),
              transparent
            );

          box-shadow:
            0 0 12px
              rgba(228, 98, 63, 0.8),
            0 0 30px
              rgba(95, 198, 232, 0.3);

          animation:
            cannonProjectile
            560ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .cannon-projectile-core {
          position: absolute;

          right: 0;
          top: 50%;

          width: 8px;
          height: 8px;

          transform:
            translate(50%, -50%);

          border-radius: 50%;

          background:
            #fff;

          box-shadow:
            0 0 8px #fff,
            0 0 18px #e4623f,
            0 0 35px #e4623f;
        }

        .cannon-fire-zone {
          position: absolute;
          width: 96px;
          height: 96px;
          transform: translate(-50%, -50%);
          padding: 0;
          border: 0;
          background: transparent;
          cursor: default;
          touch-action: none;
          user-select: none;
          outline: none;
          opacity: 0;
        }

        /* ===================================================
           CHARGE
           =================================================== */

        .target-charge {
          position: absolute;

          inset: -3px;

          border:
            2px solid
            transparent;

          border-top-color:
            #9585f5;

          border-right-color:
            #5fc6e8;

          border-radius: 50%;

          transform:
            rotate(-45deg);

          opacity: 0;

          transition:
            opacity 180ms ease;
        }

        .cannon-target-charging
          .target-charge {
          opacity: 1;

          animation:
            chargeRotate 900ms
            linear infinite;
        }

        /* ===================================================
           TARGET LABEL
           =================================================== */

        .target-label {
          position: absolute;

          left: 50%;

          top: calc(100% + 8px);

          transform:
            translateX(-50%);

          display: flex;

          flex-direction: column;

          align-items: center;

          white-space: nowrap;

          opacity: 0.5;

          transition:
            opacity 300ms ease,
            transform 300ms ease;
        }

        .cannon-target:hover
          .target-label,
        .cannon-target-armed
          .target-label {
          opacity: 1;

          transform:
            translateX(-50%)
            translateY(2px);
        }

        .target-label strong {
          font-family: monospace;

          font-size: 7px;

          font-weight: 600;

          letter-spacing:
            0.22em;

          color:
            #e4623f;
        }

        .target-label small {
          margin-top: 3px;

          font-family: monospace;

          font-size: 5px;

          letter-spacing:
            0.14em;

          color:
            rgba(255, 255, 255, 0.45);
        }

        /* ===================================================
           CHARGE HUD
           =================================================== */

        .cannon-charge-hud {
          position: absolute;

          transform:
            translateX(-50%);

          width: 125px;

          opacity: 0;

          pointer-events: none;

          transition:
            opacity 250ms ease,
            transform 350ms
              cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cannon-charge-hud-visible {
          opacity: 1;

          transform:
            translateX(-50%)
            translateY(5px);
        }

        .cannon-charge-hud > span {
          display: block;

          font-family: monospace;

          font-size: 6px;

          letter-spacing:
            0.2em;

          color:
            rgba(149, 133, 245, 0.8);

          text-align: center;
        }

        .cannon-charge-hud > div {
          height: 2px;

          margin-top: 5px;

          overflow: hidden;

          background:
            rgba(255, 255, 255, 0.08);
        }

        .cannon-charge-hud > div i {
          display: block;

          height: 100%;

          background:
            linear-gradient(
              90deg,
              #9585f5,
              #5fc6e8,
              #e4623f
            );

          box-shadow:
            0 0 10px
              rgba(95, 198, 232, 0.7);

          transition:
            width 80ms linear;
        }

        .cannon-charge-hud small {
          display: block;

          margin-top: 4px;

          font-family: monospace;

          font-size: 5px;

          letter-spacing:
            0.12em;

          color:
            rgba(255, 255, 255, 0.3);

          text-align: center;
        }

        /* ===================================================
           IMPACT
           =================================================== */

        .cannon-impact {
          position: absolute;

          left: ${TARGET_X}%;

          top: ${TARGET_Y}%;

          width: 20px;
          height: 20px;

          transform:
            translate(-50%, -50%)
            scale(0);

          opacity: 0;

          pointer-events: none;
        }

        .cannon-impact-active {
          animation:
            impactBurst 380ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .cannon-impact span {
          position: absolute;

          inset: 0;

          border:
            1px solid
            #e4623f;

          border-radius: 50%;
        }

        .cannon-impact span:nth-child(1) {
          animation:
            impactRing 380ms ease-out
            forwards;
        }

        .cannon-impact span:nth-child(2) {
          animation:
            impactRing 300ms
            50ms
            ease-out
            forwards;
        }

        .cannon-impact span:nth-child(3) {
          border-color:
            #5fc6e8;

          animation:
            impactRing 450ms
            20ms
            ease-out
            forwards;
        }

        /* ===================================================
           SCREEN FLASH
           =================================================== */

        .cannon-screen-flash {
          position: absolute;

          inset: 0;

          z-index: 35;

          pointer-events: none;

          background:
            radial-gradient(
              circle at
                ${TARGET_X}% ${TARGET_Y}%,
              rgba(255, 255, 255, 0.18),
              rgba(228, 98, 63, 0.06)
                20%,
              transparent 48%
            );

          opacity: 0;
        }

        .cannon-screen-flash-active {
          animation:
            screenFlash 260ms
            ease-out
            forwards;
        }

        /* ===================================================
           SCREEN IMPACT
           =================================================== */

        .hero-cannon-impact {
          animation:
            heroImpact 220ms
            cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ===================================================
           KEYFRAMES
           =================================================== */

        @keyframes cannonSpin {
          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }
        }

        @keyframes cannonSpinReverse {
          from {
            transform:
              rotate(360deg);
          }

          to {
            transform:
              rotate(0deg);
          }
        }

        @keyframes targetSpin {
          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }
        }

        @keyframes targetSpinReverse {
          from {
            transform:
              rotate(360deg);
          }

          to {
            transform:
              rotate(0deg);
          }
        }

        @keyframes targetPulse {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              scale(0.8);

            opacity: 0.55;
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.25);

            opacity: 1;
          }
        }

        @keyframes chargeRotate {
          from {
            transform:
              rotate(-45deg);
          }

          to {
            transform:
              rotate(315deg);
          }
        }

        @keyframes muzzleBlast {
          0% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              scaleY(0.2);
          }

          25% {
            opacity: 1;
          }

          100% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              scaleY(1.8);
          }
        }

        @keyframes cannonProjectile {
          0% {
            opacity: 0;

            width: 20px;

            transform:
              translate(0, 0)
              rotate(
                0deg
              );
          }

          8% {
            opacity: 1;
          }

          100% {
            opacity: 0;

            width: 58%;

            transform:
              translate(
                0,
                calc(
                  (${TARGET_Y} - ${CANNON_Y}) * 1%
                )
              );
          }
        }

        @keyframes impactBurst {
          0% {
            opacity: 1;

            transform:
              translate(-50%, -50%)
              scale(0.15);
          }

          100% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              scale(1.4);
          }
        }

        @keyframes impactRing {
          from {
            opacity: 0.9;

            transform:
              scale(0.2);
          }

          to {
            opacity: 0;

            transform:
              scale(4);
          }
        }

        @keyframes targetHit {
          0% {
            transform:
              translate(-50%, -50%)
              scale(1);
          }

          20% {
            transform:
              translate(
                calc(-50% - 5px),
                calc(-50% + 2px)
              )
              scale(1.2);
          }

          40% {
            transform:
              translate(
                calc(-50% + 4px),
                calc(-50% - 2px)
              )
              scale(0.95);
          }

          60% {
            transform:
              translate(
                calc(-50% - 2px),
                calc(-50% + 1px)
              )
              scale(1.08);
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(1);
          }
        }

        @keyframes screenFlash {
          0% {
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes heroImpact {
          0%,
          100% {
            transform:
              translate3d(0, 0, 0);
          }

          25% {
            transform:
              translate3d(-3px, 1px, 0);
          }

          50% {
            transform:
              translate3d(3px, -1px, 0);
          }

          75% {
            transform:
              translate3d(-1px, 0, 0);
          }
        }

        /* ===================================================
           REDUCED MOTION
           =================================================== */

        @media (prefers-reduced-motion: reduce) {
          .cannon-target,
          .cannon-origin,
          .target-ring,
          .target-core span,
          .cannon-projectile,
          .cannon-impact,
          .cannon-screen-flash,
          .hero-cannon-impact {
            animation: none !important;
            transition: none !important;
          }

          .cannon-projectile {
            display: none;
          }
        }

        /* ===================================================
           SMALL SCREENS
           =================================================== */

        @media (max-width: 767px) {
          .cannon-target {
            width: 64px;
            height: 64px;
          }

          .target-label {
            top: calc(100% + 6px);
          }

          .cannon-charge-hud {
            width: 105px;
          }

          .cannon-origin {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
});

HeroCanvas.displayName = 'HeroCanvas';