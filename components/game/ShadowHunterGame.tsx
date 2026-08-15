'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Difficulty =
  | 'initiate'
  | 'hunter'
  | 'nightmare';

type WeaponId =
  | 'moonblade'
  | 'voidfang'
  | 'nightreign';

type EnemyType =
  | 'wraith'
  | 'stalker'
  | 'reaper'
  | 'shade'
  | 'phantom';

type Screen =
  | 'menu'
  | 'game'
  | 'pause'
  | 'upgrade'
  | 'results'
  | 'settings'
  | 'stats'
  | 'howto';

type AbilityId =
  | 'nova'
  | 'step'
  | 'fracture';

type UpgradeId =
  | 'damage'
  | 'vitality'
  | 'stamina'
  | 'speed'
  | 'crit'
  | 'dash'
  | 'energy'
  | 'xp'
  | 'shards'
  | 'attackSpeed';

type AchievementId =
  | 'first_blood'
  | 'night_walker'
  | 'void_breaker'
  | 'combo_hunter'
  | 'shadow_collector'
  | 'untouchable'
  | 'nightmare'
  | 'executioner';

type Weapon = {
  id: WeaponId;
  name: string;
  subtitle: string;
  damage: number;
  attackSpeed: number;
  range: number;
  critChance: number;
  color: string;
  description: string;
};

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
  attackCooldown: number;
  attackTimer: number;
  hitFlash: number;
  elite: boolean;
  modifier?: 'berserk' | 'swift' | 'armored' | 'vampiric';
  angle: number;
  state: 'chase' | 'attack' | 'recover' | 'retreat';
  teleportTimer: number;
  shootTimer: number;
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
  color: string;
  enemy: boolean;
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

type Pickup = {
  id: number;
  x: number;
  y: number;
  type: 'health' | 'energy' | 'shard' | 'core';
  life: number;
  pulse: number;
};

type Boss = {
  active: boolean;
  name: string;
  x: number;
  y: number;
  radius: number;
  hp: number;
  maxHp: number;
  phase: 1 | 2;
  attackTimer: number;
  summonTimer: number;
  collapseTimer: number;
  hitFlash: number;
};

type GameState = {
  playerX: number;
  playerY: number;
  playerRadius: number;

  hp: number;
  maxHp: number;

  stamina: number;
  maxStamina: number;

  energy: number;
  maxEnergy: number;

  xp: number;
  xpToNext: number;
  level: number;

  score: number;
  shards: number;

  combo: number;
  maxCombo: number;
  comboTimer: number;

  wave: number;
  enemiesKilled: number;

  totalDamageDealt: number;
  totalDamageTaken: number;

  elapsed: number;

  attackTimer: number;
  attackProgress: number;
  attackAngle: number;

  dashTimer: number;
  invulnerableTimer: number;

  abilityCooldowns: Record<
    AbilityId,
    number
  >;

  spawnTimer: number;
  spawnInterval: number;

  hitStop: number;
  screenShake: number;

  enemies: Enemy[];
  projectiles: Projectile[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  pickups: Pickup[];

  boss: Boss;

  nextEnemyId: number;
  nextProjectileId: number;
  nextPickupId: number;

  running: boolean;
  gameOver: boolean;

  upgradeChoices: UpgradeId[];

  temporaryDamageBoost: number;
  temporarySpeedBoost: number;
  temporaryBoostTimer: number;
};

type PersistentSave = {
  version: number;
  highScore: number;
  bestWave: number;
  bestCombo: number;
  totalKills: number;
  totalRuns: number;
  bossesDefeated: number;
  totalTime: number;
  achievements: AchievementId[];
  unlockedWeapons: WeaponId[];
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
  energy: number;
  maxEnergy: number;
  xp: number;
  xpToNext: number;
  level: number;
  score: number;
  shards: number;
  combo: number;
  maxCombo: number;
  wave: number;
  kills: number;
  enemies: number;
  bossHp: number;
  bossMaxHp: number;
  bossName: string;
  bossPhase: number;
  gameOver: boolean;
};

const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = 560;

const STORAGE_KEY =
  'shadow-hunter-save';

const WEAPONS: Weapon[] = [
  {
    id: 'moonblade',
    name: 'MOONBLADE',
    subtitle: 'BALANCED HUNTER ARMAMENT',
    damage: 28,
    attackSpeed: 0.28,
    range: 92,
    critChance: 0.12,
    color: '#e4623f',
    description:
      'Balanced attack speed, reach and critical potential.',
  },
  {
    id: 'voidfang',
    name: 'VOIDFANG',
    subtitle: 'ASSASSIN-CLASS RELIC',
    damage: 20,
    attackSpeed: 0.17,
    range: 110,
    critChance: 0.22,
    color: '#9b74ff',
    description:
      'Rapid strikes with increased reach and critical chance.',
  },
  {
    id: 'nightreign',
    name: 'NIGHTREIGN',
    subtitle: 'HEAVY SHADOW CLEAVER',
    damage: 44,
    attackSpeed: 0.42,
    range: 84,
    critChance: 0.08,
    color: '#5fc6e8',
    description:
      'Slow, devastating attacks capable of breaking heavy targets.',
  },
];

const DIFFICULTIES: Record<
  Difficulty,
  {
    name: string;
    description: string;
    enemyMultiplier: number;
    damageMultiplier: number;
    scoreMultiplier: number;
  }
> = {
  initiate: {
    name: 'INITIATE',
    description:
      'Controlled first contact.',
    enemyMultiplier: 0.78,
    damageMultiplier: 0.72,
    scoreMultiplier: 0.8,
  },
  hunter: {
    name: 'HUNTER',
    description:
      'The intended combat experience.',
    enemyMultiplier: 1,
    damageMultiplier: 1,
    scoreMultiplier: 1,
  },
  nightmare: {
    name: 'NIGHTMARE',
    description:
      'Aggressive shadows. Maximum reward.',
    enemyMultiplier: 1.35,
    damageMultiplier: 1.28,
    scoreMultiplier: 1.6,
  },
};

const UPGRADE_DATA: Record<
  UpgradeId,
  {
    name: string;
    description: string;
    icon: string;
  }
> = {
  damage: {
    name: 'SHADOW EDGE',
    description:
      '+15% attack damage.',
    icon: '◆',
  },
  vitality: {
    name: 'BLOOD RESERVE',
    description:
      '+18 maximum HP and restore it.',
    icon: '◇',
  },
  stamina: {
    name: 'HUNTER LUNGS',
    description:
      '+20 maximum stamina.',
    icon: '△',
  },
  speed: {
    name: 'NIGHT STEP',
    description:
      '+10% movement speed.',
    icon: '↗',
  },
  crit: {
    name: 'VOID PRECISION',
    description:
      '+7% critical chance.',
    icon: '✦',
  },
  dash: {
    name: 'PHANTOM STEP',
    description:
      '-15% dash cooldown.',
    icon: '⇢',
  },
  energy: {
    name: 'ARCANE RESERVOIR',
    description:
      '+20 maximum energy.',
    icon: '◎',
  },
  xp: {
    name: 'SOUL MEMORY',
    description:
      '+15% experience gain.',
    icon: '◈',
  },
  shards: {
    name: 'SHADOW ECONOMY',
    description:
      '+20% shard rewards.',
    icon: '◇',
  },
  attackSpeed: {
    name: 'BLOOD TEMPO',
    description:
      '+10% attack speed.',
    icon: '»',
  },
};

const ACHIEVEMENT_DATA: Record<
  AchievementId,
  {
    name: string;
    description: string;
  }
> = {
  first_blood: {
    name: 'FIRST BLOOD',
    description:
      'Kill your first enemy.',
  },
  night_walker: {
    name: 'NIGHT WALKER',
    description:
      'Reach wave 3.',
  },
  void_breaker: {
    name: 'VOID BREAKER',
    description:
      'Defeat The Hollow.',
  },
  combo_hunter: {
    name: 'COMBO HUNTER',
    description:
      'Reach a x10 combo.',
  },
  shadow_collector: {
    name: 'SHADOW COLLECTOR',
    description:
      'Collect 50 shards.',
  },
  untouchable: {
    name: 'UNTOUCHABLE',
    description:
      'Survive 30 seconds without taking damage.',
  },
  nightmare: {
    name: 'NIGHTMARE',
    description:
      'Reach wave 5 on Nightmare.',
  },
  executioner: {
    name: 'EXECUTIONER',
    description:
      'Kill 100 enemies.',
  },
};

const ABILITY_DATA: Record<
  AbilityId,
  {
    name: string;
    key: string;
    cooldown: number;
    energy: number;
    description: string;
    color: string;
  }
> = {
  nova: {
    name: 'SHADOW NOVA',
    key: 'Q',
    cooldown: 12,
    energy: 35,
    description:
      'Destroy nearby shadows.',
    color: '#e4623f',
  },
  step: {
    name: 'VOID STEP',
    key: 'E',
    cooldown: 8,
    energy: 20,
    description:
      'A devastating phase dash.',
    color: '#5fc6e8',
  },
  fracture: {
    name: 'TIME FRACTURE',
    key: 'R',
    cooldown: 18,
    energy: 50,
    description:
      'Slow all enemies temporarily.',
    color: '#9b74ff',
  },
};

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

function angleDifference(
  a: number,
  b: number,
) {
  return Math.atan2(
    Math.sin(a - b),
    Math.cos(a - b),
  );
}

function createInitialState(): GameState {
  return {
    playerX:
      WORLD_WIDTH / 2,
    playerY:
      WORLD_HEIGHT / 2,

    playerRadius: 17,

    hp: 100,
    maxHp: 100,

    stamina: 100,
    maxStamina: 100,

    energy: 100,
    maxEnergy: 100,

    xp: 0,
    xpToNext: 100,
    level: 1,

    score: 0,
    shards: 0,

    combo: 0,
    maxCombo: 0,
    comboTimer: 0,

    wave: 1,
    enemiesKilled: 0,

    totalDamageDealt: 0,
    totalDamageTaken: 0,

    elapsed: 0,

    attackTimer: 0,
    attackProgress: 0,
    attackAngle: 0,

    dashTimer: 0,
    invulnerableTimer: 0,

    abilityCooldowns: {
      nova: 0,
      step: 0,
      fracture: 0,
    },

    spawnTimer: 0,
    spawnInterval: 1.45,

    hitStop: 0,
    screenShake: 0,

    enemies: [],
    projectiles: [],
    particles: [],
    floatingTexts: [],
    pickups: [],

    boss: {
      active: false,
      name: 'THE HOLLOW',
      x: WORLD_WIDTH / 2,
      y: -100,
      radius: 48,
      hp: 0,
      maxHp: 0,
      phase: 1,
      attackTimer: 2,
      summonTimer: 5,
      collapseTimer: 7,
      hitFlash: 0,
    },

    nextEnemyId: 1,
    nextProjectileId: 1,
    nextPickupId: 1,

    running: false,
    gameOver: false,

    upgradeChoices: [],

    temporaryDamageBoost: 1,
    temporarySpeedBoost: 1,
    temporaryBoostTimer: 0,
  };
}

function loadSave(): PersistentSave {
  const defaults: PersistentSave = {
    version: 1,
    highScore: 0,
    bestWave: 0,
    bestCombo: 0,
    totalKills: 0,
    totalRuns: 0,
    bossesDefeated: 0,
    totalTime: 0,
    achievements: [],
    unlockedWeapons: [
      'moonblade',
      'voidfang',
      'nightreign',
    ],
    settings: {
      sound: true,
      screenShake: true,
      particles: true,
      damageNumbers: true,
      reducedMotion: false,
    },
  };

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
      typeof parsed !== 'object'
    ) {
      return defaults;
    }

    return {
      ...defaults,
      ...parsed,
      settings: {
        ...defaults.settings,
        ...(parsed.settings || {}),
      },
      achievements:
        Array.isArray(
          parsed.achievements,
        )
          ? parsed.achievements
          : [],
      unlockedWeapons:
        Array.isArray(
          parsed.unlockedWeapons,
        )
          ? parsed.unlockedWeapons
          : defaults.unlockedWeapons,
    };
  } catch {
    return defaults;
  }
}

function saveGame(
  save: PersistentSave,
) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(save),
    );
  } catch {
    // Persistent storage is optional.
  }
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

  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = radius * 2;

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

function spawnParticles(
  state: GameState,
  x: number,
  y: number,
  color: string,
  amount: number,
  enabled: boolean,
) {
  if (!enabled) return;

  const maximum = 500;

  if (
    state.particles.length >=
    maximum
  ) {
    return;
  }

  const count = Math.min(
    amount,
    maximum -
      state.particles.length,
  );

  for (
    let i = 0;
    i < count;
    i += 1
  ) {
    const angle = random(
      0,
      Math.PI * 2,
    );

    const speed = random(
      40,
      180,
    );

    state.particles.push({
      x,
      y,
      vx:
        Math.cos(angle) *
        speed,
      vy:
        Math.sin(angle) *
        speed,
      life: random(
        0.25,
        0.75,
      ),
      maxLife: 0.75,
      size: random(1, 3.5),
      color,
      gravity: random(
        10,
        60,
      ),
      drag: 0.92,
    });
  }
}

function addText(
  state: GameState,
  x: number,
  y: number,
  text: string,
  color: string,
  scale = 1,
) {
  if (
    state.floatingTexts
      .length >= 80
  ) {
    return;
  }

  state.floatingTexts.push({
    x,
    y,
    text,
    color,
    life: 0.8,
    maxLife: 0.8,
    scale,
  });
}

function createEnemy(
  state: GameState,
  difficulty: Difficulty,
  wave: number,
  typeOverride?: EnemyType,
) {
  const side =
    Math.floor(
      Math.random() * 4,
    );

  let x = 0;
  let y = 0;

  if (side === 0) {
    x = random(30, WORLD_WIDTH - 30);
    y = -35;
  } else if (side === 1) {
    x = WORLD_WIDTH + 35;
    y = random(30, WORLD_HEIGHT - 30);
  } else if (side === 2) {
    x = random(30, WORLD_WIDTH - 30);
    y = WORLD_HEIGHT + 35;
  } else {
    x = -35;
    y = random(30, WORLD_HEIGHT - 30);
  }

  const roll =
    Math.random();

  let type: EnemyType;

  if (typeOverride) {
    type = typeOverride;
  } else if (
    wave >= 3 &&
    roll < 0.15
  ) {
    type = 'shade';
  } else if (
    wave >= 4 &&
    roll < 0.25
  ) {
    type = 'phantom';
  } else if (
    roll < 0.55
  ) {
    type = 'wraith';
  } else if (
    roll < 0.88
  ) {
    type = 'stalker';
  } else {
    type = 'reaper';
  }

  const definitions: Record<
    EnemyType,
    {
      hp: number;
      radius: number;
      speed: number;
      damage: number;
      cooldown: number;
    }
  > = {
    wraith: {
      hp: 42,
      radius: 13,
      speed: 58,
      damage: 8,
      cooldown: 1.25,
    },
    stalker: {
      hp: 72,
      radius: 17,
      speed: 41,
      damage: 12,
      cooldown: 1.05,
    },
    reaper: {
      hp: 145,
      radius: 24,
      speed: 27,
      damage: 20,
      cooldown: 1.5,
    },
    shade: {
      hp: 58,
      radius: 15,
      speed: 31,
      damage: 10,
      cooldown: 1.4,
    },
    phantom: {
      hp: 82,
      radius: 16,
      speed: 54,
      damage: 15,
      cooldown: 1.1,
    },
  };

  const definition =
    definitions[type];

  const difficultyData =
    DIFFICULTIES[
      difficulty
    ];

  const waveMultiplier =
    1 +
    Math.min(
      1.8,
      wave * 0.065,
    );

  const elite =
    Math.random() <
    Math.min(
      0.12,
      0.025 +
        wave * 0.006,
    );

  const modifierPool: Array<
    NonNullable<
      Enemy['modifier']
    >
  > = [
    'berserk',
    'swift',
    'armored',
    'vampiric',
  ];

  const modifier = elite
    ? modifierPool[
        Math.floor(
          Math.random() *
            modifierPool.length,
        )
      ]
    : undefined;

  let hp =
    definition.hp *
    waveMultiplier *
    difficultyData.enemyMultiplier;

  let speed =
    definition.speed;

  let damage =
    definition.damage *
    difficultyData.damageMultiplier;

  if (elite) {
    hp *= 1.65;

    if (modifier === 'berserk') {
      damage *= 1.25;
    }

    if (modifier === 'swift') {
      speed *= 1.35;
    }

    if (modifier === 'armored') {
      hp *= 1.35;
    }

    if (
      modifier === 'vampiric'
    ) {
      damage *= 1.08;
    }
  }

  state.enemies.push({
    id: state.nextEnemyId++,
    type,
    x,
    y,
    radius:
      definition.radius +
      (elite ? 2 : 0),
    hp,
    maxHp: hp,
    speed,
    damage,
    attackCooldown:
      definition.cooldown,
    attackTimer:
      random(
        0.2,
        definition.cooldown,
      ),
    hitFlash: 0,
    elite,
    modifier,
    angle: Math.atan2(
      state.playerY - y,
      state.playerX - x,
    ),
    state: 'chase',
    teleportTimer:
      random(2.5, 5),
    shootTimer:
      random(0.8, 1.8),
  });
}

function spawnBoss(
  state: GameState,
  difficulty: Difficulty,
) {
  const multiplier =
    DIFFICULTIES[
      difficulty
    ].enemyMultiplier;

  const hp =
    950 *
    (1 +
      state.wave * 0.08) *
    multiplier;

  state.boss = {
    active: true,
    name: 'THE HOLLOW',
    x: WORLD_WIDTH / 2,
    y: 90,
    radius: 48,
    hp,
    maxHp: hp,
    phase: 1,
    attackTimer: 2,
    summonTimer: 5,
    collapseTimer: 7,
    hitFlash: 0,
  };

  addText(
    state,
    WORLD_WIDTH / 2,
    80,
    'THE HOLLOW',
    '#e4623f',
    1.4,
  );

  spawnParticles(
    state,
    WORLD_WIDTH / 2,
    90,
    '#e4623f',
    40,
    true,
  );
}

export function ShadowHunterGame({
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

  const stateRef =
    useRef<GameState>(
      createInitialState(),
    );

  const saveRef =
    useRef<PersistentSave | null>(
      null,
    );

  const keysRef =
    useRef<Set<string>>(
      new Set(),
    );

  const animationRef =
    useRef<number | null>(
      null,
    );

  const lastFrameRef =
    useRef(0);

  const audioRef =
    useRef<AudioContext | null>(
      null,
    );

  /*
   * CC0 SFX sources:
   * - MoxieCat — 8-bit Platformer SFX
   * - FrogPog — Chiptune SFX Pack
   *
   * Audio files are played with HTMLAudioElement. This keeps the game
   * compatible with remote WAV assets without requiring AudioBuffer/CORS
   * decoding.
   */
  const sfxAudioRef = useRef<
    Record<string, HTMLAudioElement[]>
  >({});
  const sfxIndexRef = useRef<
    Record<string, number>
  >({});
  const sfxLastPlayedRef = useRef<
    Record<string, number>
  >({});

  const SFX_URLS: Record<string, string> = {
    ui:
      'https://opengameart.org/sites/default/files/button.wav',
    attack:
      'https://opengameart.org/sites/default/files/dashwoosh.wav',
    critical:
      'https://opengameart.org/sites/default/files/lightningstrike.wav',
    dash:
      'https://opengameart.org/sites/default/files/dashwoosh.wav',
    ability:
      'https://opengameart.org/sites/default/files/lightningstrike.wav',
    pickup:
      'https://opengameart.org/sites/default/files/pick_up.wav',
    hurt:
      'https://opengameart.org/sites/default/files/playerhurt.wav',
    level:
      'https://opengameart.org/sites/default/files/level_up.wav',
    victory:
      'https://opengameart.org/sites/default/files/level_passed.wav',
    defeat:
      'https://opengameart.org/sites/default/files/game_over.wav',
    fail:
      'https://opengameart.org/sites/default/files/fail.wav',
  };

  const hitStopRef =
    useRef(false);

  const [screen, setScreen] =
    useState<Screen>('menu');

  const [difficulty, setDifficulty] =
    useState<Difficulty>(
      'hunter',
    );

  const [weaponId, setWeaponId] =
    useState<WeaponId>(
      'moonblade',
    );

  const [hud, setHud] =
    useState<HudState>(() => {
      const state =
        createInitialState();

      return {
        hp: state.hp,
        maxHp: state.maxHp,
        stamina:
          state.stamina,
        maxStamina:
          state.maxStamina,
        energy:
          state.energy,
        maxEnergy:
          state.maxEnergy,
        xp: state.xp,
        xpToNext:
          state.xpToNext,
        level: state.level,
        score: state.score,
        shards: state.shards,
        combo: state.combo,
        maxCombo:
          state.maxCombo,
        wave: state.wave,
        kills:
          state.enemiesKilled,
        enemies: 0,
        bossHp: 0,
        bossMaxHp: 0,
        bossName:
          'THE HOLLOW',
        bossPhase: 1,
        gameOver: false,
      };
    });

  const [save, setSave] =
    useState<PersistentSave | null>(
      null,
    );

  const [upgradeChoices, setUpgradeChoices] =
    useState<UpgradeId[]>([]);

  const [achievementToast, setAchievementToast] =
    useState<AchievementId | null>(
      null,
    );

  const [soundEnabled, setSoundEnabled] =
    useState(true);

  const [screenShakeEnabled, setScreenShakeEnabled] =
    useState(true);

  const [particlesEnabled, setParticlesEnabled] =
    useState(true);

  const [damageNumbersEnabled, setDamageNumbersEnabled] =
    useState(true);

  const [reducedMotion, setReducedMotion] =
    useState(false);

  const selectedWeapon =
    useMemo(
      () =>
        WEAPONS.find(
          (item) =>
            item.id ===
            weaponId,
        ) ||
        WEAPONS[0],
      [weaponId],
    );

  const updateSave = useCallback(
    (
      updater: (
        current: PersistentSave,
      ) => PersistentSave,
    ) => {
      const current =
        saveRef.current ||
        loadSave();

      const next =
        updater(current);

      saveRef.current = next;

      setSave(next);

      saveGame(next);
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

    setScreenShakeEnabled(
      loaded.settings.screenShake,
    );

    setParticlesEnabled(
      loaded.settings.particles,
    );

    setDamageNumbersEnabled(
      loaded.settings.damageNumbers,
    );

    setReducedMotion(
      loaded.settings.reducedMotion,
    );
  }, [open]);

  useEffect(() => {
    if (!open || !soundEnabled) {
      return;
    }

    Object.entries(SFX_URLS).forEach(
      ([name, url]) => {
        if (sfxAudioRef.current[name]) {
          return;
        }

        sfxAudioRef.current[name] =
          Array.from(
            { length: 3 },
            () => {
              const audio = new Audio(url);
              audio.preload = 'auto';
              audio.volume = 0.72;
              audio.setAttribute(
                'playsinline',
                'true',
              );
              return audio;
            },
          );

        sfxIndexRef.current[name] = 0;
      },
    );
  }, [open, soundEnabled]);

  const playSfx = useCallback(
    (
      name: string,
      volume = 0.72,
      cooldown = 0.045,
    ) => {
      if (!soundEnabled) {
        return;
      }

      const url = SFX_URLS[name];

      if (!url) {
        return;
      }

      try {
        const now = performance.now();
        const last =
          sfxLastPlayedRef.current[name] || 0;

        if (
          now - last <
          cooldown * 1000
        ) {
          return;
        }

        sfxLastPlayedRef.current[name] =
          now;

        let pool =
          sfxAudioRef.current[name];

        if (!pool) {
          pool = Array.from(
            { length: 3 },
            () => {
              const audio = new Audio(url);
              audio.preload = 'auto';
              audio.volume = volume;
              audio.setAttribute(
                'playsinline',
                'true',
              );
              return audio;
            },
          );

          sfxAudioRef.current[name] = pool;
          sfxIndexRef.current[name] = 0;
        }

        const index =
          sfxIndexRef.current[name] %
          pool.length;

        const audio = pool[index];

        sfxIndexRef.current[name] =
          index + 1;

        audio.pause();
        audio.currentTime = 0;
        audio.volume = clamp(volume, 0, 1);

        void audio.play().catch(
          () => {
            // Browser autoplay/network failures are non-fatal.
          },
        );
      } catch {
        // SFX are optional and must never interrupt gameplay.
      }
    },
    [soundEnabled],
  );

  const playSound = useCallback(
    (
      frequency: number,
      duration: number,
      type: OscillatorType = 'sine',
      volume = 0.025,
    ) => {
      if (!soundEnabled) {
        return;
      }

      /*
       * Keep the original synthesized tone as a fallback, so the game
       * remains audible even if an external CC0 WAV is unavailable.
       */
      try {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          )
            .webkitAudioContext;

        if (AudioContextClass) {
        if (!audioRef.current) {
          audioRef.current =
            new AudioContextClass();
        }

        const audio = audioRef.current;

        if (audio.state === 'suspended') {
          void audio.resume();
        }

        const oscillator =
          audio.createOscillator();

        const gain =
          audio.createGain();

        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
          frequency,
          audio.currentTime,
        );

        gain.gain.setValueAtTime(
          volume,
          audio.currentTime,
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          audio.currentTime + duration,
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start();

        oscillator.stop(
          audio.currentTime + duration,
        );
        }
      } catch {
        // Synth fallback is optional.
      }

      /*
       * Existing playSound calls are intentionally preserved. Their
       * frequency signatures select an appropriate CC0 SFX automatically.
       */
      if (frequency >= 940) {
        playSfx('level', 0.55, 0.08);
      } else if (frequency >= 850) {
        playSfx('victory', 0.58, 0.12);
      } else if (frequency >= 700) {
        playSfx('critical', 0.34, 0.045);
      } else if (frequency >= 580) {
        playSfx('pickup', 0.48, 0.055);
      } else if (frequency >= 500) {
        playSfx('ui', 0.38, 0.05);
      } else if (frequency >= 400) {
        playSfx('attack', 0.24, 0.035);
      } else if (frequency >= 250) {
        playSfx('ability', 0.32, 0.08);
      } else if (frequency >= 150) {
        playSfx('dash', 0.38, 0.08);
      } else if (frequency <= 95) {
        playSfx('defeat', 0.48, 0.18);
      } else {
        playSfx('hurt', 0.32, 0.06);
      }
    },
    [playSfx, soundEnabled],
  );

  const syncHud =
    useCallback(() => {
      const state =
        stateRef.current;

      setHud({
        hp: state.hp,
        maxHp: state.maxHp,
        stamina:
          state.stamina,
        maxStamina:
          state.maxStamina,
        energy:
          state.energy,
        maxEnergy:
          state.maxEnergy,
        xp: state.xp,
        xpToNext:
          state.xpToNext,
        level: state.level,
        score: state.score,
        shards: state.shards,
        combo: state.combo,
        maxCombo:
          state.maxCombo,
        wave: state.wave,
        kills:
          state.enemiesKilled,
        enemies:
          state.enemies.length,
        bossHp:
          state.boss.active
            ? state.boss.hp
            : 0,
        bossMaxHp:
          state.boss.active
            ? state.boss.maxHp
            : 0,
        bossName:
          state.boss.name,
        bossPhase:
          state.boss.phase,
        gameOver:
          state.gameOver,
      });
    }, []);

  const unlockAchievement =
    useCallback(
      (
        id: AchievementId,
      ) => {
        const current =
          saveRef.current ||
          loadSave();

        if (
          current.achievements.includes(
            id,
          )
        ) {
          return;
        }

        updateSave(
          (existing) => ({
            ...existing,
            achievements: [
              ...existing.achievements,
              id,
            ],
          }),
        );

        setAchievementToast(id);

        window.setTimeout(
          () =>
            setAchievementToast(
              null,
            ),
          2600,
        );

        playSound(
          720,
          0.1,
          'triangle',
          0.02,
        );

        playSound(
          960,
          0.16,
          'triangle',
          0.018,
        );
      },
      [
        playSound,
        updateSave,
      ],
    );

  const awardXp =
    useCallback(
      (amount: number) => {
        const state =
          stateRef.current;

        const xpMultiplier =
          1 +
          (state as GameState & {
            xpMultiplier?: number;
          }).xpMultiplier! ||
          1;

        state.xp +=
          amount *
          xpMultiplier;

        if (
          state.xp >=
          state.xpToNext
        ) {
          state.xp -=
            state.xpToNext;

          state.level += 1;

          state.xpToNext =
            Math.round(
              state.xpToNext *
                1.34,
            );

          state.maxHp += 8;

          state.hp =
            state.maxHp;

          state.maxStamina +=
            5;

          state.stamina =
            state.maxStamina;

          state.maxEnergy +=
            5;

          state.energy =
            state.maxEnergy;

          const pool =
            Object.keys(
              UPGRADE_DATA,
            ) as UpgradeId[];

          const shuffled =
            [...pool].sort(
              () =>
                Math.random() -
                0.5,
            );

          const choices =
            shuffled.slice(
              0,
              3,
            );

          state.upgradeChoices =
            choices;

          setUpgradeChoices(
            choices,
          );

          state.running =
            false;

          setScreen(
            'upgrade',
          );

          spawnParticles(
            state,
            state.playerX,
            state.playerY,
            '#5fc6e8',
            35,
            particlesEnabled,
          );

          addText(
            state,
            state.playerX,
            state.playerY - 55,
            `LEVEL ${state.level}`,
            '#5fc6e8',
            1.25,
          );

          playSound(
            680,
            0.1,
            'triangle',
            0.025,
          );

          playSound(
            900,
            0.18,
            'triangle',
            0.02,
          );
        }
      },
      [particlesEnabled, playSound],
    );

  const applyUpgrade =
    useCallback(
      (id: UpgradeId) => {
        const state =
          stateRef.current;

        const current =
          state as GameState & {
            damageMultiplier?: number;
            movementMultiplier?: number;
            critChance?: number;
            dashMultiplier?: number;
            xpMultiplier?: number;
            shardMultiplier?: number;
            attackSpeedMultiplier?: number;
          };

        switch (id) {
          case 'damage':
            current.damageMultiplier =
              (current.damageMultiplier ||
                1) * 1.15;
            break;

          case 'vitality':
            state.maxHp += 18;
            state.hp =
              state.maxHp;
            break;

          case 'stamina':
            state.maxStamina += 20;
            state.stamina =
              state.maxStamina;
            break;

          case 'speed':
            current.movementMultiplier =
              (current.movementMultiplier ||
                1) * 1.1;
            break;

          case 'crit':
            current.critChance =
              (current.critChance ||
                0) + 0.07;
            break;

          case 'dash':
            current.dashMultiplier =
              (current.dashMultiplier ||
                1) * 0.85;
            break;

          case 'energy':
            state.maxEnergy += 20;
            state.energy =
              state.maxEnergy;
            break;

          case 'xp':
            current.xpMultiplier =
              (current.xpMultiplier ||
                1) * 1.15;
            break;

          case 'shards':
            current.shardMultiplier =
              (current.shardMultiplier ||
                1) * 1.2;
            break;

          case 'attackSpeed':
            current.attackSpeedMultiplier =
              (current.attackSpeedMultiplier ||
                1) * 0.9;
            break;
        }

        state.upgradeChoices =
          [];

        setUpgradeChoices(
          [],
        );

        state.running =
          true;

        setScreen('game');

        syncHud();

        playSound(
          520,
          0.08,
          'triangle',
          0.018,
        );
      },
      [playSound, syncHud],
    );

  const damageEnemy =
    useCallback(
      (
        enemy: Enemy,
        damage: number,
        critical: boolean,
      ) => {
        const state =
          stateRef.current;

        enemy.hp -= damage;

        enemy.hitFlash =
          0.14;

        state.totalDamageDealt +=
          damage;

        if (
          state.hitStop <= 0
        ) {
          state.hitStop =
            critical
              ? 0.035
              : 0.018;

          hitStopRef.current =
            true;
        }

        spawnParticles(
          state,
          enemy.x,
          enemy.y,
          critical
            ? '#f5d76e'
            : selectedWeapon.color,
          critical ? 16 : 8,
          particlesEnabled,
        );

        if (
          damageNumbersEnabled
        ) {
          addText(
            state,
            enemy.x,
            enemy.y -
              enemy.radius -
              10,
            critical
              ? `CRIT ${Math.round(
                  damage,
                )}`
              : String(
                  Math.round(
                    damage,
                  ),
                ),
            critical
              ? '#f5d76e'
              : '#f3eee6',
            critical ? 1.2 : 1,
          );
        }

        if (critical) {
          playSound(
            760,
            0.065,
            'sawtooth',
            0.02,
          );
        } else {
          playSound(
            450,
            0.045,
            'square',
            0.012,
          );
        }
      },
      [
        damageNumbersEnabled,
        particlesEnabled,
        playSound,
        selectedWeapon,
      ],
    );

  const performAttack =
    useCallback(
      (targetAngle?: number) => {
        const state =
          stateRef.current;

        if (
          !state.running ||
          state.gameOver ||
          state.attackTimer > 0 ||
          screen !== 'game'
        ) {
          return;
        }

        const data =
          state as GameState & {
            damageMultiplier?: number;
            critChance?: number;
            attackSpeedMultiplier?: number;
          };

        const angle =
          typeof targetAngle ===
          'number'
            ? targetAngle
            : state.attackAngle;

        state.attackAngle =
          angle;

        const speedMultiplier =
          data.attackSpeedMultiplier ||
          1;

        state.attackTimer =
          selectedWeapon.attackSpeed *
          speedMultiplier;

        state.attackProgress =
          1;

        let hits = 0;

        const damageMultiplier =
          data.damageMultiplier ||
          1;

        const critChance =
          clamp(
            selectedWeapon.critChance +
              (data.critChance ||
                0),
            0,
            0.75,
          );

        for (
          const enemy of state.enemies
        ) {
          const d =
            distance(
              state.playerX,
              state.playerY,
              enemy.x,
              enemy.y,
            );

          if (
            d >
            selectedWeapon.range +
              enemy.radius
          ) {
            continue;
          }

          const enemyAngle =
            Math.atan2(
              enemy.y -
                state.playerY,
              enemy.x -
                state.playerX,
            );

          const difference =
            angleDifference(
              enemyAngle,
              angle,
            );

          if (
            Math.abs(
              difference,
            ) > 0.82
          ) {
            continue;
          }

          const critical =
            Math.random() <
            critChance;

          let damage =
            selectedWeapon.damage *
            damageMultiplier *
            (critical ? 2 : 1);

          if (
            selectedWeapon.id ===
            'nightreign' &&
            enemy.type ===
              'reaper'
          ) {
            damage *= 1.2;
          }

          if (
            selectedWeapon.id ===
              'nightreign' &&
            state.level >= 3
          ) {
            damage *= 1.05;
          }

          if (
            enemy.modifier ===
            'armored'
          ) {
            damage *= 0.72;
          }

          damageEnemy(
            enemy,
            damage,
            critical,
          );

          hits += 1;

          const knockback =
            selectedWeapon.id ===
            'nightreign'
              ? 30
              : 12;

          const knockDistance =
            Math.max(
              1,
              d,
            );

          enemy.x +=
            ((enemy.x -
              state.playerX) /
              knockDistance) *
            knockback;

          enemy.y +=
            ((enemy.y -
              state.playerY) /
              knockDistance) *
            knockback;

          if (
            enemy.hp <= 0
          ) {
            const reward =
              enemy.type ===
              'reaper'
                ? 180
                : enemy.type ===
                    'shade'
                  ? 110
                  : enemy.type ===
                      'phantom'
                    ? 130
                    : enemy.type ===
                        'stalker'
                      ? 100
                      : 70;

            const eliteMultiplier =
              enemy.elite
                ? 2
                : 1;

            const difficultyMultiplier =
              DIFFICULTIES[
                difficulty
              ].scoreMultiplier;

            const score =
              Math.round(
                reward *
                  eliteMultiplier *
                  difficultyMultiplier *
                  Math.max(
                    1,
                    1 +
                      state.combo *
                        0.045,
                  ),
              );

            state.score +=
              score;

            state.enemiesKilled +=
              1;

            state.combo += 1;

            state.comboTimer =
              2.7;

            state.maxCombo =
              Math.max(
                state.maxCombo,
                state.combo,
              );

            state.energy =
              clamp(
                state.energy +
                  4 +
                  (enemy.elite
                    ? 5
                    : 0),
                0,
                state.maxEnergy,
              );

            const xp =
              enemy.elite
                ? 28
                : enemy.type ===
                    'reaper'
                  ? 24
                  : enemy.type ===
                      'shade'
                    ? 18
                    : 14;

            awardXp(xp);

            const dataState =
              state as GameState & {
                shardMultiplier?: number;
              };

            const shardMultiplier =
              dataState.shardMultiplier ||
              1;

            state.shards +=
              Math.max(
                1,
                Math.round(
                  (enemy.elite
                    ? 3
                    : 1) *
                    shardMultiplier,
                ),
              );

            if (
              Math.random() <
              0.08
            ) {
              const pickupRoll =
                Math.random();

              let pickup:
                Pickup['type'];

              if (
                pickupRoll <
                0.34
              ) {
                pickup =
                  'health';
              } else if (
                pickupRoll <
                0.68
              ) {
                pickup =
                  'energy';
              } else if (
                pickupRoll <
                0.94
              ) {
                pickup =
                  'shard';
              } else {
                pickup =
                  'core';
              }

              state.pickups.push({
                id:
                  state.nextPickupId++,
                x: enemy.x,
                y: enemy.y,
                type: pickup,
                life: 10,
                pulse: 0,
              });
            }

            if (
              state.enemiesKilled ===
              1
            ) {
              unlockAchievement(
                'first_blood',
              );
            }

            if (
              state.enemiesKilled >=
              100
            ) {
              unlockAchievement(
                'executioner',
              );
            }

            if (
              state.combo >= 10
            ) {
              unlockAchievement(
                'combo_hunter',
              );
            }

            if (
              state.shards >= 50
            ) {
              unlockAchievement(
                'shadow_collector',
              );
            }

            spawnParticles(
              state,
              enemy.x,
              enemy.y,
              enemy.elite
                ? '#f5d76e'
                : selectedWeapon.color,
              enemy.elite
                ? 28
                : 14,
              particlesEnabled,
            );
          }
        }

        if (
          hits > 0 &&
          screenShakeEnabled
        ) {
          state.screenShake =
            Math.max(
              state.screenShake,
              hits > 1
                ? 7
                : 3,
            );
        }

        syncHud();
      },
      [
        awardXp,
        damageEnemy,
        difficulty,
        particlesEnabled,
        screen,
        screenShakeEnabled,
        selectedWeapon,
        syncHud,
        unlockAchievement,
      ],
    );

  const dash =
    useCallback(() => {
      const state =
        stateRef.current;

      if (
        !state.running ||
        state.gameOver ||
        state.dashTimer > 0 ||
        state.stamina < 25
      ) {
        return;
      }

      const keys =
        keysRef.current;

      let dx = 0;
      let dy = 0;

      if (
        keys.has('w') ||
        keys.has('arrowup')
      ) {
        dy -= 1;
      }

      if (
        keys.has('s') ||
        keys.has('arrowdown')
      ) {
        dy += 1;
      }

      if (
        keys.has('a') ||
        keys.has('arrowleft')
      ) {
        dx -= 1;
      }

      if (
        keys.has('d') ||
        keys.has('arrowright')
      ) {
        dx += 1;
      }

      if (
        dx === 0 &&
        dy === 0
      ) {
        dx =
          Math.cos(
            state.attackAngle,
          );

        dy =
          Math.sin(
            state.attackAngle,
          );
      }

      const magnitude =
        Math.hypot(
          dx,
          dy,
        ) || 1;

      dx /= magnitude;
      dy /= magnitude;

      const data =
        state as GameState & {
          dashMultiplier?: number;
        };

      const dashMultiplier =
        data.dashMultiplier ||
        1;

      const distanceValue =
        125 / dashMultiplier;

      const oldX =
        state.playerX;

      const oldY =
        state.playerY;

      state.playerX =
        clamp(
          state.playerX +
            dx *
              distanceValue,
          30,
          WORLD_WIDTH -
            30,
        );

      state.playerY =
        clamp(
          state.playerY +
            dy *
              distanceValue,
          30,
          WORLD_HEIGHT -
            30,
        );

      state.stamina -= 25;

      state.dashTimer =
        0.65 *
        dashMultiplier;

      state.invulnerableTimer =
        0.28;

      state.screenShake =
        screenShakeEnabled
          ? 4
          : 0;

      spawnParticles(
        state,
        oldX,
        oldY,
        '#5fc6e8',
        22,
        particlesEnabled,
      );

      spawnParticles(
        state,
        state.playerX,
        state.playerY,
        '#5fc6e8',
        12,
        particlesEnabled,
      );

      for (
        const enemy of state.enemies
      ) {
        const d =
          distance(
            state.playerX,
            state.playerY,
            enemy.x,
            enemy.y,
          );

        if (
          d <
          55 +
            enemy.radius
        ) {
          const damage =
            25;

          enemy.hp -=
            damage;

          enemy.hitFlash =
            0.15;

          state.totalDamageDealt +=
            damage;

          if (
            enemy.hp <= 0
          ) {
            state.score +=
              80;

            state.enemiesKilled +=
              1;

            state.combo +=
              1;

            state.comboTimer =
              2.7;

            awardXp(12);
          }
        }
      }

      playSound(
        170,
        0.09,
        'sawtooth',
        0.018,
      );

      syncHud();
    }, [
      awardXp,
      particlesEnabled,
      playSound,
      screenShakeEnabled,
      syncHud,
    ]);

  const useAbility =
    useCallback(
      (id: AbilityId) => {
        const state =
          stateRef.current;

        const ability =
          ABILITY_DATA[id];

        if (
          !state.running ||
          state.gameOver ||
          state.abilityCooldowns[
            id
          ] > 0 ||
          state.energy <
            ability.energy
        ) {
          return;
        }

        state.energy -=
          ability.energy;

        state.abilityCooldowns[
          id
        ] = ability.cooldown;

        if (id === 'nova') {
          for (
            const enemy of state.enemies
          ) {
            const d =
              distance(
                state.playerX,
                state.playerY,
                enemy.x,
                enemy.y,
              );

            if (
              d <= 170
            ) {
              const damage =
                65;

              enemy.hp -=
                damage;

              enemy.hitFlash =
                0.15;

              state.totalDamageDealt +=
                damage;

              if (
                enemy.hp <= 0
              ) {
                state.score +=
                  120;

                state.enemiesKilled +=
                  1;

                state.combo +=
                  1;

                state.comboTimer =
                  2.7;

                awardXp(16);
              }
            }
          }

          spawnParticles(
            state,
            state.playerX,
            state.playerY,
            '#e4623f',
            80,
            particlesEnabled,
          );

          state.screenShake =
            screenShakeEnabled
              ? 12
              : 0;

          playSound(
            110,
            0.16,
            'sawtooth',
            0.028,
          );

          playSound(
            440,
            0.18,
            'triangle',
            0.02,
          );
        }

        if (id === 'step') {
          dash();
        }

        if (
          id === 'fracture'
        ) {
          (
            state as GameState & {
              slowTimer?: number;
            }
          ).slowTimer = 4;

          spawnParticles(
            state,
            state.playerX,
            state.playerY,
            '#9b74ff',
            50,
            particlesEnabled,
          );

          playSound(
            220,
            0.35,
            'sine',
            0.025,
          );
        }

        syncHud();
      },
      [
        awardXp,
        dash,
        particlesEnabled,
        playSound,
        screenShakeEnabled,
        syncHud,
      ],
    );

  const startGame =
    useCallback(() => {
      const state =
        createInitialState();

      state.running =
        true;

      state.spawnInterval =
        1.45 /
        DIFFICULTIES[
          difficulty
        ].enemyMultiplier;

      stateRef.current =
        state;

      updateSave(
        (current) => ({
          ...current,
          totalRuns:
            current.totalRuns +
            1,
        }),
      );

      setScreen('game');

      setUpgradeChoices(
        [],
      );

      lastFrameRef.current =
        performance.now();

      playSound(
        220,
        0.14,
        'sine',
        0.02,
      );

      playSound(
        440,
        0.2,
        'triangle',
        0.015,
      );

      syncHud();
    }, [
      difficulty,
      playSound,
      syncHud,
      updateSave,
    ]);

  const pauseGame =
    useCallback(() => {
      const state =
        stateRef.current;

      if (
        screen !== 'game' ||
        state.gameOver
      ) {
        return;
      }

      state.running =
        false;

      setScreen('pause');
    }, [screen]);

  const resumeGame =
    useCallback(() => {
      const state =
        stateRef.current;

      if (
        state.gameOver
      ) {
        return;
      }

      state.running =
        true;

      setScreen('game');

      lastFrameRef.current =
        performance.now();
    }, []);

  const finishGame =
    useCallback(() => {
      const state =
        stateRef.current;

      state.running =
        false;

      state.gameOver =
        true;

      setScreen('results');

      const current =
        saveRef.current ||
        loadSave();

      const nextHighScore =
        Math.max(
          current.highScore,
          Math.round(
            state.score,
          ),
        );

      const nextBestWave =
        Math.max(
          current.bestWave,
          state.wave,
        );

      const nextBestCombo =
        Math.max(
          current.bestCombo,
          state.maxCombo,
        );

      updateSave(
        (existing) => ({
          ...existing,
          highScore:
            nextHighScore,
          bestWave:
            nextBestWave,
          bestCombo:
            nextBestCombo,
          totalKills:
            existing.totalKills +
            state.enemiesKilled,
          totalTime:
            existing.totalTime +
            state.elapsed,
        }),
      );

      playSound(
        70,
        0.45,
        'sawtooth',
        0.03,
      );

      syncHud();
    }, [
      playSound,
      syncHud,
      updateSave,
    ]);

  const restartGame =
    useCallback(() => {
      startGame();
    }, [startGame]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown =
      (event: KeyboardEvent) => {
        const key =
          event.key.toLowerCase();

        keysRef.current.add(
          key,
        );

        if (
          key === ' ' ||
          key === 'shift' ||
          key === 'arrowup' ||
          key === 'arrowdown' ||
          key === 'arrowleft' ||
          key === 'arrowright'
        ) {
          event.preventDefault();
        }

        if (
          screen === 'game'
        ) {
          if (
            key === ' '
          ) {
            performAttack();
          }

          if (
            key === 'shift'
          ) {
            dash();
          }

          if (key === 'q') {
            useAbility('nova');
          }

          if (key === 'e') {
            useAbility('step');
          }

          if (key === 'r') {
            useAbility(
              'fracture',
            );
          }

          if (
            key === 'escape'
          ) {
            pauseGame();
          }
        } else if (
          screen === 'pause' &&
          key === 'escape'
        ) {
          resumeGame();
        }
      };

    const onKeyUp =
      (event: KeyboardEvent) => {
        keysRef.current.delete(
          event.key.toLowerCase(),
        );
      };

    window.addEventListener(
      'keydown',
      onKeyDown,
    );

    window.addEventListener(
      'keyup',
      onKeyUp,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        onKeyDown,
      );

      window.removeEventListener(
        'keyup',
        onKeyUp,
      );

      keysRef.current.clear();
    };
  }, [
    dash,
    open,
    pauseGame,
    performAttack,
    resumeGame,
    screen,
    useAbility,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.style.overflow =
      'hidden';

    return () => {
      document.body.style.overflow =
        '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
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

    let destroyed =
      false;

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
          Math.max(
            1,
            Math.round(
              rect.width *
                dpr,
            ),
          );

        canvas.height =
          Math.max(
            1,
            Math.round(
              rect.height *
                dpr,
            ),
          );
      };

    resize();

    const observer =
      new ResizeObserver(
        resize,
      );

    observer.observe(
      canvas,
    );

    const render =
      (
        timestamp: number,
      ) => {
        if (destroyed) {
          return;
        }

        const state =
          stateRef.current;

        const previous =
          lastFrameRef.current ||
          timestamp;

        const rawDelta =
          (timestamp -
            previous) /
          1000;

        const delta =
          clamp(
            rawDelta,
            0,
            0.035,
          );

        lastFrameRef.current =
          timestamp;

        const scaleX =
          canvas.width /
          WORLD_WIDTH;

        const scaleY =
          canvas.height /
          WORLD_HEIGHT;

        ctx.setTransform(
          scaleX,
          0,
          0,
          scaleY,
          0,
          0,
        );

        if (
          state.running &&
          !state.gameOver
        ) {
          if (
            state.hitStop >
            0
          ) {
            state.hitStop =
              Math.max(
                0,
                state.hitStop -
                  delta,
              );
          } else {
            updateGame(
              state,
              delta,
            );
          }
        }

        drawGame(
          ctx,
          state,
          timestamp,
        );

        animationRef.current =
          requestAnimationFrame(
            render,
          );
      };

    animationRef.current =
      requestAnimationFrame(
        render,
      );

    return () => {
      destroyed = true;

      observer.disconnect();

      if (
        animationRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationRef.current,
        );
      }
    };
  }, [
    difficulty,
    open,
    particlesEnabled,
    screen,
    screenShakeEnabled,
    selectedWeapon,
    syncHud,
  ]);

  const updateGame = useCallback(
    (
      state: GameState,
      delta: number,
    ) => {
      state.elapsed +=
        delta;

      state.attackTimer =
        Math.max(
          0,
          state.attackTimer -
            delta,
        );

      state.attackProgress =
        Math.max(
          0,
          state.attackProgress -
            delta * 4,
        );

      state.dashTimer =
        Math.max(
          0,
          state.dashTimer -
            delta,
        );

      state.invulnerableTimer =
        Math.max(
          0,
          state.invulnerableTimer -
            delta,
        );

      state.comboTimer =
        Math.max(
          0,
          state.comboTimer -
            delta,
        );

      state.screenShake =
        Math.max(
          0,
          state.screenShake -
            delta * 22,
        );

      state.stamina =
        clamp(
          state.stamina +
            24 * delta,
          0,
          state.maxStamina,
        );

      state.energy =
        clamp(
          state.energy +
            5 * delta,
          0,
          state.maxEnergy,
        );

      for (
        const ability of Object.keys(
          state.abilityCooldowns,
        ) as AbilityId[]
      ) {
        state.abilityCooldowns[
          ability
        ] = Math.max(
          0,
          state.abilityCooldowns[
            ability
          ] - delta,
        );
      }

      if (
        state.comboTimer <=
        0
      ) {
        state.combo = 0;
      }

      const keys =
        keysRef.current;

      let moveX = 0;
      let moveY = 0;

      if (
        keys.has('w') ||
        keys.has('arrowup')
      ) {
        moveY -= 1;
      }

      if (
        keys.has('s') ||
        keys.has('arrowdown')
      ) {
        moveY += 1;
      }

      if (
        keys.has('a') ||
        keys.has('arrowleft')
      ) {
        moveX -= 1;
      }

      if (
        keys.has('d') ||
        keys.has('arrowright')
      ) {
        moveX += 1;
      }

      if (
        moveX !== 0 ||
        moveY !== 0
      ) {
        const magnitude =
          Math.hypot(
            moveX,
            moveY,
          ) || 1;

        moveX /=
          magnitude;

        moveY /=
          magnitude;

        const movementData =
          state as GameState & {
            movementMultiplier?: number;
          };

        const movementMultiplier =
          movementData.movementMultiplier ||
          1;

        const speed =
          185 *
          movementMultiplier;

        state.playerX =
          clamp(
            state.playerX +
              moveX *
                speed *
                delta,
            30,
            WORLD_WIDTH -
              30,
          );

        state.playerY =
          clamp(
            state.playerY +
              moveY *
                speed *
                delta,
            30,
            WORLD_HEIGHT -
              30,
          );

        state.attackAngle =
          Math.atan2(
            moveY,
            moveX,
          );
      }

      state.spawnTimer +=
        delta;

      const maximumEnemies =
        Math.min(
          24,
          4 +
            state.wave *
              2,
        );

      if (
        state.spawnTimer >=
          state.spawnInterval &&
        state.enemies.length <
          maximumEnemies &&
        !state.boss.active
      ) {
        state.spawnTimer =
          0;

        const count =
          state.wave >= 7 &&
          Math.random() <
            0.22
            ? 2
            : 1;

        for (
          let i = 0;
          i < count;
          i += 1
        ) {
          createEnemy(
            state,
            difficulty,
            state.wave,
          );
        }
      }

      const slowTimer =
        (
          state as GameState & {
            slowTimer?: number;
          }
        ).slowTimer || 0;

      if (
        slowTimer > 0
      ) {
        (
          state as GameState & {
            slowTimer?: number;
          }
        ).slowTimer =
          Math.max(
            0,
            slowTimer -
              delta,
          );
      }

      const enemyTimeScale =
        slowTimer > 0
          ? 0.42
          : 1;

      for (
        const enemy of state.enemies
      ) {
        enemy.hitFlash =
          Math.max(
            0,
            enemy.hitFlash -
              delta,
          );

        enemy.attackTimer -=
          delta *
          enemyTimeScale;

        enemy.teleportTimer -=
          delta *
          enemyTimeScale;

        enemy.shootTimer -=
          delta *
          enemyTimeScale;

        const dx =
          state.playerX -
          enemy.x;

        const dy =
          state.playerY -
          enemy.y;

        const d =
          Math.hypot(
            dx,
            dy,
          ) || 1;

        enemy.angle =
          Math.atan2(
            dy,
            dx,
          );

        const directionX =
          dx / d;

        const directionY =
          dy / d;

        if (
          enemy.type ===
          'shade'
        ) {
          if (d < 220) {
            enemy.x -=
              directionX *
              enemy.speed *
              delta *
              enemyTimeScale;

            enemy.y -=
              directionY *
              enemy.speed *
              delta *
              enemyTimeScale;
          } else if (
            d > 340
          ) {
            enemy.x +=
              directionX *
              enemy.speed *
              delta *
              enemyTimeScale;

            enemy.y +=
              directionY *
              enemy.speed *
              delta *
              enemyTimeScale;
          }

          if (
            enemy.shootTimer <=
            0
          ) {
            enemy.shootTimer =
              1.5;

            const projectileSpeed =
              220;

            state.projectiles.push({
              id:
                state.nextProjectileId++,
              x: enemy.x,
              y: enemy.y,
              vx:
                directionX *
                projectileSpeed,
              vy:
                directionY *
                projectileSpeed,
              radius: 5,
              damage:
                enemy.damage,
              life: 3,
              color:
                '#9b74ff',
              enemy: true,
            });
          }
        } else if (
          enemy.type ===
          'phantom'
        ) {
          if (
            enemy.teleportTimer <=
              0 &&
            d > 100
          ) {
            enemy.teleportTimer =
              random(
                3,
                5,
              );

            enemy.x =
              state.playerX +
              random(
                -160,
                160,
              );

            enemy.y =
              state.playerY +
              random(
                -120,
                120,
              );

            enemy.x =
              clamp(
                enemy.x,
                35,
                WORLD_WIDTH -
                  35,
              );

            enemy.y =
              clamp(
                enemy.y,
                35,
                WORLD_HEIGHT -
                  35,
              );

            spawnParticles(
              state,
              enemy.x,
              enemy.y,
              '#9b74ff',
              18,
              particlesEnabled,
            );
          }

          enemy.x +=
            directionX *
            enemy.speed *
            delta *
            enemyTimeScale;

          enemy.y +=
            directionY *
            enemy.speed *
            delta *
            enemyTimeScale;
        } else {
          if (
            d >
            48 +
              enemy.radius
          ) {
            enemy.x +=
              directionX *
              enemy.speed *
              delta *
              enemyTimeScale;

            enemy.y +=
              directionY *
              enemy.speed *
              delta *
              enemyTimeScale;
          }

          if (
            d <
              enemy.radius +
                state.playerRadius +
                8 &&
            enemy.attackTimer <=
              0
          ) {
            enemy.attackTimer =
              enemy.attackCooldown;

            if (
              state.invulnerableTimer <=
              0
            ) {
              const damage =
                enemy.damage;

              state.hp =
                clamp(
                  state.hp -
                    damage,
                  0,
                  state.maxHp,
                );

              state.totalDamageTaken +=
                damage;

              state.combo = 0;
              state.comboTimer =
                0;

              state.invulnerableTimer =
                0.34;

              state.screenShake =
                screenShakeEnabled
                  ? 10
                  : 0;

              spawnParticles(
                state,
                state.playerX,
                state.playerY,
                '#e4623f',
                15,
                particlesEnabled,
              );

              if (
                damageNumbersEnabled
              ) {
                addText(
                  state,
                  state.playerX,
                  state.playerY -
                    28,
                  `-${Math.round(
                    damage,
                  )}`,
                  '#e4623f',
                  1.1,
                );
              }

              playSound(
                85,
                0.12,
                'sawtooth',
                0.025,
              );

              if (
                state.hp <=
                0
              ) {
                finishGame();

                return;
              }
            }
          }
        }
      }

      state.enemies =
        state.enemies.filter(
          (enemy) => {
            if (
              enemy.hp >
              0
            ) {
              return true;
            }

            if (
              enemy.modifier ===
              'vampiric'
            ) {
              // Vampiric is intentionally
              // offensive only for now.
            }

            return false;
          },
        );

      for (
        let i =
          state.projectiles.length -
          1;
        i >= 0;
        i -= 1
      ) {
        const projectile =
          state.projectiles[i];

        projectile.life -=
          delta;

        projectile.x +=
          projectile.vx *
          delta *
          enemyTimeScale;

        projectile.y +=
          projectile.vy *
          delta *
          enemyTimeScale;

        if (
          projectile.life <=
            0 ||
          projectile.x <
            -50 ||
          projectile.x >
            WORLD_WIDTH +
              50 ||
          projectile.y <
            -50 ||
          projectile.y >
            WORLD_HEIGHT +
              50
        ) {
          state.projectiles.splice(
            i,
            1,
          );

          continue;
        }

        if (
          projectile.enemy
        ) {
          const d =
            distance(
              projectile.x,
              projectile.y,
              state.playerX,
              state.playerY,
            );

          if (
            d <
            projectile.radius +
              state.playerRadius
          ) {
            if (
              state.invulnerableTimer <=
              0
            ) {
              state.hp =
                clamp(
                  state.hp -
                    projectile.damage,
                  0,
                  state.maxHp,
                );

              state.totalDamageTaken +=
                projectile.damage;

              state.invulnerableTimer =
                0.2;

              state.combo = 0;

              spawnParticles(
                state,
                state.playerX,
                state.playerY,
                '#9b74ff',
                10,
                particlesEnabled,
              );

              state.projectiles.splice(
                i,
                1,
              );

              if (
                state.hp <=
                0
              ) {
                finishGame();

                return;
              }
            }
          }
        }
      }

      for (
        let i =
          state.pickups.length -
          1;
        i >= 0;
        i -= 1
      ) {
        const pickup =
          state.pickups[i];

        pickup.life -=
          delta;

        pickup.pulse +=
          delta;

        const d =
          distance(
            pickup.x,
            pickup.y,
            state.playerX,
            state.playerY,
          );

        if (
          d < 28
        ) {
          if (
            pickup.type ===
            'health'
          ) {
            state.hp =
              clamp(
                state.hp + 22,
                0,
                state.maxHp,
              );
          }

          if (
            pickup.type ===
            'energy'
          ) {
            state.energy =
              clamp(
                state.energy +
                  30,
                0,
                state.maxEnergy,
              );
          }

          if (
            pickup.type ===
            'shard'
          ) {
            state.shards +=
              5;
          }

          if (
            pickup.type ===
            'core'
          ) {
            state.temporaryDamageBoost =
              1.3;

            state.temporarySpeedBoost =
              1.2;

            state.temporaryBoostTimer =
              8;
          }

          spawnParticles(
            state,
            pickup.x,
            pickup.y,
            pickup.type ===
              'core'
              ? '#f5d76e'
              : '#5fc6e8',
            18,
            particlesEnabled,
          );

          playSound(
            600,
            0.08,
            'triangle',
            0.016,
          );

          state.pickups.splice(
            i,
            1,
          );

          continue;
        }

        if (
          pickup.life <=
          0
        ) {
          state.pickups.splice(
            i,
            1,
          );
        }
      }

      if (
        state.temporaryBoostTimer >
        0
      ) {
        state.temporaryBoostTimer -=
          delta;

        if (
          state.temporaryBoostTimer <=
          0
        ) {
          state.temporaryDamageBoost =
            1;

          state.temporarySpeedBoost =
            1;
        }
      }

      // Wave progression.
      const killsPerWave =
        Math.max(
          6,
          state.wave * 5,
        );

      const targetWave =
        Math.floor(
          state.enemiesKilled /
            killsPerWave,
        ) + 1;

      if (
        targetWave >
        state.wave
      ) {
        state.wave =
          targetWave;

        state.spawnInterval =
          Math.max(
            0.52,
            1.45 /
              DIFFICULTIES[
                difficulty
              ].enemyMultiplier -
              state.wave *
                0.045,
          );

        addText(
          state,
          WORLD_WIDTH / 2,
          70,
          `WAVE ${String(
            state.wave,
          ).padStart(2, '0')}`,
          '#e4623f',
          1.35,
        );

        spawnParticles(
          state,
          WORLD_WIDTH / 2,
          WORLD_HEIGHT / 2,
          '#e4623f',
          35,
          particlesEnabled,
        );

        playSound(
          280,
          0.1,
          'square',
          0.018,
        );

        if (
          state.wave >=
          3
        ) {
          unlockAchievement(
            'night_walker',
          );
        }

        if (
          difficulty ===
            'nightmare' &&
          state.wave >=
            5
        ) {
          unlockAchievement(
            'nightmare',
          );
        }

        if (
          state.wave ===
          5 &&
          !state.boss.active
        ) {
          state.running =
            false;

          spawnBoss(
            state,
            difficulty,
          );

          setScreen(
            'game',
          );

          window.setTimeout(
            () => {
              if (
                !state.gameOver
              ) {
                state.running =
                  true;
              }
            },
            1400,
          );
        }
      }

      // Boss simulation.
      if (
        state.boss.active
      ) {
        const boss =
          state.boss;

        boss.attackTimer -=
          delta;

        boss.summonTimer -=
          delta;

        boss.collapseTimer -=
          delta;

        boss.hitFlash =
          Math.max(
            0,
            boss.hitFlash -
              delta,
          );

        const dx =
          state.playerX -
          boss.x;

        const dy =
          state.playerY -
          boss.y;

        const d =
          Math.hypot(
            dx,
            dy,
          ) || 1;

        const bx =
          dx / d;

        const by =
          dy / d;

        if (
          d > 170
        ) {
          boss.x +=
            bx *
            20 *
            delta;

          boss.y +=
            by *
            20 *
            delta;
        }

        if (
          boss.hp <=
            boss.maxHp *
              0.5 &&
          boss.phase ===
            1
        ) {
          boss.phase =
            2;

          addText(
            state,
            boss.x,
            boss.y -
              70,
            'PHASE II',
            '#9b74ff',
            1.3,
          );

          spawnParticles(
            state,
            boss.x,
            boss.y,
            '#9b74ff',
            50,
            particlesEnabled,
          );
        }

        if (
          boss.attackTimer <=
          0
        ) {
          boss.attackTimer =
            boss.phase ===
            2
              ? 2.1
              : 2.8;

          state.projectiles.push({
            id:
              state.nextProjectileId++,
            x: boss.x,
            y: boss.y,
            vx:
              bx *
              180,
            vy:
              by *
              180,
            radius: 9,
            damage:
              22 *
              DIFFICULTIES[
                difficulty
              ]
                .damageMultiplier,
            life: 4,
            color:
              '#e4623f',
            enemy: true,
          });

          spawnParticles(
            state,
            boss.x,
            boss.y,
            '#e4623f',
            18,
            particlesEnabled,
          );
        }

        if (
          boss.summonTimer <=
            0 &&
          boss.phase ===
            2
        ) {
          boss.summonTimer =
            6;

          createEnemy(
            state,
            difficulty,
            state.wave,
            'wraith',
          );

          createEnemy(
            state,
            difficulty,
            state.wave,
            'wraith',
          );
        }

        if (
          boss.collapseTimer <=
            0
        ) {
          boss.collapseTimer =
            boss.phase ===
            2
              ? 7
              : 9;

          addText(
            state,
            state.playerX,
            state.playerY -
              45,
            'VOID COLLAPSE',
            '#e4623f',
            1.1,
          );

          state.screenShake =
            screenShakeEnabled
              ? 7
              : 0;
        }

        if (
          boss.hp <=
          0
        ) {
          boss.active =
            false;

          state.score +=
            Math.round(
              1000 *
                DIFFICULTIES[
                  difficulty
                ]
                  .scoreMultiplier,
            );

          state.shards +=
            20;

          state.energy =
            state.maxEnergy;

          awardXp(60);

          updateSave(
            (current) => ({
              ...current,
              bossesDefeated:
                current.bossesDefeated +
                1,
            }),
          );

          unlockAchievement(
            'void_breaker',
          );

          spawnParticles(
            state,
            boss.x,
            boss.y,
            '#f5d76e',
            100,
            particlesEnabled,
          );

          addText(
            state,
            boss.x,
            boss.y,
            'BOSS DEFEATED',
            '#f5d76e',
            1.5,
          );

          playSound(
            120,
            0.25,
            'sawtooth',
            0.025,
          );

          playSound(
            880,
            0.35,
            'triangle',
            0.025,
          );
        }
      }

      for (
        let i =
          state.particles.length -
          1;
        i >= 0;
        i -= 1
      ) {
        const particle =
          state.particles[i];

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

        if (
          particle.life <=
          0
        ) {
          state.particles.splice(
            i,
            1,
          );
        }
      }

      for (
        let i =
          state.floatingTexts.length -
          1;
        i >= 0;
        i -= 1
      ) {
        const text =
          state.floatingTexts[i];

        text.life -=
          delta;

        text.y -=
          22 * delta;

        if (
          text.life <=
          0
        ) {
          state.floatingTexts.splice(
            i,
            1,
          );
        }
      }

      syncHud();
    },
    [
      damageNumbersEnabled,
      difficulty,
      finishGame,
      particlesEnabled,
      playSound,
      screenShakeEnabled,
      syncHud,
      unlockAchievement,
    ],
  );

  const drawGame =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        state: GameState,
        timestamp: number,
      ) => {
        const shake =
          screenShakeEnabled &&
          !reducedMotion
            ? state.screenShake
            : 0;

        const shakeX =
          shake > 0
            ? random(
                -shake,
                shake,
              )
            : 0;

        const shakeY =
          shake > 0
            ? random(
                -shake,
                shake,
              )
            : 0;

        ctx.save();

        ctx.translate(
          shakeX,
          shakeY,
        );

        const background =
          ctx.createRadialGradient(
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2,
            30,
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2,
            720,
          );

        background.addColorStop(
          0,
          '#16131a',
        );

        background.addColorStop(
          0.55,
          '#09080d',
        );

        background.addColorStop(
          1,
          '#020204',
        );

        ctx.fillStyle =
          background;

        ctx.fillRect(
          0,
          0,
          WORLD_WIDTH,
          WORLD_HEIGHT,
        );

        // Arena grid.
        ctx.save();

        ctx.globalAlpha =
          0.13;

        ctx.strokeStyle =
          '#8b858d';

        ctx.lineWidth = 1;

        const gridSize = 40;

        for (
          let x = 0;
          x <=
          WORLD_WIDTH;
          x +=
            gridSize
        ) {
          ctx.beginPath();

          ctx.moveTo(
            x,
            0,
          );

          ctx.lineTo(
            x,
            WORLD_HEIGHT,
          );

          ctx.stroke();
        }

        for (
          let y = 0;
          y <=
          WORLD_HEIGHT;
          y +=
            gridSize
        ) {
          ctx.beginPath();

          ctx.moveTo(
            0,
            y,
          );

          ctx.lineTo(
            WORLD_WIDTH,
            y,
          );

          ctx.stroke();
        }

        ctx.restore();

        // Central artifact.
        if (!reducedMotion) {
          ctx.save();

          ctx.translate(
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2,
          );

          ctx.rotate(
            timestamp / 12000,
          );

          ctx.strokeStyle =
            'rgba(228,98,63,0.09)';

          ctx.lineWidth = 1;

          ctx.beginPath();

          ctx.arc(
            0,
            0,
            180,
            0,
            Math.PI * 2,
          );

          ctx.stroke();

          ctx.beginPath();

          ctx.arc(
            0,
            0,
            225,
            0,
            Math.PI * 2,
          );

          ctx.stroke();

          ctx.restore();
        }

        // Pickups.
        for (
          const pickup of state.pickups
        ) {
          const colors = {
            health:
              '#e4623f',
            energy:
              '#5fc6e8',
            shard:
              '#9b74ff',
            core:
              '#f5d76e',
          };

          const color =
            colors[
              pickup.type
            ];

          const pulse =
            1 +
            Math.sin(
              pickup.pulse *
                4,
            ) *
              0.12;

          drawGlow(
            ctx,
            pickup.x,
            pickup.y,
            8 * pulse,
            color,
            0.22,
          );

          ctx.save();

          ctx.translate(
            pickup.x,
            pickup.y,
          );

          ctx.rotate(
            pickup.pulse,
          );

          ctx.strokeStyle =
            color;

          ctx.lineWidth = 1.5;

          ctx.beginPath();

          ctx.moveTo(
            0,
            -7,
          );

          ctx.lineTo(
            7,
            0,
          );

          ctx.lineTo(
            0,
            7,
          );

          ctx.lineTo(
            -7,
            0,
          );

          ctx.closePath();

          ctx.stroke();

          ctx.restore();
        }

        // Projectiles.
        for (
          const projectile of state.projectiles
        ) {
          drawGlow(
            ctx,
            projectile.x,
            projectile.y,
            projectile.radius *
              1.6,
            projectile.color,
            0.2,
          );

          ctx.fillStyle =
            projectile.color;

          ctx.beginPath();

          ctx.arc(
            projectile.x,
            projectile.y,
            projectile.radius,
            0,
            Math.PI * 2,
          );

          ctx.fill();
        }

        // Enemies.
        for (
          const enemy of state.enemies
        ) {
          const colors: Record<
            EnemyType,
            string
          > = {
            wraith:
              '#9b74ff',
            stalker:
              '#e4623f',
            reaper:
              '#5fc6e8',
            shade:
              '#b487ff',
            phantom:
              '#d7b7ff',
          };

          const color =
            colors[
              enemy.type
            ];

          const pulse =
            1 +
            Math.sin(
              timestamp /
                  180 +
                enemy.id,
            ) *
              0.07;

          ctx.save();

          ctx.translate(
            enemy.x,
            enemy.y,
          );

          ctx.rotate(
            enemy.angle +
              Math.PI /
                2,
          );

          ctx.scale(
            pulse,
            pulse,
          );

          drawGlow(
            ctx,
            0,
            0,
            enemy.radius *
              1.25,
            color,
            0.12,
          );

          ctx.fillStyle =
            '#07060a';

          ctx.strokeStyle =
            color;

          ctx.lineWidth =
            enemy.elite
              ? 2
              : 1.2;

          ctx.beginPath();

          if (
            enemy.type ===
            'wraith'
          ) {
            ctx.moveTo(
              0,
              -enemy.radius,
            );

            ctx.lineTo(
              enemy.radius,
              0,
            );

            ctx.lineTo(
              0,
              enemy.radius,
            );

            ctx.lineTo(
              -enemy.radius,
              0,
            );
          } else if (
            enemy.type ===
            'reaper'
          ) {
            ctx.moveTo(
              0,
              -enemy.radius *
                1.2,
            );

            ctx.lineTo(
              enemy.radius,
              enemy.radius,
            );

            ctx.lineTo(
              -enemy.radius,
              enemy.radius,
            );
          } else if (
            enemy.type ===
            'shade'
          ) {
            ctx.arc(
              0,
              0,
              enemy.radius,
              0,
              Math.PI * 2,
            );
          } else {
            ctx.moveTo(
              0,
              -enemy.radius,
            );

            ctx.lineTo(
              enemy.radius *
                0.8,
              enemy.radius *
                0.7,
            );

            ctx.lineTo(
              -enemy.radius *
                0.8,
              enemy.radius *
                0.7,
            );
          }

          ctx.closePath();

          ctx.fill();

          ctx.stroke();

          ctx.fillStyle =
            color;

          ctx.beginPath();

          ctx.arc(
            -enemy.radius *
              0.25,
            -enemy.radius *
              0.05,
            2,
            0,
            Math.PI * 2,
          );

          ctx.arc(
            enemy.radius *
              0.25,
            -enemy.radius *
              0.05,
            2,
            0,
            Math.PI * 2,
          );

          ctx.fill();

          ctx.restore();

          // HP bar.
          const hpRatio =
            clamp(
              enemy.hp /
                enemy.maxHp,
              0,
              1,
            );

          const barWidth =
            enemy.radius *
            2.4;

          ctx.fillStyle =
            'rgba(0,0,0,0.65)';

          ctx.fillRect(
            enemy.x -
              barWidth /
                2,
            enemy.y -
              enemy.radius -
              12,
            barWidth,
            3,
          );

          ctx.fillStyle =
            enemy.elite
              ? '#f5d76e'
              : color;

          ctx.fillRect(
            enemy.x -
              barWidth /
                2,
            enemy.y -
              enemy.radius -
              12,
            barWidth *
              hpRatio,
            3,
          );

          if (
            enemy.elite
          ) {
            ctx.save();

            ctx.font =
              '700 7px ui-monospace, monospace';

            ctx.fillStyle =
              '#f5d76e';

            ctx.textAlign =
              'center';

            ctx.fillText(
              enemy.modifier
                ? enemy.modifier.toUpperCase()
                : 'ELITE',
              enemy.x,
              enemy.y -
                enemy.radius -
                17,
            );

            ctx.restore();
          }

          if (
            enemy.hitFlash >
            0
          ) {
            ctx.save();

            ctx.globalAlpha =
              enemy.hitFlash /
              0.14;

            ctx.fillStyle =
              '#ffffff';

            ctx.beginPath();

            ctx.arc(
              enemy.x,
              enemy.y,
              enemy.radius *
                1.15,
              0,
              Math.PI * 2,
            );

            ctx.fill();

            ctx.restore();
          }
        }

        // Boss.
        if (
          state.boss.active
        ) {
          const boss =
            state.boss;

          const bossPulse =
            1 +
            Math.sin(
              timestamp / 300,
            ) *
              0.05;

          ctx.save();

          ctx.translate(
            boss.x,
            boss.y,
          );

          ctx.scale(
            bossPulse,
            bossPulse,
          );

          drawGlow(
            ctx,
            0,
            0,
            boss.radius *
              1.4,
            '#e4623f',
            0.16,
          );

          ctx.fillStyle =
            '#050408';

          ctx.strokeStyle =
            boss.phase === 2
              ? '#9b74ff'
              : '#e4623f';

          ctx.lineWidth = 2.5;

          ctx.beginPath();

          ctx.moveTo(
            0,
            -boss.radius,
          );

          ctx.lineTo(
            boss.radius,
            boss.radius *
              0.7,
          );

          ctx.lineTo(
            0,
            boss.radius *
              1.15,
          );

          ctx.lineTo(
            -boss.radius,
            boss.radius *
              0.7,
          );

          ctx.closePath();

          ctx.fill();

          ctx.stroke();

          ctx.fillStyle =
            boss.phase === 2
              ? '#9b74ff'
              : '#e4623f';

          ctx.beginPath();

          ctx.arc(
            0,
            0,
            8,
            0,
            Math.PI * 2,
          );

          ctx.fill();

          ctx.restore();

          const bossRatio =
            clamp(
              boss.hp /
                boss.maxHp,
              0,
              1,
            );

          ctx.fillStyle =
            'rgba(0,0,0,0.8)';

          ctx.fillRect(
            WORLD_WIDTH / 2 -
              260,
            22,
            520,
            8,
          );

          ctx.fillStyle =
            boss.phase === 2
              ? '#9b74ff'
              : '#e4623f';

          ctx.fillRect(
            WORLD_WIDTH / 2 -
              260,
            22,
            520 *
              bossRatio,
            8,
          );

          ctx.save();

          ctx.textAlign =
            'center';

          ctx.font =
            '700 11px ui-monospace, monospace';

          ctx.fillStyle =
            '#f3eee6';

          ctx.fillText(
            `${boss.name} // PHASE ${boss.phase}`,
            WORLD_WIDTH / 2,
            17,
          );

          ctx.restore();
        }

        // Player.
        ctx.save();

        ctx.translate(
          state.playerX,
          state.playerY,
        );

        ctx.rotate(
          state.attackAngle,
        );

        drawGlow(
          ctx,
          0,
          0,
          20,
          selectedWeapon.color,
          0.16,
        );

        if (
          state.invulnerableTimer >
          0
        ) {
          ctx.strokeStyle =
            '#5fc6e8';

          ctx.lineWidth = 2;

          ctx.beginPath();

          ctx.arc(
            0,
            0,
            27,
            0,
            Math.PI * 2,
          );

          ctx.stroke();
        }

        ctx.fillStyle =
          '#09080c';

        ctx.strokeStyle =
          selectedWeapon.color;

        ctx.lineWidth = 1.6;

        ctx.beginPath();

        ctx.arc(
          0,
          0,
          state.playerRadius,
          0,
          Math.PI * 2,
        );

        ctx.fill();

        ctx.stroke();

        // Hood.
        ctx.beginPath();

        ctx.moveTo(
          0,
          -20,
        );

        ctx.lineTo(
          14,
          11,
        );

        ctx.lineTo(
          0,
          7,
        );

        ctx.lineTo(
          -14,
          11,
        );

        ctx.closePath();

        ctx.strokeStyle =
          'rgba(243,238,230,0.7)';

        ctx.lineWidth = 1;

        ctx.stroke();

        // Core.
        drawGlow(
          ctx,
          0,
          0,
          4,
          selectedWeapon.color,
          0.9,
        );

        // Weapon.
        ctx.strokeStyle =
          selectedWeapon.color;

        ctx.lineWidth = 3;

        ctx.lineCap =
          'round';

        ctx.beginPath();

        ctx.moveTo(
          9,
          0,
        );

        ctx.lineTo(
          selectedWeapon.range *
            0.58,
          0,
        );

        ctx.stroke();

        ctx.restore();

        // Attack arc.
        if (
          state.attackProgress >
          0
        ) {
          ctx.save();

          ctx.globalAlpha =
            Math.min(
              1,
              state.attackProgress *
                1.5,
            );

          ctx.strokeStyle =
            selectedWeapon.color;

          ctx.shadowColor =
            selectedWeapon.color;

          ctx.shadowBlur = 20;

          ctx.lineWidth = 7;

          ctx.beginPath();

          ctx.arc(
            state.playerX,
            state.playerY,
            selectedWeapon.range *
              0.72,
            state.attackAngle -
              0.9,
            state.attackAngle +
              0.9,
          );

          ctx.stroke();

          ctx.restore();
        }

        // Particles.
        if (
          particlesEnabled
        ) {
          for (
            const particle of state.particles
          ) {
            const alpha =
              clamp(
                particle.life /
                  particle.maxLife,
                0,
                1,
              );

            ctx.save();

            ctx.globalAlpha =
              alpha;

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
        }

        // Floating text.
        if (
          damageNumbersEnabled
        ) {
          for (
            const text of state.floatingTexts
          ) {
            const alpha =
              clamp(
                text.life /
                  text.maxLife,
                0,
                1,
              );

            ctx.save();

            ctx.globalAlpha =
              alpha;

            ctx.textAlign =
              'center';

            ctx.font =
              `700 ${
                11 *
                text.scale
              }px ui-monospace, monospace`;

            ctx.fillStyle =
              text.color;

            ctx.shadowColor =
              text.color;

            ctx.shadowBlur = 8;

            ctx.fillText(
              text.text,
              text.x,
              text.y,
            );

            ctx.restore();
          }
        }

        // Vignette.
        const vignette =
          ctx.createRadialGradient(
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2,
            WORLD_HEIGHT *
              0.25,
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2,
            WORLD_HEIGHT *
              0.78,
          );

        vignette.addColorStop(
          0,
          'rgba(0,0,0,0)',
        );

        vignette.addColorStop(
          1,
          'rgba(0,0,0,0.72)',
        );

        ctx.fillStyle =
          vignette;

        ctx.fillRect(
          0,
          0,
          WORLD_WIDTH,
          WORLD_HEIGHT,
        );

        if (
          state.hp <
            state.maxHp *
              0.25
        ) {
          ctx.fillStyle =
            `rgba(228,70,63,${
              0.04 +
              Math.sin(
                timestamp / 150,
              ) *
                0.025
            })`;

          ctx.fillRect(
            0,
            0,
            WORLD_WIDTH,
            WORLD_HEIGHT,
          );
        }

        ctx.restore();
      },
      [
        damageNumbersEnabled,
        particlesEnabled,
        reducedMotion,
        screenShakeEnabled,
        selectedWeapon,
      ],
    );

  const handleCanvasPointer =
    useCallback(
      (
        event: React.PointerEvent<HTMLCanvasElement>,
      ) => {
        const canvas =
          canvasRef.current;

        if (
          !canvas ||
          screen !== 'game'
        ) {
          return;
        }

        const rect =
          canvas.getBoundingClientRect();

        const x =
          ((event.clientX -
            rect.left) /
            rect.width) *
          WORLD_WIDTH;

        const y =
          ((event.clientY -
            rect.top) /
            rect.height) *
          WORLD_HEIGHT;

        const state =
          stateRef.current;

        const angle =
          Math.atan2(
            y -
              state.playerY,
            x -
              state.playerX,
          );

        performAttack(
          angle,
        );
      },
      [performAttack, screen],
    );

  const toggleSetting =
    useCallback(
      (
        setting:
          | 'sound'
          | 'screenShake'
          | 'particles'
          | 'damageNumbers'
          | 'reducedMotion',
      ) => {
        const values = {
          sound:
            !soundEnabled,
          screenShake:
            !screenShakeEnabled,
          particles:
            !particlesEnabled,
          damageNumbers:
            !damageNumbersEnabled,
          reducedMotion:
            !reducedMotion,
        };

        const value =
          values[setting];

        if (
          setting ===
          'sound'
        ) {
          setSoundEnabled(
            value,
          );
        }

        if (
          setting ===
          'screenShake'
        ) {
          setScreenShakeEnabled(
            value,
          );
        }

        if (
          setting ===
          'particles'
        ) {
          setParticlesEnabled(
            value,
          );
        }

        if (
          setting ===
          'damageNumbers'
        ) {
          setDamageNumbersEnabled(
            value,
          );
        }

        if (
          setting ===
          'reducedMotion'
        ) {
          setReducedMotion(
            value,
          );
        }

        updateSave(
          (current) => ({
            ...current,
            settings: {
              ...current.settings,
              [setting]:
                value,
            },
          }),
        );
      },
      [
        damageNumbersEnabled,
        particlesEnabled,
        reducedMotion,
        screenShakeEnabled,
        soundEnabled,
        updateSave,
      ],
    );

  useEffect(() => {
    return () => {
      Object.values(
        sfxAudioRef.current,
      ).forEach((pool) => {
        pool.forEach((audio) => {
          audio.pause();
          audio.src = '';
        });
      });

      sfxAudioRef.current = {};
      sfxIndexRef.current = {};
      sfxLastPlayedRef.current = {};

      if (audioRef.current) {
        void audioRef.current
          .close()
          .catch(() => undefined);
        audioRef.current = null;
      }
    };
  }, []);

  if (!open) {
    return null;
  }

  const hpRatio =
    hud.maxHp > 0
      ? hud.hp /
        hud.maxHp
      : 0;

  const staminaRatio =
    hud.maxStamina > 0
      ? hud.stamina /
        hud.maxStamina
      : 0;

  const energyRatio =
    hud.maxEnergy > 0
      ? hud.energy /
        hud.maxEnergy
      : 0;

  const xpRatio =
    hud.xpToNext > 0
      ? hud.xp /
        hud.xpToNext
      : 0;


  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/85
        p-2
        backdrop-blur-xl
        sm:p-5
      "
      role="dialog"
      aria-modal="true"
      aria-label="Shadow Hunter"
    >
      <div
        className="
          relative
          flex
          max-h-[96vh]
          w-full
          max-w-[1180px]
          flex-col
          overflow-hidden
          border
          border-[#e4623f]/30
          bg-[#050507]
          shadow-[0_0_120px_rgba(228,98,63,0.12)]
        "
      >
        {/* Header */}
        <header
          className="
            relative
            z-30
            flex
            min-h-[60px]
            items-center
            justify-between
            border-b
            border-white/10
            bg-black/70
            px-3
            py-2
            backdrop-blur-xl
            sm:px-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                border
                border-[#e4623f]/50
                bg-[#e4623f]/10
                font-mono
                text-[10px]
                text-[#e4623f]
              "
            >
              <span className="absolute inset-1 border border-[#e4623f]/20" />
              SH
            </div>

            <div>
              <div
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.35em]
                  text-[#e4623f]
                "
              >
                SHADOW HUNTER
              </div>

              <div
                className="
                  mt-0.5
                  font-mono
                  text-[7px]
                  tracking-[0.18em]
                  text-white/25
                "
              >
                NIGHTFALL PROTOCOL // 01
              </div>
            </div>
          </div>

          {screen ===
            'game' && (
            <div
              className="
                hidden
                items-center
                gap-5
                md:flex
              "
            >
              <TopMetric
                label="WAVE"
                value={String(
                  hud.wave,
                ).padStart(
                  2,
                  '0',
                )}
              />

              <TopMetric
                label="LEVEL"
                value={String(
                  hud.level,
                ).padStart(
                  2,
                  '0',
                )}
              />

              <TopMetric
                label="KILLS"
                value={String(
                  hud.kills,
                ).padStart(
                  3,
                  '0',
                )}
              />

              <TopMetric
                label="SCORE"
                value={String(
                  hud.score,
                ).padStart(
                  6,
                  '0',
                )}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            {screen ===
              'game' && (
              <button
                type="button"
                onClick={
                  pauseGame
                }
                className="
                  border
                  border-white/10
                  px-3
                  py-2
                  font-mono
                  text-[8px]
                  tracking-[0.16em]
                  text-white/45
                  transition
                  hover:border-[#e4623f]/40
                  hover:text-[#e4623f]
                "
              >
                PAUSE
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                stateRef.current.running =
                  false;

                onClose();
              }}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                border
                border-white/10
                font-mono
                text-lg
                text-white/35
                transition
                hover:border-[#e4623f]/50
                hover:text-[#e4623f]
              "
              aria-label="Close Shadow Hunter"
            >
              ×
            </button>
          </div>
        </header>

        {/* Main area */}
        <main className="relative min-h-0 flex-1 overflow-auto">
          {screen ===
            'game' && (
            <div
              className="
                relative
                aspect-[16/9]
                min-h-[340px]
                w-full
                overflow-hidden
                bg-black
              "
            >
              <canvas
                ref={canvasRef}
                onPointerDown={
                  handleCanvasPointer
                }
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  cursor-crosshair
                  touch-none
                "
              />

              {/* Gameplay HUD */}
              <div
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-3
                  w-48
                  sm:left-5
                  sm:top-5
                  sm:w-56
                "
              >
                <HudBar
                  label="VITALITY"
                  value={`${Math.ceil(
                    hud.hp,
                  )}/${Math.ceil(
                    hud.maxHp,
                  )}`}
                  ratio={hpRatio}
                  color="#e4623f"
                />

                <HudBar
                  label="STAMINA"
                  value={String(
                    Math.ceil(
                      hud.stamina,
                    ),
                  )}
                  ratio={
                    staminaRatio
                  }
                  color="#5fc6e8"
                />

                <HudBar
                  label="ENERGY"
                  value={String(
                    Math.ceil(
                      hud.energy,
                    ),
                  )}
                  ratio={
                    energyRatio
                  }
                  color="#9b74ff"
                />

                <HudBar
                  label={`LEVEL ${hud.level}`}
                  value={`${Math.ceil(
                    hud.xp,
                  )}/${Math.ceil(
                    hud.xpToNext,
                  )}`}
                  ratio={xpRatio}
                  color="#f3eee6"
                />
              </div>

              {/* Combo */}
              {hud.combo >=
                2 && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-4
                    text-right
                    sm:right-6
                    sm:top-6
                  "
                >
                  <div
                    className="
                      font-mono
                      text-3xl
                      font-bold
                      tracking-tight
                      text-[#f5d76e]
                      drop-shadow-[0_0_15px_rgba(245,215,110,0.4)]
                      sm:text-4xl
                    "
                  >
                    x{hud.combo}
                  </div>

                  <div className="font-mono text-[7px] tracking-[0.3em] text-white/30">
                    SOUL HARVEST
                  </div>
                </div>
              )}

              {/* Boss HUD */}
              {hud.bossHp >
                0 && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-3
                    w-[min(70%,520px)]
                    -translate-x-1/2
                    sm:top-5
                  "
                >
                  <div className="mb-1 text-center font-mono text-[7px] tracking-[0.25em] text-[#e4623f]">
                    {hud.bossName}{' '}
                    // PHASE{' '}
                    {hud.bossPhase}
                  </div>

                  <div className="h-1.5 overflow-hidden bg-white/10">
                    <div
                      className="h-full bg-[#e4623f] shadow-[0_0_14px_rgba(228,98,63,0.7)] transition-[width] duration-150"
                      style={{
                        width: `${
                          hud.bossMaxHp >
                          0
                            ? clamp(
                                hud.bossHp /
                                  hud.bossMaxHp,
                                0,
                                1,
                              ) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Ability bar */}
              <div
                className="
                  absolute
                  bottom-3
                  left-1/2
                  flex
                  -translate-x-1/2
                  items-center
                  gap-1
                  sm:bottom-5
                  sm:gap-2
                "
              >
                {(
                  Object.keys(
                    ABILITY_DATA,
                  ) as AbilityId[]
                ).map(
                  (abilityId) => {
                    const ability =
                      ABILITY_DATA[
                        abilityId
                      ];

                    const cooldown =
                      stateRef.current
                        .abilityCooldowns[
                        abilityId
                      ];

                    const available =
                      cooldown <=
                        0 &&
                      hud.energy >=
                        ability.energy;

                    return (
                      <button
                        key={
                          abilityId
                        }
                        type="button"
                        onClick={() =>
                          useAbility(
                            abilityId,
                          )
                        }
                        className={`
                          relative
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          border
                          font-mono
                          text-[9px]
                          transition
                          sm:h-12
                          sm:w-12
                          ${
                            available
                              ? 'border-white/25 bg-black/60 text-white/80 hover:border-[#e4623f]/60'
                              : 'border-white/10 bg-black/50 text-white/20'
                          }
                        `}
                        style={{
                          borderColor:
                            available
                              ? `${ability.color}66`
                              : undefined,
                        }}
                        aria-label={
                          ability.name
                        }
                      >
                        <span>
                          {
                            ability.key
                          }
                        </span>

                        {cooldown >
                          0 && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/70 font-mono text-[8px] text-white/55">
                            {Math.ceil(
                              cooldown,
                            )}
                          </span>
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              {/* Controls hint */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-4
                  left-4
                  hidden
                  font-mono
                  text-[7px]
                  leading-relaxed
                  tracking-[0.12em]
                  text-white/25
                  sm:block
                "
              >
                WASD / ARROWS — MOVE
                <br />
                SPACE / CLICK — ATTACK
                <br />
                SHIFT — DASH
                <br />
                Q / E / R — ABILITIES
              </div>

              {/* Achievement toast */}
              {achievementToast && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-20
                    border
                    border-[#f5d76e]/30
                    bg-black/75
                    px-4
                    py-3
                    backdrop-blur-xl
                    sm:right-6
                  "
                >
                  <div className="font-mono text-[7px] tracking-[0.25em] text-[#f5d76e]">
                    ACHIEVEMENT UNLOCKED
                  </div>

                  <div className="mt-1 font-mono text-[10px] text-white/80">
                    {
                      ACHIEVEMENT_DATA[
                        achievementToast
                      ].name
                    }
                  </div>
                </div>
              )}

              {/* Touch controls */}
              <div
                className="
                  absolute
                  bottom-4
                  right-4
                  flex
                  gap-2
                  sm:hidden
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    performAttack()
                  }
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#e4623f]/50
                    bg-black/65
                    font-mono
                    text-[8px]
                    text-[#e4623f]
                    backdrop-blur-md
                  "
                >
                  ATK
                </button>

                <button
                  type="button"
                  onClick={
                    dash
                  }
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#5fc6e8]/50
                    bg-black/65
                    font-mono
                    text-[8px]
                    text-[#5fc6e8]
                    backdrop-blur-md
                  "
                >
                  DASH
                </button>
              </div>
            </div>
          )}

          {/* MENU */}
          {screen ===
            'menu' && (
            <MenuScreen
              difficulty={
                difficulty
              }
              weapon={
                selectedWeapon
              }
              highScore={
                save?.highScore ||
                0
              }
              unlockedWeapons={
                save?.unlockedWeapons ||
                []
              }
              onDifficultyChange={
                setDifficulty
              }
              onWeaponChange={
                setWeaponId
              }
              onStart={
                startGame
              }
              onSettings={() =>
                setScreen(
                  'settings',
                )
              }
              onStats={() =>
                setScreen(
                  'stats',
                )
              }
              onHowTo={() =>
                setScreen(
                  'howto',
                )
              }
            />
          )}

          {/* UPGRADE */}
          {screen ===
            'upgrade' && (
            <UpgradeScreen
              choices={
                upgradeChoices
              }
              onChoose={
                applyUpgrade
              }
            />
          )}

          {/* PAUSE */}
          {screen ===
            'pause' && (
            <OverlayScreen
              eyebrow="TEMPORAL STATE"
              title="PAUSED"
            >
              <div className="flex flex-wrap justify-center gap-2">
                <GameButton
                  onClick={
                    resumeGame
                  }
                >
                  RESUME HUNT
                </GameButton>

                <GameButton
                  secondary
                  onClick={() =>
                    setScreen(
                      'settings',
                    )
                  }
                >
                  SETTINGS
                </GameButton>

                <GameButton
                  secondary
                  onClick={() =>
                    setScreen(
                      'howto',
                    )
                  }
                >
                  HOW TO PLAY
                </GameButton>
              </div>
            </OverlayScreen>
          )}

          {/* RESULTS */}
          {screen ===
            'results' && (
            <ResultsScreen
              hud={hud}
              highScore={
                save?.highScore ||
                0
              }
              onRetry={
                restartGame
              }
              onMenu={() =>
                setScreen(
                  'menu',
                )
              }
              onStats={() =>
                setScreen(
                  'stats',
                )
              }
            />
          )}

          {/* SETTINGS */}
          {screen ===
            'settings' && (
            <SettingsScreen
              sound={
                soundEnabled
              }
              screenShake={
                screenShakeEnabled
              }
              particles={
                particlesEnabled
              }
              damageNumbers={
                damageNumbersEnabled
              }
              reducedMotion={
                reducedMotion
              }
              onToggle={
                toggleSetting
              }
              onBack={() =>
                setScreen(
                  stateRef.current
                    .running
                    ? 'pause'
                    : 'menu',
                )
              }
            />
          )}

          {/* STATS */}
          {screen ===
            'stats' && (
            <StatsScreen
              save={save}
              onBack={() =>
                setScreen(
                  'menu',
                )
              }
            />
          )}

          {/* HOW TO */}
          {screen ===
            'howto' && (
            <HowToScreen
              onBack={() =>
                setScreen(
                  stateRef.current
                    .running
                    ? 'pause'
                    : 'menu',
                )
              }
            />
          )}
        </main>

        {/* Footer */}
        <footer
          className="
            flex
            min-h-10
            items-center
            justify-between
            border-t
            border-white/10
            bg-black/70
            px-3
            py-2
            font-mono
            text-[7px]
            tracking-[0.15em]
            text-white/20
            sm:px-5
          "
        >
          <span>
            SHADOW HUNTER // LOCAL INSTANCE
          </span>

          <span className="hidden sm:block">
            NO NETWORK // NO BACKEND // PROCEDURAL
          </span>

          <button
            type="button"
            onClick={() =>
              toggleSetting(
                'sound',
              )
            }
            className="text-white/25 transition hover:text-white/60"
          >
            SFX:{' '}
            {soundEnabled
              ? 'ON'
              : 'OFF'}
          </button>
        </footer>
      </div>
    </div>
  );
}

function TopMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-right">
      <div className="font-mono text-[6px] tracking-[0.2em] text-white/20">
        {label}
      </div>

      <div className="mt-0.5 font-mono text-[10px] text-white/60">
        {value}
      </div>
    </div>
  );
}

function HudBar({
  label,
  value,
  ratio,
  color,
}: {
  label: string;
  value: string;
  ratio: number;
  color: string;
}) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between font-mono text-[7px] tracking-[0.16em]">
        <span className="text-white/35">
          {label}
        </span>

        <span className="text-white/50">
          {value}
        </span>
      </div>

      <div className="h-1 overflow-hidden bg-white/10">
        <div
          className="h-full transition-[width] duration-150"
          style={{
            width: `${clamp(
              ratio,
              0,
              1,
            ) * 100}%`,
            backgroundColor:
              color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

function GameButton({
  children,
  onClick,
  secondary = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  secondary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        border
        px-5
        py-3
        font-mono
        text-[8px]
        tracking-[0.2em]
        transition
        ${
          secondary
            ? 'border-white/10 bg-white/[0.02] text-white/40 hover:border-white/25 hover:text-white/70'
            : 'border-[#e4623f]/60 bg-[#e4623f]/10 text-[#e4623f] hover:bg-[#e4623f]/20'
        }
      `}
    >
      {children}
    </button>
  );
}

function MenuScreen({
  difficulty,
  weapon,
  highScore,
  unlockedWeapons,
  onDifficultyChange,
  onWeaponChange,
  onStart,
  onSettings,
  onStats,
  onHowTo,
}: {
  difficulty: Difficulty;
  weapon: Weapon;
  highScore: number;
  unlockedWeapons: WeaponId[];
  onDifficultyChange: (
    value: Difficulty,
  ) => void;
  onWeaponChange: (
    value: WeaponId,
  ) => void;
  onStart: () => void;
  onSettings: () => void;
  onStats: () => void;
  onHowTo: () => void;
}) {
  return (
    <div
      className="
        relative
        flex
        min-h-[500px]
        items-center
        justify-center
        overflow-hidden
        bg-[#060609]
        p-5
        sm:p-10
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#e4623f]/10
        "
      />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="font-mono text-[8px] tracking-[0.4em] text-[#e4623f]">
          CLASSIFIED // HUNTER NETWORK
        </div>

        <h1 className="mt-3 font-display text-5xl tracking-tight text-white sm:text-7xl">
          SHADOW
          <span className="text-[#e4623f]">
            {' '}
            HUNTER
          </span>
        </h1>

        <p className="mt-4 max-w-xl font-mono text-[10px] leading-relaxed tracking-[0.08em] text-white/35">
          Enter the night sector. Eliminate
          hostile entities, build your
          combat chain and survive the
          advancing shadow density.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div>
            <div className="mb-2 font-mono text-[7px] tracking-[0.25em] text-white/25">
              HUNT PROTOCOL
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(
                Object.keys(
                  DIFFICULTIES,
                ) as Difficulty[]
              ).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      onDifficultyChange(
                        item,
                      )
                    }
                    className={`
                      border
                      p-3
                      text-left
                      transition
                      ${
                        difficulty ===
                        item
                          ? 'border-[#e4623f]/60 bg-[#e4623f]/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                      }
                    `}
                  >
                    <div
                      className={`
                        font-mono
                        text-[8px]
                        ${
                          difficulty ===
                          item
                            ? 'text-[#e4623f]'
                            : 'text-white/50'
                        }
                      `}
                    >
                      {
                        DIFFICULTIES[
                          item
                        ].name
                      }
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 font-mono text-[7px] tracking-[0.25em] text-white/25">
              WEAPON LOADOUT
            </div>

            <div className="space-y-1.5">
              {WEAPONS.map(
                (item) => {
                  const unlocked =
                    unlockedWeapons.includes(
                      item.id,
                    );

                  return (
                    <button
                      key={
                        item.id
                      }
                      type="button"
                      disabled={
                        !unlocked
                      }
                      onClick={() =>
                        onWeaponChange(
                          item.id,
                        )
                      }
                      className={`
                        w-full
                        border
                        p-3
                        text-left
                        transition
                        ${
                          weapon.id ===
                          item.id
                            ? 'border-[#5fc6e8]/50 bg-[#5fc6e8]/10'
                            : 'border-white/10 bg-white/[0.02]'
                        }
                        ${
                          unlocked
                            ? 'hover:border-white/25'
                            : 'cursor-not-allowed opacity-30'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-[8px]"
                          style={{
                            color:
                              weapon.id ===
                              item.id
                                ? item.color
                                : undefined,
                          }}
                        >
                          {item.name}
                        </span>

                        {!unlocked && (
                          <span className="font-mono text-[6px] text-white/30">
                            LOCKED
                          </span>
                        )}
                      </div>

                      <div className="mt-1 font-mono text-[7px] text-white/25">
                        {
                          item.subtitle
                        }
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <GameButton
            onClick={onStart}
          >
            INITIALIZE HUNT
          </GameButton>

          <GameButton
            secondary
            onClick={
              onHowTo
            }
          >
            HOW TO PLAY
          </GameButton>

          <GameButton
            secondary
            onClick={
              onStats
            }
          >
            RECORDS
          </GameButton>

          <GameButton
            secondary
            onClick={
              onSettings
            }
          >
            SETTINGS
          </GameButton>
        </div>

        <div className="mt-7 flex flex-wrap gap-6 font-mono text-[7px] tracking-[0.16em] text-white/20">
          <span>
            PERSONAL RECORD{' '}
            {String(
              highScore,
            ).padStart(
              6,
              '0',
            )}
          </span>

          <span>
            PROCEDURAL COMBAT
          </span>

          <span>
            LOCAL INSTANCE
          </span>
        </div>
      </div>
    </div>
  );
}

function UpgradeScreen({
  choices,
  onChoose,
}: {
  choices: UpgradeId[];
  onChoose: (
    id: UpgradeId,
  ) => void;
}) {
  return (
    <OverlayScreen
      eyebrow="ASCENSION DETECTED"
      title="CHOOSE ONE"
    >
      <p className="mx-auto max-w-md font-mono text-[9px] leading-relaxed text-white/35">
        The hunter has breached a new
        threshold. Select one permanent
        combat enhancement for this run.
      </p>

      <div className="mt-7 grid gap-2 md:grid-cols-3">
        {choices.map(
          (id) => {
            const upgrade =
              UPGRADE_DATA[id];

            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  onChoose(id)
                }
                className="
                  group
                  border
                  border-white/10
                  bg-white/[0.02]
                  p-5
                  text-left
                  transition
                  hover:border-[#e4623f]/50
                  hover:bg-[#e4623f]/5
                "
              >
                <div className="font-mono text-xl text-[#e4623f] transition group-hover:scale-110">
                  {
                    upgrade.icon
                  }
                </div>

                <div className="mt-4 font-mono text-[9px] tracking-[0.15em] text-white/70">
                  {
                    upgrade.name
                  }
                </div>

                <div className="mt-2 font-mono text-[8px] leading-relaxed text-white/30">
                  {
                    upgrade.description
                  }
                </div>

                <div className="mt-5 font-mono text-[7px] tracking-[0.2em] text-[#e4623f]/60">
                  SELECT →
                </div>
              </button>
            );
          },
        )}
      </div>
    </OverlayScreen>
  );
}

function OverlayScreen({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[500px] items-center justify-center bg-[#060609] p-6">
      <div className="w-full max-w-3xl text-center">
        <div className="font-mono text-[8px] tracking-[0.4em] text-[#e4623f]">
          {eyebrow}
        </div>

        <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">
          {title}
        </h2>

        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({
  hud,
  highScore,
  onRetry,
  onMenu,
  onStats,
}: {
  hud: HudState;
  highScore: number;
  onRetry: () => void;
  onMenu: () => void;
  onStats: () => void;
}) {
  const isRecord =
    hud.score >=
      highScore &&
    hud.score > 0;

  return (
    <OverlayScreen
      eyebrow="HUNTER SIGNAL LOST"
      title="FALLEN"
    >
      <div className="mx-auto grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
        <ResultMetric
          label="SCORE"
          value={String(
            hud.score,
          ).padStart(
            6,
            '0',
          )}
        />

        <ResultMetric
          label="WAVE"
          value={String(
            hud.wave,
          ).padStart(
            2,
            '0',
          )}
        />

        <ResultMetric
          label="KILLS"
          value={String(
            hud.kills,
          ).padStart(
            3,
            '0',
          )}
        />

        <ResultMetric
          label="COMBO"
          value={`x${hud.maxCombo}`}
        />
      </div>

      {isRecord && (
        <div className="mt-5 font-mono text-[8px] tracking-[0.3em] text-[#f5d76e]">
          NEW HUNTER RECORD
        </div>
      )}

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <GameButton
          onClick={onRetry}
        >
          HUNT AGAIN
        </GameButton>

        <GameButton
          secondary
          onClick={onStats}
        >
          RECORDS
        </GameButton>

        <GameButton
          secondary
          onClick={onMenu}
        >
          LOADOUT
        </GameButton>
      </div>
    </OverlayScreen>
  );
}

function ResultMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.02] px-3 py-4">
      <div className="font-mono text-[6px] tracking-[0.2em] text-white/20">
        {label}
      </div>

      <div className="mt-1 font-mono text-sm text-white/65">
        {value}
      </div>
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
  onToggle: (
    setting:
      | 'sound'
      | 'screenShake'
      | 'particles'
      | 'damageNumbers'
      | 'reducedMotion',
  ) => void;
  onBack: () => void;
}) {
  const settings = [
    {
      id: 'sound' as const,
      label: 'SFX',
      value: sound,
    },
    {
      id: 'screenShake' as const,
      label: 'SCREEN SHAKE',
      value: screenShake,
    },
    {
      id: 'particles' as const,
      label: 'PARTICLES',
      value: particles,
    },
    {
      id: 'damageNumbers' as const,
      label: 'DAMAGE NUMBERS',
      value: damageNumbers,
    },
    {
      id: 'reducedMotion' as const,
      label: 'REDUCED MOTION',
      value: reducedMotion,
    },
  ];

  return (
    <OverlayScreen
      eyebrow="SYSTEM CONFIGURATION"
      title="SETTINGS"
    >
      <div className="mx-auto max-w-md space-y-2 text-left">
        {settings.map(
          (setting) => (
            <button
              key={
                setting.id
              }
              type="button"
              onClick={() =>
                onToggle(
                  setting.id,
                )
              }
              className="
                flex
                w-full
                items-center
                justify-between
                border
                border-white/10
                bg-white/[0.02]
                px-4
                py-3
                font-mono
                text-[8px]
                tracking-[0.15em]
                transition
                hover:border-white/25
              "
            >
              <span className="text-white/45">
                {
                  setting.label
                }
              </span>

              <span
                className={
                  setting.value
                    ? 'text-[#5fc6e8]'
                    : 'text-white/20'
                }
              >
                {setting.value
                  ? 'ON'
                  : 'OFF'}
              </span>
            </button>
          ),
        )}
      </div>

      <div className="mt-6">
        <GameButton
          secondary
          onClick={onBack}
        >
          BACK
        </GameButton>
      </div>
    </OverlayScreen>
  );
}

function StatsScreen({
  save,
  onBack,
}: {
  save:
    | PersistentSave
    | null;
  onBack: () => void;
}) {
  const data =
    save ||
    loadSave();

  const stats = [
    [
      'HIGH SCORE',
      String(
        data.highScore,
      ).padStart(
        6,
        '0',
      ),
    ],
    [
      'BEST WAVE',
      String(
        data.bestWave,
      ).padStart(
        2,
        '0',
      ),
    ],
    [
      'BEST COMBO',
      `x${data.bestCombo}`,
    ],
    [
      'TOTAL KILLS',
      String(
        data.totalKills,
      ).padStart(
        4,
        '0',
      ),
    ],
    [
      'TOTAL RUNS',
      String(
        data.totalRuns,
      ).padStart(
        3,
        '0',
      ),
    ],
    [
      'BOSSES',
      String(
        data.bossesDefeated,
      ).padStart(
        2,
        '0',
      ),
    ],
  ];

  return (
    <OverlayScreen
      eyebrow="HUNTER ARCHIVE"
      title="RECORDS"
    >
      <div className="mx-auto grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-3">
        {stats.map(
          ([label, value]) => (
            <div
              key={label}
              className="border border-white/10 bg-white/[0.02] p-4 text-left"
            >
              <div className="font-mono text-[6px] tracking-[0.2em] text-white/20">
                {label}
              </div>

              <div className="mt-2 font-mono text-sm text-white/65">
                {value}
              </div>
            </div>
          ),
        )}
      </div>

      <div className="mt-6">
        <GameButton
          secondary
          onClick={onBack}
        >
          BACK
        </GameButton>
      </div>
    </OverlayScreen>
  );
}

function HowToScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const controls = [
    [
      'WASD / ARROWS',
      'MOVE',
    ],
    [
      'SPACE / CLICK',
      'ATTACK',
    ],
    [
      'SHIFT',
      'SHADOW DASH',
    ],
    [
      'Q',
      'SHADOW NOVA',
    ],
    [
      'E',
      'VOID STEP',
    ],
    [
      'R',
      'TIME FRACTURE',
    ],
    [
      'ESC',
      'PAUSE',
    ],
  ];

  return (
    <OverlayScreen
      eyebrow="FIELD MANUAL"
      title="HOW TO PLAY"
    >
      <div className="mx-auto grid max-w-lg grid-cols-1 gap-1.5">
        {controls.map(
          ([key, action]) => (
            <div
              key={key}
              className="flex items-center justify-between border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <span className="font-mono text-[8px] tracking-[0.15em] text-[#e4623f]">
                {key}
              </span>

              <span className="font-mono text-[8px] tracking-[0.15em] text-white/35">
                {action}
              </span>
            </div>
          ),
        )}
      </div>

      <p className="mx-auto mt-5 max-w-lg font-mono text-[8px] leading-relaxed text-white/25">
        Eliminate shadows to gain XP and
        shards. Maintain your combo for
        higher rewards. Level up to choose
        permanent upgrades. Every fifth wave
        can become a major threat.
      </p>

      <div className="mt-6">
        <GameButton
          secondary
          onClick={onBack}
        >
          BACK
        </GameButton>
      </div>
    </OverlayScreen>
  );
}