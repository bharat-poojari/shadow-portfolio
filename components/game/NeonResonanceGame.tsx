'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/* ============================================================
   NEON RESONANCE
   Anime Rhythm / Reflex Game
   ------------------------------------------------------------
   Single-file game.
   No external dependencies.
   Same integration contract as ShadowHunterGame:

      <NeonResonanceGame
        open={boolean}
        onClose={() => void}
      />

   Controls:
      A / S / K / L   - hit lanes
      SPACE           - activate Fever
      ESC             - pause
      P               - pause

   Mouse / touch:
      Tap a lane.
   ============================================================ */

type Difficulty = 'novice' | 'performer' | 'virtuoso';

type Screen =
  | 'menu'
  | 'game'
  | 'pause'
  | 'results'
  | 'settings'
  | 'howto';

type Judgment =
  | 'PERFECT'
  | 'GREAT'
  | 'GOOD'
  | 'MISS';

type Lane = 0 | 1 | 2 | 3;

type NoteKind =
  | 'tap'
  | 'hold'
  | 'burst';

type Note = {
  id: number;
  lane: Lane;
  time: number;
  duration: number;
  kind: NoteKind;
  hit: boolean;
  missed: boolean;
  holding: boolean;
};

type FloatingText = {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  scale: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  drag: number;
};

type Star = {
  x: number;
  y: number;
  size: number;
  depth: number;
  phase: number;
};

type GameState = {
  running: boolean;
  finished: boolean;

  elapsed: number;
  duration: number;

  score: number;
  combo: number;
  maxCombo: number;

  perfect: number;
  great: number;
  good: number;
  miss: number;

  fever: number;
  feverActive: boolean;
  feverTimer: number;

  multiplier: number;

  accuracyTotal: number;
  accuracyCount: number;

  notes: Note[];

  nextNoteId: number;

  floatingTexts: FloatingText[];
  particles: Particle[];

  laneFlash: number[];
  lanePulse: number[];

  screenShake: number;
  hitStop: number;

  lastJudgment: Judgment | null;

  lastJudgmentLife: number;

  stars: Star[];

  seed: number;
};

type SaveData = {
  version: number;
  highScore: number;
  bestCombo: number;
  bestAccuracy: number;
  totalNotes: number;
  perfectNotes: number;
  sessions: number;
  settings: {
    sound: boolean;
    particles: boolean;
    screenShake: boolean;
    reducedMotion: boolean;
  };
};

type HudState = {
  score: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  fever: number;
  feverActive: boolean;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  elapsed: number;
  duration: number;
};

/* ============================================================
   CONSTANTS
   ============================================================ */

const WIDTH = 1100;
const HEIGHT = 680;

const STORAGE_KEY = 'neon-resonance-save-v1';

const LANES: Lane[] = [0, 1, 2, 3];

const LANE_KEYS = ['a', 's', 'k', 'l'];

const LANE_COLORS = [
  '#62e6ff',
  '#9d7cff',
  '#ff62c7',
  '#ffd66b',
];

const LANE_NAMES = [
  'AZURE',
  'VIOLET',
  'ROSE',
  'GOLD',
];

const DIFFICULTIES: Record<
  Difficulty,
  {
    name: string;
    subtitle: string;
    bpm: number;
    noteRate: number;
    speed: number;
    duration: number;
    scoreMultiplier: number;
  }
> = {
  novice: {
    name: 'NOVICE',
    subtitle: 'A quiet awakening',
    bpm: 92,
    noteRate: 1.05,
    speed: 330,
    duration: 65,
    scoreMultiplier: 0.8,
  },

  performer: {
    name: 'PERFORMER',
    subtitle: 'The intended experience',
    bpm: 122,
    noteRate: 0.72,
    speed: 390,
    duration: 78,
    scoreMultiplier: 1,
  },

  virtuoso: {
    name: 'VIRTUOSO',
    subtitle: 'Only rhythm remains',
    bpm: 156,
    noteRate: 0.46,
    speed: 455,
    duration: 92,
    scoreMultiplier: 1.65,
  },
};

const JUDGMENT_WINDOWS = {
  perfect: 0.075,
  great: 0.14,
  good: 0.23,
  miss: 0.31,
};

/* ============================================================
   UTILITIES
   ============================================================ */

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.max(
    min,
    Math.min(max, value),
  );
}

function random(
  min: number,
  max: number,
) {
  return (
    Math.random() *
      (max - min) +
    min
  );
}

function lerp(
  a: number,
  b: number,
  t: number,
) {
  return a + (b - a) * t;
}

function distance(
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  return Math.hypot(
    ax - bx,
    ay - by,
  );
}

function accuracyOf(
  state: GameState,
) {
  if (state.accuracyCount <= 0) {
    return 100;
  }

  return (
    state.accuracyTotal /
    state.accuracyCount
  );
}

function rankFor(
  accuracy: number,
  miss: number,
  combo: number,
) {
  if (
    accuracy >= 97 &&
    miss === 0 &&
    combo >= 30
  ) {
    return 'S+';
  }

  if (accuracy >= 94) {
    return 'S';
  }

  if (accuracy >= 88) {
    return 'A';
  }

  if (accuracy >= 78) {
    return 'B';
  }

  if (accuracy >= 65) {
    return 'C';
  }

  return 'D';
}

/* ============================================================
   SAVE
   ============================================================ */

function defaultSave(): SaveData {
  return {
    version: 1,
    highScore: 0,
    bestCombo: 0,
    bestAccuracy: 0,
    totalNotes: 0,
    perfectNotes: 0,
    sessions: 0,

    settings: {
      sound: true,
      particles: true,
      screenShake: true,
      reducedMotion: false,
    },
  };
}

function loadSave(): SaveData {
  const defaults =
    defaultSave();

  if (
    typeof window ===
    'undefined'
  ) {
    return defaults;
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return defaults;
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !==
        'object'
    ) {
      return defaults;
    }

    return {
      ...defaults,
      ...parsed,
      settings: {
        ...defaults.settings,
        ...(parsed.settings ||
          {}),
      },
    };
  } catch {
    return defaults;
  }
}

function saveData(
  data: SaveData,
) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data),
    );
  } catch {
    // Storage is optional.
  }
}

/* ============================================================
   INITIAL STATE
   ============================================================ */

function createStars(): Star[] {
  return Array.from(
    { length: 160 },
    () => ({
      x: random(0, WIDTH),
      y: random(0, HEIGHT),
      size: random(0.5, 2.4),
      depth: random(0.2, 1),
      phase: random(
        0,
        Math.PI * 2,
      ),
    }),
  );
}

function createInitialState(): GameState {
  return {
    running: false,
    finished: false,

    elapsed: 0,
    duration: 78,

    score: 0,
    combo: 0,
    maxCombo: 0,

    perfect: 0,
    great: 0,
    good: 0,
    miss: 0,

    fever: 0,
    feverActive: false,
    feverTimer: 0,

    multiplier: 1,

    accuracyTotal: 0,
    accuracyCount: 0,

    notes: [],

    nextNoteId: 1,

    floatingTexts: [],
    particles: [],

    laneFlash: [0, 0, 0, 0],
    lanePulse: [0, 0, 0, 0],

    screenShake: 0,
    hitStop: 0,

    lastJudgment: null,
    lastJudgmentLife: 0,

    stars: createStars(),

    seed: Math.floor(
      Math.random() * 1000000,
    ),
  };
}

/* ============================================================
   NOTE GENERATION
   ============================================================ */

function generateNotes(
  difficulty: Difficulty,
): Note[] {
  const config =
    DIFFICULTIES[
      difficulty
    ];

  const notes: Note[] = [];

  const beat =
    60 / config.bpm;

  let time = 3.0;

  let lastLane: Lane =
    1;

  let id = 1;

  while (
    time <
    config.duration - 2
  ) {
    const roll =
      Math.random();

    let amount = 1;

    if (
      difficulty ===
        'performer' &&
      roll > 0.82
    ) {
      amount = 2;
    }

    if (
      difficulty ===
        'virtuoso' &&
      roll > 0.62
    ) {
      amount =
        roll > 0.9
          ? 3
          : 2;
    }

    const lanes: Lane[] =
      [];

    for (
      let i = 0;
      i < amount;
      i += 1
    ) {
      let lane =
        Math.floor(
          Math.random() * 4,
        ) as Lane;

      if (
        lane === lastLane &&
        Math.random() < 0.65
      ) {
        lane =
          ((lane + 1) %
            4) as Lane;
      }

      lanes.push(lane);
      lastLane = lane;
    }

    for (
      const lane of lanes
    ) {
      const kindRoll =
        Math.random();

      let kind: NoteKind =
        'tap';

      let duration = 0;

      if (
        difficulty !==
          'novice' &&
        kindRoll > 0.91
      ) {
        kind = 'hold';

        duration =
          beat *
          (difficulty ===
          'virtuoso'
            ? 2.2
            : 1.7);
      } else if (
        difficulty ===
          'virtuoso' &&
        kindRoll > 0.82
      ) {
        kind = 'burst';
      }

      notes.push({
        id: id++,
        lane,
        time,
        duration,
        kind,
        hit: false,
        missed: false,
        holding: false,
      });
    }

    const spacing =
      beat *
      config.noteRate;

    time +=
      spacing *
      random(
        0.76,
        1.22,
      );
  }

  return notes;
}

/* ============================================================
   DRAW HELPERS
   ============================================================ */

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius =
    Math.min(
      r,
      w / 2,
      h / 2,
    );

  ctx.beginPath();

  ctx.moveTo(
    x + radius,
    y,
  );

  ctx.arcTo(
    x + w,
    y,
    x + w,
    y + h,
    radius,
  );

  ctx.arcTo(
    x + w,
    y + h,
    x,
    y + h,
    radius,
  );

  ctx.arcTo(
    x,
    y + h,
    x,
    y,
    radius,
  );

  ctx.arcTo(
    x,
    y,
    x + w,
    y,
    radius,
  );

  ctx.closePath();
}

function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha = 1,
) {
  ctx.save();

  ctx.globalAlpha =
    alpha;

  ctx.fillStyle =
    color;

  ctx.shadowColor =
    color;

  ctx.shadowBlur =
    radius * 1.8;

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2,
  );

  ctx.fill();

  ctx.restore();
}

function drawLineGlow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
  alpha = 1,
) {
  ctx.save();

  ctx.globalAlpha =
    alpha;

  ctx.strokeStyle =
    color;

  ctx.lineWidth =
    width;

  ctx.shadowColor =
    color;

  ctx.shadowBlur =
    width * 4;

  ctx.beginPath();

  ctx.moveTo(
    x1,
    y1,
  );

  ctx.lineTo(
    x2,
    y2,
  );

  ctx.stroke();

  ctx.restore();
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export function NeonResonanceGame({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const canvasRef =
    useRef<HTMLCanvasElement>(
      null,
    );

  const animationRef =
    useRef<number | null>(
      null,
    );

  const lastFrameRef =
    useRef(0);

  const stateRef =
    useRef<GameState>(
      createInitialState(),
    );

  const keysRef =
    useRef<Set<string>>(
      new Set(),
    );

  const audioRef =
    useRef<AudioContext | null>(
      null,
    );

  /*
   * SFX
   * ---
   * The game keeps all critical gameplay audio procedural so it remains
   * self-contained and cannot break because a third-party CDN is offline.
   *
   * The sonic palette is based on freely available CC0 game-audio references,
   * including the OpenGameArt Chiptune SFX Pack by FrogPog:
   * https://opengameart.org/content/chiptune-sfx-pack
   *
   * The pack is CC0; no asset files are bundled into this single-file component.
   * The procedural layer below gives the game deterministic SFX without an
   * external runtime dependency.
   */
  const sfxMasterRef =
    useRef<GainNode | null>(null);

  const sfxCooldownRef =
    useRef<Record<string, number>>({});

  const saveRef =
    useRef<SaveData | null>(
      null,
    );

  const [screen, setScreen] =
    useState<Screen>('menu');

  const [difficulty, setDifficulty] =
    useState<Difficulty>(
      'performer',
    );

  const [hud, setHud] =
    useState<HudState>({
      score: 0,
      combo: 0,
      maxCombo: 0,
      accuracy: 100,
      fever: 0,
      feverActive: false,
      perfect: 0,
      great: 0,
      good: 0,
      miss: 0,
      elapsed: 0,
      duration: 78,
    });

  const [save, setSave] =
    useState<SaveData | null>(
      null,
    );

  const [soundEnabled, setSoundEnabled] =
    useState(true);

  const [particlesEnabled, setParticlesEnabled] =
    useState(true);

  const [screenShakeEnabled, setScreenShakeEnabled] =
    useState(true);

  const [reducedMotion, setReducedMotion] =
    useState(false);

  const [resultRank, setResultRank] =
    useState('D');

  /* ==========================================================
     PERSISTENCE
     ========================================================== */

  const updateSave =
    useCallback(
      (
        updater: (
          current: SaveData,
        ) => SaveData,
      ) => {
        const current =
          saveRef.current ||
          loadSave();

        const next =
          updater(current);

        saveRef.current =
          next;

        setSave(next);

        saveData(next);
      },
      [],
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    const loaded =
      loadSave();

    saveRef.current =
      loaded;

    setSave(loaded);

    setSoundEnabled(
      loaded.settings.sound,
    );

    setParticlesEnabled(
      loaded.settings
        .particles,
    );

    setScreenShakeEnabled(
      loaded.settings
        .screenShake,
    );

    setReducedMotion(
      loaded.settings
        .reducedMotion,
    );
  }, [open]);

  /* ==========================================================
     AUDIO
     ========================================================== */

  const getAudioContext =
    useCallback(() => {
      if (typeof window === 'undefined') {
        return null;
      }

      try {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (!AudioContextClass) {
          return null;
        }

        if (!audioRef.current) {
          audioRef.current =
            new AudioContextClass();
        }

        const audio =
          audioRef.current;

        if (audio.state === 'suspended') {
          void audio.resume();
        }

        if (!sfxMasterRef.current) {
          const master =
            audio.createGain();

          master.gain.value =
            0.8;

          master.connect(
            audio.destination,
          );

          sfxMasterRef.current =
            master;
        }

        return audio;
      } catch {
        return null;
      }
    }, []);

  const playTone =
    useCallback(
      (
        frequency: number,
        duration: number,
        type: OscillatorType = 'sine',
        volume = 0.025,
      ) => {
        if (!soundEnabled) {
          return;
        }

        const audio =
          getAudioContext();

        if (
          !audio ||
          !sfxMasterRef.current
        ) {
          return;
        }

        try {
          const oscillator =
            audio.createOscillator();

          const gain =
            audio.createGain();

          oscillator.type =
            type;

          oscillator.frequency.setValueAtTime(
            Math.max(20, frequency),
            audio.currentTime,
          );

          gain.gain.setValueAtTime(
            Math.max(0.0001, volume),
            audio.currentTime,
          );

          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audio.currentTime +
              Math.max(0.025, duration),
          );

          oscillator.connect(gain);
          gain.connect(
            sfxMasterRef.current,
          );

          oscillator.start();

          oscillator.stop(
            audio.currentTime +
              Math.max(0.03, duration),
          );
        } catch {
          // Audio is optional.
        }
      },
      [
        getAudioContext,
        soundEnabled,
      ],
    );

  const playSfx =
    useCallback(
      (
        kind:
          | 'ui'
          | 'hit'
          | 'perfect'
          | 'miss'
          | 'fever'
          | 'start'
          | 'finish',
      ) => {
        if (!soundEnabled) {
          return;
        }

        const now =
          performance.now();

        const last =
          sfxCooldownRef.current[
            kind
          ] ?? 0;

        const cooldown =
          kind === 'hit'
            ? 22
            : 55;

        if (
          now - last <
          cooldown
        ) {
          return;
        }

        sfxCooldownRef.current[
          kind
        ] = now;

        switch (kind) {
          case 'ui':
            playTone(
              640,
              0.045,
              'square',
              0.012,
            );
            playTone(
              960,
              0.055,
              'triangle',
              0.009,
            );
            break;

          case 'hit':
            playTone(
              420,
              0.045,
              'triangle',
              0.014,
            );
            break;

          case 'perfect':
            playTone(
              740,
              0.055,
              'triangle',
              0.018,
            );
            playTone(
              1110,
              0.085,
              'sine',
              0.014,
            );
            break;

          case 'miss':
            playTone(
              145,
              0.11,
              'sawtooth',
              0.014,
            );
            break;

          case 'fever':
            playTone(
              220,
              0.18,
              'sawtooth',
              0.018,
            );
            playTone(
              440,
              0.22,
              'triangle',
              0.018,
            );
            playTone(
              880,
              0.34,
              'sine',
              0.016,
            );
            break;

          case 'start':
            playTone(
              392,
              0.08,
              'triangle',
              0.014,
            );
            window.setTimeout(
              () =>
                playTone(
                  523,
                  0.08,
                  'triangle',
                  0.014,
                ),
              70,
            );
            window.setTimeout(
              () =>
                playTone(
                  784,
                  0.14,
                  'triangle',
                  0.016,
                ),
              140,
            );
            break;

          case 'finish':
            playTone(
              523,
              0.12,
              'triangle',
              0.018,
            );
            window.setTimeout(
              () =>
                playTone(
                  659,
                  0.12,
                  'triangle',
                  0.018,
                ),
              100,
            );
            window.setTimeout(
              () =>
                playTone(
                  784,
                  0.22,
                  'triangle',
                  0.02,
                ),
              200,
            );
            break;
        }
      },
      [
        playTone,
        soundEnabled,
      ],
    );



  /* ==========================================================
     HUD
     ========================================================== */

  const syncHud =
    useCallback(() => {
      const state =
        stateRef.current;

      setHud({
        score: state.score,
        combo: state.combo,
        maxCombo:
          state.maxCombo,
        accuracy:
          accuracyOf(state),
        fever: state.fever,
        feverActive:
          state.feverActive,
        perfect:
          state.perfect,
        great:
          state.great,
        good: state.good,
        miss: state.miss,
        elapsed:
          state.elapsed,
        duration:
          state.duration,
      });
    }, []);

  /* ==========================================================
     PARTICLES
     ========================================================== */

  const spawnParticles =
    useCallback(
      (
        state: GameState,
        x: number,
        y: number,
        color: string,
        amount: number,
      ) => {
        if (
          !particlesEnabled ||
          reducedMotion
        ) {
          return;
        }

        const limit = 700;

        const count =
          Math.min(
            amount,
            limit -
              state.particles
                .length,
          );

        for (
          let i = 0;
          i < count;
          i += 1
        ) {
          const angle =
            random(
              0,
              Math.PI * 2,
            );

          const speed =
            random(
              30,
              220,
            );

          state.particles.push({
            x,
            y,
            vx:
              Math.cos(
                angle,
              ) * speed,
            vy:
              Math.sin(
                angle,
              ) * speed,
            life: random(
              0.25,
              0.8,
            ),
            maxLife: 0.8,
            size: random(
              1,
              4,
            ),
            color,
            gravity: random(
              -20,
              50,
            ),
            drag: 0.93,
          });
        }
      },
      [
        particlesEnabled,
        reducedMotion,
      ],
    );

  /* ==========================================================
     JUDGMENT
     ========================================================== */

  const registerJudgment =
    useCallback(
      (
        note: Note,
        judgment: Judgment,
        offset: number,
      ) => {
        const state =
          stateRef.current;

        const lane =
          note.lane;

        const accuracyValue =
          judgment ===
          'PERFECT'
            ? 100
            : judgment ===
                'GREAT'
              ? 92
              : judgment ===
                  'GOOD'
                ? 75
                : 0;

        if (
          judgment ===
          'MISS'
        ) {
          state.combo = 0;
          state.miss += 1;

          state.fever =
            clamp(
              state.fever -
                12,
              0,
              100,
            );

          state.lastJudgment =
            'MISS';

          state.lastJudgmentLife =
            0.65;

          playSfx('miss');
        } else {
          if (
            judgment ===
            'PERFECT'
          ) {
            state.perfect += 1;
            state.combo += 1;
            state.fever += 9;

            playSfx('perfect');
          }

          if (
            judgment ===
            'GREAT'
          ) {
            state.great += 1;
            state.combo += 1;
            state.fever += 6;

            playSfx('hit');
          }

          if (
            judgment ===
            'GOOD'
          ) {
            state.good += 1;
            state.combo += 1;
            state.fever += 3;

            playSfx('hit');
          }

          state.accuracyTotal +=
            accuracyValue;

          state.accuracyCount +=
            1;

          state.maxCombo =
            Math.max(
              state.maxCombo,
              state.combo,
            );

          state.score +=
            Math.round(
              (judgment ===
              'PERFECT'
                ? 1000
                : judgment ===
                    'GREAT'
                  ? 700
                  : 420) *
                state.multiplier *
                DIFFICULTIES[
                  difficulty
                ].scoreMultiplier,
            );

          state.lastJudgment =
            judgment;

          state.lastJudgmentLife =
            0.65;

          state.laneFlash[
            lane
          ] = 1;

          state.lanePulse[
            lane
          ] = 1;

          if (
            state.combo >
              0 &&
            state.combo %
              10 ===
              0
          ) {
            state.score +=
              state.combo *
              50;

            state.fever =
              clamp(
                state.fever +
                  12,
                0,
                100,
              );
          }

          spawnParticles(
            state,
            240 +
              lane *
                160,
            545,
            LANE_COLORS[
              lane
            ],
            judgment ===
              'PERFECT'
              ? 32
              : 18,
          );
        }

        state.fever =
          clamp(
            state.fever,
            0,
            100,
          );

        state.floatingTexts.push({
          x:
            240 +
            lane *
              160,
          y: 505,
          text:
            judgment ===
            'MISS'
              ? 'MISS'
              : `${judgment}  ${Math.abs(
                  Math.round(
                    offset *
                      1000,
                  ),
                )}ms`,
          color:
            judgment ===
            'PERFECT'
              ? '#ffd66b'
              : judgment ===
                  'GREAT'
                ? '#9d7cff'
                : judgment ===
                    'GOOD'
                  ? '#62e6ff'
                  : '#ff5f73',
          life: 0.75,
          maxLife: 0.75,
          scale:
            judgment ===
            'PERFECT'
              ? 1.2
              : 1,
        });

        if (
          judgment ===
          'PERFECT'
        ) {
          state.screenShake =
            screenShakeEnabled
              ? 2.5
              : 0;
        }

        syncHud();
      },
      [
        difficulty,
        playSfx,
        screenShakeEnabled,
        spawnParticles,
        syncHud,
      ],
    );

  /* ==========================================================
     HIT NOTE
     ========================================================== */

  const hitLane =
    useCallback(
      (lane: Lane) => {
        const state =
          stateRef.current;

        if (
          !state.running ||
          state.finished
        ) {
          return;
        }

        const targetTime =
          state.elapsed;

        let candidate:
          | Note
          | null = null;

        let smallest =
          Infinity;

        for (
          const note of
            state.notes
        ) {
          if (
            note.hit ||
            note.missed ||
            note.lane !==
              lane
          ) {
            continue;
          }

          const difference =
            Math.abs(
              note.time -
                targetTime,
            );

          if (
            difference <
            smallest
          ) {
            smallest =
              difference;
            candidate =
              note;
          }
        }

        if (
          !candidate
        ) {
          return;
        }

        const offset =
          targetTime -
          candidate.time;

        const absolute =
          Math.abs(offset);

        if (
          absolute >
          JUDGMENT_WINDOWS.miss
        ) {
          return;
        }

        candidate.hit = true;

        let judgment:
          | Judgment;

        if (
          absolute <=
          JUDGMENT_WINDOWS.perfect
        ) {
          judgment =
            'PERFECT';
        } else if (
          absolute <=
          JUDGMENT_WINDOWS.great
        ) {
          judgment =
            'GREAT';
        } else {
          judgment =
            'GOOD';
        }

        registerJudgment(
          candidate,
          judgment,
          offset,
        );

        if (
          candidate.kind ===
          'hold'
        ) {
          candidate.holding =
            true;
        }
      },
      [registerJudgment],
    );

  /* ==========================================================
     FEVER
     ========================================================== */

  const activateFever =
    useCallback(() => {
      const state =
        stateRef.current;

      if (
        !state.running ||
        state.finished ||
        state.fever <
          100 ||
        state.feverActive
      ) {
        return;
      }

      state.feverActive =
        true;

      state.feverTimer =
        7.5;

      state.multiplier =
        2.5;

      state.score +=
        2500;

      playSfx('fever');

      spawnParticles(
        state,
        WIDTH / 2,
        330,
        '#ff62c7',
        100,
      );

      syncHud();
    }, [
      playSfx,
      spawnParticles,
      syncHud,
    ]);

  /* ==========================================================
     START
     ========================================================== */

  const startGame =
    useCallback(() => {
      const state =
        createInitialState();

      const config =
        DIFFICULTIES[
          difficulty
        ];

      state.duration =
        config.duration;

      state.notes =
        generateNotes(
          difficulty,
        );

      state.running =
        true;

      state.finished =
        false;

      state.elapsed = 0;

      state.seed =
        Math.floor(
          Math.random() *
            1000000,
        );

      stateRef.current =
        state;

      setScreen('game');

      updateSave(
        (current) => ({
          ...current,
          sessions:
            current.sessions +
            1,
        }),
      );

      playSfx('start');

      syncHud();
    }, [
      difficulty,
      playSfx,
      syncHud,
      updateSave,
    ]);

  /* ==========================================================
     PAUSE
     ========================================================== */

  const pauseGame =
    useCallback(() => {
      const state =
        stateRef.current;

      if (
        screen === 'game' &&
        state.running
      ) {
        state.running =
          false;

        setScreen('pause');

        syncHud();
      }
    }, [
      screen,
      syncHud,
    ]);

  const resumeGame =
    useCallback(() => {
      const state =
        stateRef.current;

      if (
        screen === 'pause' &&
        !state.finished
      ) {
        state.running =
          true;

        setScreen('game');

        lastFrameRef.current =
          performance.now();
      }
    }, [screen]);

  /* ==========================================================
     FINISH
     ========================================================== */

  const finishGame =
    useCallback(() => {
      const state =
        stateRef.current;

      if (
        state.finished
      ) {
        return;
      }

      state.running =
        false;

      state.finished =
        true;

      const accuracy =
        accuracyOf(state);

      const rank =
        rankFor(
          accuracy,
          state.miss,
          state.maxCombo,
        );

      setResultRank(rank);

      updateSave(
        (current) => ({
          ...current,
          highScore:
            Math.max(
              current.highScore,
              state.score,
            ),
          bestCombo:
            Math.max(
              current.bestCombo,
              state.maxCombo,
            ),
          bestAccuracy:
            Math.max(
              current.bestAccuracy,
              accuracy,
            ),
          totalNotes:
            current.totalNotes +
            state.notes.length,
          perfectNotes:
            current.perfectNotes +
            state.perfect,
        }),
      );

      setScreen(
        'results',
      );

      syncHud();

      playSfx('finish');

      window.setTimeout(
        () => {
          playTone(
            rank === 'S+' ||
              rank === 'S'
              ? 880
              : 660,
            0.3,
            'triangle',
            0.02,
          );
        },
        120,
      );
    }, [
      playSfx,
      playTone,
      syncHud,
      updateSave,
    ]);

  /* ==========================================================
     GAME UPDATE
     ========================================================== */

  const update =
    useCallback(
      (delta: number) => {
        const state =
          stateRef.current;

        if (
          !state.running ||
          state.finished
        ) {
          return;
        }

        if (
          state.hitStop > 0
        ) {
          state.hitStop -=
            delta;

          return;
        }

        state.elapsed +=
          delta;

        if (
          state.elapsed >=
          state.duration
        ) {
          finishGame();
          return;
        }

        if (
          state.combo > 0
        ) {
          // Combo slowly decays
          // only when no note is hit.
          //
          // The rhythm itself is
          // responsible for keeping
          // the combo alive.
        }

        if (
          state.feverActive
        ) {
          state.feverTimer -=
            delta;

          state.fever -=
            delta * 2.8;

          if (
            state.feverTimer <=
              0 ||
            state.fever <= 0
          ) {
            state.feverActive =
              false;

            state.multiplier =
              1;

            state.fever = 0;
          }
        }

        state.laneFlash =
          state.laneFlash.map(
            (value) =>
              Math.max(
                0,
                value -
                  delta * 5,
              ),
          );

        state.lanePulse =
          state.lanePulse.map(
            (value) =>
              Math.max(
                0,
                value -
                  delta * 3.5,
              ),
          );

        state.screenShake =
          Math.max(
            0,
            state.screenShake -
              delta * 12,
          );

        state.lastJudgmentLife =
          Math.max(
            0,
            state.lastJudgmentLife -
              delta,
          );

        /* --------------------
           MISS DETECTION
           -------------------- */

        for (
          const note of
            state.notes
        ) {
          if (
            note.hit ||
            note.missed
          ) {
            continue;
          }

          if (
            state.elapsed -
              note.time >
            JUDGMENT_WINDOWS
              .miss
          ) {
            note.missed =
              true;

            registerJudgment(
              note,
              'MISS',
              state.elapsed -
                note.time,
            );
          }
        }

        /* --------------------
           HOLD NOTES
           -------------------- */

        for (
          const note of
            state.notes
        ) {
          if (
            note.kind !==
              'hold' ||
            !note.hit ||
            !note.holding
          ) {
            continue;
          }

          const heldUntil =
            note.time +
            note.duration;

          if (
            state.elapsed >=
            heldUntil
          ) {
            note.holding =
              false;

            state.score +=
              Math.round(
                900 *
                  state.multiplier,
              );

            state.fever =
              clamp(
                state.fever +
                  14,
                0,
                100,
              );

            spawnParticles(
              state,
              240 +
                note.lane *
                  160,
              540,
              LANE_COLORS[
                note.lane
              ],
              20,
            );
          }
        }

        /* --------------------
           PARTICLES
           -------------------- */

        for (
          const particle of
            state.particles
        ) {
          particle.life -=
            delta;

          particle.vx *=
            Math.pow(
              particle.drag,
              delta * 60,
            );

          particle.vy *=
            Math.pow(
              particle.drag,
              delta * 60,
            );

          particle.vy +=
            particle.gravity *
            delta;

          particle.x +=
            particle.vx *
            delta;

          particle.y +=
            particle.vy *
            delta;
        }

        state.particles =
          state.particles.filter(
            (particle) =>
              particle.life >
              0,
          );

        /* --------------------
           FLOATING TEXT
           -------------------- */

        for (
          const text of
            state.floatingTexts
        ) {
          text.life -=
            delta;

          text.y -=
            delta * 38;

          text.scale =
            lerp(
              text.scale,
              1,
              delta * 4,
            );
        }

        state.floatingTexts =
          state.floatingTexts.filter(
            (text) =>
              text.life >
              0,
          );

        syncHud();
      },
      [
        finishGame,
        registerJudgment,
        spawnParticles,
        syncHud,
      ],
    );

  /* ==========================================================
     RENDER
     ========================================================== */

  const render =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        now: number,
      ) => {
        const state =
          stateRef.current;

        const config =
          DIFFICULTIES[
            difficulty
          ];

        const scaleX =
          ctx.canvas.width /
          WIDTH;

        const scaleY =
          ctx.canvas.height /
          HEIGHT;

        const scale =
          Math.min(
            scaleX,
            scaleY,
          );

        const offsetX =
          (ctx.canvas.width -
            WIDTH * scale) /
          2;

        const offsetY =
          (ctx.canvas.height -
            HEIGHT * scale) /
          2;

        ctx.clearRect(
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height,
        );

        ctx.save();

        ctx.translate(
          offsetX,
          offsetY,
        );

        ctx.scale(
          scale,
          scale,
        );

        /* ======================================================
           BACKGROUND
           ====================================================== */

        const gradient =
          ctx.createLinearGradient(
            0,
            0,
            0,
            HEIGHT,
          );

        gradient.addColorStop(
          0,
          '#070817',
        );

        gradient.addColorStop(
          0.55,
          state.feverActive
            ? '#160b25'
            : '#0b0d22',
        );

        gradient.addColorStop(
          1,
          '#03040c',
        );

        ctx.fillStyle =
          gradient;

        ctx.fillRect(
          0,
          0,
          WIDTH,
          HEIGHT,
        );

        /* ======================================================
           STARS
           ====================================================== */

        for (
          const star of
            state.stars
        ) {
          const twinkle =
            0.45 +
            Math.sin(
              now * 0.001 *
                star.depth +
                star.phase,
            ) *
              0.3;

          ctx.globalAlpha =
            twinkle;

          ctx.fillStyle =
            '#dce8ff';

          ctx.beginPath();

          ctx.arc(
            star.x,
            star.y,
            star.size *
              star.depth,
            0,
            Math.PI * 2,
          );

          ctx.fill();
        }

        ctx.globalAlpha = 1;

        /* ======================================================
           ASTRAL HALO
           ====================================================== */

        const haloX =
          WIDTH / 2;

        const haloY =
          175;

        const halo =
          ctx.createRadialGradient(
            haloX,
            haloY,
            20,
            haloX,
            haloY,
            250,
          );

        halo.addColorStop(
          0,
          state.feverActive
            ? 'rgba(255,98,199,.28)'
            : 'rgba(98,230,255,.18)',
        );

        halo.addColorStop(
          1,
          'rgba(0,0,0,0)',
        );

        ctx.fillStyle =
          halo;

        ctx.fillRect(
          0,
          0,
          WIDTH,
          390,
        );

        /* ======================================================
           ANIME CHARACTER / ASTRAL MAIDEN
           ====================================================== */

        const characterX =
          WIDTH / 2;

        const characterY =
          150 +
          Math.sin(
            now * 0.002,
          ) *
            4;

        ctx.save();

        ctx.translate(
          characterX,
          characterY,
        );

        const auraColor =
          state.feverActive
            ? '#ff62c7'
            : '#62e6ff';

        drawGlow(
          ctx,
          0,
          12,
          state.feverActive
            ? 42
            : 30,
          auraColor,
          0.22,
        );

        /* Hair */

        ctx.fillStyle =
          '#121a3d';

        ctx.beginPath();

        ctx.moveTo(
          -32,
          -8,
        );

        ctx.quadraticCurveTo(
          -50,
          28,
          -39,
          65,
        );

        ctx.lineTo(
          -19,
          35,
        );

        ctx.lineTo(
          -8,
          75,
        );

        ctx.lineTo(
          4,
          34,
        );

        ctx.lineTo(
          28,
          68,
        );

        ctx.quadraticCurveTo(
          43,
          28,
          31,
          -8,
        );

        ctx.closePath();

        ctx.fill();

        /* Face */

        const face =
          ctx.createRadialGradient(
            -7,
            -11,
            2,
            0,
            0,
            30,
          );

        face.addColorStop(
          0,
          '#ffe5dd',
        );

        face.addColorStop(
          1,
          '#d89baf',
        );

        ctx.fillStyle =
          face;

        ctx.beginPath();

        ctx.ellipse(
          0,
          0,
          22,
          27,
          0,
          0,
          Math.PI * 2,
        );

        ctx.fill();

        /* Hair fringe */

        ctx.fillStyle =
          '#1c2857';

        ctx.beginPath();

        ctx.moveTo(
          -25,
          -13,
        );

        ctx.quadraticCurveTo(
          -8,
          -34,
          24,
          -14,
        );

        ctx.lineTo(
          11,
          3,
        );

        ctx.lineTo(
          3,
          -15,
        );

        ctx.lineTo(
          -7,
          5,
        );

        ctx.lineTo(
          -15,
          -15,
        );

        ctx.closePath();

        ctx.fill();

        /* Eyes */

        ctx.fillStyle =
          '#62e6ff';

        ctx.shadowColor =
          '#62e6ff';

        ctx.shadowBlur = 8;

        ctx.beginPath();

        ctx.ellipse(
          -9,
          3,
          4,
          2.7,
          0,
          0,
          Math.PI * 2,
        );

        ctx.ellipse(
          9,
          3,
          4,
          2.7,
          0,
          0,
          Math.PI * 2,
        );

        ctx.fill();

        ctx.shadowBlur = 0;

        /* Body */

        ctx.fillStyle =
          '#e9ecff';

        ctx.beginPath();

        ctx.moveTo(
          -17,
          25,
        );

        ctx.lineTo(
          -36,
          83,
        );

        ctx.lineTo(
          0,
          67,
        );

        ctx.lineTo(
          36,
          83,
        );

        ctx.lineTo(
          17,
          25,
        );

        ctx.closePath();

        ctx.fill();

        /* Dress */

        ctx.strokeStyle =
          auraColor;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
          -36,
          83,
        );

        ctx.quadraticCurveTo(
          0,
          55,
          36,
          83,
        );

        ctx.stroke();

        /* Floating crystal */

        const crystalY =
          -56 +
          Math.sin(
            now * 0.003,
          ) *
            5;

        ctx.save();

        ctx.translate(
          0,
          crystalY,
        );

        ctx.rotate(
          now * 0.001,
        );

        ctx.fillStyle =
          auraColor;

        ctx.shadowColor =
          auraColor;

        ctx.shadowBlur = 18;

        ctx.beginPath();

        ctx.moveTo(
          0,
          -12,
        );

        ctx.lineTo(
          8,
          0,
        );

        ctx.lineTo(
          0,
          12,
        );

        ctx.lineTo(
          -8,
          0,
        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();

        ctx.restore();

        /* ======================================================
           LANE AREA
           ====================================================== */

        const laneLeft =
          160;

        const laneTop =
          225;

        const laneWidth =
          160;

        const laneHeight =
          350;

        /* Outer frame */

        ctx.save();

        roundedRect(
          ctx,
          laneLeft - 16,
          laneTop - 18,
          laneWidth * 4 +
            32,
          laneHeight + 35,
          22,
        );

        ctx.fillStyle =
          'rgba(7,9,25,.78)';

        ctx.fill();

        ctx.strokeStyle =
          state.feverActive
            ? 'rgba(255,98,199,.75)'
            : 'rgba(98,230,255,.28)';

        ctx.lineWidth = 1.5;

        ctx.stroke();

        ctx.restore();

        /* ======================================================
           LANES
           ====================================================== */

        for (
          const lane of
            LANES
        ) {
          const x =
            laneLeft +
            lane *
              laneWidth;

          const flash =
            state.laneFlash[
              lane
            ];

          const pulse =
            state.lanePulse[
              lane
            ];

          ctx.fillStyle =
            flash > 0
              ? `${LANE_COLORS[lane]}22`
              : 'rgba(255,255,255,.015)';

          ctx.fillRect(
            x,
            laneTop,
            laneWidth - 2,
            laneHeight,
          );

          drawLineGlow(
            ctx,
            x,
            laneTop,
            x,
            laneTop +
              laneHeight,
            LANE_COLORS[
              lane
            ],
            1,
            0.18,
          );

          if (
            pulse > 0
          ) {
            ctx.save();

            ctx.globalAlpha =
              pulse;

            ctx.strokeStyle =
              LANE_COLORS[
                lane
              ];

            ctx.lineWidth =
              4;

            ctx.shadowColor =
              LANE_COLORS[
                lane
              ];

            ctx.shadowBlur =
              22;

            ctx.strokeRect(
              x + 4,
              laneTop + 4,
              laneWidth -
                10,
              laneHeight -
                8,
            );

            ctx.restore();
          }

          ctx.fillStyle =
            LANE_COLORS[
              lane
            ];

          ctx.globalAlpha =
            0.65;

          ctx.font =
            '600 10px Inter, sans-serif';

          ctx.textAlign =
            'center';

          ctx.fillText(
            LANE_NAMES[
              lane
            ],
            x +
              laneWidth /
                2,
            laneTop +
              24,
          );

          ctx.globalAlpha = 1;

          /* Key */

          roundedRect(
            ctx,
            x +
              laneWidth /
                2 -
              20,
            587,
            40,
            32,
            9,
          );

          ctx.fillStyle =
            'rgba(255,255,255,.04)';

          ctx.fill();

          ctx.strokeStyle =
            `${LANE_COLORS[lane]}88`;

          ctx.stroke();

          ctx.fillStyle =
            '#eef4ff';

          ctx.font =
            '700 14px Inter, sans-serif';

          ctx.fillText(
            LANE_KEYS[
              lane
            ].toUpperCase(),
            x +
              laneWidth /
                2,
            608,
          );
        }

        /* ======================================================
           JUDGMENT LINE
           ====================================================== */

        const judgmentY =
          548;

        drawLineGlow(
          ctx,
          laneLeft,
          judgmentY,
          laneLeft +
            laneWidth * 4,
          judgmentY,
          state.feverActive
            ? '#ff62c7'
            : '#f4f7ff',
          state.feverActive
            ? 4
            : 2,
          state.feverActive
            ? 0.9
            : 0.5,
        );

        /* ======================================================
           NOTES
           ====================================================== */

        for (
          const note of
            state.notes
        ) {
          if (
            note.hit &&
            !note.holding
          ) {
            continue;
          }

          if (
            note.missed
          ) {
            continue;
          }

          const travel =
            note.time -
            state.elapsed;

          const noteY =
            judgmentY -
            travel *
              config.speed;

          if (
            noteY <
                laneTop -
                  90 ||
            noteY >
                judgmentY +
                  120
          ) {
            continue;
          }

          const x =
            laneLeft +
            note.lane *
              laneWidth +
            laneWidth /
              2;

          const color =
            LANE_COLORS[
              note.lane
            ];

          if (
            note.kind ===
              'hold' &&
            note.duration >
              0
          ) {
            const endY =
              noteY -
              note.duration *
                config.speed;

            ctx.save();

            ctx.globalAlpha =
              0.32;

            ctx.fillStyle =
              color;

            roundedRect(
              ctx,
              x - 12,
              endY,
              24,
              noteY -
                endY,
              12,
            );

            ctx.fill();

            ctx.restore();
          }

          ctx.save();

          ctx.fillStyle =
            color;

          ctx.shadowColor =
            color;

          ctx.shadowBlur =
            note.kind ===
            'burst'
              ? 24
              : 14;

          if (
            note.kind ===
            'burst'
          ) {
            ctx.translate(
              x,
              noteY,
            );

            ctx.rotate(
              Math.PI / 4,
            );

            roundedRect(
              ctx,
              -13,
              -13,
              26,
              26,
              5,
            );

            ctx.fill();
          } else {
            roundedRect(
              ctx,
              x - 16,
              noteY - 10,
              32,
              20,
              8,
            );

            ctx.fill();
          }

          ctx.restore();

          ctx.save();

          ctx.strokeStyle =
            '#ffffff';

          ctx.globalAlpha =
            0.45;

          ctx.lineWidth = 1;

          ctx.strokeRect(
            x - 11,
            noteY - 5,
            22,
            10,
          );

          ctx.restore();
        }

        /* ======================================================
           FEVER EFFECT
           ====================================================== */

        if (
          state.feverActive
        ) {
          const feverAlpha =
            0.06 +
            Math.sin(
              now * 0.01,
            ) *
              0.025;

          ctx.fillStyle =
            `rgba(255,98,199,${feverAlpha})`;

          ctx.fillRect(
            0,
            0,
            WIDTH,
            HEIGHT,
          );

          ctx.save();

          ctx.strokeStyle =
            '#ff62c7';

          ctx.globalAlpha =
            0.2;

          ctx.lineWidth = 3;

          ctx.beginPath();

          ctx.arc(
            WIDTH / 2,
            330,
            210 +
              Math.sin(
                now *
                  0.004,
              ) *
                20,
            0,
            Math.PI * 2,
          );

          ctx.stroke();

          ctx.restore();
        }

        /* ======================================================
           PARTICLES
           ====================================================== */

        for (
          const particle of
            state.particles
        ) {
          ctx.save();

          ctx.globalAlpha =
            clamp(
              particle.life /
                particle.maxLife,
              0,
              1,
            );

          ctx.fillStyle =
            particle.color;

          ctx.shadowColor =
            particle.color;

          ctx.shadowBlur =
            particle.size *
            4;

          ctx.beginPath();

          ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2,
          );

          ctx.fill();

          ctx.restore();
        }

        /* ======================================================
           FLOATING TEXT
           ====================================================== */

        for (
          const text of
            state.floatingTexts
        ) {
          ctx.save();

          ctx.globalAlpha =
            clamp(
              text.life /
                text.maxLife,
              0,
              1,
            );

          ctx.fillStyle =
            text.color;

          ctx.shadowColor =
            text.color;

          ctx.shadowBlur =
            15;

          ctx.textAlign =
            'center';

          ctx.font =
            `800 ${
              16 *
              text.scale
            }px Inter, sans-serif`;

          ctx.fillText(
            text.text,
            text.x,
            text.y,
          );

          ctx.restore();
        }

        /* ======================================================
           TOP TITLE
           ====================================================== */

        ctx.fillStyle =
          '#eef4ff';

        ctx.font =
          '800 15px Inter, sans-serif';

        ctx.textAlign =
          'left';

        ctx.fillText(
          'NEON RESONANCE',
          34,
          36,
        );

        ctx.fillStyle =
          '#6c789f';

        ctx.font =
          '600 10px Inter, sans-serif';

        ctx.fillText(
          'ASTRAL PERFORMANCE SYSTEM',
          34,
          53,
        );

        /* ======================================================
           SCORE
           ====================================================== */

        ctx.textAlign =
          'right';

        ctx.fillStyle =
          '#ffffff';

        ctx.font =
          '800 24px Inter, sans-serif';

        ctx.fillText(
          state.score
            .toLocaleString(),
          WIDTH - 34,
          39,
        );

        ctx.fillStyle =
          '#687399';

        ctx.font =
          '600 9px Inter, sans-serif';

        ctx.fillText(
          'SCORE',
          WIDTH - 34,
          55,
        );

        /* ======================================================
           COMBO
           ====================================================== */

        if (
          state.combo >= 2
        ) {
          ctx.textAlign =
            'center';

          ctx.fillStyle =
            state.combo >=
            30
              ? '#ffd66b'
              : '#eef4ff';

          ctx.font =
            `800 ${
              state.combo >=
              30
                ? 34
                : 28
            }px Inter, sans-serif`;

          ctx.fillText(
            `${state.combo}x`,
            WIDTH / 2,
            625,
          );

          ctx.fillStyle =
            '#7783a7';

          ctx.font =
            '700 9px Inter, sans-serif';

          ctx.fillText(
            'COMBO',
            WIDTH / 2,
            642,
          );
        }

        /* ======================================================
           FEVER BAR
           ====================================================== */

        const feverX =
          34;

        const feverY =
          630;

        const feverW =
          170;

        const feverH =
          9;

        roundedRect(
          ctx,
          feverX,
          feverY,
          feverW,
          feverH,
          5,
        );

        ctx.fillStyle =
          'rgba(255,255,255,.05)';

        ctx.fill();

        if (
          state.fever > 0
        ) {
          roundedRect(
            ctx,
            feverX,
            feverY,
            feverW *
              (state.fever /
                100),
            feverH,
            5,
          );

          ctx.fillStyle =
            state.feverActive
              ? '#ff62c7'
              : '#62e6ff';

          ctx.fill();
        }

        ctx.fillStyle =
          '#7581a7';

        ctx.font =
          '700 8px Inter, sans-serif';

        ctx.textAlign =
          'left';

        ctx.fillText(
          state.feverActive
            ? 'FEVER ACTIVE'
            : 'FEVER',
          feverX,
          653,
        );

        /* ======================================================
           TIME
           ====================================================== */

        const timeRatio =
          clamp(
            state.elapsed /
              state.duration,
            0,
            1,
          );

        ctx.fillStyle =
          'rgba(255,255,255,.06)';

        ctx.fillRect(
          400,
          44,
          300,
          2,
        );

        ctx.fillStyle =
          state.feverActive
            ? '#ff62c7'
            : '#62e6ff';

        ctx.fillRect(
          400,
          44,
          300 *
            timeRatio,
          2,
        );

        ctx.restore();
      },
      [
        difficulty,
      ],
    );

  /* ==========================================================
     ANIMATION LOOP
     ========================================================== */

  useEffect(() => {
    if (
      !open ||
      screen !== 'game'
    ) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext(
        '2d',
      );

    if (!ctx) {
      return;
    }

    const resize =
      () => {
        const rect =
          canvas.getBoundingClientRect();

        const dpr =
          Math.min(
            window.devicePixelRatio ||
              1,
            2,
          );

        canvas.width =
          Math.floor(
            rect.width * dpr,
          );

        canvas.height =
          Math.floor(
            rect.height * dpr,
          );

        ctx.imageSmoothingEnabled =
          true;
      };

    resize();

    window.addEventListener(
      'resize',
      resize,
    );

    lastFrameRef.current =
      performance.now();

    const loop = (
      timestamp: number,
    ) => {
      const delta =
        Math.min(
          0.033,
          Math.max(
            0,
            (timestamp -
              lastFrameRef.current) /
              1000,
          ),
        );

      lastFrameRef.current =
        timestamp;

      update(delta);

      render(
        ctx,
        timestamp,
      );

      animationRef.current =
        requestAnimationFrame(
          loop,
        );
    };

    animationRef.current =
      requestAnimationFrame(
        loop,
      );

    return () => {
      window.removeEventListener(
        'resize',
        resize,
      );

      if (
        animationRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationRef.current,
        );

        animationRef.current =
          null;
      }
    };
  }, [
    open,
    render,
    screen,
    update,
  ]);

  /* ==========================================================
     KEYBOARD
     ========================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }

    const down = (
      event: KeyboardEvent,
    ) => {
      const key =
        event.key.toLowerCase();

      if (
        [
          ' ',
          'arrowup',
          'arrowdown',
          'arrowleft',
          'arrowright',
        ].includes(key)
      ) {
        event.preventDefault();
      }

      if (
        key === 'escape' ||
        key === 'p'
      ) {
        if (
          screen === 'game'
        ) {
          pauseGame();
        } else if (
          screen === 'pause'
        ) {
          resumeGame();
        }

        return;
      }

      if (
        key === ' '
      ) {
        activateFever();
        return;
      }

      const index =
        LANE_KEYS.indexOf(
          key,
        );

      if (
        index >= 0
      ) {
        keysRef.current.add(
          key,
        );

        hitLane(
          index as Lane,
        );
      }
    };

    const up = (
      event: KeyboardEvent,
    ) => {
      keysRef.current.delete(
        event.key.toLowerCase(),
      );
    };

    window.addEventListener(
      'keydown',
      down,
    );

    window.addEventListener(
      'keyup',
      up,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        down,
      );

      window.removeEventListener(
        'keyup',
        up,
      );
    };
  }, [
    activateFever,
    hitLane,
    open,
    pauseGame,
    resumeGame,
    screen,
  ]);

  /* ==========================================================
     CLEANUP
     ========================================================== */

  useEffect(() => {
    if (!open) {
      setScreen('menu');

      const state =
        createInitialState();

      stateRef.current =
        state;
    }
  }, [open]);

  /* ==========================================================
     RESULTS DATA
     ========================================================== */

  const resultAccuracy =
    useMemo(
      () =>
        accuracyOf(
          stateRef.current,
        ),
      [
        screen,
        hud.score,
      ],
    );

  /* ==========================================================
     CLOSED
     ========================================================== */

  if (!open) {
    return null;
  }

  /* ==========================================================
     MODAL
     ========================================================== */

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        background:
          'rgba(2,3,12,.86)',
        backdropFilter:
          'blur(18px)',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position:
            'relative',
          width:
            'min(1180px, 96vw)',
          height:
            'min(790px, 94vh)',
          minHeight: 580,
          overflow:
            'hidden',
          border:
            '1px solid rgba(130,150,255,.22)',
          borderRadius: 24,
          background:
            'linear-gradient(145deg,#08091a,#050611)',
          boxShadow:
            '0 30px 120px rgba(0,0,0,.72), 0 0 80px rgba(98,230,255,.08)',
        }}
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <div
          style={{
            position:
              'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 68,
            zIndex: 20,
            display:
              'flex',
            alignItems:
              'center',
            justifyContent:
              'space-between',
            padding:
              '0 22px',
            borderBottom:
              '1px solid rgba(255,255,255,.06)',
            background:
              'rgba(5,6,17,.74)',
            backdropFilter:
              'blur(16px)',
          }}
        >
          <div>
            <div
              style={{
                color:
                  '#eef4ff',
                fontSize: 13,
                fontWeight: 900,
                letterSpacing:
                  '.18em',
              }}
            >
              NEON
              <span
                style={{
                  color:
                    '#62e6ff',
                }}
              >
                RESONANCE
              </span>
            </div>

            <div
              style={{
                marginTop: 3,
                color:
                  '#66729b',
                fontSize: 8,
                fontWeight: 700,
                letterSpacing:
                  '.18em',
              }}
            >
              ASTRAL PERFORMANCE SYSTEM
            </div>
          </div>

          <div
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap: 8,
            }}
          >
            {screen ===
              'game' && (
              <button
                type="button"
                onClick={
                  pauseGame
                }
                style={{
                  border:
                    '1px solid rgba(98,230,255,.2)',
                  background:
                    'rgba(98,230,255,.05)',
                  color:
                    '#9eaccf',
                  padding:
                    '9px 13px',
                  borderRadius: 10,
                  cursor:
                    'pointer',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing:
                    '.1em',
                }}
              >
                PAUSE
              </button>
            )}

            <button
              type="button"
              onClick={
                onClose
              }
              aria-label="Close game"
              style={{
                width: 36,
                height: 36,
                border:
                  '1px solid rgba(255,255,255,.09)',
                borderRadius: 10,
                background:
                  'rgba(255,255,255,.035)',
                color:
                  '#9ba8c9',
                cursor:
                  'pointer',
                fontSize: 17,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* ==================================================
            MENU
            ================================================== */}

        {screen ===
          'menu' && (
          <div
            style={{
              position:
                'absolute',
              inset: 68,
              overflow:
                'auto',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              padding: 30,
            }}
          >
            <div
              style={{
                width:
                  'min(820px, 100%)',
                textAlign:
                  'center',
              }}
            >
              <div
                style={{
                  display:
                    'inline-flex',
                  alignItems:
                    'center',
                  gap: 8,
                  padding:
                    '7px 11px',
                  border:
                    '1px solid rgba(98,230,255,.2)',
                  borderRadius:
                    999,
                  color:
                    '#62e6ff',
                  background:
                    'rgba(98,230,255,.04)',
                  fontSize: 8,
                  fontWeight: 900,
                  letterSpacing:
                    '.2em',
                }}
              >
                SYSTEM INSTANCE 02
              </div>

              <h1
                style={{
                  margin:
                    '22px 0 8px',
                  color:
                    '#f3f6ff',
                  fontSize:
                    'clamp(42px, 7vw, 78px)',
                  lineHeight:
                    .95,
                  letterSpacing:
                    '-.055em',
                  fontWeight: 950,
                }}
              >
                NEON
                <br />
                <span
                  style={{
                    color:
                      '#62e6ff',
                    textShadow:
                      '0 0 40px rgba(98,230,255,.3)',
                  }}
                >
                  RESONANCE
                </span>
              </h1>

              <p
                style={{
                  margin:
                    '18px auto 34px',
                  maxWidth:
                    580,
                  color:
                    '#7d89ad',
                  fontSize: 13,
                  lineHeight:
                    1.8,
                }}
              >
                A rhythm-based astral
                performance system.
                Synchronize with the
                falling constellations,
                build your resonance,
                and awaken the stage.
              </p>

              {/* Difficulty */}

              <div
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    'repeat(3, 1fr)',
                  gap: 10,
                  marginBottom:
                    22,
                }}
              >
                {(
                  Object.keys(
                    DIFFICULTIES,
                  ) as Difficulty[]
                ).map(
                  (
                    id,
                  ) => {
                    const item =
                      DIFFICULTIES[
                        id
                      ];

                    const selected =
                      difficulty ===
                      id;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          setDifficulty(
                            id,
                          )
                        }
                        style={{
                          textAlign:
                            'left',
                          padding:
                            16,
                          border:
                            selected
                              ? '1px solid rgba(98,230,255,.55)'
                              : '1px solid rgba(255,255,255,.07)',
                          borderRadius:
                            14,
                          background:
                            selected
                              ? 'rgba(98,230,255,.08)'
                              : 'rgba(255,255,255,.025)',
                          color:
                            '#fff',
                          cursor:
                            'pointer',
                          boxShadow:
                            selected
                              ? '0 0 30px rgba(98,230,255,.08)'
                              : 'none',
                        }}
                      >
                        <div
                          style={{
                            color:
                              selected
                                ? '#62e6ff'
                                : '#c9d1e8',
                            fontSize:
                              11,
                            fontWeight:
                              900,
                            letterSpacing:
                              '.13em',
                          }}
                        >
                          {item.name}
                        </div>

                        <div
                          style={{
                            marginTop:
                              6,
                            color:
                              '#687399',
                            fontSize:
                              9,
                          }}
                        >
                          {item.subtitle}
                        </div>

                        <div
                          style={{
                            marginTop:
                              12,
                            color:
                              '#8490b3',
                            fontSize:
                              8,
                            fontWeight:
                              800,
                          }}
                        >
                          {item.bpm}{' '}
                          BPM
                        </div>
                      </button>
                    );
                  },
                )}
              </div>

              <div
                style={{
                  display:
                    'flex',
                  justifyContent:
                    'center',
                  gap: 10,
                  flexWrap:
                    'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={
                    startGame
                  }
                  style={{
                    minWidth:
                      210,
                    padding:
                      '15px 24px',
                    border:
                      '1px solid rgba(98,230,255,.7)',
                    borderRadius:
                      13,
                    background:
                      'linear-gradient(135deg,rgba(98,230,255,.16),rgba(157,124,255,.12))',
                    color:
                      '#f5f8ff',
                    cursor:
                      'pointer',
                    fontSize:
                      11,
                    fontWeight:
                      950,
                    letterSpacing:
                      '.18em',
                    boxShadow:
                      '0 0 40px rgba(98,230,255,.1)',
                  }}
                >
                  BEGIN PERFORMANCE
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setScreen(
                      'howto',
                    )
                  }
                  style={{
                    padding:
                      '15px 18px',
                    border:
                      '1px solid rgba(255,255,255,.09)',
                    borderRadius:
                      13,
                    background:
                      'rgba(255,255,255,.035)',
                    color:
                      '#9ba8c9',
                    cursor:
                      'pointer',
                    fontSize:
                      10,
                    fontWeight:
                      800,
                    letterSpacing:
                      '.12em',
                  }}
                >
                  HOW TO PLAY
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setScreen(
                      'settings',
                    )
                  }
                  style={{
                    padding:
                      '15px 18px',
                    border:
                      '1px solid rgba(255,255,255,.09)',
                    borderRadius:
                      13,
                    background:
                      'rgba(255,255,255,.035)',
                    color:
                      '#9ba8c9',
                    cursor:
                      'pointer',
                    fontSize:
                      10,
                    fontWeight:
                      800,
                    letterSpacing:
                      '.12em',
                  }}
                >
                  SETTINGS
                </button>
              </div>

              {save && (
                <div
                  style={{
                    marginTop:
                      28,
                    display:
                      'flex',
                    justifyContent:
                      'center',
                    gap: 28,
                    color:
                      '#596586',
                    fontSize: 8,
                    fontWeight:
                      800,
                    letterSpacing:
                      '.1em',
                  }}
                >
                  <span>
                    HIGH SCORE{' '}
                    <b
                      style={{
                        color:
                          '#9ba8c9',
                      }}
                    >
                      {save.highScore.toLocaleString()}
                    </b>
                  </span>

                  <span>
                    BEST COMBO{' '}
                    <b
                      style={{
                        color:
                          '#9ba8c9',
                      }}
                    >
                      {save.bestCombo}x
                    </b>
                  </span>

                  <span>
                    BEST ACC{' '}
                    <b
                      style={{
                        color:
                          '#9ba8c9',
                      }}
                    >
                      {save.bestAccuracy.toFixed(
                        1,
                      )}
                      %
                    </b>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================
            GAME
            ================================================== */}

        {screen ===
          'game' && (
          <div
            style={{
              position:
                'absolute',
              inset: 68,
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                width:
                  '100%',
                height:
                  '100%',
                display:
                  'block',
                touchAction:
                  'none',
              }}
              onPointerDown={(
                event,
              ) => {
                const canvas =
                  canvasRef.current;

                if (!canvas) {
                  return;
                }

                const rect =
                  canvas.getBoundingClientRect();

                const normalizedX =
                  (event.clientX -
                    rect.left) /
                  rect.width;

                const lane =
                  Math.floor(
                    normalizedX *
                      4,
                  );

                if (
                  lane >= 0 &&
                  lane <= 3
                ) {
                  hitLane(
                    lane as Lane,
                  );
                }
              }}
            />

            <div
              style={{
                position:
                  'absolute',
                top: 14,
                right: 18,
                display:
                  'flex',
                gap: 6,
                pointerEvents:
                  'none',
              }}
            >
              {(
                [
                  [
                    'PERFECT',
                    hud.perfect,
                  ],
                  [
                    'GREAT',
                    hud.great,
                  ],
                  [
                    'GOOD',
                    hud.good,
                  ],
                  [
                    'MISS',
                    hud.miss,
                  ],
                ] as const
              ).map(
                (item) => (
                  <div
                    key={
                      item[0]
                    }
                    style={{
                      padding:
                        '5px 8px',
                      border:
                        '1px solid rgba(255,255,255,.05)',
                      borderRadius:
                        7,
                      background:
                        'rgba(0,0,0,.25)',
                      color:
                        '#6d789a',
                      fontSize:
                        7,
                      fontWeight:
                        800,
                    }}
                  >
                    {item[0]}{' '}
                    <b
                      style={{
                        color:
                          '#aeb8d4',
                      }}
                    >
                      {
                        item[1]
                      }
                    </b>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* ==================================================
            PAUSE
            ================================================== */}

        {screen ===
          'pause' && (
          <div
            style={{
              position:
                'absolute',
              inset: 68,
              zIndex: 30,
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              background:
                'rgba(3,4,13,.72)',
              backdropFilter:
                'blur(12px)',
            }}
          >
            <div
              style={{
                width:
                  360,
                padding:
                  28,
                border:
                  '1px solid rgba(98,230,255,.18)',
                borderRadius:
                  18,
                background:
                  'rgba(9,11,28,.9)',
                textAlign:
                  'center',
              }}
            >
              <div
                style={{
                  color:
                    '#62e6ff',
                  fontSize:
                    9,
                  fontWeight:
                    900,
                  letterSpacing:
                    '.2em',
                }}
              >
                PERFORMANCE PAUSED
              </div>

              <h2
                style={{
                  margin:
                    '12px 0 8px',
                  color:
                    '#f4f7ff',
                  fontSize:
                    30,
                }}
              >
                Resonance
                <br />
                suspended.
              </h2>

              <p
                style={{
                  color:
                    '#687399',
                  fontSize:
                    10,
                  lineHeight:
                    1.7,
                }}
              >
                The stage is waiting
                for your return.
              </p>

              <div
                style={{
                  display:
                    'grid',
                  gap: 8,
                  marginTop:
                    20,
                }}
              >
                <button
                  type="button"
                  onClick={
                    resumeGame
                  }
                  style={{
                    padding:
                      13,
                    border:
                      '1px solid rgba(98,230,255,.5)',
                    borderRadius:
                      11,
                    background:
                      'rgba(98,230,255,.08)',
                    color:
                      '#eef4ff',
                    cursor:
                      'pointer',
                    fontSize:
                      10,
                    fontWeight:
                      900,
                  }}
                >
                  RESUME
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setScreen(
                      'menu',
                    )
                  }
                  style={{
                    padding:
                      13,
                    border:
                      '1px solid rgba(255,255,255,.07)',
                    borderRadius:
                      11,
                    background:
                      'rgba(255,255,255,.025)',
                    color:
                      '#7d89ad',
                    cursor:
                      'pointer',
                    fontSize:
                      10,
                    fontWeight:
                      800,
                  }}
                >
                  EXIT PERFORMANCE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            RESULTS
            ================================================== */}

        {screen ===
          'results' && (
          <div
            style={{
              position:
                'absolute',
              inset: 68,
              overflow:
                'auto',
              display:
                'flex',
              alignItems:
                'center',
                justifyContent:
                'center',
              padding: 25,
            }}
          >
            <div
              style={{
                width:
                  'min(720px, 100%)',
                textAlign:
                  'center',
              }}
            >
              <div
                style={{
                  color:
                    '#62e6ff',
                  fontSize:
                    8,
                  fontWeight:
                    900,
                  letterSpacing:
                    '.22em',
                }}
              >
                PERFORMANCE COMPLETE
              </div>

              <div
                style={{
                  margin:
                    '14px 0',
                  fontSize:
                    112,
                  lineHeight:
                    1,
                  fontWeight:
                    950,
                  color:
                    resultRank ===
                      'S+' ||
                    resultRank ===
                      'S'
                      ? '#ffd66b'
                      : '#eef4ff',
                  textShadow:
                    '0 0 60px rgba(255,214,107,.2)',
                }}
              >
                {resultRank}
              </div>

              <div
                style={{
                  color:
                    '#687399',
                  fontSize:
                    10,
                  fontWeight:
                    800,
                  letterSpacing:
                    '.16em',
                }}
              >
                FINAL RESONANCE
              </div>

              <div
                style={{
                  margin:
                    '20px auto',
                  display:
                    'grid',
                  gridTemplateColumns:
                    'repeat(4, 1fr)',
                  gap: 8,
                }}
              >
                {[
                  [
                    'SCORE',
                    hud.score.toLocaleString(),
                  ],
                  [
                    'ACCURACY',
                    `${resultAccuracy.toFixed(
                      1,
                    )}%`,
                  ],
                  [
                    'MAX COMBO',
                    `${hud.maxCombo}x`,
                  ],
                  [
                    'PERFECT',
                    String(
                      hud.perfect,
                    ),
                  ],
                ].map(
                  (item) => (
                    <div
                      key={
                        item[0]
                      }
                      style={{
                        padding:
                          15,
                        border:
                          '1px solid rgba(255,255,255,.07)',
                        borderRadius:
                          12,
                        background:
                          'rgba(255,255,255,.025)',
                      }}
                    >
                      <div
                        style={{
                          color:
                            '#5d688a',
                          fontSize:
                            7,
                          fontWeight:
                            900,
                          letterSpacing:
                            '.12em',
                        }}
                      >
                        {item[0]}
                      </div>

                      <div
                        style={{
                          marginTop:
                            8,
                          color:
                            '#edf2ff',
                          fontSize:
                            18,
                          fontWeight:
                            900,
                        }}
                      >
                        {item[1]}
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    'repeat(4, 1fr)',
                  gap: 8,
                  marginBottom:
                    22,
                }}
              >
                {([
                  [
                    'PERFECT',
                    hud.perfect,
                    '#ffd66b',
                  ],
                  [
                    'GREAT',
                    hud.great,
                    '#9d7cff',
                  ],
                  [
                    'GOOD',
                    hud.good,
                    '#62e6ff',
                  ],
                  [
                    'MISS',
                    hud.miss,
                    '#ff5f73',
                  ],
                ] as const).map(
                  ([label, count, color]) => (
                    <div
                      key={label}
                      style={{
                        color,
                        fontSize: 8,
                        fontWeight: 900,
                        letterSpacing: '.1em',
                      }}
                    >
                      {label}{' '}
                      {count}
                    </div>
                  ),
                )}
              </div>

              <div
                style={{
                  display:
                    'flex',
                  justifyContent:
                    'center',
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={
                    startGame
                  }
                  style={{
                    padding:
                      '13px 22px',
                    border:
                      '1px solid rgba(98,230,255,.5)',
                    borderRadius:
                      11,
                    background:
                      'rgba(98,230,255,.08)',
                    color:
                      '#eef4ff',
                    cursor:
                      'pointer',
                    fontSize:
                      9,
                    fontWeight:
                      900,
                    letterSpacing:
                      '.12em',
                  }}
                >
                  PLAY AGAIN
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setScreen(
                      'menu',
                    )
                  }
                  style={{
                    padding:
                      '13px 20px',
                    border:
                      '1px solid rgba(255,255,255,.07)',
                    borderRadius:
                      11,
                    background:
                      'rgba(255,255,255,.025)',
                    color:
                      '#7d89ad',
                    cursor:
                      'pointer',
                    fontSize:
                      9,
                    fontWeight:
                      900,
                    letterSpacing:
                      '.12em',
                  }}
                >
                  MAIN SYSTEM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            HOW TO PLAY
            ================================================== */}

        {screen ===
          'howto' && (
          <div
            style={{
              position:
                'absolute',
              inset: 68,
              overflow:
                'auto',
              padding:
                '55px 30px',
            }}
          >
            <div
              style={{
                width:
                  'min(680px, 100%)',
                margin:
                  '0 auto',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setScreen(
                    'menu',
                  )
                }
                style={{
                  border: 0,
                  background:
                    'none',
                  color:
                    '#62e6ff',
                  cursor:
                    'pointer',
                  fontSize:
                    9,
                  fontWeight:
                    900,
                  letterSpacing:
                    '.15em',
                }}
              >
                ← BACK
              </button>

              <h2
                style={{
                  margin:
                    '22px 0 8px',
                  color:
                    '#f2f6ff',
                  fontSize:
                    36,
                }}
              >
                How to
                Resonance
              </h2>

              <p
                style={{
                  color:
                    '#687399',
                  fontSize:
                    11,
                  lineHeight:
                    1.8,
                }}
              >
                Notes travel toward the
                resonance line. Press the
                corresponding key when the
                note reaches the line.
              </p>

              <div
                style={{
                  display:
                    'grid',
                  gap: 10,
                  marginTop:
                    25,
                }}
              >
                {[
                  [
                    'A',
                    'AZURE',
                    '#62e6ff',
                  ],
                  [
                    'S',
                    'VIOLET',
                    '#9d7cff',
                  ],
                  [
                    'K',
                    'ROSE',
                    '#ff62c7',
                  ],
                  [
                    'L',
                    'GOLD',
                    '#ffd66b',
                  ],
                ].map(
                  (item) => (
                    <div
                      key={
                        item[0]
                      }
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'center',
                        gap: 14,
                        padding:
                          14,
                        border:
                          '1px solid rgba(255,255,255,.06)',
                        borderRadius:
                          12,
                        background:
                          'rgba(255,255,255,.025)',
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          display:
                            'grid',
                          placeItems:
                            'center',
                          border:
                            `1px solid ${item[2]}66`,
                          borderRadius:
                            10,
                          color:
                            item[2],
                          fontWeight:
                            950,
                        }}
                      >
                        {item[0]}
                      </div>

                      <div>
                        <div
                          style={{
                            color:
                              '#edf2ff',
                            fontSize:
                              10,
                            fontWeight:
                              900,
                          }}
                        >
                          {item[1]}
                          {' '}
                          LANE
                        </div>

                        <div
                          style={{
                            marginTop:
                              3,
                            color:
                              '#66729b',
                            fontSize:
                              9,
                          }}
                        >
                          Strike when
                          the note
                          intersects
                          the line.
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    'repeat(2, 1fr)',
                  gap: 10,
                  marginTop:
                    20,
                }}
              >
                {[
                  [
                    'PERFECT',
                    '±75ms',
                    '#ffd66b',
                  ],
                  [
                    'GREAT',
                    '±140ms',
                    '#9d7cff',
                  ],
                  [
                    'GOOD',
                    '±230ms',
                    '#62e6ff',
                  ],
                  [
                    'MISS',
                    '>230ms',
                    '#ff5f73',
                  ],
                ].map(
                  (item) => (
                    <div
                      key={
                        item[0]
                      }
                      style={{
                        padding:
                          15,
                        border:
                          '1px solid rgba(255,255,255,.05)',
                        borderRadius:
                          12,
                      }}
                    >
                      <div
                        style={{
                          color:
                            item[2],
                          fontSize:
                            9,
                          fontWeight:
                            900,
                        }}
                      >
                        {item[0]}
                      </div>

                      <div
                        style={{
                          marginTop:
                            5,
                          color:
                            '#69759a',
                          fontSize:
                            9,
                        }}
                      >
                        {item[1]}
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div
                style={{
                  marginTop:
                    18,
                  padding:
                    17,
                  border:
                    '1px solid rgba(255,98,199,.14)',
                  borderRadius:
                    13,
                  background:
                    'rgba(255,98,199,.035)',
                }}
              >
                <div
                  style={{
                    color:
                      '#ff62c7',
                    fontSize:
                      9,
                    fontWeight:
                      900,
                    letterSpacing:
                      '.12em',
                  }}
                >
                  FEVER
                </div>

                <div
                  style={{
                    marginTop:
                      6,
                    color:
                      '#7c87a8',
                    fontSize:
                      9,
                    lineHeight:
                      1.7,
                  }}
                >
                  Build the resonance meter
                  through accurate hits. At
                  100%, press SPACE to activate
                  Fever and gain a temporary
                  2.5× score multiplier.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            SETTINGS
            ================================================== */}

        {screen ===
          'settings' && (
          <div
            style={{
              position:
                'absolute',
              inset: 68,
              overflow:
                'auto',
              padding:
                '55px 30px',
            }}
          >
            <div
              style={{
                width:
                  'min(620px, 100%)',
                margin:
                  '0 auto',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setScreen(
                    'menu',
                  )
                }
                style={{
                  border: 0,
                  background:
                    'none',
                  color:
                    '#62e6ff',
                  cursor:
                    'pointer',
                  fontSize:
                    9,
                  fontWeight:
                    900,
                  letterSpacing:
                    '.15em',
                }}
              >
                ← BACK
              </button>

              <h2
                style={{
                  margin:
                    '22px 0 26px',
                  color:
                    '#f2f6ff',
                  fontSize:
                    36,
                }}
              >
                System
                Settings
              </h2>

              {(
                [
                  [
                    'Sound',
                    soundEnabled,
                    setSoundEnabled,
                    'Generated interface audio',
                  ],
                  [
                    'Particles',
                    particlesEnabled,
                    setParticlesEnabled,
                    'Astral particle effects',
                  ],
                  [
                    'Screen Shake',
                    screenShakeEnabled,
                    setScreenShakeEnabled,
                    'Impact feedback',
                  ],
                  [
                    'Reduced Motion',
                    reducedMotion,
                    setReducedMotion,
                    'Lower animation intensity',
                  ],
                ] as const
              ).map(
                ([label, enabled, setter, description]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setter(
                        !enabled,
                      );

                      updateSave(
                        (
                          current,
                        ) => ({
                          ...current,
                          settings:
                            {
                              ...current.settings,
                              sound:
                                label ===
                                'Sound'
                                  ? !enabled
                                  : current
                                      .settings
                                      .sound,
                              particles:
                                label ===
                                'Particles'
                                  ? !enabled
                                  : current
                                      .settings
                                      .particles,
                              screenShake:
                                label ===
                                'Screen Shake'
                                  ? !enabled
                                  : current
                                      .settings
                                      .screenShake,
                              reducedMotion:
                                label ===
                                'Reduced Motion'
                                  ? !enabled
                                  : current
                                      .settings
                                      .reducedMotion,
                            },
                        }),
                      );
                    }}
                    style={{
                      width:
                        '100%',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'space-between',
                      marginBottom:
                        8,
                      padding:
                        17,
                      border:
                        '1px solid rgba(255,255,255,.06)',
                      borderRadius:
                        13,
                      background:
                        'rgba(255,255,255,.025)',
                      color:
                        '#fff',
                      cursor:
                        'pointer',
                      textAlign:
                        'left',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color:
                            '#e9efff',
                          fontSize:
                            10,
                          fontWeight:
                            900,
                        }}
                      >
                        {label}
                      </div>

                      <div
                        style={{
                          marginTop:
                            4,
                          color:
                            '#657198',
                          fontSize:
                            8,
                        }}
                      >
                        {description}
                      </div>
                    </div>

                    <div
                      style={{
                        width: 38,
                        height: 20,
                        borderRadius:
                          999,
                        padding: 2,
                        background:
                          enabled
                            ? '#62e6ff'
                            : 'rgba(255,255,255,.08)',
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius:
                            '50%',
                          background:
                            '#fff',
                          transform:
                            enabled
                              ? 'translateX(18px)'
                              : 'translateX(0)',
                          transition:
                            'transform .2s ease',
                        }}
                      />
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NeonResonanceGame;