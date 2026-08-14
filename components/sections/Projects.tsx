'use client';

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';

import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Code2,
  Command,
  Database,
  ExternalLink,
  Filter,
  Github,
  Globe2,
  Layers3,
  Network,
  Play,
  Radio,
  Rocket,
  Search,
  Server,
  Sparkles,
  Terminal,
  X,
  Zap,
} from 'lucide-react';

import { Icon } from '@iconify/react';

import {
  useMemo,
  useState,
} from 'react';

import { projects } from '@/lib/content';


/* ============================================================================
   TYPES
============================================================================ */

type ProjectCategory =
  (typeof projects)[number]['category'];

type FilterCategory =
  | 'all'
  | ProjectCategory;

type SortMode =
  | 'default'
  | 'newest'
  | 'stack'
  | 'alphabetical';


/* ============================================================================
   CATEGORY CONFIG
============================================================================ */

const categoryConfig: Record<
  ProjectCategory,
  {
    label: string;
    short: string;
    description: string;
    icon: typeof BrainCircuit;
  }
> = {
  flagship: {
    label: 'Flagship — 3D Commerce',
    short: 'FLAGSHIP',
    description:
      'High-fidelity interactive product experiences.',
    icon: Layers3,
  },

  ai: {
    label: 'AI / Offline Intelligence',
    short: 'AI',
    description:
      'Intelligent systems, automation and AI interfaces.',
    icon: BrainCircuit,
  },

  frontend: {
    label: 'Frontend / Performance',
    short: 'FRONTEND',
    description:
      'Interactive interfaces engineered for usability and speed.',
    icon: Globe2,
  },

  tooling: {
    label: 'Developer Tooling',
    short: 'TOOLING',
    description:
      'Engineering systems and developer productivity tools.',
    icon: Terminal,
  },

  evolution: {
    label: 'Personal Evolution',
    short: 'EVOLUTION',
    description:
      'Experiments documenting technical progression.',
    icon: Sparkles,
  },
};


/* ============================================================================
   TECHNOLOGY ICONS
============================================================================ */

const technologyIcons: Record<string, string> = {
  javascript: 'logos:javascript',
  typescript: 'logos:typescript',

  react: 'logos:react',
  'react.js': 'logos:react',

  nextjs: 'logos:nextjs-icon',
  'next.js': 'logos:nextjs-icon',

  node: 'logos:nodejs-icon',
  nodejs: 'logos:nodejs-icon',
  'node.js': 'logos:nodejs-icon',

  express: 'simple-icons:express',

  mongodb: 'logos:mongodb-icon',
  mongo: 'logos:mongodb-icon',

  mysql: 'logos:mysql',
  postgresql: 'logos:postgresql',
  postgres: 'logos:postgresql',

  firebase: 'logos:firebase',

  python: 'logos:python',

  php: 'logos:php',

  java: 'logos:java',

  html: 'logos:html-5',
  html5: 'logos:html-5',

  css: 'logos:css-3',
  css3: 'logos:css-3',

  tailwind: 'logos:tailwindcss-icon',
  tailwindcss: 'logos:tailwindcss-icon',
  'tailwind css': 'logos:tailwindcss-icon',

  bootstrap: 'logos:bootstrap',

  vite: 'logos:vitejs',

  threejs: 'logos:threejs',
  'three.js': 'logos:threejs',

  docker: 'logos:docker-icon',

  git: 'logos:git-icon',

  github: 'mdi:github',

  figma: 'logos:figma',

  graphql: 'logos:graphql',

  prisma: 'logos:prisma',

  redux: 'logos:redux',

  postman: 'logos:postman-icon',

  linux: 'logos:linux-tux',

  openai: 'simple-icons:openai',
};


function normalizeTechnology(
  value: string,
) {
  return value
    .trim()
    .toLowerCase();
}


function TechnologyIcon({
  name,
}: {
  name: string;
}) {
  const key =
    normalizeTechnology(name);

  const icon =
    technologyIcons[key];

  if (!icon) {
    return (
      <Code2
        size={13}
        strokeWidth={1.5}
      />
    );
  }

  return (
    <Icon
      icon={icon}
      width={15}
      height={15}
      aria-hidden="true"
    />
  );
}


/* ============================================================================
   ANIMATION
============================================================================ */

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(10px)',
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: 'easeOut',
    },
  },
};


/* ============================================================================
   PROJECT CARD
============================================================================ */

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const reduceMotion =
    useReducedMotion();

  const mouseX =
    useMotionValue(0);

  const mouseY =
    useMotionValue(0);

  const rotateX = useSpring(
    useTransform(
      mouseY,
      [-0.5, 0.5],
      [5, -5],
    ),
    {
      stiffness: 220,
      damping: 25,
    },
  );

  const rotateY = useSpring(
    useTransform(
      mouseX,
      [-0.5, 0.5],
      [-5, 5],
    ),
    {
      stiffness: 220,
      damping: 25,
    },
  );

  const spotlightX =
    useTransform(
      mouseX,
      [-0.5, 0.5],
      ['0%', '100%'],
    );

  const spotlightY =
    useTransform(
      mouseY,
      [-0.5, 0.5],
      ['0%', '100%'],
    );

  const spotlight =
    useMotionTemplate`
      radial-gradient(
        420px circle at
        ${spotlightX} ${spotlightY},
        rgba(255,255,255,.055),
        transparent 70%
      )
    `;


  function handlePointerMove(
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (reduceMotion) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    mouseX.set(
      (event.clientX - rect.left) /
        rect.width -
        0.5,
    );

    mouseY.set(
      (event.clientY - rect.top) /
        rect.height -
        0.5,
    );
  }


  function resetPointer() {
    mouseX.set(0);
    mouseY.set(0);
  }


  const CategoryIcon =
    categoryConfig[
      project.category
    ].icon;


  return (
    <motion.article
      layout
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.08,
      }}
      transition={{
        duration: 0.55,
        delay: Math.min(
          index * 0.07,
          0.35,
        ),
      }}
      style={{
        perspective: 1200,
      }}
      className="relative"
    >

      <motion.div
        onPointerMove={
          handlePointerMove
        }
        onPointerLeave={
          resetPointer
        }
        style={{
          rotateX:
            reduceMotion
              ? 0
              : rotateX,
          rotateY:
            reduceMotion
              ? 0
              : rotateY,
        }}
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -4,
                scale: 1.008,
              }
        }
        className={`
          group
          relative
          overflow-hidden
          border
          bg-void-raised
          transition-colors
          duration-500
          border-void-line
          hover:border-ember-bright/40
        `}
      >

        {/* -------------------------------------------------------------- */}
        {/* SPOTLIGHT                                                      */}
        {/* -------------------------------------------------------------- */}

        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              reduceMotion
                ? undefined
                : spotlight,
          }}
        />


        {/* -------------------------------------------------------------- */}
        {/* ACTIVE TOP BAR                                                 */}
        {/* -------------------------------------------------------------- */}

        <motion.div
          initial={{
            scaleX: 0,
          }}
          animate={{
            scaleX: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            absolute
            left-0
            right-0
            top-0
            z-20
            h-px
            origin-left
            bg-gradient-to-r
            from-ember-bright
            via-signal
            to-transparent
          "
        />

        {/* -------------------------------------------------------------- */}
        {/* CARD CONTENT                                                    */}
        {/* -------------------------------------------------------------- */}

        <div className="relative z-20">

          {/* Header */}
          <div
            className="
              flex
              flex-col
              gap-5
              border-b
              border-void-line
              p-6
              sm:p-7
              lg:flex-row
              lg:items-start
              lg:justify-between
            "
          >

            <div className="min-w-0">

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                <span
                  className="
                    font-mono
                    text-[9px]
                    tracking-[0.2em]
                    text-ember-bright
                  "
                >
                  MISSION{' '}
                  {String(
                    project.order,
                  ).padStart(2, '0')}
                </span>

                <span className="h-px w-6 bg-void-line" />

                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    font-mono
                    text-[8px]
                    tracking-[0.15em]
                    text-ash
                  "
                >
                  <CategoryIcon
                    size={12}
                  />

                  {
                    categoryConfig[
                      project.category
                    ].short
                  }
                </span>

              </div>


              <motion.h3
                animate={{
                  x: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  mt-4
                  font-display
                  text-2xl
                  leading-tight
                  text-bone
                  transition-colors
                  duration-300
                  group-hover:text-spectral-bright
                  sm:text-3xl
                "
              >
                {project.title}
              </motion.h3>


              <p
                className="
                  mt-2
                  max-w-2xl
                  font-body
                  text-sm
                  leading-6
                  text-bone-muted
                "
              >
                {project.subtitle}
              </p>

            </div>

          </div>


          {/* Body */}
          <div
            className="
              grid
              lg:grid-cols-[1fr_230px]
            "
          >

            <div className="p-6 sm:p-7">

              {/* Capabilities */}
              <div
                className="
                  grid
                  gap-2
                  sm:grid-cols-2
                "
              >

                {project.points.map(
                  (
                    point,
                    pointIndex,
                  ) => (
                    <motion.div
                      key={point}
                      initial={{
                        opacity: 0,
                        x: -8,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay:
                          pointIndex *
                          0.04,
                      }}
                      className="
                        flex
                        gap-3
                        border-l
                        border-void-line
                        py-1.5
                        pl-3
                        transition-colors
                        duration-300
                        group-hover:border-ember-bright/30
                      "
                    >

                      <Check
                        size={12}
                        className="
                          mt-0.5
                          shrink-0
                          text-signal
                        "
                      />

                      <span
                        className="
                          font-body
                          text-xs
                          leading-5
                          text-bone-muted
                        "
                      >
                        {point}
                      </span>

                    </motion.div>
                  ),
                )}

              </div>


              {/* Stack */}
              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-2
                  border-t
                  border-void-line
                  pt-5
                "
              >

                {project.stack.map(
                  (tech) => (
                    <motion.span
                      key={tech}
                      whileHover={
                        reduceMotion
                          ? undefined
                          : {
                              y: -3,
                              scale: 1.04,
                            }
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        border
                        border-void-line
                        bg-black/20
                        px-2.5
                        py-1.5
                        font-mono
                        text-[9px]
                        text-ash
                        transition-all
                        duration-300
                        hover:border-signal/50
                        hover:text-bone
                      "
                    >
                      <TechnologyIcon
                        name={tech}
                      />

                      {tech}
                    </motion.span>
                  ),
                )}

              </div>


              {/* Actions */}
              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-2
                "
              >

                {project.githubUrl && (
                  <a
                    href={
                      project.githubUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      border
                      border-void-line
                      px-3
                      py-2
                      font-mono
                      text-[9px]
                      text-bone-muted
                      transition-all
                      duration-300
                      hover:border-spectral-bright/60
                      hover:text-spectral-bright
                    "
                  >
                    <Github
                      size={13}
                    />

                    SOURCE

                    <ArrowUpRight
                      size={10}
                    />
                  </a>
                )}


                {project.liveUrl && (
                  <a
                    href={
                      project.liveUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      border
                      border-signal/40
                      bg-signal/[0.04]
                      px-3
                      py-2
                      font-mono
                      text-[9px]
                      text-signal
                      transition-all
                      duration-300
                      hover:bg-signal/10
                      hover:text-bone
                    "
                  >
                    <Play
                      size={10}
                      fill="currentColor"
                    />

                    LIVE SYSTEM
                  </a>
                )}

              </div>

            </div>


            {/* ------------------------------------------------------------ */}
            {/* TELEMETRY                                                    */}
            {/* ------------------------------------------------------------ */}

            <div
              className="
                border-t
                border-void-line
                bg-black/10
                p-6
                lg:border-l
                lg:border-t-0
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.2em]
                    text-ash
                  "
                >
                  TELEMETRY
                </span>

                <motion.div
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          rotate: 360,
                        }
                  }
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Radio
                    size={12}
                    className="text-signal"
                  />
                </motion.div>

              </div>


              {/* Status */}
              <div className="mt-7">

                <span
                  className="
                    font-mono
                    text-[7px]
                    text-ash
                  "
                >
                  ACCESS
                </span>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-2
                  "
                >

                  <motion.span
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: [
                              0.25,
                              1,
                              0.25,
                            ],
                          }
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-signal
                    "
                  />

                  <span
                    className="
                      font-mono
                      text-[8px]
                      text-signal
                    "
                  >
                    AVAILABLE
                  </span>

                </div>

              </div>


              {/* Stack depth */}
              <div className="mt-6">

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span
                    className="
                      font-mono
                      text-[7px]
                      text-ash
                    "
                  >
                    STACK DEPTH
                  </span>

                  <span
                    className="
                      font-mono
                      text-[8px]
                      text-bone
                    "
                  >
                    {
                      project.stack.length
                    }
                  </span>

                </div>


                <div
                  className="
                    mt-2
                    flex
                    gap-1
                  "
                >

                  {project.stack.map(
                    (_, stackIndex) => (
                      <motion.span
                        key={stackIndex}
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
                            stackIndex *
                            0.05,
                        }}
                        className="
                          h-1
                          min-w-0
                          flex-1
                          origin-left
                          bg-gradient-to-r
                          from-signal
                          to-ember-bright
                        "
                      />
                    ),
                  )}

                </div>

              </div>


              {/* Category */}
              <div className="mt-6">

                <span
                  className="
                    font-mono
                    text-[7px]
                    text-ash
                  "
                >
                  CLASS
                </span>

                <p
                  className="
                    mt-1
                    font-mono
                    text-[9px]
                    text-bone
                  "
                >
                  {
                    categoryConfig[
                      project.category
                    ].short
                  }
                </p>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </motion.article>
  );
}



/* ============================================================================
   MAIN PROJECT SECTION
============================================================================ */

export function Projects() {
  const reduceMotion =
    useReducedMotion();

  const [
    activeCategory,
    setActiveCategory,
  ] =
    useState<FilterCategory>('all');

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    sortMode,
    setSortMode,
  ] =
    useState<SortMode>('default');


  /* --------------------------------------------------------------------------
     COUNTS
  -------------------------------------------------------------------------- */

  const counts = useMemo(
    () => ({
      total: projects.length,

      live: projects.filter(
        (project) =>
          Boolean(project.liveUrl),
      ).length,

      source: projects.filter(
        (project) =>
          Boolean(project.githubUrl),
      ).length,

      categories:
        new Set(
          projects.map(
            (project) =>
              project.category,
          ),
        ).size,
    }),
    [],
  );


  /* --------------------------------------------------------------------------
     FILTER + SEARCH + SORT
  -------------------------------------------------------------------------- */

  const visibleProjects =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      let result =
        projects.filter(
          (project) => {

            const categoryMatch =
              activeCategory ===
                'all' ||
              project.category ===
                activeCategory;

            if (!categoryMatch) {
              return false;
            }

            if (!query) {
              return true;
            }

            const searchable = [
              project.title,
              project.subtitle,
              project.category,
              ...project.points,
              ...project.stack,
            ]
              .join(' ')
              .toLowerCase();

            return searchable.includes(
              query,
            );
          },
        );


      result = [
        ...result,
      ];


      switch (sortMode) {
        case 'newest':
          return result.sort(
            (a, b) =>
              b.order - a.order,
          );

        case 'stack':
          return result.sort(
            (a, b) =>
              b.stack.length -
              a.stack.length,
          );

        case 'alphabetical':
          return result.sort(
            (a, b) =>
              a.title.localeCompare(
                b.title,
              ),
          );

        default:
          return result.sort(
            (a, b) =>
              a.order - b.order,
          );
      }
    }, [
      activeCategory,
      search,
      sortMode,
    ]);


  return (
    <section
      id="projects"
      className="
        relative
        overflow-hidden
        bg-void
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

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
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
            backgroundSize:
              '50px 50px',
          }}
        />


        <div
          className="
            absolute
            inset-0
            opacity-[0.02]
          "
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)',
            backgroundSize:
              '22px 22px',
          }}
        />


        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 80, 0],
                  y: [0, -40, 0],
                  scale: [
                    1,
                    1.15,
                    1,
                  ],
                  opacity: [
                    0.025,
                    0.07,
                    0.025,
                  ],
                }
          }
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute
            right-[-12%]
            top-[10%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-ember-bright/10
            blur-[170px]
          "
        />


        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -70, 0],
                  y: [0, 50, 0],
                  scale: [
                    1,
                    1.1,
                    1,
                  ],
                  opacity: [
                    0.02,
                    0.055,
                    0.02,
                  ],
                }
          }
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute
            bottom-[-15%]
            left-[-12%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-signal/10
            blur-[170px]
          "
        />

      </div>


      {/* Scanlines */}
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

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
        "
      >

        {/* ================================================================= */}
        {/* HEADER                                                            */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <motion.div
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      rotate: 90,
                      scale: 1.08,
                    }
              }
              className="
                relative
                flex
                h-12
                w-12
                items-center
                justify-center
                border
                border-ember-bright/60
              "
            >

              <span
                className="
                  font-display
                  text-lg
                  text-ember-bright
                "
              >
                04
              </span>

              <span
                className="
                  absolute
                  -bottom-1
                  -right-1
                  h-2
                  w-2
                  bg-ember-bright
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
                  border-signal
                "
              />

            </motion.div>


            <div>

              <p
                className="
                  hud-label
                  text-xs
                  tracking-[0.3em]
                  text-ember-bright
                "
              >
                THE CAMPAIGNS
              </p>

              <p
                className="
                  mt-1
                  font-mono
                  text-[8px]
                  tracking-[0.25em]
                  text-ash
                "
              >
                戦歴 // SYSTEM ARCHIVE
              </p>

            </div>

          </div>


          <div
            className="
              mt-8
              grid
              gap-8
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
                  leading-[1.04]
                  text-bone
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Ideas are cheap.
                <br />

                <span className="text-ember-bright">
                  Systems are evidence.
                </span>
              </h2>


              <p
                className="
                  mt-6
                  max-w-2xl
                  font-body
                  text-sm
                  leading-7
                  text-bone-muted
                "
              >
                A living archive of systems,
                experiments and engineering
                campaigns — built to demonstrate
                decisions, implementation and
                technical range.
              </p>

            </div>


            {/* ============================================================= */}
            {/* COMMAND TELEMETRY                                             */}
            {/* ============================================================= */}

            <div
              className="
                grid
                grid-cols-2
                border
                border-void-line
                bg-black/20
                sm:grid-cols-4
                lg:grid-cols-2
              "
            >

              <StatWidget
                icon={Layers3}
                label="MISSIONS"
                value={counts.total}
              />

              <StatWidget
                icon={Radio}
                label="LIVE"
                value={counts.live}
                signal
              />

              <StatWidget
                icon={Github}
                label="SOURCE"
                value={counts.source}
              />

              <StatWidget
                icon={Network}
                label="CLASSES"
                value={counts.categories}
              />

            </div>

          </div>

        </motion.div>


        {/* ================================================================= */}
        {/* COMMAND BAR                                                       */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          className="mt-12"
        >

          <div
            className="
              border
              border-void-line
              bg-black/20
            "
          >

            {/* Top command header */}
            <div
              className="
                flex
                flex-col
                gap-3
                border-b
                border-void-line
                p-3
                sm:flex-row
                sm:items-center
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-2
                "
              >

                <Command
                  size={13}
                  className="text-signal"
                />

                <span
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.2em]
                    text-ash
                  "
                >
                  CAMPAIGN_COMMAND
                </span>

              </div>


              {/* Search */}
              <div
                className="
                  relative
                  flex-1
                "
              >

                <Search
                  size={13}
                  className="
                    pointer-events-none
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
                  placeholder="Search campaigns, technologies, capabilities..."
                  className="
                    w-full
                    border
                    border-void-line
                    bg-void
                    py-2.5
                    pl-9
                    pr-9
                    font-mono
                    text-[9px]
                    text-bone
                    outline-none
                    placeholder:text-ash/50
                    focus:border-signal/50
                  "
                />

                {search && (
                  <button
                    onClick={() =>
                      setSearch('')
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-ash
                      hover:text-bone
                    "
                  >
                    <X size={12} />
                  </button>
                )}

              </div>


              {/* Sort */}
              <div className="relative">

                <select
                  value={sortMode}
                  onChange={(event) =>
                    setSortMode(
                      event.target.value as SortMode,
                    )
                  }
                  className="
                    appearance-none
                    border
                    border-void-line
                    bg-void
                    py-2.5
                    pl-3
                    pr-8
                    font-mono
                    text-[8px]
                    text-ash
                    outline-none
                    focus:border-signal/50
                  "
                >
                  <option value="default">
                    DEFAULT ORDER
                  </option>

                  <option value="newest">
                    REVERSE ORDER
                  </option>

                  <option value="stack">
                    STACK DEPTH
                  </option>

                  <option value="alphabetical">
                    A → Z
                  </option>
                </select>

                <ChevronDown
                  size={11}
                  className="
                    pointer-events-none
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    text-ash
                  "
                />

              </div>

            </div>


            {/* Filters */}
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-1
                p-2
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-2
                  font-mono
                  text-[7px]
                  text-ash
                "
              >
                <Filter size={10} />
                FILTER
              </div>


              <FilterButton
                active={
                  activeCategory ===
                  'all'
                }
                onClick={() =>
                  setActiveCategory(
                    'all',
                  )
                }
                label="ALL"
                count={
                  projects.length
                }
              />


              {(
                Object.keys(
                  categoryConfig,
                ) as ProjectCategory[]
              ).map(
                (category) => {

                  const count =
                    projects.filter(
                      (project) =>
                        project.category ===
                        category,
                    ).length;

                  return (
                    <FilterButton
                      key={category}
                      active={
                        activeCategory ===
                        category
                      }
                      onClick={() =>
                        setActiveCategory(
                          category,
                        )
                      }
                      label={
                        categoryConfig[
                          category
                        ].short
                      }
                      count={count}
                    />
                  );
                },
              )}


              <span
                className="
                  ml-auto
                  hidden
                  px-3
                  font-mono
                  text-[8px]
                  text-ash
                  sm:block
                "
              >
                {visibleProjects.length}
                {' '}
                RECORDS
              </span>

            </div>

          </div>

        </motion.div>


        {/* ================================================================= */}
        {/* ACTIVE CATEGORY DESCRIPTION                                       */}
        {/* ================================================================= */}

        <AnimatePresence mode="wait">

          <motion.div
            key={activeCategory}
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
              mt-5
              flex
              items-center
              gap-3
            "
          >

            <CircleDot
              size={11}
              className="text-ember-bright"
            />

            <span
              className="
                font-mono
                text-[8px]
                tracking-[0.12em]
                text-ash
              "
            >
              {activeCategory ===
              'all'
                ? 'ALL CAMPAIGNS'
                : categoryConfig[
                    activeCategory
                  ].description}
            </span>

          </motion.div>

        </AnimatePresence>


        {/* ================================================================= */}
        {/* PROJECTS                                                          */}
        {/* ================================================================= */}

        <motion.div
          layout
          className="mt-7 space-y-4"
        >

          <AnimatePresence
            mode="popLayout"
          >

            {visibleProjects.map(
              (
                project,
                index,
              ) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ),
            )}

          </AnimatePresence>


          {/* Empty state */}
          {visibleProjects.length ===
            0 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="
                flex
                min-h-[220px]
                flex-col
                items-center
                justify-center
                border
                border-dashed
                border-void-line
                text-center
              "
            >

              <Search
                size={22}
                className="text-ash"
              />

              <p
                className="
                  mt-4
                  font-mono
                  text-[9px]
                  tracking-[0.2em]
                  text-bone
                "
              >
                NO RECORDS FOUND
              </p>

              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory(
                    'all',
                  );
                }}
                className="
                  mt-4
                  border
                  border-void-line
                  px-4
                  py-2
                  font-mono
                  text-[8px]
                  text-ash
                  hover:border-signal/50
                  hover:text-signal
                "
              >
                RESET COMMAND
              </button>

            </motion.div>
          )}


          {/* =============================================================== */}
          {/* RESERVED SLOT                                                   */}
          {/* =============================================================== */}

          {activeCategory ===
            'all' &&
            !search && (
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                }}
                className="
                  relative
                  overflow-hidden
                  border
                  border-dashed
                  border-void-line
                  p-8
                "
              >

                <motion.div
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          x: [
                            '-100%',
                            '200%',
                          ],
                        }
                  }
                  transition={{
                    duration: 4,
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
                  "
                />


                <div
                  className="
                    flex
                    flex-col
                    items-center
                    text-center
                  "
                >

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      border
                      border-void-line
                    "
                  >
                    <Network
                      size={17}
                      className="text-ash"
                    />
                  </div>


                  <p
                    className="
                      mt-4
                      font-mono
                      text-[8px]
                      tracking-[0.25em]
                      text-ash
                    "
                  >
                    06 // RESERVED
                  </p>


                  <p
                    className="
                      mt-2
                      font-display
                      text-lg
                      text-bone-muted
                    "
                  >
                    Next campaign pending.
                  </p>

                </div>

              </motion.div>
            )}

        </motion.div>


        {/* ================================================================= */}
        {/* FOOTER SYSTEM STATUS                                              */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
          }}
          className="
            mt-12
            flex
            flex-col
            gap-4
            border-t
            border-void-line
            pt-5
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

            <motion.span
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scale: [
                        1,
                        1.35,
                        1,
                      ],
                    }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
              }}
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-signal
              "
            />

            <span
              className="
                font-mono
                text-[8px]
                tracking-[0.18em]
                text-ash
              "
            >
              ARCHIVE ONLINE //
              {' '}
              {visibleProjects.length}
              {' '}
              ACTIVE RECORDS
            </span>

          </div>


          <div
            className="
              flex
              items-center
              gap-3
              font-mono
              text-[8px]
              text-ash
            "
          >

            <span>
              BUILD
            </span>

            <ChevronRight
              size={10}
              className="text-signal"
            />

            <span>
              TEST
            </span>

            <ChevronRight
              size={10}
              className="text-signal"
            />

            <span>
              SHIP
            </span>

            <Zap
              size={11}
              className="text-ember-bright"
            />

          </div>

        </motion.div>

      </div>

    </section>
  );
}


/* ============================================================================
   STAT WIDGET
============================================================================ */

function StatWidget({
  icon: IconComponent,
  label,
  value,
  signal = false,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
  signal?: boolean;
}) {
  return (
    <div
      className="
        border-r
        border-b
        border-void-line
        px-4
        py-3
        last:border-r-0
        sm:px-5
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <IconComponent
          size={11}
          className={
            signal
              ? 'text-signal'
              : 'text-ash'
          }
        />

        <span
          className="
            font-mono
            text-[7px]
            tracking-[0.16em]
            text-ash
          "
        >
          {label}
        </span>

      </div>


      <p
        className={`
          mt-1
          font-display
          text-xl
          ${
            signal
              ? 'text-signal'
              : 'text-bone'
          }
        `}
      >
        {value}
      </p>

    </div>
  );
}


/* ============================================================================
   FILTER BUTTON
============================================================================ */

function FilterButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{
        scale: 0.96,
      }}
      onClick={onClick}
      className={`
        flex
        items-center
        gap-2
        px-3
        py-2
        font-mono
        text-[8px]
        tracking-wider
        transition-all
        duration-300
        ${
          active
            ? 'bg-ember-bright text-void'
            : 'text-ash hover:bg-white/[0.04] hover:text-bone'
        }
      `}
    >

      <span>
        {label}
      </span>

      <span
        className={`
          text-[7px]
          ${
            active
              ? 'text-void/60'
              : 'text-ash/50'
          }
        `}
      >
        {count}
      </span>

    </motion.button>
  );
}