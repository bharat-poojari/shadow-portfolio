'use client';

import { Icon } from '@iconify/react';
import {
  Activity,
  BrainCircuit,
  Check,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Layers3,
  Search,
  Server,
  Sparkles,
  Terminal,
  Wrench,
} from 'lucide-react';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

import { useMemo, useState } from 'react';

import { skillGroups } from '@/lib/content';

/* ==========================================================================
   REAL TECHNOLOGY ICON REGISTRY
   ========================================================================== */

/**
 * Technology/brand icons are loaded from:
 *
 * Devicon       -> programming languages, frameworks, databases, tools
 * Simple Icons  -> brands that don't have an appropriate Devicon
 * MDI           -> capabilities which aren't brands/logos
 *
 * This intentionally avoids generic Lucide icons for known technologies.
 */

const SKILL_ICONS: Record<string, string> = {
  /* ------------------------------------------------------------------------
     LANGUAGES
     ------------------------------------------------------------------------ */

  javascript: 'devicon:javascript',
  'javascript (es6+)': 'devicon:javascript',
  javascriptes6: 'devicon:javascript',
  js: 'devicon:javascript',

  typescript: 'devicon:typescript',
  ts: 'devicon:typescript',

  php: 'devicon:php',

  python: 'devicon:python',
  py: 'devicon:python',

  c: 'devicon:c',

  'c++': 'devicon:cplusplus',
  cpp: 'devicon:cplusplus',

  java: 'devicon:java',

  sql: 'devicon:mysql',


  /* ------------------------------------------------------------------------
     FRONTEND
     ------------------------------------------------------------------------ */

  react: 'devicon:react',
  reactjs: 'devicon:react',
  'react.js': 'devicon:react',

  html: 'devicon:html5',
  html5: 'devicon:html5',

  css: 'devicon:css3',
  css3: 'devicon:css3',

  sass: 'devicon:sass',
  scss: 'devicon:sass',

  tailwind: 'devicon:tailwindcss',
  tailwindcss: 'devicon:tailwindcss',
  'tailwind css': 'devicon:tailwindcss',

  bootstrap: 'devicon:bootstrap',

  vite: 'devicon:vite',

  threejs: 'devicon:threejs',
  three: 'devicon:threejs',
  'three.js': 'devicon:threejs',

  zustand: 'simple-icons:zustand',

  'responsive web design': 'mdi:responsive',


  /* ------------------------------------------------------------------------
     BACKEND
     ------------------------------------------------------------------------ */

  node: 'devicon:nodejs',
  nodejs: 'devicon:nodejs',
  'node.js': 'devicon:nodejs',

  express: 'devicon:express',
  expressjs: 'devicon:express',
  'express.js': 'devicon:express',

  'rest api': 'mdi:api',
  'rest apis': 'mdi:api',
  restapi: 'mdi:api',

  api: 'mdi:api',


  /* ------------------------------------------------------------------------
     DATABASES
     ------------------------------------------------------------------------ */

  mongodb: 'devicon:mongodb',
  mongo: 'devicon:mongodb',

  mysql: 'devicon:mysql',

  postgresql: 'devicon:postgresql',
  postgres: 'devicon:postgresql',

  sqlite: 'devicon:sqlite',

  redis: 'devicon:redis',

  firebase: 'devicon:firebase',
  'firebase (basic)': 'devicon:firebase',

  supabase: 'devicon:supabase',


  /* ------------------------------------------------------------------------
     AI / INTELLIGENCE
     ------------------------------------------------------------------------ */

  openai: 'simple-icons:openai',
  chatgpt: 'simple-icons:openai',

  'prompt engineering': 'mdi:message-processing-outline',

  llm: 'mdi:brain',

  llms: 'mdi:brain',

  'large language model': 'mdi:brain',

  'large language models': 'mdi:brain',

  'large language models (llms)': 'mdi:brain',

  'ai integration': 'mdi:brain-circuit',

  'artificial intelligence': 'mdi:brain-circuit',

  ai: 'mdi:brain-circuit',

  'machine learning': 'devicon:tensorflow',

  tensorflow: 'devicon:tensorflow',

  pytorch: 'devicon:pytorch',

  huggingface: 'simple-icons:huggingface',

  'hugging face': 'simple-icons:huggingface',

  langchain: 'simple-icons:langchain',


  /* ------------------------------------------------------------------------
     VERSION CONTROL
     ------------------------------------------------------------------------ */

  git: 'devicon:git',

  github: 'devicon:github',

  gitlab: 'devicon:gitlab',

  bitbucket: 'devicon:bitbucket',


  /* ------------------------------------------------------------------------
     DEVELOPMENT TOOLS
     ------------------------------------------------------------------------ */

  vscode: 'devicon:vscode',

  'vs code': 'devicon:vscode',

  'visual studio code': 'devicon:vscode',

  visualstudiocode: 'devicon:vscode',

  postman: 'devicon:postman',

  docker: 'devicon:docker',

  'docker (basic)': 'devicon:docker',

  npm: 'devicon:npm',

  yarn: 'devicon:yarn',

  pnpm: 'devicon:pnpm',

  linux: 'devicon:linux',


  /* ------------------------------------------------------------------------
     DESIGN
     ------------------------------------------------------------------------ */

  figma: 'devicon:figma',

  photoshop: 'devicon:photoshop',

  'adobe photoshop': 'devicon:photoshop',

  canva: 'simple-icons:canva',


  /* ------------------------------------------------------------------------
     API / DATA FORMATS
     ------------------------------------------------------------------------ */

  graphql: 'devicon:graphql',

  json: 'mdi:code-json',

  jwt: 'mdi:shield-key-outline',

  'json web token': 'mdi:shield-key-outline',

  websocket: 'mdi:connection',

  'web sockets': 'mdi:connection',

  'socket.io': 'simple-icons:socketdotio',

  socketio: 'simple-icons:socketdotio',


  /* ------------------------------------------------------------------------
     OTHER DEVELOPMENT TECHNOLOGIES
     ------------------------------------------------------------------------ */

  eslint: 'devicon:eslint',

  prettier: 'devicon:prettier',

  jest: 'devicon:jest',

  webpack: 'devicon:webpack',

  babel: 'devicon:babel',

  redux: 'devicon:redux',

  'redux toolkit': 'devicon:redux',

  prisma: 'devicon:prisma',

  axios: 'simple-icons:axios',

  markdown: 'simple-icons:markdown',
};


/* ==========================================================================
   NORMALIZATION
   ========================================================================== */

function normalizeSkill(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ');
}

/**
 * O(1) icon lookup table.
 *
 * The original component normalizes each skill and derives its compact
 * variant every time SkillLogo renders. Building this once keeps the
 * render path cheap without changing the resulting icon selection.
 */
const RESOLVED_SKILL_ICONS = (() => {
  const registry: Record<string, string> = {};

  for (const [key, icon] of Object.entries(SKILL_ICONS)) {
    const normalized = normalizeSkill(key);
    const compact = normalized
      .replace(/[._]/g, '')
      .replace(/\s+/g, '');

    registry[normalized] = icon;
    registry[compact] = icon;
  }

  return registry;
})();


/* ==========================================================================
   REAL LOGO COMPONENT
   ========================================================================== */

function SkillLogo({
  name,
  size = 30,
}: {
  name: string;
  size?: number;
}) {
  const normalized = normalizeSkill(name);

  const compact = normalized
    .replace(/[._]/g, '')
    .replace(/\s+/g, '');

  const iconName =
    RESOLVED_SKILL_ICONS[normalized] ??
    RESOLVED_SKILL_ICONS[compact];

  /*
   * Known technology:
   *
   * Render the real Devicon/Simple Icon SVG.
   */
  if (iconName) {
    return (
      <Icon
        icon={iconName}
        width={size}
        height={size}
        aria-label={`${name} logo`}
      />
    );
  }

  /*
   * Capabilities without a real brand logo.
   *
   * These are deliberately semantic rather than pretending
   * that "Prompt Engineering", "REST API", etc. have logos.
   */
  return (
    <Icon
      icon="mdi:code-tags"
      width={size}
      height={size}
      aria-hidden="true"
    />
  );
}


/* ==========================================================================
   CATEGORY METADATA
   ========================================================================== */

function getCategoryMeta(label: string) {
  const normalized = label.toLowerCase();

  if (
    normalized.includes('language') ||
    normalized.includes('programming')
  ) {
    return {
      icon: Code2,
      code: 'LANG',
      description: 'Programming languages and syntax systems',
    };
  }

  if (
    normalized.includes('frontend') ||
    normalized.includes('front-end') ||
    normalized.includes('web')
  ) {
    return {
      icon: Layers3,
      code: 'UI',
      description: 'Interfaces, components and frontend systems',
    };
  }

  if (
    normalized.includes('backend') ||
    normalized.includes('back-end') ||
    normalized.includes('server')
  ) {
    return {
      icon: Server,
      code: 'API',
      description: 'Application logic, APIs and server systems',
    };
  }

  if (
    normalized.includes('database') ||
    normalized.includes('data')
  ) {
    return {
      icon: Database,
      code: 'DATA',
      description: 'Data persistence and database systems',
    };
  }

  if (
    normalized.includes('ai') ||
    normalized.includes('machine') ||
    normalized.includes('intelligence')
  ) {
    return {
      icon: BrainCircuit,
      code: 'AI',
      description: 'AI, LLMs and intelligent application systems',
    };
  }

  if (
    normalized.includes('tool') ||
    normalized.includes('development')
  ) {
    return {
      icon: Wrench,
      code: 'TOOL',
      description: 'Engineering, development and workflow tools',
    };
  }

  if (
    normalized.includes('devops') ||
    normalized.includes('cloud') ||
    normalized.includes('deployment')
  ) {
    return {
      icon: Cpu,
      code: 'OPS',
      description: 'Infrastructure, containers and deployment systems',
    };
  }

  if (normalized.includes('design')) {
    return {
      icon: Sparkles,
      code: 'UX',
      description: 'Interface design and visual systems',
    };
  }

  return {
    icon: Layers3,
    code: 'CORE',
    description: 'Technology and development capability',
  };
}


/* ==========================================================================
   ANIMATION
   ========================================================================== */

const sectionReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 42,
    filter: 'blur(9px)',
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};


const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.95,
    filter: 'blur(5px)',
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.42,
      ease: 'easeOut',
    },
  },
};


const categoryReveal: Variants = {
  hidden: {
    opacity: 0,
    x: -14,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};


/* ==========================================================================
   PRECOMPUTED CATEGORY METADATA
   ========================================================================== */

const CATEGORY_META = new Map(
  skillGroups.map((group) => [
    group.id,
    getCategoryMeta(group.label),
  ]),
);

const TOTAL_CAPABILITIES = skillGroups.reduce(
  (total, group) => total + group.items.length,
  0,
);


/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export function Skills() {
  const reduceMotion = useReducedMotion();

  const [activeId, setActiveId] = useState(
    skillGroups[0]?.id ?? '',
  );

  const [search, setSearch] = useState('');

  const active =
    skillGroups.find(
      (group) => group.id === activeId,
    ) ?? skillGroups[0];

  const filteredItems = useMemo(() => {
    if (!active) {
      return [];
    }

    const query = normalizeSkill(search);

    if (!query) {
      return active.items;
    }

    return active.items.filter((item) =>
      normalizeSkill(item).includes(query),
    );
  }, [active, search]);


  if (!active) {
    return null;
  }


  const categoryMeta =
    CATEGORY_META.get(active.id) ??
    getCategoryMeta(active.label);

  const CategoryIcon = categoryMeta.icon;


  return (
    <section
      id="skills"
      className="
        relative
        overflow-hidden
        isolate
        contain-paint
        bg-void-raised
        px-5
        py-28
        sm:px-8
        sm:py-36
      "
    >

      {/* ================================================================== */}
      {/* ATMOSPHERE                                                         */}
      {/* ================================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Large grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.028]
            contain-paint
            contain-paint
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,.8) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.8) 1px,
                transparent 1px
              )
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Micro grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            contain-paint
          "
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Left atmosphere */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  scale: [1, 1.16, 1],
                  opacity: [0.035, 0.085, 0.035],
                }
          }
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute
            left-[-12%]
            top-[18%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-signal/10
            blur-[150px]
            transform-gpu
            will-change-transform
          "
        />

        {/* Right atmosphere */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  scale: [1.1, 1, 1.1],
                  opacity: [0.025, 0.075, 0.025],
                }
          }
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute
            bottom-[5%]
            right-[-10%]
            h-[480px]
            w-[480px]
            rounded-full
            bg-spectral-bright/10
            blur-[150px]
            transform-gpu
            will-change-transform
          "
        />
      </div>


      {/* Scanline layer */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.018]
          [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px)]
          [background-size:100%_4px]
        "
      />


      {/* ================================================================== */}
      {/* CONTENT                                                            */}
      {/* ================================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ================================================================= */}
        {/* HEADER                                                            */}
        {/* ================================================================= */}

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="mb-14"
        >

          <div className="flex items-center gap-4">

            {/* Section number */}
            <motion.div
              whileHover={
                reduceMotion
                  ? {}
                  : {
                      rotate: 90,
                      scale: 1.08,
                    }
              }
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
              className="
                relative
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                border
                border-signal/60
              "
            >

              <span className="font-mono text-lg text-signal">
                03
              </span>

              <span
                className="
                  absolute
                  -bottom-1
                  -right-1
                  h-2
                  w-2
                  bg-signal
                "
              />

              <span
                className="
                  absolute
                  -left-1
                  -top-1
                  h-2
                  w-2
                  border-l
                  border-t
                  border-spectral-bright
                "
              />
            </motion.div>


            <div>

              <p
                className="
                  hud-label
                  text-xs
                  tracking-[0.3em]
                  text-signal
                "
              >
                THE CODEX
              </p>

              <p
                className="
                  mt-1
                  font-mono
                  text-[9px]
                  tracking-[0.25em]
                  text-ash
                "
              >
                能力 // CAPABILITY INDEX
              </p>

            </div>

          </div>


          <div
            className="
              mt-8
              grid
              gap-6
              lg:grid-cols-[1fr_auto]
              lg:items-end
            "
          >

            <div>

              <h2
                className="
                  max-w-4xl
                  font-display
                  text-3xl
                  leading-tight
                  text-bone
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Tools are only abilities.
                <br />

                <span className="text-spectral-bright">
                  Combination creates capability.
                </span>
              </h2>


              <p
                className="
                  mt-5
                  max-w-2xl
                  font-body
                  text-sm
                  leading-7
                  text-bone-muted
                "
              >
                A living index of the technologies,
                frameworks and tools used to turn ideas
                into working systems.
              </p>

            </div>


            {/* System status */}
            <div
              className="
                flex
                items-center
                gap-3
                border
                border-void-line
                bg-black/20
                px-4
                py-3
              "
            >

              <motion.span
                animate={
                  reduceMotion
                    ? {}
                    : {
                        opacity: [0.25, 1, 0.25],
                      }
                }
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                }}
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-signal
                "
              />

              <div>

                <p
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.2em]
                    text-signal
                  "
                >
                  CODEX ONLINE
                </p>

                <p
                  className="
                    mt-1
                    font-mono
                    text-[8px]
                    text-ash
                  "
                >
                  {skillGroups.length} GROUPS //
                  {' '}
                  {TOTAL_CAPABILITIES}
                  {' '}
                  CAPABILITIES
                </p>

              </div>

            </div>

          </div>

        </motion.div>


        {/* ================================================================= */}
        {/* MAIN CODEX                                                        */}
        {/* ================================================================= */}

        <div
          className="
            grid
            gap-5
            lg:grid-cols-[230px_1fr]
          "
        >

          {/* =============================================================== */}
          {/* CATEGORY NAVIGATION                                             */}
          {/* =============================================================== */}

          <motion.aside
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="relative"
          >

            <div className="sticky top-24">

              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                "
              >

                <p
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.25em]
                    text-ash
                  "
                >
                  CATEGORIES
                </p>

                <span
                  className="
                    font-mono
                    text-[8px]
                    text-ash
                  "
                >
                  {String(skillGroups.length).padStart(2, '0')}
                </span>

              </div>


              <div
                className="
                  overflow-hidden
                  border
                  border-void-line
                  bg-black/10
                "
              >

                {skillGroups.map(
                  (group, index) => {
                    const meta =
                      CATEGORY_META.get(group.id) ??
                      getCategoryMeta(group.label);

                    const IconComponent =
                      meta.icon;

                    const isActive =
                      group.id === activeId;


                    return (
                      <motion.button
                        key={group.id}
                        variants={categoryReveal}
                        initial="hidden"
                        animate="visible"
                        transition={{
                          delay: index * 0.06,
                        }}
                        onClick={() => {
                          setActiveId(group.id);
                          setSearch('');
                        }}
                        aria-pressed={isActive}
                        className={`
                          group
                          relative
                          flex
                          w-full
                          items-center
                          gap-3
                          border-b
                          border-void-line
                          px-4
                          py-3.5
                          text-left
                          transition-colors
                          duration-300
                          last:border-b-0
                          ${
                            isActive
                              ? 'bg-spectral-bright/[0.06] text-spectral-bright'
                              : 'text-ash hover:bg-white/[0.02] hover:text-bone'
                          }
                        `}
                      >

                        {/* Active line */}
                        <motion.span
                          initial={false}
                          animate={{
                            scaleY:
                              isActive
                                ? 1
                                : 0,
                            opacity:
                              isActive
                                ? 1
                                : 0,
                          }}
                          className="
                            absolute
                            bottom-0
                            left-0
                            top-0
                            w-[2px]
                            origin-center
                            bg-signal
                          "
                        />


                        <span
                          className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            border
                            transition-colors
                            ${
                              isActive
                                ? 'border-spectral-bright/40 bg-spectral-bright/10'
                                : 'border-void-line group-hover:border-signal/40'
                            }
                          `}
                        >
                          <IconComponent size={15} />
                        </span>


                        <span className="min-w-0 flex-1">

                          <span
                            className="
                              block
                              font-mono
                              text-[10px]
                              tracking-wider
                            "
                          >
                            {group.label}
                          </span>

                          <span
                            className={`
                              mt-1
                              block
                              font-mono
                              text-[7px]
                              ${
                                isActive
                                  ? 'text-spectral-bright/70'
                                  : 'text-ash/60'
                              }
                            `}
                          >
                            {meta.code}
                          </span>

                        </span>


                        <ChevronRight
                          size={12}
                          className={`
                            transition-all
                            duration-300
                            ${
                              isActive
                                ? 'translate-x-0 text-signal'
                                : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                            }
                          `}
                        />

                      </motion.button>
                    );
                  },
                )}

              </div>


              {/* Category description */}
              <AnimatePresence mode="wait">

                <motion.div
                  key={active.id}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="
                    mt-3
                    border
                    border-void-line
                    bg-black/10
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <CategoryIcon
                      size={13}
                      className="text-signal"
                    />

                    <span
                      className="
                        font-mono
                        text-[8px]
                        tracking-[0.2em]
                        text-signal
                      "
                    >
                      {categoryMeta.code}
                    </span>

                  </div>


                  <p
                    className="
                      mt-2
                      font-body
                      text-[10px]
                      leading-5
                      text-ash
                    "
                  >
                    {categoryMeta.description}
                  </p>

                </motion.div>

              </AnimatePresence>

            </div>

          </motion.aside>


          {/* =============================================================== */}
          {/* SKILL PANEL                                                      */}
          {/* =============================================================== */}

          <motion.div
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="
              relative
              overflow-hidden
              border
              border-void-line
              bg-black/10
            "
          >

            {/* ============================================================= */}
            {/* PANEL HEADER                                                   */}
            {/* ============================================================= */}

            <div
              className="
                border-b
                border-void-line
                p-5
                sm:p-6
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                {/* Active category */}
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <motion.div
                    key={active.id}
                    initial={{
                      scale: 0.7,
                      opacity: 0,
                      rotate: -15,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotate: 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 18,
                    }}
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-spectral-bright/40
                      bg-spectral-bright/[0.06]
                    "
                  >
                    <CategoryIcon
                      size={20}
                      className="text-spectral-bright"
                    />
                  </motion.div>


                  <div>

                    <p
                      className="
                        font-mono
                        text-[8px]
                        tracking-[0.25em]
                        text-signal
                      "
                    >
                      ACTIVE CATEGORY
                    </p>


                    <AnimatePresence mode="wait">

                      <motion.h3
                        key={active.id}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                        }}
                        className="
                          mt-1
                          font-display
                          text-xl
                          text-bone
                        "
                      >
                        {active.label}
                      </motion.h3>

                    </AnimatePresence>

                  </div>

                </div>


                {/* Search */}
                <div className="relative sm:w-56">

                  <Search
                    size={13}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-ash
                    "
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Filter capability..."
                    aria-label="Filter capabilities"
                    className="
                      w-full
                      border
                      border-void-line
                      bg-void/60
                      py-2.5
                      pl-9
                      pr-3
                      font-mono
                      text-[9px]
                      text-bone
                      outline-none
                      transition
                      placeholder:text-ash/50
                      focus:border-signal/50
                    "
                  />

                </div>

              </div>


              {/* Metadata */}
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-x-6
                  gap-y-2
                  border-t
                  border-void-line
                  pt-4
                "
              >

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    font-mono
                    text-[8px]
                    text-ash
                  "
                >
                  <Activity
                    size={11}
                    className="text-signal"
                  />

                  {filteredItems.length}
                  {' '}
                  INDEXED
                </span>


                <span
                  className="
                    flex
                    items-center
                    gap-2
                    font-mono
                    text-[8px]
                    text-ash
                  "
                >
                  <Cpu
                    size={11}
                    className="text-spectral-bright"
                  />

                  {categoryMeta.code}
                  {' '}
                  SYSTEM
                </span>


                <span
                  className="
                    ml-auto
                    hidden
                    font-mono
                    text-[8px]
                    text-ash
                    sm:block
                  "
                >
                  CODEX/
                  {String(active.id).toUpperCase()}
                </span>

              </div>

            </div>


            {/* ============================================================= */}
            {/* SKILL GRID                                                     */}
            {/* ============================================================= */}

            <AnimatePresence mode="wait">

              <motion.div
                key={`${active.id}-${search}`}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  grid
                  gap-px
                  bg-void-line
                  sm:grid-cols-2
                "
              >

                {filteredItems.map(
                  (item, index) => (
                    <motion.div
                      key={item}
                      variants={cardReveal}
                      initial="hidden"
                      animate="visible"
                      transition={{
                        delay: Math.min(
                          index * 0.045,
                          0.45,
                        ),
                      }}
                      whileHover={
                        reduceMotion
                          ? {}
                          : {
                              y: -5,
                              backgroundColor:
                                'rgba(255,255,255,0.025)',
                            }
                      }
                      className="
                        group
                        relative
                        overflow-hidden
                        bg-void-raised
                        p-5
                      "
                    >

                      {/* --------------------------------------------------- */}
                      {/* Hover scan                                           */}
                      {/* --------------------------------------------------- */}

                      <motion.div
                        initial={{
                          x: '-120%',
                        }}
                        whileHover={{
                          x: '120%',
                        }}
                        transition={{
                          duration: 0.65,
                        }}
                        className="
                          pointer-events-none
                          absolute
                          left-0
                          top-0
                          h-px
                          w-full
                          bg-gradient-to-r
                          from-transparent
                          via-signal
                          to-transparent
                        "
                      />


                      {/* Bottom energy line */}
                      <span
                        className="
                          absolute
                          bottom-0
                          left-0
                          h-px
                          w-0
                          bg-signal
                          transition-all
                          duration-500
                          group-hover:w-full
                        "
                      />


                      <div
                        className="
                          flex
                          items-center
                          gap-4
                        "
                      >

                        {/* ================================================= */}
                        {/* REAL TECHNOLOGY LOGO                             */}
                        {/* ================================================= */}

                        <motion.div
                          whileHover={
                            reduceMotion
                              ? {}
                              : {
                                  rotate: 5,
                                  scale: 1.12,
                                }
                          }
                          transition={{
                            type: 'spring',
                            stiffness: 350,
                            damping: 16,
                          }}
                          className="
                            relative
                            flex
                            h-14
                            w-14
                            shrink-0
                            items-center
                            justify-center
                            border
                            border-void-line
                            bg-black/30
                            text-bone
                            transition-all
                            duration-300
                            group-hover:border-signal/50
                            group-hover:bg-signal/[0.04]
                          "
                        >

                          <SkillLogo
                            name={item}
                            size={30}
                          />


                          {/* HUD corner top-right */}
                          <span
                            className="
                              absolute
                              -right-px
                              -top-px
                              h-2.5
                              w-2.5
                              border-r
                              border-t
                              border-signal/60
                            "
                          />


                          {/* HUD corner bottom-left */}
                          <span
                            className="
                              absolute
                              -bottom-px
                              -left-px
                              h-2.5
                              w-2.5
                              border-b
                              border-l
                              border-spectral-bright/40
                            "
                          />

                        </motion.div>


                        {/* ================================================= */}
                        {/* NAME                                                */}
                        {/* ================================================= */}

                        <div className="min-w-0 flex-1">

                          <p
                            className="
                              font-display
                              text-base
                              text-bone
                              transition-colors
                              duration-300
                              group-hover:text-spectral-bright
                            "
                          >
                            {item}
                          </p>


                          <div
                            className="
                              mt-2
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <span
                              className="
                                h-px
                                w-5
                                bg-signal/40
                                transition-all
                                duration-300
                                group-hover:w-8
                                group-hover:bg-signal
                              "
                            />

                            <span
                              className="
                                font-mono
                                text-[7px]
                                tracking-[0.2em]
                                text-ash
                              "
                            >
                              VERIFIED STACK
                            </span>

                          </div>

                        </div>


                        {/* ================================================= */}
                        {/* STATUS                                             */}
                        {/* ================================================= */}

                        <motion.div
                          whileHover={
                            reduceMotion
                              ? {}
                              : {
                                  rotate: 90,
                                }
                          }
                          className="
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            border
                            border-void-line
                            text-ash
                            transition-all
                            duration-300
                            group-hover:border-signal/50
                            group-hover:text-signal
                          "
                        >
                          <Check size={11} />
                        </motion.div>

                      </div>


                      {/* =================================================== */}
                      {/* SIGNAL METER                                         */}
                      {/* =================================================== */}

                      <div
                        className="
                          mt-5
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <div className="flex gap-1">

                          {[1, 2, 3, 4].map(
                            (bar) => (
                              <motion.span
                                key={bar}
                                initial={{
                                  scaleX: 0,
                                }}
                                whileInView={{
                                  scaleX: 1,
                                }}
                                viewport={{
                                  once: true,
                                }}
                                transition={{
                                  delay:
                                    index * 0.04 +
                                    bar * 0.05,
                                  duration: 0.25,
                                }}
                                className="
                                  h-[2px]
                                  w-4
                                  origin-left
                                  bg-signal/50
                                "
                              />
                            ),
                          )}

                        </div>


                        <span
                          className="
                            font-mono
                            text-[7px]
                            tracking-wider
                            text-ash
                          "
                        >
                          ACTIVE
                        </span>

                      </div>

                    </motion.div>
                  ),
                )}

              </motion.div>

            </AnimatePresence>


            {/* ============================================================= */}
            {/* EMPTY SEARCH STATE                                             */}
            {/* ============================================================= */}

            {filteredItems.length === 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="p-12 text-center"
              >

                <Terminal
                  size={24}
                  className="mx-auto text-ash"
                />

                <p
                  className="
                    mt-4
                    font-mono
                    text-xs
                    text-bone
                  "
                >
                  NO CAPABILITY FOUND
                </p>

                <p
                  className="
                    mt-2
                    font-body
                    text-xs
                    text-ash
                  "
                >
                  Try another search term.
                </p>

              </motion.div>
            )}


            {/* ============================================================= */}
            {/* FOOTER                                                         */}
            {/* ============================================================= */}

            <div
              className="
                flex
                flex-col
                gap-3
                border-t
                border-void-line
                px-5
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <Sparkles
                  size={12}
                  className="text-signal"
                />

                <span
                  className="
                    font-mono
                    text-[8px]
                    text-ash
                  "
                >
                  SELECT A CATEGORY TO RECONFIGURE
                  THE CODEX
                </span>

              </div>


              <span
                className="
                  font-mono
                  text-[8px]
                  text-spectral-bright
                "
              >
                SYSTEM_READY
              </span>

            </div>

          </motion.div>

        </div>


        {/* ================================================================= */}
        {/* FINAL CODEX STATEMENT                                             */}
        {/* ================================================================= */}

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="
            relative
            mt-16
            overflow-hidden
            border
            border-void-line
            bg-black/10
            p-6
            sm:p-8
          "
        >

          {/* Moving energy beam */}
          <motion.div
            animate={
              reduceMotion
                ? {}
                : {
                    x: [
                      '-120%',
                      '220%',
                    ],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="
              absolute
              left-0
              top-0
              h-px
              w-1/3
              bg-gradient-to-r
              from-transparent
              via-signal
              to-transparent
              transform-gpu
              will-change-transform
            "
          />


          <div
            className="
              flex
              flex-col
              gap-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div
              className="
                flex
                items-start
                gap-4
              "
            >

              <motion.div
                animate={
                  reduceMotion
                    ? {}
                    : {
                        rotate: [
                          0,
                          180,
                          360,
                        ],
                      }
                }
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  border
                  border-signal/30
                  text-signal
                "
              >
                <Layers3 size={17} />
              </motion.div>


              <div>

                <p
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.25em]
                    text-signal
                  "
                >
                  THE REAL SKILL
                </p>


                <p
                  className="
                    mt-2
                    max-w-2xl
                    font-display
                    text-lg
                    text-bone
                  "
                >
                  Knowing the tools is useful.
                  {' '}

                  <span className="text-spectral-bright">
                    Knowing when to combine them
                    is the capability.
                  </span>
                </p>

              </div>

            </div>


            <div
              className="
                flex
                shrink-0
                items-center
                gap-3
                font-mono
                text-[8px]
                text-ash
              "
            >

              <span
                className="
                  h-px
                  w-8
                  bg-signal
                "
              />

              <span>
                BUILD // COMBINE // SHIP
              </span>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}