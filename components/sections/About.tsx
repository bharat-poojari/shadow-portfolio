'use client';

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Command,
  Download,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  BrainCircuit,
  Sparkles,
  Terminal,
  Target,
  Zap,
  Radio,
  Globe2,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';

import { useRef } from 'react';
import { profile, internship } from '@/lib/content';

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const SOCIALS = [
  {
    name: 'GitHub',
    handle: '@YOUR_USERNAME',
    href: 'https://github.com/YOUR_USERNAME',
    icon: Github,
    description: 'Projects & source code',
  },
  {
    name: 'LinkedIn',
    handle: '/in/YOUR_PROFILE',
    href: 'https://linkedin.com/in/YOUR_PROFILE',
    icon: Linkedin,
    description: 'Professional network',
  },
  {
    name: 'LeetCode',
    handle: '@YOUR_USERNAME',
    href: 'https://leetcode.com/YOUR_USERNAME',
    icon: Code2,
    description: 'Problem solving',
  },
  {
    name: 'Email',
    handle: 'Let’s connect',
    href: 'mailto:YOUR_EMAIL@example.com',
    icon: Mail,
    description: 'Direct communication',
  },
];

const ORIGIN_STATS = [
  {
    value: '∞',
    label: 'Curiosity',
    detail: 'Never idle',
  },
  {
    value: '01',
    label: 'Mindset',
    detail: 'Build first',
  },
  {
    value: 'AI',
    label: 'Direction',
    detail: 'Human × Machine',
  },
];

const ORIGIN_PHASES = [
  {
    number: '01',
    label: 'DISCOVER',
    text: 'Curiosity became a desire to understand how things work.',
  },
  {
    number: '02',
    label: 'CREATE',
    text: 'Ideas started turning into interfaces, systems and applications.',
  },
  {
    number: '03',
    label: 'CONNECT',
    text: 'Software became a way to combine engineering with intelligence.',
  },
  {
    number: '04',
    label: 'EVOLVE',
    text: 'The next chapter is about building things that matter.',
  },
];

const CURRENT_FOCUS = [
  {
    icon: Code2,
    title: 'Building',
    text: 'Turning ideas into real software instead of leaving them as concepts.',
  },
  {
    icon: BrainCircuit,
    title: 'Exploring AI',
    text: 'Experimenting with intelligent systems and practical AI integration.',
  },
  {
    icon: Rocket,
    title: 'Shipping',
    text: 'Learning through projects, iteration, failures and finished products.',
  },
  {
    icon: Target,
    title: 'Creating Impact',
    text: 'Focusing on technology that solves actual problems.',
  },
];

const COMMAND_WIDGETS = [
  {
    id: 'mission',
    label: 'ACTIVE MISSION',
    icon: Target,
    title: 'Build → Integrate → Ship',
    description:
      'Turning ideas into useful full-stack applications with intelligent AI features.',
    status: 'IN PROGRESS',
  },
  {
    id: 'availability',
    label: 'COLLABORATION',
    icon: Globe2,
    title: 'Open to opportunities',
    description:
      'Interested in meaningful projects, internships, freelance work and developer collaborations.',
    status: 'AVAILABLE',
  },
  {
    id: 'build',
    label: 'BUILD QUEUE',
    icon: Command,
    title: 'Next objective',
    description:
      'Keep improving real-world applications while exploring stronger AI-powered workflows.',
    status: 'QUEUED',
  },
  {
    id: 'signal',
    label: 'DEVELOPER SIGNAL',
    icon: Radio,
    title: 'Online & Building',
    description:
      'Currently focused on creating, experimenting, learning and shipping.',
    status: 'ACTIVE',
  },
];

const QUICK_ACTIONS = [
  {
    label: 'SOURCE',
    title: 'GitHub',
    href: 'https://github.com/YOUR_USERNAME',
    icon: Github,
  },
  {
    label: 'NETWORK',
    title: 'LinkedIn',
    href: 'https://linkedin.com/in/YOUR_PROFILE',
    icon: Linkedin,
  },
  {
    label: 'PROFILE',
    title: 'Resume',
    href: '/resume.pdf',
    icon: FileText,
  },
  {
    label: 'CONTACT',
    title: 'Message',
    href: 'mailto:YOUR_EMAIL@example.com',
    icon: MessageSquare,
  },
];

/* -------------------------------------------------------------------------- */
/* ANIMATION                                                                  */
/* -------------------------------------------------------------------------- */

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
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

const revealLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -45,
    filter: 'blur(8px)',
  },

  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: 'easeOut',
    },
  },
};

const revealRight: Variants = {
  hidden: {
    opacity: 0,
    x: 45,
    filter: 'blur(8px)',
  },

  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: 'easeOut',
    },
  },
};

const stagger: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* ------------------------------------------------------------------------ */
  /* SCROLL EFFECTS                                                           */
  /* ------------------------------------------------------------------------ */

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['-8%', '18%'],
  );

  const commandCenterY = useTransform(
    scrollYProgress,
    [0, 1],
    [50, -50],
  );

  const commandCenterRotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-1.5, 0, 1.5],
  );

  const progressScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  /* ------------------------------------------------------------------------ */
  /* MOUSE EFFECT                                                             */
  /* ------------------------------------------------------------------------ */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 70,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 70,
    damping: 20,
  });

  function handleMouseMove(
    event: React.MouseEvent<HTMLElement>,
  ) {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x * 35);
    mouseY.set(y * 35);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-void px-5 py-28 sm:px-8 sm:py-36"
    >
      {/* ================================================================== */}
      {/* GLOBAL ATMOSPHERE                                                  */}
      {/* ================================================================== */}

      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0"
      >
        {/* Main technical grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Fine dot grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Atmospheric glow 1 */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  scale: [1, 1.15, 1],
                  opacity: [0.06, 0.12, 0.06],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-[-10%] top-[5%] h-[500px] w-[500px] rounded-full bg-signal/10 blur-[140px]"
        />

        {/* Atmospheric glow 2 */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  scale: [1.1, 1, 1.1],
                  opacity: [0.05, 0.11, 0.05],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute right-[-10%] top-[20%] h-[550px] w-[550px] rounded-full bg-spectral-bright/10 blur-[160px]"
        />

        {/* Bottom atmosphere */}
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.025] blur-[150px]" />
      </motion.div>

      {/* Scanline layer */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:100%_4px]" />

      {/* Mouse-reactive energy field */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="pointer-events-none absolute left-1/2 top-[25%] z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-spectral-bright/[0.035] blur-[120px]"
      />

      {/* Scroll progress rail */}
      <motion.div
        style={{
          scaleY: progressScale,
          transformOrigin: 'top',
        }}
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-30 hidden w-px bg-gradient-to-b from-signal via-spectral-bright to-transparent lg:block"
      />

      <div className="relative z-20 mx-auto max-w-7xl">

        {/* ================================================================= */}
        {/* TOP HUD                                                           */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{
                rotate: 90,
                scale: 1.1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
              className="relative flex h-12 w-12 items-center justify-center border border-signal/60"
            >
              <span className="font-mono text-lg text-signal">
                02
              </span>

              <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-signal" />

              <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-spectral-bright" />
            </motion.div>

            <div>
              <p className="hud-label text-xs tracking-[0.3em] text-signal">
                THE ORIGIN
              </p>

              <p className="mt-1 font-mono text-[9px] tracking-[0.25em] text-ash">
                起源 // CHARACTER ARC
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <motion.span
              animate={
                reduceMotion
                  ? {}
                  : {
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
              }}
              className="h-2 w-2 rounded-full bg-signal"
            />

            <span className="font-mono text-[10px] tracking-[0.2em] text-ash">
              STATUS: BUILDING FUTURE
            </span>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* HERO                                                             */}
        {/* ================================================================= */}

        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">

          {/* ----------------------------------------------------------------- */}
          {/* LEFT — ORIGIN STORY                                              */}
          {/* ----------------------------------------------------------------- */}

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={revealLeft}>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-ash">
                Character Introduction
              </p>

              <h2 className="font-display text-4xl leading-[1.05] text-bone sm:text-5xl lg:text-6xl">
                Every developer
                <br />
                has an origin.
                <br />

                <motion.span
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          opacity: [0.7, 1, 0.7],
                        }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-spectral-bright"
                >
                  This is mine.
                </motion.span>
              </h2>
            </motion.div>

            <motion.p
              variants={revealLeft}
              className="mt-7 font-body text-sm text-spectral-bright/70"
            >
              「すべての開発者には起源がある。これは私の物語だ。」
            </motion.p>

            {/* Origin log */}
            <motion.div
              variants={revealLeft}
              className="relative mt-10 overflow-hidden border border-void-line bg-black/20 p-6 backdrop-blur-sm"
            >
              <motion.div
                animate={
                  reduceMotion
                    ? {}
                    : {
                        y: ['-100%', '300%'],
                      }
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="pointer-events-none absolute left-0 top-0 h-20 w-px bg-gradient-to-b from-transparent via-signal to-transparent"
              />

              <div className="mb-5 flex items-center gap-3">
                <Terminal
                  size={15}
                  className="text-signal"
                />

                <p className="hud-label text-[10px] tracking-[0.2em] text-signal">
                  ORIGIN LOG
                </p>

                <span className="h-px flex-1 bg-void-line" />
              </div>

              <p className="font-body text-sm leading-7 text-bone-muted">
                {profile.aboutLine}
              </p>

              <p className="mt-4 font-body text-sm leading-7 text-bone-muted">
                I started with curiosity — the simple desire to understand
                how things work and how ideas can become real. That curiosity
                gradually became a passion for software engineering.
              </p>

              <p className="mt-4 font-body text-sm leading-7 text-bone-muted">
                What began as exploration became a habit of building,
                experimenting and learning. Today, that same curiosity drives
                me toward full-stack development, AI and creating useful
                digital experiences.
              </p>
            </motion.div>

            {/* Origin stats */}
            <motion.div
              variants={stagger}
              className="mt-5 grid grid-cols-3 gap-2"
            >
              {ORIGIN_STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={reveal}
                  whileHover={{
                    y: -8,
                    scale: 1.04,
                    borderColor: 'rgba(120,110,255,.55)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 18,
                  }}
                  className="group relative overflow-hidden border border-void-line bg-black/20 p-4 text-center"
                >
                  <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />

                  <motion.p
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            opacity: [0.75, 1, 0.75],
                          }
                    }
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="font-display text-2xl text-spectral-bright"
                  >
                    {stat.value}
                  </motion.p>

                  <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-bone">
                    {stat.label}
                  </p>

                  <p className="mt-1 font-mono text-[8px] text-ash">
                    {stat.detail}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ----------------------------------------------------------------- */}
          {/* RIGHT — DEVELOPER COMMAND CENTER                                 */}
          {/* ----------------------------------------------------------------- */}

          <motion.div
            style={{
              y: commandCenterY,
              rotate: commandCenterRotate,
            }}
            variants={revealRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="relative mx-auto w-full max-w-[620px]"
          >
            {/* Main dashboard */}
            <div className="relative overflow-hidden border border-spectral-bright/25 bg-[#05070d]/90 backdrop-blur-md">

              {/* Moving top scan line */}
              <motion.div
                animate={
                  reduceMotion
                    ? {}
                    : {
                        x: ['-100%', '300%'],
                      }
                }
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="pointer-events-none absolute left-0 top-0 z-20 h-px w-1/3 bg-gradient-to-r from-transparent via-signal to-transparent"
              />

              {/* Corner brackets */}
              <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-signal/70" />
              <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-signal/70" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-signal/40" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-signal/40" />

              {/* Dashboard header */}
              <div className="flex items-center justify-between border-b border-void-line px-5 py-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            rotate: 360,
                          }
                    }
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="flex h-9 w-9 items-center justify-center border border-signal/40"
                  >
                    <Command
                      size={15}
                      className="text-signal"
                    />
                  </motion.div>

                  <div>
                    <p className="font-mono text-[8px] tracking-[0.25em] text-ash">
                      DEVELOPER COMMAND CENTER
                    </p>

                    <p className="mt-1 font-display text-sm text-bone">
                      ORIGIN // SYSTEM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.span
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.15, 0.8],
                          }
                    }
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                    }}
                    className="h-2 w-2 rounded-full bg-signal"
                  />

                  <span className="font-mono text-[8px] tracking-wider text-signal">
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Telemetry */}
              <div className="grid grid-cols-3 border-b border-void-line">
                <div className="border-r border-void-line p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Activity
                      size={12}
                      className="text-signal"
                    />

                    <span className="font-mono text-[8px] text-ash">
                      STATE
                    </span>
                  </div>

                  <p className="font-display text-sm text-bone">
                    BUILDING
                  </p>
                </div>

                <div className="border-r border-void-line p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock3
                      size={12}
                      className="text-spectral-bright"
                    />

                    <span className="font-mono text-[8px] text-ash">
                      MODE
                    </span>
                  </div>

                  <p className="font-display text-sm text-bone">
                    FOCUS
                  </p>
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck
                      size={12}
                      className="text-signal"
                    />

                    <span className="font-mono text-[8px] text-ash">
                      SIGNAL
                    </span>
                  </div>

                  <p className="font-display text-sm text-spectral-bright">
                    ACTIVE
                  </p>
                </div>
              </div>

              {/* Command widgets */}
              <motion.div
                variants={stagger}
                className="grid gap-px bg-void-line sm:grid-cols-2"
              >
                {COMMAND_WIDGETS.map((widget, index) => {
                  const Icon = widget.icon;

                  return (
                    <motion.div
                      key={widget.id}
                      variants={reveal}
                      whileHover={{
                        y: -4,
                        backgroundColor:
                          'rgba(255,255,255,0.025)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="group relative overflow-hidden bg-[#05070d] p-5"
                    >
                      <div className="absolute bottom-0 left-0 h-px w-0 bg-signal transition-all duration-700 group-hover:w-full" />

                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center border border-void-line text-spectral-bright transition duration-300 group-hover:border-signal group-hover:text-signal">
                          <Icon size={15} />
                        </div>

                        <span className="font-mono text-[7px] text-ash">
                          0{index + 1}
                        </span>
                      </div>

                      <p className="font-mono text-[8px] tracking-[0.2em] text-signal">
                        {widget.label}
                      </p>

                      <h3 className="mt-2 font-display text-base text-bone">
                        {widget.title}
                      </h3>

                      <p className="mt-2 font-body text-[11px] leading-5 text-bone-muted">
                        {widget.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="flex items-center gap-2 font-mono text-[7px] tracking-wider text-ash">
                          <span className="h-1.5 w-1.5 rounded-full bg-signal" />

                          {widget.status}
                        </span>

                        <ArrowUpRight
                          size={13}
                          className="text-ash transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Activity stream */}
              <div className="border-t border-void-line p-5">
                <div className="mb-4 flex items-center gap-3">
                  <Terminal
                    size={13}
                    className="text-signal"
                  />

                  <span className="font-mono text-[8px] tracking-[0.25em] text-signal">
                    ACTIVITY STREAM
                  </span>

                  <span className="h-px flex-1 bg-void-line" />
                </div>

                <div className="space-y-3 font-mono text-[9px]">

                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                    className="flex gap-3"
                  >
                    <span className="text-signal">
                      01
                    </span>

                    <span className="text-bone-muted">
                      Exploring better ways to integrate AI into software.
                    </span>

                    <span className="ml-auto hidden text-ash sm:block">
                      NOW
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                    className="flex gap-3"
                  >
                    <span className="text-spectral-bright">
                      02
                    </span>

                    <span className="text-bone-muted">
                      Building and refining full-stack applications.
                    </span>

                    <span className="ml-auto hidden text-ash sm:block">
                      ACTIVE
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.4,
                    }}
                    className="flex gap-3"
                  >
                    <span className="text-ash">
                      03
                    </span>

                    <span className="text-bone-muted">
                      Learning through experimentation and shipping.
                    </span>

                    <span className="ml-auto hidden text-ash sm:block">
                      LOOP
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="border-t border-void-line p-5">
                <div className="mb-4 flex items-center gap-3">
                  <Zap
                    size={13}
                    className="text-signal"
                  />

                  <span className="font-mono text-[8px] tracking-[0.25em] text-signal">
                    QUICK ACCESS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;

                    return (
                      <motion.a
                        key={action.title}
                        href={action.href}
                        target={
                          action.href.startsWith('/')
                            ? undefined
                            : '_blank'
                        }
                        rel={
                          action.href.startsWith('/')
                            ? undefined
                            : 'noopener noreferrer'
                        }
                        whileHover={{
                          x: 4,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        className="group flex items-center gap-3 border border-void-line bg-black/10 p-3 transition hover:border-signal/50 hover:bg-signal/[0.03]"
                      >
                        <Icon
                          size={14}
                          className="text-spectral-bright transition group-hover:text-signal"
                        />

                        <div className="min-w-0">
                          <p className="font-mono text-[7px] tracking-wider text-ash">
                            {action.label}
                          </p>

                          <p className="truncate font-display text-xs text-bone">
                            {action.title}
                          </p>
                        </div>

                        <ChevronRight
                          size={12}
                          className="ml-auto text-ash transition group-hover:translate-x-1 group-hover:text-signal"
                        />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Floating status */}
            <motion.div
              animate={
                reduceMotion
                  ? {}
                  : {
                      y: [0, -6, 0],
                    }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-5 -right-2 hidden border border-signal/30 bg-[#070914]/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:block"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={15}
                  className="text-signal"
                />

                <div>
                  <p className="font-mono text-[7px] tracking-[0.2em] text-ash">
                    SYSTEM MESSAGE
                  </p>

                  <p className="mt-1 font-display text-xs text-bone">
                    Ready to build.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ================================================================= */}
        {/* ORIGIN SEQUENCE                                                   */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-32"
        >
          <div className="mb-8 flex items-center gap-4">
            <p className="hud-label text-[10px] tracking-[0.25em] text-signal">
              ORIGIN SEQUENCE
            </p>

            <span className="h-px flex-1 bg-void-line" />

            <span className="font-mono text-[8px] text-ash">
              001 → ∞
            </span>
          </div>

          <motion.div
            variants={stagger}
            className="grid gap-px border border-void-line bg-void-line md:grid-cols-2 lg:grid-cols-4"
          >
            {ORIGIN_PHASES.map((phase, index) => (
              <motion.div
                key={phase.number}
                variants={reveal}
                whileHover={{
                  y: -8,
                  backgroundColor:
                    'rgba(255,255,255,0.025)',
                }}
                className="group relative overflow-hidden bg-void p-6"
              >
                <div className="absolute left-0 top-0 h-px w-0 bg-signal transition-all duration-700 group-hover:w-full" />

                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-signal">
                    {phase.number}
                  </span>

                  <ArrowUpRight
                    size={14}
                    className="text-ash transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal"
                  />
                </div>

                <h3 className="font-display text-lg text-bone">
                  {phase.label}
                </h3>

                <p className="mt-3 font-body text-xs leading-6 text-bone-muted">
                  {phase.text}
                </p>

                <div className="mt-6 h-px bg-void-line">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    whileInView={{
                      width: '55%',
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.15,
                      duration: 0.8,
                    }}
                    className="h-px bg-spectral-bright"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ================================================================= */}
        {/* CONNECT                                                           */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-24"
        >
          <div className="mb-6 flex items-center gap-4">
            <p className="hud-label text-[10px] tracking-[0.25em] text-signal">
              CONNECT WITH ME
            </p>

            <span className="h-px flex-1 bg-void-line" />

            <p className="hidden font-mono text-[8px] text-ash sm:block">
              つながる // CONNECT
            </p>
          </div>

          <motion.div
            variants={stagger}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {SOCIALS.map((social) => {
              const Icon = social.icon;

              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target={
                    social.href.startsWith('mailto:')
                      ? undefined
                      : '_blank'
                  }
                  rel={
                    social.href.startsWith('mailto:')
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  variants={reveal}
                  whileHover={{
                    y: -9,
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="group relative overflow-hidden border border-void-line bg-black/20 p-5 transition-colors duration-500 hover:border-spectral-bright/50 hover:bg-spectral-bright/[0.03]"
                >
                  <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-signal/10 blur-2xl transition-all duration-500 group-hover:scale-[2]" />

                  <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-signal/20 transition-all duration-500 group-hover:h-full group-hover:w-full" />

                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-void-line bg-void text-spectral-bright transition duration-300 group-hover:border-signal group-hover:text-signal">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base text-bone">
                        {social.name}
                      </p>

                      <p className="mt-0.5 truncate font-mono text-[9px] text-spectral-bright">
                        {social.handle}
                      </p>

                      <p className="mt-1 font-body text-[9px] text-ash">
                        {social.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="text-ash transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal"
                    />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ================================================================= */}
        {/* CURRENT MISSION + TERMINAL                                        */}
        {/* ================================================================= */}

        <div className="mt-20 grid gap-5 lg:grid-cols-2">

          {/* Current mission */}
          <motion.div
            variants={revealLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="relative overflow-hidden border border-void-line bg-black/10 p-6 sm:p-8"
          >
            <div className="absolute right-0 top-0 h-20 w-20 border-r border-t border-signal/20" />

            <div className="mb-8 flex items-center gap-3">
              <Sparkles
                size={15}
                className="text-signal"
              />

              <p className="hud-label text-[10px] tracking-[0.2em] text-signal">
                CURRENT MISSION
              </p>
            </div>

            <h3 className="font-display text-2xl text-bone">
              Build things worth remembering.
            </h3>

            <p className="mt-4 max-w-lg font-body text-sm leading-7 text-bone-muted">
              The current chapter is about turning curiosity into useful
              software — combining engineering, creativity and AI to create
              experiences that solve real problems.
            </p>

            <div className="mt-8 space-y-4">
              {CURRENT_FOCUS.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.5,
                    }}
                    whileHover={{
                      x: 7,
                    }}
                    className="group flex gap-4 border-b border-void-line pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-void-line text-spectral-bright transition duration-300 group-hover:border-signal group-hover:text-signal">
                      <Icon size={15} />
                    </div>

                    <div>
                      <h4 className="font-display text-sm text-bone">
                        {item.title}
                      </h4>

                      <p className="mt-1 font-body text-xs leading-5 text-bone-muted">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Developer terminal */}
          <motion.div
            variants={revealRight}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="relative overflow-hidden border border-void-line bg-[#030508] p-6 sm:p-8"
          >
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal
                  size={15}
                  className="text-signal"
                />

                <p className="hud-label text-[10px] tracking-[0.2em] text-signal">
                  DEVELOPER LOG
                </p>
              </div>

              <div className="flex gap-1.5">
                <motion.span
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          opacity: [0.4, 1, 0.4],
                        }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="h-2 w-2 rounded-full bg-red-400/60"
                />

                <span className="h-2 w-2 rounded-full bg-yellow-400/60" />

                <span className="h-2 w-2 rounded-full bg-green-400/60" />
              </div>
            </div>

            <div className="font-mono text-xs leading-7 text-bone-muted">
              <p>
                <span className="text-signal">
                  &gt;
                </span>{' '}
                whoami
              </p>

              <p className="text-spectral-bright">
                developer@future:~$
              </p>

              <p className="mt-3">
                <span className="text-signal">
                  &gt;
                </span>{' '}
                origin --status
              </p>

              <p className="text-bone">
                curiosity ........ ACTIVE
              </p>

              <p className="text-bone">
                creativity ....... ACTIVE
              </p>

              <p className="text-bone">
                learning ......... ACTIVE
              </p>

              <p className="mt-3">
                <span className="text-signal">
                  &gt;
                </span>{' '}
                mission --current
              </p>

              <p className="text-bone">
                Build meaningful software.
              </p>

              <p className="text-bone">
                Integrate intelligence.
              </p>

              <p className="text-bone">
                Create real-world impact.
              </p>

              <p className="mt-3">
                <span className="text-signal">
                  &gt;
                </span>{' '}
                status
              </p>

              <p className="text-signal">
                ● ON A MISSION
              </p>

              <p className="mt-3">
                <span className="text-signal">
                  &gt;
                </span>{' '}
                next
              </p>

              <p className="text-spectral-bright">
                Keep building...
              </p>

              <motion.span
                animate={
                  reduceMotion
                    ? {}
                    : {
                        opacity: [1, 0, 1],
                      }
                }
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                }}
                className="ml-1 inline-block h-3 w-1 bg-signal align-middle"
              />
            </div>

            <motion.div
              animate={
                reduceMotion
                  ? {}
                  : {
                      scale: [1, 1.3, 1],
                      opacity: [0.03, 0.08, 0.03],
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-signal blur-[70px]"
            />
          </motion.div>
        </div>

        {/* ================================================================= */}
        {/* RESUME + FIELD EXPERIENCE                                        */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto]"
        >
          {/* Resume */}
          <motion.div
            whileHover={{
              y: -5,
            }}
            className="group relative overflow-hidden border border-spectral-bright/30 bg-spectral-bright/[0.025] p-6 sm:p-8"
          >
            <div className="absolute left-0 top-0 h-px w-0 bg-signal transition-all duration-700 group-hover:w-full" />

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-5">
                <motion.div
                  whileHover={{
                    rotate: -8,
                    scale: 1.08,
                  }}
                  className="flex h-14 w-14 shrink-0 items-center justify-center border border-spectral-bright/30 text-spectral-bright"
                >
                  <FileText size={24} />
                </motion.div>

                <div>
                  <p className="hud-label text-[10px] text-signal">
                    RESUME FILE
                  </p>

                  <h3 className="mt-1 font-display text-xl text-bone">
                    Developer_Resume.pdf
                  </h3>

                  <p className="mt-1 font-mono text-[9px] text-ash">
                    EXPERIENCE // PROJECTS // CONTACT
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex items-center gap-2 border border-spectral-bright/50 bg-spectral-bright/10 px-5 py-3 font-mono text-[10px] tracking-wider text-spectral-bright transition hover:bg-spectral-bright hover:text-void"
                >
                  <FileText size={14} />

                  VIEW RESUME

                  <ExternalLink
                    size={12}
                    className="transition group-hover/btn:translate-x-1"
                  />
                </a>

                <a
                  href="/resume.pdf"
                  download="Developer-Resume.pdf"
                  className="flex items-center gap-2 border border-void-line px-5 py-3 font-mono text-[10px] tracking-wider text-bone transition hover:border-signal hover:text-signal"
                >
                  <Download size={14} />

                  DOWNLOAD
                </a>
              </div>
            </div>
          </motion.div>

          {/* Internship */}
          <motion.div
            whileHover={{
              y: -5,
            }}
            className="group border border-void-line bg-black/10 p-6 sm:min-w-[290px]"
          >
            <div className="flex items-center gap-3">
              <BriefcaseBusiness
                size={16}
                className="text-signal"
              />

              <p className="hud-label text-[10px] text-signal">
                FIELD EXPERIENCE
              </p>
            </div>

            <p className="mt-4 font-display text-lg text-bone">
              Prompt Engineering
            </p>

            <p className="mt-1 font-body text-xs text-bone-muted">
              {internship.company}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-px w-8 bg-signal" />

              <p className="font-mono text-[9px] text-ash">
                {internship.period}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ================================================================= */}
        {/* FINAL ORIGIN CTA                                                 */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
          }}
          className="relative mt-24 overflow-hidden border border-void-line p-8 text-center sm:p-12"
        >
          {/* Moving light */}
          <motion.div
            animate={
              reduceMotion
                ? {}
                : {
                    x: ['-100%', '300%'],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="pointer-events-none absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-signal to-transparent"
          />

          <motion.div
            animate={
              reduceMotion
                ? {}
                : {
                    rotate: 360,
                  }
            }
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-spectral-bright/20"
          >
            <Radio
              size={18}
              className="text-spectral-bright"
            />
          </motion.div>

          <p className="font-mono text-[9px] tracking-[0.35em] text-ash">
            ORIGIN ARC
          </p>

          <h3 className="mt-3 font-display text-2xl text-bone sm:text-3xl">
            The story is still being written.
          </h3>

          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-6 text-bone-muted">
            This is only the beginning. The next chapter is another system
            to build, another problem to solve and another idea to bring to
            life.
          </p>

          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-void-line" />

            <ArrowDownRight
              size={14}
              className="text-signal"
            />

            <span className="font-mono text-[8px] tracking-[0.25em] text-signal">
              CONTINUES...
            </span>

            <span className="h-px w-12 bg-void-line" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}