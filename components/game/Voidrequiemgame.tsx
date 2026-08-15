'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ============================================================================
   VOID//REQUIEM — "CUT FATE"
   Anime action-duel / roguelite / bullet-time survival.
   Single-file, self-contained React component. No external deps beyond
   React + Tailwind utility classes (matches ShadowHunterGame conventions).
   ========================================================================== */

/* ---------------------------------- Types --------------------------------- */

type Difficulty = 'awakened' | 'voidbound' | 'abyssal';

type EnemyType = 'wraith' | 'lancer' | 'oracle' | 'executor' | 'null';

type Screen =
  | 'menu'
  | 'game'
  | 'pause'
  | 'upgrade'
  | 'results'
  | 'settings'
  | 'stats'
  | 'howto';

type UpgradeId =
  | 'blackEdge'
  | 'phantomStep'
  | 'fracturedFate'
  | 'voidHunger'
  | 'bloodEdge'
  | 'swiftBlade'
  | 'ironWill'
  | 'starlitFocus'
  | 'styleSurge'
  | 'secondWind';

type AchievementId =
  | 'first_cut'
  | 'untamed'
  | 'no_future'
  | 'fateless'
  | 'void_walker'
  | 'death_itself'
  | 'perfect_world'
  | 'null_slain';

type EnemyState = 'chase' | 'telegraph' | 'attack' | 'recover' | 'retreat';

type Enemy = {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  state: EnemyState;
  stateTimer: number;
  telegraphDuration: number;
  attackCooldown: number;
  attackTimer: number;
  hitFlash: number;
  staggered: number;
  angle: number;
  shootTimer: number;
  elite: boolean;
  requiemEligible: boolean;
  parried: boolean;
};

type Projectile = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  life: number;
  spawnLife: number;
  color: string;
  cuttable: boolean;
  cutFlash: number;
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

type FloatingText = {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  scale: number;
};

type SlashFx = {
  x: number;
  y: number;
  angle: number;
  life: number;
  maxLife: number;
  color: string;
  length: number;
};

type Pickup = {
  id: number;
  x: number;
  y: number;
  type: 'health' | 'void' | 'core';
  life: number;
  pulse: number;
};

type Boss = {
  active: boolean;
  defeated: boolean;
  name: string;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  phase: 1 | 2;
  attackTimer: number;
  state: EnemyState;
  stateTimer: number;
  telegraphDuration: number;
  summonTimer: number;
  lineTimer: number;
  hitFlash: number;
  staggered: number;
  angle: number;
};

type GameState = {
  playerX: number;
  playerY: number;
  playerRadius: number;

  hp: number;
  maxHp: number;

  stamina: number;
  maxStamina: number;

  voidMeter: number;
  maxVoid: number;
  ascended: boolean;
  ascendTimer: number;

  style: number;
  styleDecayDelay: number;

  combo: number;
  maxCombo: number;
  comboTimer: number;

  score: number;
  shards: number;

  encounter: number;
  enemiesKilled: number;
  perfectRequiems: number;
  requiemsTotal: number;
  voidCuts: number;
  damageTaken: number;
  hitsTaken: number;
  noDamageEncounter: boolean;
  elapsed: number;
  timeSinceHit: number;

  strikeTimer: number;
  strikeProgress: number;
  strikeAngle: number;

  dashTimer: number;
  invulnTimer: number;
  dashCooldown: number;
  cloneCharges: number;

  requiemCooldown: number;
  requiemFlashTimer: number;
  requiemHoldGlow: number;

  spawnTimer: number;
  spawnInterval: number;
  enemiesRemainingInEncounter: number;

  hitStop: number;
  slowMoTimer: number;
  screenShake: number;

  enemies: Enemy[];
  projectiles: Projectile[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  slashes: SlashFx[];
  pickups: Pickup[];

  boss: Boss;
  bossRoute: boolean;

  nextEnemyId: number;
  nextProjectileId: number;
  nextPickupId: number;

  running: boolean;
  gameOver: boolean;
  victory: boolean;

  upgradeChoices: UpgradeId[];

  // Mutable modifiers set by upgrades
  damageMultiplier: number;
  voidGainMultiplier: number;
  styleGainMultiplier: number;
  requiemWindowMultiplier: number;
  requiemRadiusMultiplier: number;
  attackSpeedMultiplier: number;
  dashCooldownMultiplier: number;
  maxHpBonus: number;
  lowHpDamageBonus: boolean;
  phantomStepEnabled: boolean;
  fracturedFateEnabled: boolean;
};

type PersistentSave = {
  version: number;
  highScore: number;
  bestCombo: number;
  bestStyleRank: string;
  totalKills: number;
  totalRuns: number;
  bossesDefeated: number;
  totalPerfectRequiems: number;
  achievements: AchievementId[];
  titles: string[];
  settings: {
    sound: boolean;
    screenShake: boolean;
    particles: boolean;
    damageNumbers: boolean;
    reducedMotion: boolean;
  };
};

type HudState = {
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  voidMeter: number;
  maxVoid: number;
  ascended: boolean;
  style: number;
  styleRank: string;
  combo: number;
  maxCombo: number;
  score: number;
  shards: number;
  encounter: number;
  enemies: number;
  bossHp: number;
  bossMaxHp: number;
  bossName: string;
  bossPhase: number;
  requiemReady: boolean;
  requiemCooldown: number;
  requiemCooldownMax: number;
  gameOver: boolean;
  victory: boolean;
};

/* ------------------------------- Constants -------------------------------- */

const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = 560;
const STORAGE_KEY = 'void-requiem-save';
const ENCOUNTERS_PER_RUN = 7;

const PALETTE = {
  black: '#050509',
  voidBlue: '#5DEBFF',
  voidPurple: '#8A5CFF',
  white: '#FFFFFF',
  danger: '#FF365C',
};

const DIFFICULTIES: Record<
  Difficulty,
  { name: string; description: string; enemyMult: number; dmgMult: number; scoreMult: number }
> = {
  awakened: {
    name: 'AWAKENED',
    description: 'The first breath of Void sync.',
    enemyMult: 0.78,
    dmgMult: 0.72,
    scoreMult: 0.8,
  },
  voidbound: {
    name: 'VOIDBOUND',
    description: 'The intended cut.',
    enemyMult: 1,
    dmgMult: 1,
    scoreMult: 1,
  },
  abyssal: {
    name: 'ABYSSAL',
    description: 'Fate fights back.',
    enemyMult: 1.32,
    dmgMult: 1.25,
    scoreMult: 1.65,
  },
};

const UPGRADE_DATA: Record<UpgradeId, { name: string; description: string; icon: string }> = {
  blackEdge: { name: 'BLACK EDGE', description: '+18% Strike damage.', icon: '⟠' },
  phantomStep: { name: 'PHANTOM STEP', description: 'Perfect Dash leaves a cutting afterimage.', icon: '⇢' },
  fracturedFate: { name: 'FRACTURED FATE', description: 'Requiem cuts a wider arc of attacks.', icon: '✦' },
  voidHunger: { name: 'VOID HUNGER', description: '+25% Void gained from all sources.', icon: '◎' },
  bloodEdge: { name: 'BLOOD EDGE', description: 'Below 35% HP: +45% damage, +20% speed.', icon: '❖' },
  swiftBlade: { name: 'SWIFT BLADE', description: '+14% attack speed.', icon: '»' },
  ironWill: { name: 'IRON WILL', description: '+22 max HP, restore it.', icon: '◇' },
  starlitFocus: { name: 'STARLIT FOCUS', description: '+30% Requiem timing window.', icon: '◯' },
  styleSurge: { name: 'STYLE SURGE', description: '+30% Style gained from all sources.', icon: '✶' },
  secondWind: { name: 'SECOND WIND', description: '-20% dash cooldown, +stamina regen.', icon: '↻' },
};

const ACHIEVEMENT_DATA: Record<AchievementId, { name: string; description: string; title: string }> = {
  first_cut: { name: 'FIRST CUT', description: 'Perform your first Requiem.', title: 'AWAKENED' },
  untamed: { name: 'UNTAMED', description: 'Reach a x30 combo.', title: 'VOID WALKER' },
  no_future: { name: 'NO FUTURE', description: 'Clear an encounter without taking damage.', title: 'FATELESS' },
  fateless: { name: 'FATELESS', description: 'Perform 10 Perfect Requiems in one run.', title: 'FATE CUTTER' },
  void_walker: { name: 'VOID WALKER', description: 'Reach maximum Void.', title: 'VOIDBOUND' },
  death_itself: { name: 'DEATH ITSELF', description: 'Defeat The First Death.', title: 'NULL SLAYER' },
  perfect_world: { name: 'PERFECT WORLD', description: 'Complete a run with 90%+ Requiem accuracy.', title: 'PERFECT WORLD' },
  null_slain: { name: 'MIRROR BROKEN', description: 'Defeat a NULL without taking damage from it.', title: 'UNBOUND' },
};

const BOSS_LINES = [
  'You already know how this ends.',
  'Every cut, I have made before.',
  'Fate does not flinch twice.',
  'You are cutting a memory.',
  'This is the shape you chose.',
];

/* -------------------------------- Helpers ---------------------------------- */

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function angleDiff(a: number, b: number) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

function styleRankFromValue(value: number): string {
  if (value >= 92) return 'SSS';
  if (value >= 80) return 'SS';
  if (value >= 65) return 'S';
  if (value >= 50) return 'A';
  if (value >= 35) return 'B';
  if (value >= 20) return 'C';
  return 'D';
}

function createInitialState(): GameState {
  return {
    playerX: WORLD_WIDTH / 2,
    playerY: WORLD_HEIGHT / 2,
    playerRadius: 16,

    hp: 100,
    maxHp: 100,

    stamina: 100,
    maxStamina: 100,

    voidMeter: 0,
    maxVoid: 100,
    ascended: false,
    ascendTimer: 0,

    style: 0,
    styleDecayDelay: 0,

    combo: 0,
    maxCombo: 0,
    comboTimer: 0,

    score: 0,
    shards: 0,

    encounter: 1,
    enemiesKilled: 0,
    perfectRequiems: 0,
    requiemsTotal: 0,
    voidCuts: 0,
    damageTaken: 0,
    hitsTaken: 0,
    noDamageEncounter: true,
    elapsed: 0,
    timeSinceHit: 0,

    strikeTimer: 0,
    strikeProgress: 0,
    strikeAngle: 0,

    dashTimer: 0,
    invulnTimer: 0,
    dashCooldown: 0,
    cloneCharges: 0,

    requiemCooldown: 0,
    requiemFlashTimer: 0,
    requiemHoldGlow: 0,

    spawnTimer: 0,
    spawnInterval: 1.1,
    enemiesRemainingInEncounter: 4,

    hitStop: 0,
    slowMoTimer: 0,
    screenShake: 0,

    enemies: [],
    projectiles: [],
    particles: [],
    floatingTexts: [],
    slashes: [],
    pickups: [],

    boss: {
      active: false,
      defeated: false,
      name: 'THE FIRST DEATH',
      x: WORLD_WIDTH / 2,
      y: -100,
      radius: 46,
      hp: 0,
      maxHp: 0,
      phase: 1,
      attackTimer: 2,
      state: 'chase',
      stateTimer: 0,
      telegraphDuration: 0.55,
      summonTimer: 6,
      lineTimer: 4,
      hitFlash: 0,
      staggered: 0,
      angle: 0,
    },
    bossRoute: false,

    nextEnemyId: 1,
    nextProjectileId: 1,
    nextPickupId: 1,

    running: false,
    gameOver: false,
    victory: false,

    upgradeChoices: [],

    damageMultiplier: 1,
    voidGainMultiplier: 1,
    styleGainMultiplier: 1,
    requiemWindowMultiplier: 1,
    requiemRadiusMultiplier: 1,
    attackSpeedMultiplier: 1,
    dashCooldownMultiplier: 1,
    maxHpBonus: 0,
    lowHpDamageBonus: false,
    phantomStepEnabled: false,
    fracturedFateEnabled: false,
  };
}

function loadSave(): PersistentSave {
  const defaults: PersistentSave = {
    version: 1,
    highScore: 0,
    bestCombo: 0,
    bestStyleRank: 'D',
    totalKills: 0,
    totalRuns: 0,
    bossesDefeated: 0,
    totalPerfectRequiems: 0,
    achievements: [],
    titles: [],
    settings: {
      sound: true,
      screenShake: true,
      particles: true,
      damageNumbers: true,
      reducedMotion: false,
    },
  };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaults;
    return {
      ...defaults,
      ...parsed,
      settings: { ...defaults.settings, ...(parsed.settings || {}) },
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      titles: Array.isArray(parsed.titles) ? parsed.titles : [],
    };
  } catch {
    return defaults;
  }
}

function saveGame(save: PersistentSave) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // optional
  }
}

function drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = radius * 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function spawnParticles(
  state: GameState,
  x: number,
  y: number,
  color: string,
  amount: number,
  enabled: boolean,
) {
  if (!enabled) return;
  const maximum = 420;
  if (state.particles.length >= maximum) return;
  const count = Math.min(amount, maximum - state.particles.length);
  for (let i = 0; i < count; i += 1) {
    const angle = random(0, Math.PI * 2);
    const speed = random(40, 200);
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: random(0.25, 0.7),
      maxLife: 0.7,
      size: random(1, 3.4),
      color,
      gravity: random(10, 55),
      drag: 0.92,
    });
  }
}

function addText(state: GameState, x: number, y: number, text: string, color: string, scale = 1) {
  if (state.floatingTexts.length >= 60) return;
  state.floatingTexts.push({ x, y, text, color, life: 0.85, maxLife: 0.85, scale });
}

function addSlash(state: GameState, x: number, y: number, angle: number, color: string, length = 70) {
  if (state.slashes.length >= 20) return;
  state.slashes.push({ x, y, angle, life: 0.28, maxLife: 0.28, color, length });
}

function pickEnemyType(encounter: number): EnemyType {
  const roll = Math.random();
  if (encounter >= 6 && roll < 0.14) return 'null';
  if (encounter >= 3 && roll < 0.3) return 'executor';
  if (encounter >= 2 && roll < 0.5) return 'oracle';
  if (roll < 0.75) return 'lancer';
  return 'wraith';
}

const ENEMY_DEFS: Record<
  EnemyType,
  { hp: number; radius: number; speed: number; damage: number; cooldown: number; telegraph: number }
> = {
  wraith: { hp: 34, radius: 12, speed: 92, damage: 7, cooldown: 1.3, telegraph: 0.28 },
  lancer: { hp: 58, radius: 15, speed: 70, damage: 13, cooldown: 1.7, telegraph: 0.42 },
  oracle: { hp: 46, radius: 14, speed: 40, damage: 10, cooldown: 1.9, telegraph: 0.3 },
  executor: { hp: 130, radius: 23, speed: 34, damage: 22, cooldown: 2.2, telegraph: 0.6 },
  null: { hp: 90, radius: 17, speed: 88, damage: 16, cooldown: 1.4, telegraph: 0.32 },
};

function createEnemy(state: GameState, difficulty: Difficulty, encounter: number, typeOverride?: EnemyType) {
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;
  if (side === 0) {
    x = random(30, WORLD_WIDTH - 30);
    y = -30;
  } else if (side === 1) {
    x = WORLD_WIDTH + 30;
    y = random(30, WORLD_HEIGHT - 30);
  } else if (side === 2) {
    x = random(30, WORLD_WIDTH - 30);
    y = WORLD_HEIGHT + 30;
  } else {
    x = -30;
    y = random(30, WORLD_HEIGHT - 30);
  }

  const type = typeOverride || pickEnemyType(encounter);
  const def = ENEMY_DEFS[type];
  const diff = DIFFICULTIES[difficulty];
  const scale = 1 + Math.min(1.6, encounter * 0.09);
  const elite = !typeOverride && Math.random() < Math.min(0.1, 0.02 + encounter * 0.005);

  let hp = def.hp * scale * diff.enemyMult;
  let damage = def.damage * diff.dmgMult;
  if (elite) {
    hp *= 1.6;
    damage *= 1.15;
  }

  state.enemies.push({
    id: state.nextEnemyId++,
    type,
    x,
    y,
    radius: def.radius + (elite ? 2 : 0),
    hp,
    maxHp: hp,
    speed: def.speed,
    damage,
    state: 'chase',
    stateTimer: random(0.4, 1.1),
    telegraphDuration: def.telegraph,
    attackCooldown: def.cooldown,
    attackTimer: random(0.5, def.cooldown),
    hitFlash: 0,
    staggered: 0,
    angle: Math.atan2(state.playerY - y, state.playerX - x),
    shootTimer: random(0.8, 1.6),
    elite,
    requiemEligible: false,
    parried: false,
  });
}

function spawnBoss(state: GameState, difficulty: Difficulty) {
  const hp = 1200 * DIFFICULTIES[difficulty].enemyMult;
  state.boss = {
    active: true,
    defeated: false,
    name: 'THE FIRST DEATH',
    x: WORLD_WIDTH / 2,
    y: 100,
    radius: 46,
    hp,
    maxHp: hp,
    phase: 1,
    attackTimer: 1.6,
    state: 'chase',
    stateTimer: 1,
    telegraphDuration: 0.55,
    summonTimer: 7,
    lineTimer: 3,
    hitFlash: 0,
    staggered: 0,
    angle: 0,
  };
  addText(state, WORLD_WIDTH / 2, 76, 'THE FIRST DEATH', PALETTE.voidPurple, 1.5);
  spawnParticles(state, WORLD_WIDTH / 2, 100, PALETTE.voidPurple, 46, true);
}

/* ================================ COMPONENT ================================ */

export function VoidRequiemGame({ open, onClose }: { open: boolean; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(createInitialState());
  const saveRef = useRef<PersistentSave | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const animationRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);

  const [screen, setScreen] = useState<Screen>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('voidbound');
  const [hud, setHud] = useState<HudState>(() => {
    const s = createInitialState();
    return {
      hp: s.hp,
      maxHp: s.maxHp,
      stamina: s.stamina,
      maxStamina: s.maxStamina,
      voidMeter: s.voidMeter,
      maxVoid: s.maxVoid,
      ascended: s.ascended,
      style: s.style,
      styleRank: 'D',
      combo: s.combo,
      maxCombo: s.maxCombo,
      score: s.score,
      shards: s.shards,
      encounter: s.encounter,
      enemies: 0,
      bossHp: 0,
      bossMaxHp: 0,
      bossName: 'THE FIRST DEATH',
      bossPhase: 1,
      requiemReady: true,
      requiemCooldown: 0,
      requiemCooldownMax: 0.4,
      gameOver: false,
      victory: false,
    };
  });
  const [save, setSave] = useState<PersistentSave | null>(null);
  const [upgradeChoices, setUpgradeChoices] = useState<UpgradeId[]>([]);
  const [achievementToast, setAchievementToast] = useState<AchievementId | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [screenShakeEnabled, setScreenShakeEnabled] = useState(true);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [damageNumbersEnabled, setDamageNumbersEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const updateSave = useCallback((updater: (c: PersistentSave) => PersistentSave) => {
    const current = saveRef.current || loadSave();
    const next = updater(current);
    saveRef.current = next;
    setSave(next);
    saveGame(next);
  }, []);

  useEffect(() => {
    if (!open) return;
    const loaded = loadSave();
    saveRef.current = loaded;
    setSave(loaded);
    setSoundEnabled(loaded.settings.sound);
    setScreenShakeEnabled(loaded.settings.screenShake);
    setParticlesEnabled(loaded.settings.particles);
    setDamageNumbersEnabled(loaded.settings.damageNumbers);
    setReducedMotion(loaded.settings.reducedMotion);
  }, [open]);

  /* ------------------------------- Audio ---------------------------------- */

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.025, delay = 0) => {
      if (!soundEnabled) return;
      try {
        const AudioContextClass =
          window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        if (!audioRef.current) audioRef.current = new AudioContextClass();
        const audio = audioRef.current;
        if (audio.state === 'suspended') void audio.resume();
        const start = audio.currentTime + delay;
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
      } catch {
        // optional
      }
    },
    [soundEnabled],
  );

  const sfx = useMemo(
    () => ({
      strike: () => playTone(340, 0.05, 'square', 0.014),
      strikeHit: () => playTone(500 + random(-40, 40), 0.04, 'square', 0.014),
      dash: () => playTone(180, 0.08, 'sawtooth', 0.016),
      requiemFail: () => playTone(120, 0.09, 'square', 0.014),
      perfectRequiem: () => {
        playTone(70, 0.28, 'sawtooth', 0.032);
        playTone(660, 0.14, 'square', 0.02, 0.02);
        playTone(1760, 0.1, 'sine', 0.018, 0.05);
      },
      goodRequiem: () => {
        playTone(90, 0.16, 'sawtooth', 0.024);
        playTone(520, 0.1, 'square', 0.016, 0.02);
      },
      hit: () => playTone(95, 0.12, 'sawtooth', 0.024),
      kill: () => playTone(240, 0.08, 'triangle', 0.016),
      levelCard: () => {
        playTone(520, 0.08, 'triangle', 0.02);
        playTone(780, 0.14, 'triangle', 0.018, 0.04);
      },
      ascend: () => {
        playTone(60, 0.5, 'sawtooth', 0.03);
        playTone(880, 0.3, 'sine', 0.02, 0.1);
        playTone(1320, 0.35, 'sine', 0.016, 0.2);
      },
      bossHit: () => playTone(120, 0.1, 'sawtooth', 0.02),
      bossDefeat: () => {
        playTone(80, 0.4, 'sawtooth', 0.03);
        playTone(660, 0.5, 'triangle', 0.024, 0.1);
      },
      achievement: () => {
        playTone(720, 0.1, 'triangle', 0.02);
        playTone(960, 0.16, 'triangle', 0.018, 0.05);
      },
      pickup: () => playTone(600, 0.08, 'triangle', 0.016),
      death: () => playTone(65, 0.5, 'sawtooth', 0.03),
      encounterClear: () => {
        playTone(400, 0.1, 'triangle', 0.018);
        playTone(600, 0.14, 'triangle', 0.016, 0.06);
      },
    }),
    [playTone],
  );

  /* -------------------------------- HUD sync -------------------------------- */

  const syncHud = useCallback(() => {
    const s = stateRef.current;
    setHud({
      hp: s.hp,
      maxHp: s.maxHp,
      stamina: s.stamina,
      maxStamina: s.maxStamina,
      voidMeter: s.voidMeter,
      maxVoid: s.maxVoid,
      ascended: s.ascended,
      style: s.style,
      styleRank: styleRankFromValue(s.style),
      combo: s.combo,
      maxCombo: s.maxCombo,
      score: s.score,
      shards: s.shards,
      encounter: s.encounter,
      enemies: s.enemies.length,
      bossHp: s.boss.active ? s.boss.hp : 0,
      bossMaxHp: s.boss.active ? s.boss.maxHp : 0,
      bossName: s.boss.name,
      bossPhase: s.boss.phase,
      requiemReady: s.requiemCooldown <= 0,
      requiemCooldown: s.requiemCooldown,
      requiemCooldownMax: 0.4,
      gameOver: s.gameOver,
      victory: s.victory,
    });
  }, []);

  const unlockAchievement = useCallback(
    (id: AchievementId) => {
      const current = saveRef.current || loadSave();
      if (current.achievements.includes(id)) return;
      const title = ACHIEVEMENT_DATA[id].title;
      updateSave((existing) => ({
        ...existing,
        achievements: [...existing.achievements, id],
        titles: existing.titles.includes(title) ? existing.titles : [...existing.titles, title],
      }));
      setAchievementToast(id);
      window.setTimeout(() => setAchievementToast(null), 2800);
      sfx.achievement();
    },
    [sfx, updateSave],
  );

  const gainStyle = useCallback((state: GameState, amount: number) => {
    state.style = clamp(state.style + amount * state.styleGainMultiplier, 0, 100);
    state.styleDecayDelay = 1.1;
  }, []);

  const gainVoid = useCallback((state: GameState, amount: number) => {
    if (state.ascended) return;
    state.voidMeter = clamp(state.voidMeter + amount * state.voidGainMultiplier, 0, state.maxVoid);
  }, []);

  /* ------------------------------ Upgrade flow ------------------------------ */

  const beginEncounterOrUpgrade = useCallback(
    (state: GameState) => {
      state.encounter += 1;
      if (state.encounter > ENCOUNTERS_PER_RUN) {
        if (!state.bossRoute) {
          state.bossRoute = true;
          state.running = false;
          spawnBoss(state, difficulty);
          setScreen('game');
          window.setTimeout(() => {
            if (!stateRef.current.gameOver) stateRef.current.running = true;
          }, 1500);
        }
        return;
      }

      const pool = Object.keys(UPGRADE_DATA) as UpgradeId[];
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const choices = shuffled.slice(0, 3);
      state.upgradeChoices = choices;
      setUpgradeChoices(choices);
      state.running = false;
      state.enemiesRemainingInEncounter = 3 + Math.floor(state.encounter * 1.15);
      state.spawnInterval = Math.max(0.5, 1.1 - state.encounter * 0.04);
      setScreen('upgrade');
    },
    [difficulty],
  );

  const applyUpgrade = useCallback(
    (id: UpgradeId) => {
      const state = stateRef.current;
      switch (id) {
        case 'blackEdge':
          state.damageMultiplier *= 1.18;
          break;
        case 'phantomStep':
          state.phantomStepEnabled = true;
          break;
        case 'fracturedFate':
          state.fracturedFateEnabled = true;
          state.requiemRadiusMultiplier *= 1.5;
          break;
        case 'voidHunger':
          state.voidGainMultiplier *= 1.25;
          break;
        case 'bloodEdge':
          state.lowHpDamageBonus = true;
          break;
        case 'swiftBlade':
          state.attackSpeedMultiplier *= 0.86;
          break;
        case 'ironWill':
          state.maxHpBonus += 22;
          state.maxHp += 22;
          state.hp = state.maxHp;
          break;
        case 'starlitFocus':
          state.requiemWindowMultiplier *= 1.3;
          break;
        case 'styleSurge':
          state.styleGainMultiplier *= 1.3;
          break;
        case 'secondWind':
          state.dashCooldownMultiplier *= 0.8;
          break;
      }
      state.upgradeChoices = [];
      setUpgradeChoices([]);
      state.running = true;
      setScreen('game');
      syncHud();
      sfx.levelCard();
      addText(state, state.playerX, state.playerY - 45, UPGRADE_DATA[id].name, PALETTE.voidBlue, 1.1);
    },
    [sfx, syncHud],
  );

  /* --------------------------------- Damage ---------------------------------- */

  const damageEnemy = useCallback(
    (state: GameState, enemy: Enemy, damage: number, crit: boolean) => {
      enemy.hp -= damage;
      enemy.hitFlash = 0.13;
      if (state.hitStop <= 0) state.hitStop = crit ? 0.03 : 0.015;
      spawnParticles(state, enemy.x, enemy.y, crit ? PALETTE.white : PALETTE.voidBlue, crit ? 14 : 7, particlesEnabled);
      if (damageNumbersEnabled) {
        addText(
          state,
          enemy.x,
          enemy.y - enemy.radius - 10,
          crit ? `${Math.round(damage)}!` : String(Math.round(damage)),
          crit ? PALETTE.white : '#e6f7ff',
          crit ? 1.15 : 0.95,
        );
      }
      sfx.strikeHit();
    },
    [damageNumbersEnabled, particlesEnabled, sfx],
  );

  const killEnemy = useCallback(
    (state: GameState, enemy: Enemy, styleBonus: number) => {
      const rewardBase =
        enemy.type === 'executor' ? 160 : enemy.type === 'null' ? 200 : enemy.type === 'oracle' ? 110 : enemy.type === 'lancer' ? 90 : 60;
      const eliteMult = enemy.elite ? 1.8 : 1;
      const diffMult = DIFFICULTIES[difficulty].scoreMult;
      const comboMult = Math.max(1, 1 + state.combo * 0.04);
      state.score += Math.round(rewardBase * eliteMult * diffMult * comboMult);
      state.enemiesKilled += 1;
      state.combo += 1;
      state.comboTimer = 2.8;
      state.maxCombo = Math.max(state.maxCombo, state.combo);
      state.shards += enemy.elite ? 3 : 1;
      gainVoid(state, enemy.elite ? 8 : 4);
      gainStyle(state, 2 + styleBonus);
      state.enemiesRemainingInEncounter -= 1;

      if (enemy.type === 'null' && state.hitsTaken === 0) {
        unlockAchievement('null_slain');
      }

      if (Math.random() < 0.1) {
        const roll = Math.random();
        state.pickups.push({
          id: state.nextPickupId++,
          x: enemy.x,
          y: enemy.y,
          type: roll < 0.45 ? 'health' : roll < 0.85 ? 'void' : 'core',
          life: 9,
          pulse: 0,
        });
      }

      spawnParticles(state, enemy.x, enemy.y, enemy.elite ? PALETTE.white : PALETTE.voidBlue, enemy.elite ? 26 : 12, particlesEnabled);
      sfx.kill();

      if (state.combo >= 30) unlockAchievement('untamed');
      if (state.voidMeter >= state.maxVoid) unlockAchievement('void_walker');

      if (state.enemiesRemainingInEncounter <= 0 && !state.boss.active) {
        if (state.noDamageEncounter) unlockAchievement('no_future');
        state.noDamageEncounter = true;
        sfx.encounterClear();
        addText(state, WORLD_WIDTH / 2, 60, `ENCOUNTER ${state.encounter} CLEAR`, PALETTE.voidBlue, 1.2);
        beginEncounterOrUpgrade(state);
      }
    },
    [beginEncounterOrUpgrade, difficulty, gainStyle, gainVoid, particlesEnabled, sfx, unlockAchievement],
  );

  /* --------------------------------- Actions ---------------------------------- */

  const performStrike = useCallback(
    (targetAngle?: number) => {
      const state = stateRef.current;
      if (!state.running || state.gameOver || state.strikeTimer > 0 || screen !== 'game') return;

      const angle = typeof targetAngle === 'number' ? targetAngle : state.strikeAngle;
      state.strikeAngle = angle;
      state.strikeTimer = 0.24 * state.attackSpeedMultiplier;
      state.strikeProgress = 1;

      const baseRange = 78;
      const lowHpBonus = state.lowHpDamageBonus && state.hp < state.maxHp * 0.35 ? 1.45 : 1;
      const ascendBonus = state.ascended ? 2 : 1;
      let hits = 0;

      addSlash(state, state.playerX, state.playerY, angle, PALETTE.voidBlue, 60);
      sfx.strike();

      for (const enemy of state.enemies) {
        const d = distance(state.playerX, state.playerY, enemy.x, enemy.y);
        if (d > baseRange + enemy.radius) continue;
        const enemyAngle = Math.atan2(enemy.y - state.playerY, enemy.x - state.playerX);
        if (Math.abs(angleDiff(enemyAngle, angle)) > 0.85) continue;

        const crit = Math.random() < 0.12;
        const damage = 16 * state.damageMultiplier * lowHpBonus * ascendBonus * (crit ? 1.8 : 1);
        damageEnemy(state, enemy, damage, crit);
        hits += 1;

        const kb = 16;
        const kd = Math.max(1, d);
        enemy.x += ((enemy.x - state.playerX) / kd) * kb;
        enemy.y += ((enemy.y - state.playerY) / kd) * kb;
        if (enemy.staggered <= 0) enemy.staggered = 0.12;

        if (enemy.hp <= 0) killEnemy(state, enemy, 0);
      }

      if (state.boss.active && !state.boss.defeated) {
        const boss = state.boss;
        const d = distance(state.playerX, state.playerY, boss.x, boss.y);
        if (d <= baseRange + boss.radius) {
          const bossAngle = Math.atan2(boss.y - state.playerY, boss.x - state.playerX);
          if (Math.abs(angleDiff(bossAngle, angle)) <= 0.85) {
            const crit = Math.random() < 0.12;
            const damage = 14 * state.damageMultiplier * lowHpBonus * ascendBonus * (crit ? 1.8 : 1);
            boss.hp -= damage;
            boss.hitFlash = 0.13;
            spawnParticles(state, boss.x, boss.y, PALETTE.voidPurple, 10, particlesEnabled);
            sfx.bossHit();
            hits += 1;
            gainVoid(state, 2);
            gainStyle(state, 1.5);
          }
        }
      }

      state.enemies = state.enemies.filter((e) => e.hp > 0);

      if (hits > 0 && screenShakeEnabled) {
        state.screenShake = Math.max(state.screenShake, hits > 1 ? 6 : 3);
      }

      syncHud();
    },
    [damageEnemy, gainStyle, gainVoid, killEnemy, particlesEnabled, screen, screenShakeEnabled, sfx, syncHud],
  );

  const dash = useCallback(() => {
    const state = stateRef.current;
    if (!state.running || state.gameOver || state.dashCooldown > 0 || state.stamina < 22) return;

    const keys = keysRef.current;
    let dx = 0;
    let dy = 0;
    if (keys.has('w') || keys.has('arrowup')) dy -= 1;
    if (keys.has('s') || keys.has('arrowdown')) dy += 1;
    if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
    if (keys.has('d') || keys.has('arrowright')) dx += 1;
    if (dx === 0 && dy === 0) {
      dx = Math.cos(state.strikeAngle);
      dy = Math.sin(state.strikeAngle);
    }
    const mag = Math.hypot(dx, dy) || 1;
    dx /= mag;
    dy /= mag;

    const oldX = state.playerX;
    const oldY = state.playerY;
    const dist = 120;
    state.playerX = clamp(state.playerX + dx * dist, 28, WORLD_WIDTH - 28);
    state.playerY = clamp(state.playerY + dy * dist, 28, WORLD_HEIGHT - 28);
    state.stamina = state.ascended ? state.stamina : state.stamina - 22;
    state.dashCooldown = 0.55 * state.dashCooldownMultiplier * (state.ascended ? 0.1 : 1);
    state.invulnTimer = 0.26;
    state.screenShake = screenShakeEnabled ? 3 : 0;

    spawnParticles(state, oldX, oldY, PALETTE.voidBlue, 18, particlesEnabled);
    spawnParticles(state, state.playerX, state.playerY, PALETTE.voidBlue, 10, particlesEnabled);
    sfx.dash();

    if (state.phantomStepEnabled) {
      // Afterimage cuts anything between old and new position.
      const midX = (oldX + state.playerX) / 2;
      const midY = (oldY + state.playerY) / 2;
      for (const enemy of state.enemies) {
        const d = distance(midX, midY, enemy.x, enemy.y);
        if (d < 60 + enemy.radius) {
          const dmg = 22 * state.damageMultiplier;
          damageEnemy(state, enemy, dmg, false);
          if (enemy.hp <= 0) killEnemy(state, enemy, 1);
        }
      }
      addSlash(state, midX, midY, Math.atan2(dy, dx), PALETTE.white, 50);
      state.enemies = state.enemies.filter((e) => e.hp > 0);
    }

    syncHud();
  }, [damageEnemy, killEnemy, particlesEnabled, screenShakeEnabled, sfx, syncHud]);

  const triggerAscension = useCallback(() => {
    const state = stateRef.current;
    if (!state.running || state.gameOver || state.ascended) return;
    if (state.voidMeter < state.maxVoid) return;
    state.ascended = true;
    state.ascendTimer = 8;
    state.voidMeter = 0;
    state.screenShake = screenShakeEnabled ? 14 : 0;
    spawnParticles(state, state.playerX, state.playerY, PALETTE.white, 90, particlesEnabled);
    addText(state, state.playerX, state.playerY - 50, 'VOID ASCENSION', PALETTE.white, 1.6);
    sfx.ascend();
    syncHud();
  }, [particlesEnabled, screenShakeEnabled, sfx, syncHud]);

  /* --------------------------------- Requiem ----------------------------------- */

  const performRequiem = useCallback(() => {
    const state = stateRef.current;
    if (!state.running || state.gameOver || screen !== 'game' || state.requiemCooldown > 0) return;

    state.requiemCooldown = 0.4;
    const requiemRange = 150 * state.requiemRadiusMultiplier;
    const windowMult = state.requiemWindowMultiplier;

    let bestTarget: { kind: 'projectile'; ref: Projectile } | { kind: 'enemy'; ref: Enemy } | { kind: 'boss'; ref: Boss } | null = null;
    let bestScore = Infinity;

    // Cuttable projectiles near the player.
    for (const projectile of state.projectiles) {
      if (!projectile.cuttable) continue;
      const d = distance(projectile.x, projectile.y, state.playerX, state.playerY);
      if (d > requiemRange) continue;
      const arrival = d / (Math.hypot(projectile.vx, projectile.vy) || 1);
      if (arrival < bestScore) {
        bestScore = arrival;
        bestTarget = { kind: 'projectile', ref: projectile };
      }
    }

    // Telegraphing melee enemies.
    for (const enemy of state.enemies) {
      if (enemy.state !== 'telegraph') continue;
      const d = distance(enemy.x, enemy.y, state.playerX, state.playerY);
      if (d > requiemRange) continue;
      const remaining = enemy.stateTimer;
      if (remaining < bestScore) {
        bestScore = remaining;
        bestTarget = { kind: 'enemy', ref: enemy };
      }
    }

    // Boss telegraph.
    if (state.boss.active && state.boss.state === 'telegraph') {
      const d = distance(state.boss.x, state.boss.y, state.playerX, state.playerY);
      if (d <= requiemRange + state.boss.radius && state.boss.stateTimer < bestScore) {
        bestScore = state.boss.stateTimer;
        bestTarget = { kind: 'boss', ref: state.boss };
      }
    }

    if (!bestTarget) {
      // No valid target — a whiffed Requiem still grants a brief dash-like sidestep with i-frames,
      // but no reward, to keep the button always responsive.
      state.invulnTimer = Math.max(state.invulnTimer, 0.12);
      sfx.requiemFail();
      addText(state, state.playerX, state.playerY - 30, 'MISS', 'rgba(255,255,255,0.4)', 0.85);
      syncHud();
      return;
    }

    // Determine timing quality. Perfect window scales with upgrades.
    const perfectWindow = 0.14 * windowMult;
    const goodWindow = 0.34 * windowMult;
    const isPerfect = bestScore <= perfectWindow;
    const isGood = !isPerfect && bestScore <= goodWindow;

    state.hitStop = 0.05;
    state.slowMoTimer = isPerfect ? 0.55 : 0.32;
    state.requiemFlashTimer = 0.18;
    state.invulnTimer = 0.5;
    state.requiemsTotal += 1;

    const px = bestTarget.ref.x;
    const py = bestTarget.ref.y;
    const angleToTarget = Math.atan2(py - state.playerY, px - state.playerX);
    addSlash(state, (px + state.playerX) / 2, (py + state.playerY) / 2, angleToTarget, PALETTE.white, 110);
    state.screenShake = screenShakeEnabled ? (isPerfect ? 14 : 8) : 0;

    if (bestTarget.kind === 'projectile') {
      const projectile = bestTarget.ref;
      projectile.cutFlash = 0.2;
      state.projectiles = state.projectiles.filter((p) => p !== projectile);
      state.voidCuts += 1;
      spawnParticles(state, px, py, PALETTE.white, isPerfect ? 30 : 16, particlesEnabled);
    } else if (bestTarget.kind === 'enemy') {
      const enemy = bestTarget.ref;
      enemy.parried = true;
      enemy.state = 'recover';
      enemy.stateTimer = 0.7;
      enemy.staggered = 0.7;
      const dmg = (isPerfect ? 38 : 24) * state.damageMultiplier;
      damageEnemy(state, enemy, dmg, isPerfect);
      if (enemy.hp <= 0) killEnemy(state, enemy, isPerfect ? 3 : 1);
      spawnParticles(state, px, py, PALETTE.white, isPerfect ? 30 : 16, particlesEnabled);
    } else {
      const boss = bestTarget.ref;
      boss.state = 'recover';
      boss.stateTimer = 1;
      boss.staggered = 1;
      const dmg = (isPerfect ? 70 : 40) * state.damageMultiplier;
      boss.hp -= dmg;
      boss.hitFlash = 0.16;
      spawnParticles(state, px, py, PALETTE.white, 34, particlesEnabled);
    }

    if (isPerfect) {
      state.perfectRequiems += 1;
      gainVoid(state, 16);
      gainStyle(state, 15);
      state.score += 450;
      addText(state, state.playerX, state.playerY - 40, 'PERFECT REQUIEM', PALETTE.white, 1.4);
      sfx.perfectRequiem();
      if (state.perfectRequiems === 1) unlockAchievement('first_cut');
      if (state.perfectRequiems >= 10) unlockAchievement('fateless');
    } else if (isGood) {
      gainVoid(state, 8);
      gainStyle(state, 6);
      state.score += 150;
      addText(state, state.playerX, state.playerY - 40, 'REQUIEM', '#cdeaff', 1.1);
      sfx.goodRequiem();
      if (state.perfectRequiems === 0 && state.requiemsTotal === 1) unlockAchievement('first_cut');
    } else {
      gainVoid(state, 3);
      gainStyle(state, 2);
      state.score += 60;
      addText(state, state.playerX, state.playerY - 30, 'CUT', '#8fbfd6', 0.95);
      sfx.goodRequiem();
    }

    state.combo += isPerfect ? 2 : 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.comboTimer = 2.8;

    syncHud();
  }, [damageEnemy, gainStyle, gainVoid, killEnemy, particlesEnabled, screen, screenShakeEnabled, sfx, syncHud, unlockAchievement]);

  /* -------------------------------- Run lifecycle -------------------------------- */

  const startGame = useCallback(() => {
    const state = createInitialState();
    state.running = true;
    state.enemiesRemainingInEncounter = 4;
    state.spawnInterval = 1.05 / DIFFICULTIES[difficulty].enemyMult;
    stateRef.current = state;

    updateSave((c) => ({ ...c, totalRuns: c.totalRuns + 1 }));
    setScreen('game');
    setUpgradeChoices([]);
    lastFrameRef.current = performance.now();
    sfx.dash();
    syncHud();
  }, [difficulty, sfx, syncHud, updateSave]);

  const pauseGame = useCallback(() => {
    const state = stateRef.current;
    if (screen !== 'game' || state.gameOver) return;
    state.running = false;
    setScreen('pause');
  }, [screen]);

  const resumeGame = useCallback(() => {
    const state = stateRef.current;
    if (state.gameOver) return;
    state.running = true;
    setScreen('game');
    lastFrameRef.current = performance.now();
  }, []);

  const finishGame = useCallback(
    (victory: boolean) => {
      const state = stateRef.current;
      state.running = false;
      state.gameOver = true;
      state.victory = victory;
      setScreen('results');

      const current = saveRef.current || loadSave();
      const accuracy = state.requiemsTotal > 0 ? state.perfectRequiems / state.requiemsTotal : 0;
      if (accuracy >= 0.9 && state.requiemsTotal >= 8) unlockAchievement('perfect_world');
      if (victory) unlockAchievement('death_itself');

      const rankOrder = ['D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
      const currentRank = styleRankFromValue(state.style);
      const bestRank =
        rankOrder.indexOf(currentRank) > rankOrder.indexOf(current.bestStyleRank) ? currentRank : current.bestStyleRank;

      updateSave((existing) => ({
        ...existing,
        highScore: Math.max(existing.highScore, Math.round(state.score)),
        bestCombo: Math.max(existing.bestCombo, state.maxCombo),
        bestStyleRank: bestRank,
        totalKills: existing.totalKills + state.enemiesKilled,
        totalPerfectRequiems: existing.totalPerfectRequiems + state.perfectRequiems,
        bossesDefeated: existing.bossesDefeated + (victory ? 1 : 0),
      }));

      sfx.death();
      syncHud();
    },
    [sfx, syncHud, unlockAchievement, updateSave],
  );

  const restartGame = useCallback(() => startGame(), [startGame]);

  /* ---------------------------------- Input ---------------------------------- */

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      keysRef.current.add(key);
      if ([' ', 'shift', 'r', 'f', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        event.preventDefault();
      }
      if (screen === 'game') {
        if (key === ' ') performStrike();
        if (key === 'shift') dash();
        if (key === 'r') performRequiem();
        if (key === 'f') triggerAscension();
        if (key === 'escape') pauseGame();
      } else if (screen === 'pause' && key === 'escape') {
        resumeGame();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      keysRef.current.clear();
    };
  }, [dash, open, pauseGame, performRequiem, performStrike, resumeGame, screen, triggerAscension]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* --------------------------------- Update loop -------------------------------- */

  const updateGame = useCallback(
    (state: GameState, delta: number) => {
      state.elapsed += delta;
      state.timeSinceHit += delta;

      state.strikeTimer = Math.max(0, state.strikeTimer - delta);
      state.strikeProgress = Math.max(0, state.strikeProgress - delta * 4.2);
      state.dashCooldown = Math.max(0, state.dashCooldown - delta);
      state.invulnTimer = Math.max(0, state.invulnTimer - delta);
      state.comboTimer = Math.max(0, state.comboTimer - delta);
      state.requiemCooldown = Math.max(0, state.requiemCooldown - delta);
      state.requiemFlashTimer = Math.max(0, state.requiemFlashTimer - delta);
      state.screenShake = Math.max(0, state.screenShake - delta * 24);

      if (state.styleDecayDelay > 0) {
        state.styleDecayDelay -= delta;
      } else {
        state.style = Math.max(0, state.style - delta * 6);
      }

      state.stamina = clamp(state.stamina + 26 * delta, 0, state.maxStamina);

      if (state.comboTimer <= 0) state.combo = 0;

      if (state.ascended) {
        state.ascendTimer -= delta;
        if (state.ascendTimer <= 0) {
          state.ascended = false;
          addText(state, state.playerX, state.playerY - 40, 'ASCENSION FADES', PALETTE.voidPurple, 1.05);
        }
      }

      const timeScale = state.slowMoTimer > 0 ? 0.22 : 1;
      if (state.slowMoTimer > 0) state.slowMoTimer = Math.max(0, state.slowMoTimer - delta);
      const scaledDelta = delta * timeScale;

      // Movement
      const keys = keysRef.current;
      let moveX = 0;
      let moveY = 0;
      if (keys.has('w') || keys.has('arrowup')) moveY -= 1;
      if (keys.has('s') || keys.has('arrowdown')) moveY += 1;
      if (keys.has('a') || keys.has('arrowleft')) moveX -= 1;
      if (keys.has('d') || keys.has('arrowright')) moveX += 1;
      if (moveX !== 0 || moveY !== 0) {
        const mag = Math.hypot(moveX, moveY) || 1;
        moveX /= mag;
        moveY /= mag;
        const speed = (state.ascended ? 240 : 190) * (state.lowHpDamageBonus && state.hp < state.maxHp * 0.35 ? 1.2 : 1);
        state.playerX = clamp(state.playerX + moveX * speed * delta, 28, WORLD_WIDTH - 28);
        state.playerY = clamp(state.playerY + moveY * speed * delta, 28, WORLD_HEIGHT - 28);
        state.strikeAngle = Math.atan2(moveY, moveX);
      }

      // Spawning (only outside boss encounter)
      if (!state.boss.active && state.enemiesRemainingInEncounter > 0) {
        state.spawnTimer += delta;
        const maxOnScreen = Math.min(7, 2 + state.encounter);
        if (state.spawnTimer >= state.spawnInterval && state.enemies.length < maxOnScreen) {
          state.spawnTimer = 0;
          createEnemy(state, difficulty, state.encounter);
        }
      }

      // Enemy simulation
      for (const enemy of state.enemies) {
        enemy.hitFlash = Math.max(0, enemy.hitFlash - delta);
        enemy.staggered = Math.max(0, enemy.staggered - delta);
        const dx = state.playerX - enemy.x;
        const dy = state.playerY - enemy.y;
        const d = Math.hypot(dx, dy) || 1;
        enemy.angle = Math.atan2(dy, dx);
        const dirX = dx / d;
        const dirY = dy / d;
        const eScale = enemy.staggered > 0 ? 0.15 : timeScale;

        if (enemy.state === 'chase') {
          const stopDistance = enemy.type === 'oracle' ? 210 : enemy.radius + state.playerRadius + 46;
          if (d > stopDistance) {
            enemy.x += dirX * enemy.speed * delta * eScale;
            enemy.y += dirY * enemy.speed * delta * eScale;
          } else if (enemy.type === 'oracle' && d < 150) {
            enemy.x -= dirX * enemy.speed * delta * eScale;
            enemy.y -= dirY * enemy.speed * delta * eScale;
          }

          if (enemy.type === 'null') {
            // Mirrors: occasionally strafes opposite the player's recent motion.
            enemy.x += Math.cos(enemy.angle + Math.PI / 2) * 14 * delta * eScale * (Math.sin(state.elapsed * 3) > 0 ? 1 : -1);
          }

          enemy.attackTimer -= delta * eScale;
          if (enemy.attackTimer <= 0) {
            const inRange = enemy.type === 'oracle' ? d < 340 : d < enemy.radius + state.playerRadius + 60;
            if (inRange) {
              enemy.state = 'telegraph';
              enemy.stateTimer = enemy.telegraphDuration;
              enemy.requiemEligible = true;
              enemy.parried = false;
            }
          }
        } else if (enemy.state === 'telegraph') {
          enemy.stateTimer -= delta * eScale;
          // Slight forward creep during windup for lancer/executor.
          if (enemy.type === 'lancer' || enemy.type === 'executor') {
            enemy.x += dirX * enemy.speed * 0.25 * delta * eScale;
            enemy.y += dirY * enemy.speed * 0.25 * delta * eScale;
          }
          if (enemy.stateTimer <= 0) {
            enemy.state = 'attack';
            enemy.stateTimer = 0.18;
          }
        } else if (enemy.state === 'attack') {
          enemy.stateTimer -= delta * eScale;
          if (!enemy.parried && enemy.stateTimer > 0.02 && enemy.stateTimer < 0.16) {
            if (enemy.type === 'oracle') {
              state.projectiles.push({
                id: state.nextProjectileId++,
                x: enemy.x,
                y: enemy.y,
                vx: dirX * 240,
                vy: dirY * 240,
                radius: 6,
                damage: enemy.damage,
                life: 3.2,
                spawnLife: 3.2,
                color: PALETTE.voidPurple,
                cuttable: true,
                cutFlash: 0,
              });
              enemy.stateTimer = 0;
            } else if (d < enemy.radius + state.playerRadius + 22 && state.invulnTimer <= 0) {
              const dmg = enemy.damage;
              state.hp = clamp(state.hp - dmg, 0, state.maxHp);
              state.damageTaken += dmg;
              state.hitsTaken += 1;
              state.noDamageEncounter = false;
              state.combo = 0;
              state.comboTimer = 0;
              state.invulnTimer = 0.3;
              state.timeSinceHit = 0;
              state.screenShake = screenShakeEnabled ? 9 : 0;
              spawnParticles(state, state.playerX, state.playerY, PALETTE.danger, 14, particlesEnabled);
              if (damageNumbersEnabled) addText(state, state.playerX, state.playerY - 26, `-${Math.round(dmg)}`, PALETTE.danger, 1.05);
              sfx.hit();
              enemy.stateTimer = 0;
              if (state.hp <= 0) {
                finishGame(false);
                return;
              }
            }
          }
          if (enemy.stateTimer <= 0) {
            enemy.state = 'recover';
            enemy.stateTimer = 0.35;
          }
        } else if (enemy.state === 'recover') {
          enemy.stateTimer -= delta * eScale;
          if (enemy.stateTimer <= 0) {
            enemy.state = 'chase';
            enemy.attackTimer = enemy.attackCooldown;
          }
        }
      }

      state.enemies = state.enemies.filter((e) => e.hp > 0);

      // Projectiles
      for (let i = state.projectiles.length - 1; i >= 0; i -= 1) {
        const p = state.projectiles[i];
        p.life -= delta;
        p.x += p.vx * delta * timeScale;
        p.y += p.vy * delta * timeScale;
        if (p.life <= 0 || p.x < -50 || p.x > WORLD_WIDTH + 50 || p.y < -50 || p.y > WORLD_HEIGHT + 50) {
          state.projectiles.splice(i, 1);
          continue;
        }
        const d = distance(p.x, p.y, state.playerX, state.playerY);
        if (d < p.radius + state.playerRadius && state.invulnTimer <= 0) {
          state.hp = clamp(state.hp - p.damage, 0, state.maxHp);
          state.damageTaken += p.damage;
          state.hitsTaken += 1;
          state.noDamageEncounter = false;
          state.invulnTimer = 0.22;
          state.combo = 0;
          state.timeSinceHit = 0;
          spawnParticles(state, state.playerX, state.playerY, PALETTE.voidPurple, 10, particlesEnabled);
          state.projectiles.splice(i, 1);
          sfx.hit();
          if (state.hp <= 0) {
            finishGame(false);
            return;
          }
        }
      }

      // Pickups
      for (let i = state.pickups.length - 1; i >= 0; i -= 1) {
        const pickup = state.pickups[i];
        pickup.life -= delta;
        pickup.pulse += delta;
        const d = distance(pickup.x, pickup.y, state.playerX, state.playerY);
        if (d < 26) {
          if (pickup.type === 'health') state.hp = clamp(state.hp + 18, 0, state.maxHp);
          if (pickup.type === 'void') gainVoid(state, 14);
          if (pickup.type === 'core') gainStyle(state, 20);
          spawnParticles(state, pickup.x, pickup.y, pickup.type === 'core' ? PALETTE.white : PALETTE.voidBlue, 14, particlesEnabled);
          sfx.pickup();
          state.pickups.splice(i, 1);
          continue;
        }
        if (pickup.life <= 0) state.pickups.splice(i, 1);
      }

      // Boss simulation
      if (state.boss.active) {
        const boss = state.boss;
        boss.hitFlash = Math.max(0, boss.hitFlash - delta);
        boss.staggered = Math.max(0, boss.staggered - delta);
        boss.lineTimer -= delta;

        const dx = state.playerX - boss.x;
        const dy = state.playerY - boss.y;
        const d = Math.hypot(dx, dy) || 1;
        const bx = dx / d;
        const by = dy / d;
        boss.angle = Math.atan2(dy, dx);
        const bScale = boss.staggered > 0 ? 0.1 : timeScale;

        if (boss.hp <= boss.maxHp * 0.5 && boss.phase === 1) {
          boss.phase = 2;
          addText(state, boss.x, boss.y - 70, 'PHASE II — NULL FRAGMENT', PALETTE.voidPurple, 1.25);
          spawnParticles(state, boss.x, boss.y, PALETTE.voidPurple, 46, particlesEnabled);
        }

        if (boss.lineTimer <= 0) {
          boss.lineTimer = random(6, 10);
          addText(state, boss.x, boss.y - 60, BOSS_LINES[Math.floor(Math.random() * BOSS_LINES.length)], 'rgba(255,255,255,0.6)', 0.9);
        }

        if (boss.state === 'chase') {
          if (d > 160) {
            boss.x += bx * 46 * delta * bScale;
            boss.y += by * 46 * delta * bScale;
          }
          boss.attackTimer -= delta * bScale;
          if (boss.attackTimer <= 0) {
            boss.state = 'telegraph';
            boss.stateTimer = boss.telegraphDuration;
          }
        } else if (boss.state === 'telegraph') {
          boss.stateTimer -= delta * bScale;
          if (boss.stateTimer <= 0) {
            boss.state = 'attack';
            boss.stateTimer = 0.2;
          }
        } else if (boss.state === 'attack') {
          boss.stateTimer -= delta * bScale;
          if (boss.stateTimer > 0.02 && boss.stateTimer < 0.18) {
            if (boss.phase === 2 && Math.random() < 0.5) {
              for (let a = -1; a <= 1; a += 1) {
                state.projectiles.push({
                  id: state.nextProjectileId++,
                  x: boss.x,
                  y: boss.y,
                  vx: Math.cos(boss.angle + a * 0.3) * 210,
                  vy: Math.sin(boss.angle + a * 0.3) * 210,
                  radius: 8,
                  damage: 16 * DIFFICULTIES[difficulty].dmgMult,
                  life: 4,
                  spawnLife: 4,
                  color: PALETTE.danger,
                  cuttable: true,
                  cutFlash: 0,
                });
              }
            } else if (d < boss.radius + state.playerRadius + 60 && state.invulnTimer <= 0) {
              const dmg = 24 * DIFFICULTIES[difficulty].dmgMult;
              state.hp = clamp(state.hp - dmg, 0, state.maxHp);
              state.damageTaken += dmg;
              state.hitsTaken += 1;
              state.combo = 0;
              state.invulnTimer = 0.32;
              state.timeSinceHit = 0;
              state.screenShake = screenShakeEnabled ? 12 : 0;
              spawnParticles(state, state.playerX, state.playerY, PALETTE.danger, 16, particlesEnabled);
              sfx.hit();
              if (state.hp <= 0) {
                finishGame(false);
                return;
              }
            }
            boss.stateTimer = 0;
          }
          if (boss.stateTimer <= 0) {
            boss.state = 'recover';
            boss.stateTimer = 0.4;
          }
        } else if (boss.state === 'recover') {
          boss.stateTimer -= delta * bScale;
          if (boss.stateTimer <= 0) {
            boss.state = 'chase';
            boss.attackTimer = boss.phase === 2 ? 1.5 : 2;
          }
        }

        if (boss.phase === 2) {
          boss.summonTimer -= delta;
          if (boss.summonTimer <= 0) {
            boss.summonTimer = 7;
            createEnemy(state, difficulty, state.encounter, 'wraith');
          }
        }

        if (boss.hp <= 0 && !boss.defeated) {
          boss.defeated = true;
          boss.active = false;
          state.score += Math.round(1200 * DIFFICULTIES[difficulty].scoreMult);
          state.shards += 25;
          gainVoid(state, 30);
          gainStyle(state, 30);
          spawnParticles(state, boss.x, boss.y, PALETTE.white, 110, particlesEnabled);
          addText(state, boss.x, boss.y, 'THE VOID REMEMBERS', PALETTE.white, 1.6);
          sfx.bossDefeat();
          finishGame(true);
          return;
        }
      }

      // Particles
      for (let i = state.particles.length - 1; i >= 0; i -= 1) {
        const particle = state.particles[i];
        particle.life -= delta;
        particle.vx *= Math.pow(particle.drag, delta * 60);
        particle.vy *= Math.pow(particle.drag, delta * 60);
        particle.vy += particle.gravity * delta;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        if (particle.life <= 0) state.particles.splice(i, 1);
      }

      // Floating text
      for (let i = state.floatingTexts.length - 1; i >= 0; i -= 1) {
        const text = state.floatingTexts[i];
        text.life -= delta;
        text.y -= 22 * delta;
        if (text.life <= 0) state.floatingTexts.splice(i, 1);
      }

      // Slashes
      for (let i = state.slashes.length - 1; i >= 0; i -= 1) {
        const slash = state.slashes[i];
        slash.life -= delta;
        if (slash.life <= 0) state.slashes.splice(i, 1);
      }

      syncHud();
    },
    [damageNumbersEnabled, difficulty, finishGame, gainStyle, gainVoid, particlesEnabled, screenShakeEnabled, sfx, syncHud],
  );

  /* ---------------------------------- Render ----------------------------------- */

  const drawGame = useCallback(
    (ctx: CanvasRenderingContext2D, state: GameState, timestamp: number) => {
      const shake = screenShakeEnabled && !reducedMotion ? state.screenShake : 0;
      const shakeX = shake > 0 ? random(-shake, shake) : 0;
      const shakeY = shake > 0 ? random(-shake, shake) : 0;

      ctx.save();
      ctx.translate(shakeX, shakeY);

      const bg = ctx.createRadialGradient(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 30, WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 720);
      if (state.ascended) {
        bg.addColorStop(0, '#0c0616');
        bg.addColorStop(0.55, '#050208');
        bg.addColorStop(1, '#000000');
      } else {
        bg.addColorStop(0, '#0a0a10');
        bg.addColorStop(0.55, PALETTE.black);
        bg.addColorStop(1, '#000000');
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Grid
      ctx.save();
      ctx.globalAlpha = state.ascended ? 0.22 : 0.11;
      ctx.strokeStyle = state.ascended ? PALETTE.voidPurple : '#8b858d';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x <= WORLD_WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORLD_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= WORLD_HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD_WIDTH, y);
        ctx.stroke();
      }
      ctx.restore();

      // Rotating void rings
      if (!reducedMotion) {
        ctx.save();
        ctx.translate(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        ctx.rotate(timestamp / 13000);
        ctx.strokeStyle = state.ascended ? 'rgba(138,92,255,0.16)' : 'rgba(93,235,255,0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 185, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 232, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Requiem timing rings on eligible enemies/boss
      for (const enemy of state.enemies) {
        if (enemy.state !== 'telegraph') continue;
        const progress = 1 - enemy.stateTimer / enemy.telegraphDuration;
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = PALETTE.danger;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius + 14, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      if (state.boss.active && state.boss.state === 'telegraph') {
        const boss = state.boss;
        const progress = 1 - boss.stateTimer / boss.telegraphDuration;
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = PALETTE.danger;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, boss.radius + 18, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Pickups
      for (const pickup of state.pickups) {
        const colors = { health: PALETTE.danger, void: PALETTE.voidPurple, core: PALETTE.white };
        const color = colors[pickup.type];
        const pulse = 1 + Math.sin(pickup.pulse * 4) * 0.12;
        drawGlow(ctx, pickup.x, pickup.y, 8 * pulse, color, 0.22);
        ctx.save();
        ctx.translate(pickup.x, pickup.y);
        ctx.rotate(pickup.pulse);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(7, 0);
        ctx.lineTo(0, 7);
        ctx.lineTo(-7, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Projectiles
      for (const p of state.projectiles) {
        drawGlow(ctx, p.x, p.y, p.radius * 1.7, p.color, 0.22);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        if (p.cuttable) {
          ctx.save();
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Enemies
      const enemyColors: Record<EnemyType, string> = {
        wraith: PALETTE.voidPurple,
        lancer: PALETTE.danger,
        oracle: PALETTE.voidPurple,
        executor: PALETTE.voidBlue,
        null: PALETTE.white,
      };

      for (const enemy of state.enemies) {
        const color = enemyColors[enemy.type];
        const pulse = 1 + Math.sin(timestamp / 180 + enemy.id) * 0.06;
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(enemy.angle + Math.PI / 2);
        ctx.scale(pulse, pulse);
        drawGlow(ctx, 0, 0, enemy.radius * 1.2, color, 0.12);
        ctx.fillStyle = '#07060a';
        ctx.strokeStyle = color;
        ctx.lineWidth = enemy.elite ? 2 : 1.2;
        ctx.beginPath();
        if (enemy.type === 'wraith') {
          ctx.moveTo(0, -enemy.radius);
          ctx.lineTo(enemy.radius, 0);
          ctx.lineTo(0, enemy.radius);
          ctx.lineTo(-enemy.radius, 0);
        } else if (enemy.type === 'lancer') {
          ctx.moveTo(0, -enemy.radius * 1.3);
          ctx.lineTo(enemy.radius * 0.6, enemy.radius);
          ctx.lineTo(-enemy.radius * 0.6, enemy.radius);
        } else if (enemy.type === 'oracle') {
          ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
        } else if (enemy.type === 'executor') {
          ctx.moveTo(0, -enemy.radius * 1.15);
          ctx.lineTo(enemy.radius, enemy.radius * 0.7);
          ctx.lineTo(-enemy.radius, enemy.radius * 0.7);
        } else {
          ctx.moveTo(0, -enemy.radius);
          ctx.lineTo(enemy.radius * 0.8, enemy.radius * 0.7);
          ctx.lineTo(0, enemy.radius * 0.3);
          ctx.lineTo(-enemy.radius * 0.8, enemy.radius * 0.7);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
        const barWidth = enemy.radius * 2.4;
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 12, barWidth, 3);
        ctx.fillStyle = enemy.elite ? PALETTE.white : color;
        ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 12, barWidth * hpRatio, 3);

        if (enemy.hitFlash > 0) {
          ctx.save();
          ctx.globalAlpha = enemy.hitFlash / 0.13;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.radius * 1.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Boss
      if (state.boss.active) {
        const boss = state.boss;
        const pulse = 1 + Math.sin(timestamp / 300) * 0.05;
        ctx.save();
        ctx.translate(boss.x, boss.y);
        ctx.scale(pulse, pulse);
        drawGlow(ctx, 0, 0, boss.radius * 1.4, boss.phase === 2 ? PALETTE.voidPurple : PALETTE.voidBlue, 0.16);
        ctx.fillStyle = '#050408';
        ctx.strokeStyle = boss.phase === 2 ? PALETTE.voidPurple : PALETTE.voidBlue;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -boss.radius);
        ctx.lineTo(boss.radius, boss.radius * 0.7);
        ctx.lineTo(0, boss.radius * 1.15);
        ctx.lineTo(-boss.radius, boss.radius * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = boss.phase === 2 ? PALETTE.voidPurple : PALETTE.voidBlue;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (boss.hitFlash > 0) {
          ctx.save();
          ctx.globalAlpha = boss.hitFlash / 0.16;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(boss.x, boss.y, boss.radius * 1.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        const bossRatio = clamp(boss.hp / boss.maxHp, 0, 1);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(WORLD_WIDTH / 2 - 260, 20, 520, 7);
        ctx.fillStyle = boss.phase === 2 ? PALETTE.voidPurple : PALETTE.voidBlue;
        ctx.fillRect(WORLD_WIDTH / 2 - 260, 20, 520 * bossRatio, 7);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = '700 11px ui-monospace, monospace';
        ctx.fillStyle = '#f3eee6';
        ctx.fillText(`${boss.name} // PHASE ${boss.phase}`, WORLD_WIDTH / 2, 15);
        ctx.restore();
      }

      // Player
      ctx.save();
      ctx.translate(state.playerX, state.playerY);
      ctx.rotate(state.strikeAngle);

      const swordColor = state.ascended ? PALETTE.white : state.combo > 8 ? PALETTE.voidBlue : '#3a3a44';
      drawGlow(ctx, 0, 0, state.ascended ? 30 : 18, state.ascended ? PALETTE.white : PALETTE.voidBlue, state.ascended ? 0.3 : 0.14);

      if (state.invulnTimer > 0) {
        ctx.strokeStyle = PALETTE.voidBlue;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#09080c';
      ctx.strokeStyle = state.ascended ? PALETTE.white : PALETTE.voidBlue;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, state.playerRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Coat silhouette hint
      ctx.beginPath();
      ctx.moveTo(0, -19);
      ctx.lineTo(13, 10);
      ctx.lineTo(0, 6);
      ctx.lineTo(-13, 10);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(243,238,230,0.65)';
      ctx.lineWidth = 1;
      ctx.stroke();

      drawGlow(ctx, 0, 0, 3.5, state.ascended ? PALETTE.white : PALETTE.voidBlue, 0.9);

      // Kurohane sword
      ctx.strokeStyle = swordColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowColor = swordColor;
      ctx.shadowBlur = state.ascended ? 18 : 6;
      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(52, 0);
      ctx.stroke();
      ctx.restore();

      // Strike arc
      if (state.strikeProgress > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, state.strikeProgress * 1.5);
        ctx.strokeStyle = PALETTE.voidBlue;
        ctx.shadowColor = PALETTE.voidBlue;
        ctx.shadowBlur = 20;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(state.playerX, state.playerY, 68, state.strikeAngle - 0.85, state.strikeAngle + 0.85);
        ctx.stroke();
        ctx.restore();
      }

      // Requiem flash
      if (state.requiemFlashTimer > 0) {
        ctx.save();
        ctx.globalAlpha = state.requiemFlashTimer / 0.18;
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        ctx.restore();
      }

      // Slashes
      for (const slash of state.slashes) {
        const alpha = clamp(slash.life / slash.maxLife, 0, 1);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(slash.x, slash.y);
        ctx.rotate(slash.angle);
        ctx.strokeStyle = slash.color;
        ctx.shadowColor = slash.color;
        ctx.shadowBlur = 16;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-slash.length / 2, 0);
        ctx.lineTo(slash.length / 2, 0);
        ctx.stroke();
        ctx.restore();
      }

      // Particles
      if (particlesEnabled) {
        for (const particle of state.particles) {
          const alpha = clamp(particle.life / particle.maxLife, 0, 1);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = particle.size * 4;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Floating text
      if (damageNumbersEnabled) {
        for (const text of state.floatingTexts) {
          const alpha = clamp(text.life / text.maxLife, 0, 1);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.textAlign = 'center';
          ctx.font = `700 ${11 * text.scale}px ui-monospace, monospace`;
          ctx.fillStyle = text.color;
          ctx.shadowColor = text.color;
          ctx.shadowBlur = 8;
          ctx.fillText(text.text, text.x, text.y);
          ctx.restore();
        }
      }

      // Vignette
      const vignette = ctx.createRadialGradient(
        WORLD_WIDTH / 2,
        WORLD_HEIGHT / 2,
        WORLD_HEIGHT * 0.25,
        WORLD_WIDTH / 2,
        WORLD_HEIGHT / 2,
        WORLD_HEIGHT * 0.78,
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.72)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      if (state.hp < state.maxHp * 0.25) {
        ctx.fillStyle = `rgba(255,54,92,${0.04 + Math.sin(timestamp / 150) * 0.025})`;
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      }

      if (state.slowMoTimer > 0 && !reducedMotion) {
        ctx.fillStyle = `rgba(93,235,255,${0.05 * (state.slowMoTimer / 0.55)})`;
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      }

      ctx.restore();
    },
    [damageNumbersEnabled, particlesEnabled, reducedMotion, screenShakeEnabled],
  );

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let destroyed = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const render = (timestamp: number) => {
      if (destroyed) return;
      const state = stateRef.current;
      const previous = lastFrameRef.current || timestamp;
      const rawDelta = (timestamp - previous) / 1000;
      const delta = clamp(rawDelta, 0, 0.035);
      lastFrameRef.current = timestamp;

      const scaleX = canvas.width / WORLD_WIDTH;
      const scaleY = canvas.height / WORLD_HEIGHT;
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

      if (state.running && !state.gameOver) {
        if (state.hitStop > 0) {
          state.hitStop = Math.max(0, state.hitStop - delta);
        } else {
          updateGame(state, delta);
        }
      }

      drawGame(ctx, state, timestamp);
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      observer.disconnect();
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, [drawGame, open, updateGame]);

  const handleCanvasPointer = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || screen !== 'game') return;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * WORLD_WIDTH;
      const y = ((event.clientY - rect.top) / rect.height) * WORLD_HEIGHT;
      const state = stateRef.current;
      const angle = Math.atan2(y - state.playerY, x - state.playerX);
      performStrike(angle);
    },
    [performStrike, screen],
  );

  const toggleSetting = useCallback(
    (setting: 'sound' | 'screenShake' | 'particles' | 'damageNumbers' | 'reducedMotion') => {
      const values = {
        sound: !soundEnabled,
        screenShake: !screenShakeEnabled,
        particles: !particlesEnabled,
        damageNumbers: !damageNumbersEnabled,
        reducedMotion: !reducedMotion,
      };
      const value = values[setting];
      if (setting === 'sound') setSoundEnabled(value);
      if (setting === 'screenShake') setScreenShakeEnabled(value);
      if (setting === 'particles') setParticlesEnabled(value);
      if (setting === 'damageNumbers') setDamageNumbersEnabled(value);
      if (setting === 'reducedMotion') setReducedMotion(value);
      updateSave((current) => ({ ...current, settings: { ...current.settings, [setting]: value } }));
    },
    [damageNumbersEnabled, particlesEnabled, reducedMotion, screenShakeEnabled, soundEnabled, updateSave],
  );

  if (!open) return null;

  const hpRatio = hud.maxHp > 0 ? hud.hp / hud.maxHp : 0;
  const staminaRatio = hud.maxStamina > 0 ? hud.stamina / hud.maxStamina : 0;
  const voidRatio = hud.maxVoid > 0 ? hud.voidMeter / hud.maxVoid : 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-2 backdrop-blur-xl sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Void Requiem"
    >
      <div className="relative flex max-h-[96vh] w-full max-w-[1180px] flex-col overflow-hidden border border-[#5DEBFF]/25 bg-[#050509] shadow-[0_0_120px_rgba(93,235,255,0.12)]">
        {/* Header */}
        <header className="relative z-30 flex min-h-[60px] items-center justify-between border-b border-white/10 bg-black/70 px-3 py-2 backdrop-blur-xl sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center border border-[#5DEBFF]/50 bg-[#5DEBFF]/10 font-mono text-[10px] text-[#5DEBFF]">
              <span className="absolute inset-1 border border-[#5DEBFF]/20" />
              VR
            </div>
            <div>
              <div className="font-mono text-[8px] tracking-[0.35em] text-[#5DEBFF]">VOID//REQUIEM</div>
              <div className="mt-0.5 font-mono text-[7px] tracking-[0.18em] text-white/25">CUT FATE // 01</div>
            </div>
          </div>

          {screen === 'game' && (
            <div className="hidden items-center gap-5 md:flex">
              <TopMetric label="ENCOUNTER" value={String(hud.encounter).padStart(2, '0')} />
              <TopMetric label="STYLE" value={hud.styleRank} />
              <TopMetric label="SCORE" value={String(hud.score).padStart(6, '0')} />
            </div>
          )}

          <div className="flex items-center gap-2">
            {screen === 'game' && (
              <button
                type="button"
                onClick={pauseGame}
                className="border border-white/10 px-3 py-2 font-mono text-[8px] tracking-[0.16em] text-white/45 transition hover:border-[#5DEBFF]/40 hover:text-[#5DEBFF]"
              >
                PAUSE
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                stateRef.current.running = false;
                onClose();
              }}
              className="flex h-8 w-8 items-center justify-center border border-white/10 font-mono text-lg text-white/35 transition hover:border-[#5DEBFF]/50 hover:text-[#5DEBFF]"
              aria-label="Close Void Requiem"
            >
              ×
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="relative min-h-0 flex-1 overflow-auto">
          {screen === 'game' && (
            <div className="relative aspect-[16/9] min-h-[340px] w-full overflow-hidden bg-black">
              <canvas
                ref={canvasRef}
                onPointerDown={handleCanvasPointer}
                className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
              />

              {/* HUD */}
              <div className="pointer-events-none absolute left-3 top-3 w-48 sm:left-5 sm:top-5 sm:w-56">
                <HudBar label="HP" value={`${Math.ceil(hud.hp)}/${Math.ceil(hud.maxHp)}`} ratio={hpRatio} color={PALETTE.danger} />
                <HudBar label="STAMINA" value={String(Math.ceil(hud.stamina))} ratio={staminaRatio} color={PALETTE.voidBlue} />
                <HudBar
                  label={hud.ascended ? 'ASCENDED' : 'VOID'}
                  value={hud.ascended ? 'MAX' : `${Math.ceil(hud.voidMeter)}%`}
                  ratio={hud.ascended ? 1 : voidRatio}
                  color={hud.ascended ? PALETTE.white : PALETTE.voidPurple}
                />
                <div className="mt-2">
                  <div className="mb-1 flex justify-between font-mono text-[7px] tracking-[0.16em]">
                    <span className="text-white/35">STYLE</span>
                    <span className="text-[#f5d76e]">{hud.styleRank}</span>
                  </div>
                  <div className="h-1 overflow-hidden bg-white/10">
                    <div
                      className="h-full transition-[width] duration-150"
                      style={{ width: `${clamp(hud.style, 0, 100)}%`, backgroundColor: '#f5d76e', boxShadow: '0 0 12px #f5d76e' }}
                    />
                  </div>
                </div>
              </div>

              {/* Combo */}
              {hud.combo >= 2 && (
                <div className="pointer-events-none absolute right-4 top-4 text-right sm:right-6 sm:top-6">
                  <div className="font-mono text-3xl font-bold tracking-tight text-[#f5d76e] drop-shadow-[0_0_15px_rgba(245,215,110,0.4)] sm:text-4xl">
                    x{hud.combo}
                  </div>
                  <div className="font-mono text-[7px] tracking-[0.3em] text-white/30">{hud.styleRank} STYLE</div>
                </div>
              )}

              {/* Boss HUD */}
              {hud.bossHp > 0 && (
                <div className="pointer-events-none absolute left-1/2 top-3 w-[min(70%,520px)] -translate-x-1/2 sm:top-5">
                  <div className="mb-1 text-center font-mono text-[7px] tracking-[0.25em] text-[#5DEBFF]">
                    {hud.bossName} // PHASE {hud.bossPhase}
                  </div>
                  <div className="h-1.5 overflow-hidden bg-white/10">
                    <div
                      className="h-full bg-[#8A5CFF] shadow-[0_0_14px_rgba(138,92,255,0.7)] transition-[width] duration-150"
                      style={{ width: `${hud.bossMaxHp > 0 ? clamp(hud.bossHp / hud.bossMaxHp, 0, 1) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Requiem readiness */}
              <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 text-center sm:bottom-20">
                <div
                  className={`font-mono text-[9px] tracking-[0.3em] ${hud.requiemReady ? 'text-[#5DEBFF]' : 'text-white/20'}`}
                  style={hud.requiemReady ? { textShadow: '0 0 12px rgba(93,235,255,0.7)' } : undefined}
                >
                  [R] REQUIEM {hud.requiemReady ? 'READY' : ''}
                </div>
                {hud.voidMeter >= hud.maxVoid && !hud.ascended && (
                  <div className="mt-1 font-mono text-[9px] tracking-[0.3em] text-white" style={{ textShadow: '0 0 12px rgba(255,255,255,0.8)' }}>
                    [F] ASCEND
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 sm:bottom-5 sm:gap-2">
                <ActionButton label="STRIKE" hint="SPACE" color={PALETTE.voidBlue} onClick={() => performStrike()} />
                <ActionButton label="DASH" hint="SHIFT" color={PALETTE.voidBlue} onClick={dash} disabled={hud.stamina < 22} />
                <ActionButton label="REQUIEM" hint="R" color={PALETTE.danger} onClick={performRequiem} disabled={!hud.requiemReady} />
              </div>

              {/* Controls hint */}
              <div className="pointer-events-none absolute bottom-4 left-4 hidden font-mono text-[7px] leading-relaxed tracking-[0.12em] text-white/25 sm:block">
                WASD / ARROWS — MOVE
                <br />
                SPACE / CLICK — STRIKE
                <br />
                SHIFT — DASH
                <br />
                R — REQUIEM (CUT)
                <br />
                F — ASCEND (VOID FULL)
              </div>

              {achievementToast && (
                <div className="pointer-events-none absolute right-4 top-20 border border-[#f5d76e]/30 bg-black/75 px-4 py-3 backdrop-blur-xl sm:right-6">
                  <div className="font-mono text-[7px] tracking-[0.25em] text-[#f5d76e]">ACHIEVEMENT UNLOCKED</div>
                  <div className="mt-1 font-mono text-[10px] text-white/80">{ACHIEVEMENT_DATA[achievementToast].name}</div>
                </div>
              )}

              {/* Touch controls */}
              <div className="absolute bottom-4 right-4 flex gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => performStrike()}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#5DEBFF]/50 bg-black/65 font-mono text-[8px] text-[#5DEBFF] backdrop-blur-md"
                >
                  CUT
                </button>
                <button
                  type="button"
                  onClick={dash}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#5DEBFF]/50 bg-black/65 font-mono text-[8px] text-[#5DEBFF] backdrop-blur-md"
                >
                  DASH
                </button>
                <button
                  type="button"
                  onClick={performRequiem}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#FF365C]/50 bg-black/65 font-mono text-[8px] text-[#FF365C] backdrop-blur-md"
                >
                  R
                </button>
              </div>
            </div>
          )}

          {screen === 'menu' && (
            <MenuScreen
              difficulty={difficulty}
              highScore={save?.highScore || 0}
              bestStyleRank={save?.bestStyleRank || 'D'}
              onDifficultyChange={setDifficulty}
              onStart={startGame}
              onSettings={() => setScreen('settings')}
              onStats={() => setScreen('stats')}
              onHowTo={() => setScreen('howto')}
            />
          )}

          {screen === 'upgrade' && <UpgradeScreen choices={upgradeChoices} onChoose={applyUpgrade} />}

          {screen === 'pause' && (
            <OverlayScreen eyebrow="VOID SYNC PAUSED" title="PAUSED">
              <div className="flex flex-wrap justify-center gap-2">
                <GameButton onClick={resumeGame}>RESUME</GameButton>
                <GameButton secondary onClick={() => setScreen('settings')}>
                  SETTINGS
                </GameButton>
                <GameButton secondary onClick={() => setScreen('howto')}>
                  HOW TO PLAY
                </GameButton>
              </div>
            </OverlayScreen>
          )}

          {screen === 'results' && (
            <ResultsScreen
              hud={hud}
              stateSnapshot={stateRef.current}
              highScore={save?.highScore || 0}
              onRetry={restartGame}
              onMenu={() => setScreen('menu')}
              onStats={() => setScreen('stats')}
            />
          )}

          {screen === 'settings' && (
            <SettingsScreen
              sound={soundEnabled}
              screenShake={screenShakeEnabled}
              particles={particlesEnabled}
              damageNumbers={damageNumbersEnabled}
              reducedMotion={reducedMotion}
              onToggle={toggleSetting}
              onBack={() => setScreen(stateRef.current.running ? 'pause' : 'menu')}
            />
          )}

          {screen === 'stats' && <StatsScreen save={save} onBack={() => setScreen('menu')} />}

          {screen === 'howto' && <HowToScreen onBack={() => setScreen(stateRef.current.running ? 'pause' : 'menu')} />}
        </main>

        {/* Footer */}
        <footer className="flex min-h-10 items-center justify-between border-t border-white/10 bg-black/70 px-3 py-2 font-mono text-[7px] tracking-[0.15em] text-white/20 sm:px-5">
          <span>VOID//REQUIEM // LOCAL INSTANCE</span>
          <span className="hidden sm:block">NO NETWORK // NO BACKEND // PROCEDURAL</span>
          <button type="button" onClick={() => toggleSetting('sound')} className="text-white/25 transition hover:text-white/60">
            SFX: {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ------------------------------- Subcomponents ------------------------------- */

function TopMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="font-mono text-[6px] tracking-[0.2em] text-white/20">{label}</div>
      <div className="mt-0.5 font-mono text-[10px] text-white/60">{value}</div>
    </div>
  );
}

function HudBar({ label, value, ratio, color }: { label: string; value: string; ratio: number; color: string }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between font-mono text-[7px] tracking-[0.16em]">
        <span className="text-white/35">{label}</span>
        <span className="text-white/50">{value}</span>
      </div>
      <div className="h-1 overflow-hidden bg-white/10">
        <div
          className="h-full transition-[width] duration-150"
          style={{ width: `${clamp(ratio, 0, 1) * 100}%`, backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
        />
      </div>
    </div>
  );
}

function ActionButton({
  label,
  hint,
  color,
  onClick,
  disabled,
}: {
  label: string;
  hint: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hidden flex-col items-center justify-center border px-3 py-2 font-mono text-[8px] tracking-[0.14em] transition md:flex ${
        disabled ? 'cursor-not-allowed border-white/10 bg-black/40 text-white/20' : 'border-white/20 bg-black/60 text-white/70 hover:border-white/40'
      }`}
      style={!disabled ? { borderColor: `${color}55` } : undefined}
      disabled={disabled}
    >
      <span>{label}</span>
      <span className="mt-0.5 text-[6px] text-white/30">{hint}</span>
    </button>
  );
}

function GameButton({ children, onClick, secondary = false }: { children: React.ReactNode; onClick: () => void; secondary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-5 py-3 font-mono text-[8px] tracking-[0.2em] transition ${
        secondary
          ? 'border-white/10 bg-white/[0.02] text-white/40 hover:border-white/25 hover:text-white/70'
          : 'border-[#5DEBFF]/60 bg-[#5DEBFF]/10 text-[#5DEBFF] hover:bg-[#5DEBFF]/20'
      }`}
    >
      {children}
    </button>
  );
}

function OverlayScreen({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[500px] items-center justify-center bg-[#060609] p-6">
      <div className="w-full max-w-3xl text-center">
        <div className="font-mono text-[8px] tracking-[0.4em] text-[#5DEBFF]">{eyebrow}</div>
        <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function MenuScreen({
  difficulty,
  highScore,
  bestStyleRank,
  onDifficultyChange,
  onStart,
  onSettings,
  onStats,
  onHowTo,
}: {
  difficulty: Difficulty;
  highScore: number;
  bestStyleRank: string;
  onDifficultyChange: (value: Difficulty) => void;
  onStart: () => void;
  onSettings: () => void;
  onStats: () => void;
  onHowTo: () => void;
}) {
  return (
    <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden bg-[#060609] p-5 sm:p-10">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5DEBFF]/10" />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="font-mono text-[8px] tracking-[0.4em] text-[#5DEBFF]">VOID SYNCHRONIZATION // SOUL SIGNATURE DETECTED</div>

        <h1 className="mt-3 font-display text-5xl tracking-tight text-white sm:text-7xl">
          VOID<span className="text-[#5DEBFF]">//</span>REQUIEM
        </h1>

        <p className="mt-4 max-w-xl font-mono text-[10px] leading-relaxed tracking-[0.08em] text-white/35">
          You don&apos;t block fate — you cut it. Kairo the Voidbound answers every incoming strike with Kurohane, and
          every perfectly timed cut carves deeper into the Void.
        </p>

        <div className="mt-8">
          <div className="mb-2 font-mono text-[7px] tracking-[0.25em] text-white/25">HUNT PROTOCOL</div>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(DIFFICULTIES) as Difficulty[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onDifficultyChange(item)}
                className={`border p-3 text-left transition ${
                  difficulty === item ? 'border-[#5DEBFF]/60 bg-[#5DEBFF]/10' : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                }`}
              >
                <div className={`font-mono text-[8px] ${difficulty === item ? 'text-[#5DEBFF]' : 'text-white/50'}`}>
                  {DIFFICULTIES[item].name}
                </div>
                <div className="mt-1 font-mono text-[7px] text-white/25">{DIFFICULTIES[item].description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <GameButton onClick={onStart}>ENTER THE VOID</GameButton>
          <GameButton secondary onClick={onHowTo}>
            HOW TO PLAY
          </GameButton>
          <GameButton secondary onClick={onStats}>
            VOID ARCHIVE
          </GameButton>
          <GameButton secondary onClick={onSettings}>
            SETTINGS
          </GameButton>
        </div>

        <div className="mt-7 flex flex-wrap gap-6 font-mono text-[7px] tracking-[0.16em] text-white/20">
          <span>PERSONAL RECORD {String(highScore).padStart(6, '0')}</span>
          <span>BEST STYLE {bestStyleRank}</span>
          <span>LOCAL INSTANCE</span>
        </div>
      </div>
    </div>
  );
}

function UpgradeScreen({ choices, onChoose }: { choices: UpgradeId[]; onChoose: (id: UpgradeId) => void }) {
  return (
    <OverlayScreen eyebrow="VOID ARCHIVE UNLOCKED" title="CHOOSE ONE">
      <p className="mx-auto max-w-md font-mono text-[9px] leading-relaxed text-white/35">
        The Void offers a fragment of power. Select one permanent enhancement for the rest of this run.
      </p>

      <div className="mt-7 grid gap-2 md:grid-cols-3">
        {choices.map((id) => {
          const upgrade = UPGRADE_DATA[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChoose(id)}
              className="group border border-white/10 bg-white/[0.02] p-5 text-left transition hover:border-[#5DEBFF]/50 hover:bg-[#5DEBFF]/5"
            >
              <div className="font-mono text-xl text-[#5DEBFF] transition group-hover:scale-110">{upgrade.icon}</div>
              <div className="mt-4 font-mono text-[9px] tracking-[0.15em] text-white/70">{upgrade.name}</div>
              <div className="mt-2 font-mono text-[8px] leading-relaxed text-white/30">{upgrade.description}</div>
              <div className="mt-5 font-mono text-[7px] tracking-[0.2em] text-[#5DEBFF]/60">SELECT →</div>
            </button>
          );
        })}
      </div>
    </OverlayScreen>
  );
}

function ResultsScreen({
  hud,
  stateSnapshot,
  highScore,
  onRetry,
  onMenu,
  onStats,
}: {
  hud: HudState;
  stateSnapshot: GameState;
  highScore: number;
  onRetry: () => void;
  onMenu: () => void;
  onStats: () => void;
}) {
  const isRecord = hud.score >= highScore && hud.score > 0;
  const accuracy =
    stateSnapshot.requiemsTotal > 0 ? Math.round((stateSnapshot.perfectRequiems / stateSnapshot.requiemsTotal) * 100) : 0;

  return (
    <OverlayScreen eyebrow={hud.victory ? 'FATE, CUT' : 'HUNTER SIGNAL LOST'} title={hud.victory ? 'RUN COMPLETE' : 'FALLEN'}>
      <div className="mx-auto mb-4 font-display text-6xl text-white">{hud.styleRank}</div>

      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
        <ResultMetric label="SCORE" value={String(hud.score).padStart(6, '0')} />
        <ResultMetric label="MAX COMBO" value={`x${hud.maxCombo}`} />
        <ResultMetric label="PERFECT CUTS" value={String(stateSnapshot.perfectRequiems)} />
        <ResultMetric label="REQUIEM ACC." value={`${accuracy}%`} />
        <ResultMetric label="VOID CUTS" value={String(stateSnapshot.voidCuts)} />
        <ResultMetric label="ENCOUNTERS" value={String(hud.encounter - 1)} />
        <ResultMetric label="SHARDS" value={String(hud.shards)} />
        <ResultMetric label="DMG TAKEN" value={String(Math.round(stateSnapshot.damageTaken))} />
      </div>

      {isRecord && <div className="mt-5 font-mono text-[8px] tracking-[0.3em] text-[#f5d76e]">NEW HUNTER RECORD</div>}

      <div className="mt-3 font-mono text-[9px] tracking-[0.2em] text-white/30">&quot;THE VOID REMEMBERS.&quot;</div>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <GameButton onClick={onRetry}>RUN AGAIN</GameButton>
        <GameButton secondary onClick={onStats}>
          VOID ARCHIVE
        </GameButton>
        <GameButton secondary onClick={onMenu}>
          MENU
        </GameButton>
      </div>
    </OverlayScreen>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] px-3 py-4">
      <div className="font-mono text-[6px] tracking-[0.2em] text-white/20">{label}</div>
      <div className="mt-1 font-mono text-sm text-white/65">{value}</div>
    </div>
  );
}

function SettingsScreen({
  sound,
  screenShake,
  particles,
  damageNumbers,
  reducedMotion,
  onToggle,
  onBack,
}: {
  sound: boolean;
  screenShake: boolean;
  particles: boolean;
  damageNumbers: boolean;
  reducedMotion: boolean;
  onToggle: (setting: 'sound' | 'screenShake' | 'particles' | 'damageNumbers' | 'reducedMotion') => void;
  onBack: () => void;
}) {
  const settings = [
    { id: 'sound' as const, label: 'SFX', value: sound },
    { id: 'screenShake' as const, label: 'SCREEN SHAKE', value: screenShake },
    { id: 'particles' as const, label: 'PARTICLES', value: particles },
    { id: 'damageNumbers' as const, label: 'DAMAGE NUMBERS', value: damageNumbers },
    { id: 'reducedMotion' as const, label: 'REDUCED MOTION', value: reducedMotion },
  ];

  return (
    <OverlayScreen eyebrow="SYSTEM CONFIGURATION" title="SETTINGS">
      <div className="mx-auto max-w-md space-y-2 text-left">
        {settings.map((setting) => (
          <button
            key={setting.id}
            type="button"
            onClick={() => onToggle(setting.id)}
            className="flex w-full items-center justify-between border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-[8px] tracking-[0.15em] transition hover:border-white/25"
          >
            <span className="text-white/45">{setting.label}</span>
            <span className={setting.value ? 'text-[#5DEBFF]' : 'text-white/20'}>{setting.value ? 'ON' : 'OFF'}</span>
          </button>
        ))}
      </div>
      <div className="mt-6">
        <GameButton secondary onClick={onBack}>
          BACK
        </GameButton>
      </div>
    </OverlayScreen>
  );
}

function StatsScreen({ save, onBack }: { save: PersistentSave | null; onBack: () => void }) {
  const data = save || loadSave();

  const stats: [string, string][] = [
    ['HIGH SCORE', String(data.highScore).padStart(6, '0')],
    ['BEST COMBO', `x${data.bestCombo}`],
    ['BEST STYLE', data.bestStyleRank],
    ['TOTAL KILLS', String(data.totalKills).padStart(4, '0')],
    ['TOTAL RUNS', String(data.totalRuns).padStart(3, '0')],
    ['BOSSES CUT', String(data.bossesDefeated).padStart(2, '0')],
    ['PERFECT CUTS', String(data.totalPerfectRequiems).padStart(4, '0')],
    ['TITLES EARNED', String(data.titles.length)],
  ];

  return (
    <OverlayScreen eyebrow="VOID ARCHIVE" title="RECORDS">
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="border border-white/10 bg-white/[0.02] p-4 text-left">
            <div className="font-mono text-[6px] tracking-[0.2em] text-white/20">{label}</div>
            <div className="mt-2 font-mono text-sm text-white/65">{value}</div>
          </div>
        ))}
      </div>

      {data.titles.length > 0 && (
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="mb-2 text-left font-mono text-[7px] tracking-[0.25em] text-white/25">EARNED TITLES</div>
          <div className="flex flex-wrap gap-2">
            {data.titles.map((title) => (
              <span key={title} className="border border-[#5DEBFF]/30 bg-[#5DEBFF]/5 px-3 py-1.5 font-mono text-[8px] tracking-[0.15em] text-[#5DEBFF]">
                「{title}」
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <GameButton secondary onClick={onBack}>
          BACK
        </GameButton>
      </div>
    </OverlayScreen>
  );
}

function HowToScreen({ onBack }: { onBack: () => void }) {
  const controls: [string, string][] = [
    ['WASD / ARROWS', 'MOVE'],
    ['SPACE / CLICK', 'STRIKE'],
    ['SHIFT', 'DASH'],
    ['R', 'REQUIEM — CUT AN INCOMING ATTACK'],
    ['F', 'VOID ASCENSION (WHEN METER IS FULL)'],
    ['ESC', 'PAUSE'],
  ];

  return (
    <OverlayScreen eyebrow="FIELD MANUAL" title="HOW TO PLAY">
      <div className="mx-auto grid max-w-lg grid-cols-1 gap-1.5">
        {controls.map(([key, action]) => (
          <div key={key} className="flex items-center justify-between border border-white/10 bg-white/[0.02] px-4 py-3">
            <span className="font-mono text-[8px] tracking-[0.15em] text-[#5DEBFF]">{key}</span>
            <span className="text-right font-mono text-[8px] tracking-[0.15em] text-white/35">{action}</span>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-lg font-mono text-[8px] leading-relaxed text-white/25">
        Enemies flash a red ring before they strike — that&apos;s your Requiem window. Press R while it&apos;s closing to
        cut the attack out of reality: tight timing is a Perfect Requiem, worth huge Void and Style. Oracle-type
        enemies fire projectiles that can always be cut. Fill the Void meter to unlock Ascension. Survive seven
        encounters, then face The First Death.
      </p>

      <div className="mt-6">
        <GameButton secondary onClick={onBack}>
          BACK
        </GameButton>
      </div>
    </OverlayScreen>
  );
}