'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ShadowHunterGame } from '../game/ShadowHunterGame';
import NeonResonanceGame from '@/components/game/NeonResonanceGame';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type GameStatus =
  | 'AVAILABLE'
  | 'COMING SOON'
  | 'LOCKED';

type GameRank =
  | 'E'
  | 'D'
  | 'C'
  | 'B'
  | 'A'
  | 'S';

type GameId =
  | 'shadow-hunter'
  | 'neon-resonance';

type GameEntry = {
  id: GameId;
  title: string;
  subtitle: string;
  description: string;
  status: GameStatus;
  rank: GameRank;
  genre: string;
  mode: string;
  difficulty: string;
  accent: string;
  secondaryAccent: string;
  version: string;
  tags: string[];
  controls: string[];
};

/* -------------------------------------------------------------------------- */
/* Game Registry                                                              */
/* -------------------------------------------------------------------------- */

const GAMES: GameEntry[] = [
  {
    id: 'shadow-hunter',

    title: 'SHADOW HUNTER',

    subtitle:
      'DIMENSIONAL COMBAT SIMULATION',

    description:
      'Enter a hostile shadow dimension, eliminate escalating enemy waves, unlock abilities, defeat elite entities and survive long enough to challenge The Hollow.',

    status: 'AVAILABLE',

    rank: 'S',

    genre:
      'ACTION / SURVIVAL',

    mode:
      'SOLO INSTANCE',

    difficulty:
      'DYNAMIC',

    accent:
      '#5fc6e8',

    secondaryAccent:
      '#9b74ff',

    version:
      'v1.0.0',

    tags: [
      'COMBAT',
      'WAVES',
      'ABILITIES',
      'BOSS',
      'UPGRADES',
      'ACHIEVEMENTS',
    ],

    controls: [
      'WASD / ARROWS',
      'MOUSE AIM',
      'SPACE DASH',
      'Q / E / R ABILITIES',
    ],
  },
  {
    id: 'neon-resonance',

    title: 'NEON RESONANCE',

    subtitle:
      'ASTRAL RHYTHM PERFORMANCE',

    description:
      'Synchronize with an anime astral performer, strike falling resonance notes with precise timing, build your combo, trigger Fever and chase an S-rank performance.',

    status: 'AVAILABLE',

    rank: 'S',

    genre:
      'RHYTHM / REFLEX',

    mode:
      'SOLO PERFORMANCE',

    difficulty:
      'NOVICE → VIRTUOSO',

    accent:
      '#62e6ff',

    secondaryAccent:
      '#ff62c7',

    version:
      'v1.0.0',

    tags: [
      'RHYTHM',
      'COMBO',
      'FEVER',
      'ACCURACY',
      'RANKING',
      'PROCEDURAL',
    ],

    controls: [
      'A / S / K / L',
      'MOUSE / TOUCH LANES',
      'SPACE FEVER',
      'ESC / P PAUSE',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Decorative System Helpers                                                  */
/* -------------------------------------------------------------------------- */

function CornerFrame({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative
        ${className}
      `}
    >
      {/* top-left */}
      <span
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-3
          w-3
          border-l
          border-t
          border-[#5fc6e8]/55
        "
      />

      {/* top-right */}
      <span
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-3
          w-3
          border-r
          border-t
          border-[#5fc6e8]/55
        "
      />

      {/* bottom-left */}
      <span
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-3
          w-3
          border-b
          border-l
          border-[#5fc6e8]/55
        "
      />

      {/* bottom-right */}
      <span
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          h-3
          w-3
          border-b
          border-r
          border-[#5fc6e8]/55
        "
      />

      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shadow Hunter Illustration                                                  */
/* -------------------------------------------------------------------------- */

function ShadowHunterIllustration({
  active,
}: {
  active: boolean;
}) {
  return (
    <div
      className="
        relative
        h-full
        min-h-[280px]
        overflow-hidden
        bg-[#05070b]
      "
    >
      {/* Atmospheric glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-64
          w-64
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#5fc6e8]/8
          blur-3xl
        "
      />

      <div
        className="
          absolute
          left-[55%]
          top-[35%]
          h-40
          w-40
          rounded-full
          bg-[#9b74ff]/8
          blur-3xl
        "
      />

      {/* Grid */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.13]
          [background-image:linear-gradient(rgba(95,198,232,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(95,198,232,0.18)_1px,transparent_1px)]
          [background-size:32px_32px]
        "
      />

      {/* Scanline */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-[#5fc6e8]/30
          shadow-[0_0_12px_rgba(95,198,232,0.45)]
          animate-[scan_4s_linear_infinite]
        "
      />

      {/* Dimension coordinates */}

      <div
        className="
          absolute
          left-4
          top-4
          font-mono
          text-[8px]
          tracking-[0.22em]
          text-[#5fc6e8]/45
        "
      >
        DIMENSION // 07
      </div>

      <div
        className="
          absolute
          right-4
          top-4
          font-mono
          text-[8px]
          tracking-[0.18em]
          text-[#5fc6e8]/45
        "
      >
        INSTANCE: ACTIVE
      </div>

      {/* Character */}

      <div
        className={`
          absolute
          left-1/2
          top-1/2
          h-52
          w-40
          -translate-x-1/2
          -translate-y-[45%]
          transition-all
          duration-700
          ${
            active
              ? 'scale-105'
              : 'scale-100'
          }
        `}
      >
        {/* aura */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-40
            w-40
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-[#5fc6e8]/15
            shadow-[0_0_80px_rgba(95,198,232,0.12)]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-32
            w-32
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-dashed
            border-[#9b74ff]/20
            animate-[spin_18s_linear_infinite]
          "
        />

        {/* cloak */}

        <div
          className="
            absolute
            left-1/2
            top-[30%]
            h-36
            w-28
            -translate-x-1/2
            rounded-[45%_45%_18%_18%]
            border
            border-[#313946]
            bg-gradient-to-b
            from-[#151b25]
            via-[#080b11]
            to-[#030508]
            shadow-[0_20px_50px_rgba(0,0,0,0.8)]
          "
        />

        {/* head */}

        <div
          className="
            absolute
            left-1/2
            top-[15%]
            h-20
            w-20
            -translate-x-1/2
            rounded-[48%_48%_42%_42%]
            border
            border-[#566171]
            bg-[#0c1017]
            shadow-[0_0_24px_rgba(95,198,232,0.08)]
          "
        />

        {/* hair / hood spikes */}

        <div
          className="
            absolute
            left-1/2
            top-[7%]
            h-12
            w-24
            -translate-x-1/2
            bg-[#05070b]
            [clip-path:polygon(0_65%,12%_0,27%_48%,44%_0,57%_43%,76%_5%,100%_64%,82%_100%,18%_100%)]
          "
        />

        {/* visor */}

        <div
          className="
            absolute
            left-1/2
            top-[35%]
            h-3
            w-14
            -translate-x-1/2
            skew-x-[-15deg]
            bg-[#5fc6e8]
            shadow-[0_0_16px_rgba(95,198,232,0.9)]
          "
        />

        {/* chest */}

        <div
          className="
            absolute
            left-1/2
            top-[48%]
            h-16
            w-16
            -translate-x-1/2
            border
            border-[#5fc6e8]/45
            bg-[#0b0f16]
            [clip-path:polygon(50%_0,100%_25%,82%_100%,18%_100%,0_25%)]
          "
        />

        {/* core */}

        <div
          className="
            absolute
            left-1/2
            top-[61%]
            h-4
            w-4
            -translate-x-1/2
            rotate-45
            bg-[#5fc6e8]
            shadow-[0_0_18px_rgba(95,198,232,1)]
          "
        />

        {/* weapon */}

        <div
          className="
            absolute
            left-[67%]
            top-[43%]
            h-2
            w-28
            rotate-[-18deg]
            origin-left
            bg-gradient-to-r
            from-[#5fc6e8]
            via-[#d9f8ff]
            to-transparent
            shadow-[0_0_15px_rgba(95,198,232,0.8)]
          "
        />

        {/* scarf */}

        <div
          className="
            absolute
            left-[38%]
            top-[51%]
            h-px
            w-28
            rotate-[14deg]
            origin-left
            bg-[#9b74ff]
            shadow-[0_0_12px_rgba(155,116,255,0.75)]
          "
        />

        {/* floor shadow */}

        <div
          className="
            absolute
            bottom-3
            left-1/2
            h-4
            w-36
            -translate-x-1/2
            rounded-full
            bg-[#5fc6e8]/10
            blur-xl
          "
        />
      </div>

      {/* Bottom system readout */}

      <div
        className="
          absolute
          bottom-4
          left-4
          right-4
          flex
          items-end
          justify-between
        "
      >
        <div>
          <div
            className="
              font-mono
              text-[8px]
              tracking-[0.22em]
              text-[#5fc6e8]/45
            "
          >
            HUNTER SIGNATURE
          </div>

          <div
            className="
              mt-1
              font-mono
              text-[10px]
              tracking-[0.16em]
              text-bone/70
            "
          >
            SHADOW / VOID / STEEL
          </div>
        </div>

        <div
          className="
            font-mono
            text-[8px]
            tracking-[0.18em]
            text-[#5fc6e8]/45
          "
        >
          SIGNAL LOCKED
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Neon Resonance Illustration                                                */
/* -------------------------------------------------------------------------- */

function NeonResonanceIllustration({
  active,
}: {
  active: boolean;
}) {
  return (
    <div
      className="
        relative
        h-full
        min-h-[280px]
        overflow-hidden
        bg-[#050615]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_50%_42%,rgba(98,230,255,0.16),transparent_34%),radial-gradient(circle_at_70%_58%,rgba(255,98,199,0.12),transparent_32%)]
        "
      />

      <div
        className="
          absolute
          inset-0
          opacity-[0.16]
          [background-image:linear-gradient(rgba(98,230,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(98,230,255,0.16)_1px,transparent_1px)]
          [background-size:28px_28px]
        "
      />

      <div
        className="
          absolute
          left-4
          top-4
          font-mono
          text-[8px]
          tracking-[0.22em]
          text-[#62e6ff]/50
        "
      >
        STAGE // ASTRAL-04
      </div>

      <div
        className="
          absolute
          right-4
          top-4
          font-mono
          text-[8px]
          tracking-[0.18em]
          text-[#ff62c7]/50
        "
      >
        RHYTHM LINKED
      </div>

      {/* orbit */}
      <div
        className={`
          absolute
          left-1/2
          top-[44%]
          h-44
          w-44
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#62e6ff]/20
          ${active ? 'animate-[spin_8s_linear_infinite]' : 'animate-[spin_18s_linear_infinite]'}
        `}
      />

      <div
        className="
          absolute
          left-1/2
          top-[44%]
          h-32
          w-32
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-dashed
          border-[#ff62c7]/20
          animate-[spin_12s_linear_infinite_reverse]
        "
      />

      {/* anime performer */}
      <div
        className={`
          absolute
          left-1/2
          top-[48%]
          h-44
          w-32
          -translate-x-1/2
          -translate-y-1/2
          transition-transform
          duration-500
          ${active ? 'scale-105' : 'scale-100'}
        `}
      >
        <div
          className="
            absolute
            left-1/2
            top-0
            h-20
            w-20
            -translate-x-1/2
            rounded-[48%_48%_45%_45%]
            border
            border-[#ffdfe8]/40
            bg-gradient-to-b
            from-[#ffe9ee]
            to-[#c894ad]
            shadow-[0_0_35px_rgba(98,230,255,0.12)]
          "
        />

        {/* hair */}
        <div
          className="
            absolute
            left-1/2
            top-[-8px]
            h-20
            w-24
            -translate-x-1/2
            bg-gradient-to-b
            from-[#24376e]
            via-[#16234e]
            to-[#0a1029]
            [clip-path:polygon(0_40%,8%_0,24%_22%,39%_0,55%_25%,75%_0,100%_38%,88%_100%,72%_70%,54%_100%,38%_72%,18%_100%)]
          "
        />

        {/* eyes */}
        <div
          className="
            absolute
            left-1/2
            top-[40px]
            h-1
            w-14
            -translate-x-1/2
            bg-[#62e6ff]
            shadow-[0_0_14px_rgba(98,230,255,0.9)]
          "
        />

        {/* body */}
        <div
          className="
            absolute
            left-1/2
            top-[68px]
            h-28
            w-28
            -translate-x-1/2
            bg-gradient-to-b
            from-[#f1f4ff]
            via-[#b6c0df]
            to-[#4b557d]
            [clip-path:polygon(35%_0,65%_0,82%_32%,100%_100%,50%_82%,0_100%,18%_32%)]
            shadow-[0_12px_40px_rgba(0,0,0,0.45)]
          "
        />

        {/* neon core */}
        <div
          className="
            absolute
            left-1/2
            top-[92px]
            h-5
            w-5
            -translate-x-1/2
            rotate-45
            bg-[#ff62c7]
            shadow-[0_0_24px_rgba(255,98,199,1)]
          "
        />

        {/* floating crystal */}
        <div
          className={`
            absolute
            left-1/2
            top-[-36px]
            h-7
            w-7
            -translate-x-1/2
            rotate-45
            border
            border-[#62e6ff]/70
            bg-[#62e6ff]/20
            shadow-[0_0_24px_rgba(98,230,255,0.75)]
            ${active ? 'animate-pulse' : ''}
          `}
        />
      </div>

      {/* falling notes */}
      {[
        { left: '27%', top: active ? '50%' : '38%', color: '#62e6ff' },
        { left: '43%', top: active ? '30%' : '18%', color: '#9d7cff' },
        { left: '59%', top: active ? '43%' : '28%', color: '#ff62c7' },
        { left: '75%', top: active ? '24%' : '12%', color: '#ffd66b' },
      ].map((note, index) => (
        <span
          key={index}
          className="absolute h-3 w-3 rotate-45 shadow-[0_0_14px_currentColor]"
          style={{
            left: note.left,
            top: note.top,
            color: note.color,
            backgroundColor: note.color,
          }}
        />
      ))}

      <div
        className="
          absolute
          bottom-4
          left-4
          right-4
          flex
          items-end
          justify-between
        "
      >
        <div>
          <div className="font-mono text-[8px] tracking-[0.22em] text-[#62e6ff]/45">
            PERFORMANCE SIGNATURE
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.14em] text-bone/70">
            RHYTHM / LIGHT / RESONANCE
          </div>
        </div>

        <div className="font-mono text-[8px] tracking-[0.18em] text-[#ff62c7]/45">
          STAGE READY
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function FunZone() {
  const [activeGame, setActiveGame] =
    useState<GameId | null>(null);

  const [hoveredGame, setHoveredGame] =
    useState<GameId | null>(null);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedGame = useMemo(
    () =>
      GAMES.find(
        (game) =>
          game.id === activeGame,
      ) ?? null,
    [activeGame],
  );

  const openGame = useCallback(
    (game: GameEntry) => {
      if (
        game.status !==
        'AVAILABLE'
      ) {
        return;
      }

      setActiveGame(game.id);
    },
    [],
  );

  const closeGame = useCallback(
    () => {
      setActiveGame(null);
    },
    [],
  );

  useEffect(() => {
    if (!activeGame) {
      document.body.style.overflow =
        '';

      return;
    }

    document.body.style.overflow =
      'hidden';

    return () => {
      document.body.style.overflow =
        '';
    };
  }, [activeGame]);

  useEffect(() => {
    const handleKeyDown =
      (event: KeyboardEvent) => {
        if (
          event.key ===
            'Escape' &&
          activeGame
        ) {
          closeGame();
        }
      };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
  }, [
    activeGame,
    closeGame,
  ]);

  return (
    <>
      <section
        id="fun-zone"
        className="
          relative
          overflow-hidden
          border-t
          border-white/[0.06]
          bg-[#050608]
          px-4
          py-24
          sm:px-6
          lg:px-8
        "
      >
        {/* ---------------------------------------------------------------- */}
        {/* Background                                                        */}
        {/* ---------------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.22]
            [background-image:linear-gradient(rgba(95,198,232,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(95,198,232,0.055)_1px,transparent_1px)]
            [background-size:56px_56px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[15%]
            top-[20%]
            h-80
            w-80
            rounded-full
            bg-[#5fc6e8]/[0.025]
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[10%]
            bottom-[10%]
            h-96
            w-96
            rounded-full
            bg-[#9b74ff]/[0.025]
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
          "
        >
          {/* ---------------------------------------------------------------- */}
          {/* Header                                                           */}
          {/* ---------------------------------------------------------------- */}

          <div
            className={`
              mb-12
              transition-all
              duration-1000
              ${
                mounted
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }
            `}
          >
            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-10
                  bg-[#5fc6e8]
                  shadow-[0_0_10px_rgba(95,198,232,0.6)]
                "
              />

              <span
                className="
                  font-mono
                  text-[9px]
                  font-semibold
                  tracking-[0.28em]
                  text-[#5fc6e8]
                "
              >
                SYSTEM // ENTERTAINMENT
              </span>

              <span
                className="
                  ml-1
                  inline-flex
                  h-1.5
                  w-1.5
                  animate-pulse
                  rounded-full
                  bg-[#5fc6e8]
                  shadow-[0_0_8px_rgba(95,198,232,0.9)]
                "
              />
            </div>

            <div
              className="
                flex
                flex-col
                justify-between
                gap-6
                lg:flex-row
                lg:items-end
              "
            >
              <div>
                <h2
                  className="
                    font-display
                    text-4xl
                    font-bold
                    uppercase
                    tracking-[-0.035em]
                    text-bone
                    sm:text-5xl
                    lg:text-6xl
                  "
                >
                  FUN ZONE
                </h2>

                <p
                  className="
                    mt-4
                    max-w-2xl
                    font-mono
                    text-[10px]
                    leading-6
                    tracking-[0.14em]
                    text-bone/45
                    sm:text-xs
                  "
                >
                  OPTIONAL INSTANCES.
                  <br />
                  NO MISSION REQUIRED.
                  ENTER WHEN YOU WANT
                  TO TEST THE SYSTEM.
                </p>
              </div>

              <CornerFrame
                className="
                  w-fit
                  border
                  border-white/[0.07]
                  bg-black/25
                  px-5
                  py-4
                  backdrop-blur-sm
                "
              >
                <div
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.18em]
                    text-bone/30
                  "
                >
                  AVAILABLE INSTANCES
                </div>

                <div
                  className="
                    mt-1
                    flex
                    items-baseline
                    gap-2
                  "
                >
                  <span
                    className="
                      font-mono
                      text-xl
                      font-bold
                      text-[#5fc6e8]
                    "
                  >
                    {GAMES.filter(
                      (game) =>
                        game.status ===
                        'AVAILABLE',
                    ).length
                      .toString()
                      .padStart(
                        2,
                        '0',
                      )}
                  </span>

                  <span
                    className="
                      font-mono
                      text-[8px]
                      tracking-[0.18em]
                      text-bone/30
                    "
                  >
                    ACTIVE
                  </span>
                </div>
              </CornerFrame>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* System divider                                                   */}
          {/* ---------------------------------------------------------------- */}

          <div
            className="
              mb-8
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                font-mono
                text-[8px]
                tracking-[0.2em]
                text-bone/20
              "
            >
              INSTANCE REGISTRY
            </span>

            <span
              className="
                h-px
                flex-1
                bg-gradient-to-r
                from-[#5fc6e8]/20
                to-transparent
              "
            />

            <span
              className="
                font-mono
                text-[8px]
                tracking-[0.2em]
                text-[#5fc6e8]/30
              "
            >
              SYSTEM ONLINE
            </span>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Game cards                                                       */}
          {/* ---------------------------------------------------------------- */}

          <div
            className="
              grid
              gap-6
              lg:grid-cols-2
            "
          >
            {GAMES.map(
              (
                game,
                index,
              ) => {
                const isHovered =
                  hoveredGame ===
                  game.id;

                return (
                  <article
                    key={
                      game.id
                    }
                    onMouseEnter={() =>
                      setHoveredGame(
                        game.id,
                      )
                    }
                    onMouseLeave={() =>
                      setHoveredGame(
                        null,
                      )
                    }
                    className="
                      group
                      relative
                      overflow-hidden
                      border
                      border-white/[0.08]
                      bg-[#090b10]/90
                      shadow-[0_25px_80px_rgba(0,0,0,0.25)]
                      transition-all
                      duration-700
                      hover:-translate-y-1
                      hover:border-[#5fc6e8]/30
                      hover:shadow-[0_30px_100px_rgba(0,0,0,0.5)]
                    "
                    style={{
                      transitionDelay: `${
                        index *
                        70
                      }ms`,
                    }}
                  >
                    {/* animated top scan */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        top-0
                        z-20
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-[#5fc6e8]
                        to-transparent
                        opacity-0
                        transition-opacity
                        duration-500
                        group-hover:opacity-70
                      "
                    />

                    <div
                      className="
                        grid
                        lg:grid-cols-[0.95fr_1.05fr]
                      "
                    >
                      {/* Illustration */}

                      {game.id ===
                      'shadow-hunter' ? (
                        <ShadowHunterIllustration
                          active={
                            isHovered
                          }
                        />
                      ) : (
                        <NeonResonanceIllustration
                          active={
                            isHovered
                          }
                        />
                      )}

                      {/* Information */}

                      <div
                        className="
                          relative
                          flex
                          min-h-[280px]
                          flex-col
                          p-6
                          sm:p-7
                        "
                      >
                        <div
                          className="
                            mb-5
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >
                          <div>
                            <div
                              className="
                                font-mono
                                text-[8px]
                                tracking-[0.22em]
                                text-[#5fc6e8]/50
                              "
                            >
                              INSTANCE 001
                            </div>

                            <h3
                              className="
                                mt-2
                                font-display
                                text-2xl
                                font-bold
                                tracking-[-0.02em]
                                text-bone
                              "
                            >
                              {
                                game.title
                              }
                            </h3>

                            <p
                              className="
                                mt-1
                                font-mono
                                text-[8px]
                                tracking-[0.15em]
                                text-[#5fc6e8]/65
                              "
                            >
                              {
                                game.subtitle
                              }
                            </p>
                          </div>

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              border
                              border-[#5fc6e8]/25
                              bg-[#5fc6e8]/[0.04]
                              font-mono
                              text-lg
                              font-bold
                              text-[#5fc6e8]
                              shadow-[0_0_20px_rgba(95,198,232,0.08)]
                            "
                          >
                            {
                              game.rank
                            }
                          </div>
                        </div>

                        <p
                          className="
                            max-w-xl
                            font-mono
                            text-[10px]
                            leading-5
                            text-bone/45
                          "
                        >
                          {
                            game.description
                          }
                        </p>

                        {/* metadata */}

                        <div
                          className="
                            mt-6
                            grid
                            grid-cols-2
                            gap-px
                            overflow-hidden
                            border
                            border-white/[0.06]
                            bg-white/[0.05]
                          "
                        >
                          {[
                            [
                              'TYPE',
                              game.genre,
                            ],
                            [
                              'MODE',
                              game.mode,
                            ],
                            [
                              'THREAT',
                              game.difficulty,
                            ],
                            [
                              'VERSION',
                              game.version,
                            ],
                          ].map(
                            (item) => (
                              <div
                                key={
                                  item[0]
                                }
                                className="
                                  bg-[#080a0f]
                                  px-3
                                  py-2.5
                                "
                              >
                                <div
                                  className="
                                    font-mono
                                    text-[7px]
                                    tracking-[0.16em]
                                    text-bone/20
                                  "
                                >
                                  {
                                    item[0]
                                  }
                                </div>

                                <div
                                  className="
                                    mt-1
                                    truncate
                                    font-mono
                                    text-[8px]
                                    tracking-[0.1em]
                                    text-bone/65
                                  "
                                >
                                  {
                                    item[1]
                                  }
                                </div>
                              </div>
                            ),
                          )}
                        </div>

                        {/* tags */}

                        <div
                          className="
                            mt-5
                            flex
                            flex-wrap
                            gap-1.5
                          "
                        >
                          {game.tags.map(
                            (
                              tag,
                            ) => (
                              <span
                                key={
                                  tag
                                }
                                className="
                                  border
                                  border-white/[0.06]
                                  bg-white/[0.025]
                                  px-2
                                  py-1
                                  font-mono
                                  text-[7px]
                                  tracking-[0.12em]
                                  text-bone/30
                                  transition-colors
                                  group-hover:border-[#5fc6e8]/15
                                  group-hover:text-bone/45
                                "
                              >
                                {
                                  tag
                                }
                              </span>
                            ),
                          )}
                        </div>

                        {/* Controls + action */}

                        <div
                          className="
                            mt-auto
                            flex
                            flex-col
                            gap-5
                            pt-7
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                          "
                        >
                          <div>
                            <div
                              className="
                                font-mono
                                text-[7px]
                                tracking-[0.18em]
                                text-bone/20
                              "
                            >
                              INPUT PROTOCOL
                            </div>

                            <div
                              className="
                                mt-2
                                max-w-[230px]
                                font-mono
                                text-[7px]
                                leading-4
                                tracking-[0.08em]
                                text-bone/35
                              "
                            >
                              {
                                game.controls.join(
                                  ' // ',
                                )
                              }
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={
                              game.status !==
                              'AVAILABLE'
                            }
                            onClick={() =>
                              openGame(
                                game,
                              )
                            }
                            className="
                              relative
                              inline-flex
                              min-w-[165px]
                              items-center
                              justify-center
                              gap-3
                              overflow-hidden
                              border
                              border-[#5fc6e8]/40
                              bg-[#5fc6e8]/[0.05]
                              px-5
                              py-3.5
                              font-mono
                              text-[9px]
                              font-semibold
                              tracking-[0.18em]
                              text-[#5fc6e8]
                              transition-all
                              duration-300
                              hover:border-[#5fc6e8]
                              hover:bg-[#5fc6e8]/10
                              hover:shadow-[0_0_28px_rgba(95,198,232,0.14)]
                              active:scale-[0.97]
                              disabled:cursor-not-allowed
                              disabled:opacity-30
                            "
                          >
                            <span
                              className="
                                absolute
                                inset-y-0
                                left-0
                                w-px
                                bg-[#5fc6e8]
                                transition-all
                                duration-500
                                group-hover:w-full
                                group-hover:opacity-10
                              "
                            />

                            <span className="relative">
                              {game.status ===
                              'AVAILABLE'
                                ? 'OPEN INSTANCE'
                                : game.status}
                            </span>

                            <span
                              className="
                                relative
                                text-sm
                              "
                            >
                              →
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}

            {/* Future game slot */}

            <CornerFrame
              className="
                relative
                min-h-[280px]
                overflow-hidden
                border
                border-dashed
                border-white/[0.08]
                bg-black/10
              "
            >
              <div
                className="
                  flex
                  h-full
                  min-h-[280px]
                  flex-col
                  items-center
                  justify-center
                  px-8
                  text-center
                "
              >
                <div
                  className="
                    mb-5
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    border
                    border-dashed
                    border-[#9b74ff]/25
                    bg-[#9b74ff]/[0.025]
                    font-mono
                    text-2xl
                    text-[#9b74ff]/45
                  "
                >
                  +
                </div>

                <div
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.25em]
                    text-[#9b74ff]/45
                  "
                >
                  NEXT INSTANCE
                </div>

                <h3
                  className="
                    mt-3
                    font-display
                    text-lg
                    font-semibold
                    tracking-[0.04em]
                    text-bone/35
                  "
                >
                  UNKNOWN
                </h3>

                <p
                  className="
                    mt-3
                    max-w-xs
                    font-mono
                    text-[8px]
                    leading-5
                    tracking-[0.08em]
                    text-bone/20
                  "
                >
                  ANOTHER PLAYABLE SYSTEM
                  WILL BE DEPLOYED HERE.
                </p>

                <div
                  className="
                    mt-5
                    border
                    border-white/[0.06]
                    px-4
                    py-2
                    font-mono
                    text-[7px]
                    tracking-[0.18em]
                    text-bone/20
                  "
                >
                  SLOT RESERVED
                </div>
              </div>
            </CornerFrame>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Footer system message                                             */}
          {/* ---------------------------------------------------------------- */}

          <div
            className="
              mt-10
              flex
              flex-col
              gap-3
              border-t
              border-white/[0.06]
              pt-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div
              className="
                font-mono
                text-[8px]
                tracking-[0.15em]
                text-bone/20
              "
            >
              FUN ZONE // OPTIONAL CONTENT
            </div>

            <div
              className="
                font-mono
                text-[8px]
                tracking-[0.15em]
                text-[#5fc6e8]/35
              "
            >
              SYSTEM DOES NOT REQUIRE
              COMPLETION
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* GAME WINDOW                                                         */}
      {/* ================================================================== */}

      {selectedGame?.id ===
        'shadow-hunter' && (
        <div
          className="
            fixed
            inset-0
            z-[300]
            flex
            items-center
            justify-center
            bg-[#020307]/90
            p-2
            backdrop-blur-xl
            sm:p-4
            lg:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-label="Shadow Hunter game"
        >
          {/* outer system frame */}

          <div
            className="
              relative
              h-full
              max-h-[940px]
              w-full
              max-w-[1400px]
              overflow-hidden
              border
              border-[#5fc6e8]/20
              bg-[#05070b]
              shadow-[0_0_100px_rgba(0,0,0,0.85),0_0_40px_rgba(95,198,232,0.05)]
            "
          >
            {/* top system bar */}

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                z-[20]
                flex
                h-8
                items-center
                justify-between
                border-b
                border-white/[0.06]
                bg-black/50
                px-3
                backdrop-blur-md
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  font-mono
                  text-[7px]
                  tracking-[0.18em]
                  text-[#5fc6e8]/50
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    animate-pulse
                    rounded-full
                    bg-[#5fc6e8]
                    shadow-[0_0_8px_rgba(95,198,232,1)]
                  "
                />

                SYSTEM INSTANCE

                <span className="text-bone/20">
                  //
                </span>

                SHADOW HUNTER
              </div>

              <button
                type="button"
                onClick={
                  closeGame
                }
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.16em]
                  text-bone/40
                  transition-colors
                  hover:text-[#e4623f]
                "
              >
                ESC // CLOSE
              </button>
            </div>

            <div
              className="
                h-full
                w-full
                pt-8
              "
            >
              <ShadowHunterGame
                open={
                  activeGame ===
                  'shadow-hunter'
                }
                onClose={
                  closeGame
                }
              />
            </div>
          </div>
        </div>
      )}

      {selectedGame?.id ===
        'neon-resonance' && (
        <div
          className="
            fixed
            inset-0
            z-[300]
            flex
            items-center
            justify-center
            bg-[#02030c]/90
            p-2
            backdrop-blur-xl
            sm:p-4
            lg:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-label="Neon Resonance game"
        >
          <div
            className="
              relative
              h-full
              max-h-[940px]
              w-full
              max-w-[1400px]
              overflow-hidden
              border
              border-[#62e6ff]/20
              bg-[#050615]
              shadow-[0_0_100px_rgba(0,0,0,0.85),0_0_50px_rgba(98,230,255,0.06)]
            "
          >
            <div
              className="
                absolute
                left-0
                right-0
                top-0
                z-[20]
                flex
                h-8
                items-center
                justify-between
                border-b
                border-white/[0.06]
                bg-black/50
                px-3
                backdrop-blur-md
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  font-mono
                  text-[7px]
                  tracking-[0.18em]
                  text-[#62e6ff]/60
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    animate-pulse
                    rounded-full
                    bg-[#62e6ff]
                    shadow-[0_0_8px_rgba(98,230,255,1)]
                  "
                />

                SYSTEM INSTANCE

                <span className="text-bone/20">
                  //
                </span>

                NEON RESONANCE
              </div>

              <button
                type="button"
                onClick={
                  closeGame
                }
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.16em]
                  text-bone/40
                  transition-colors
                  hover:text-[#ff62c7]
                "
              >
                ESC // CLOSE
              </button>
            </div>

            <div
              className="
                h-full
                w-full
                pt-8
              "
            >
              <NeonResonanceGame
                open={
                  activeGame ===
                  'neon-resonance'
                }
                onClose={
                  closeGame
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FunZone;