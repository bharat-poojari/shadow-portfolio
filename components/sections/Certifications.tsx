'use client';

import {
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

import {
  Award,
  BadgeCheck,
  Binary,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Fingerprint,
  LockKeyhole,
  Orbit,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

import {
  certifications,
  achievements,
} from '@/lib/content';


/* ============================================================================
   ANIMATION
============================================================================ */

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: 'blur(10px)',
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};


/* ============================================================================
   CERTIFICATION CARD
============================================================================ */

function ArtifactCard({
  cert,
  index,
  reduceMotion,
}: {
  cert: (typeof certifications)[number];
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 35,
        scale: 0.96,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        delay: index * 0.1,
        duration: 0.65,
        ease: 'easeOut',
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -8,
              rotateX: 2,
              rotateY: index % 2 === 0 ? -1 : 1,
            }
      }
      style={{
        transformStyle: 'preserve-3d',
      }}
      className="
        group
        relative
        min-h-[310px]
        overflow-hidden
        border
        border-void-line
        bg-void-raised
        transition-colors
        duration-500
        hover:border-signal/50
      "
    >

      {/* ================================================================ */}
      {/* HOLOGRAPHIC BACKGROUND                                            */}
      {/* ================================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-40
          transition-opacity
          duration-500
          group-hover:opacity-100
          [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)]
          [background-size:28px_28px]
        "
      />


      {/* Atmospheric glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-52
          w-52
          rounded-full
          bg-signal/10
          blur-[80px]
          opacity-30
          transition-all
          duration-700
          group-hover:scale-150
          group-hover:opacity-60
        "
      />


      {/* ================================================================ */}
      {/* MOVING SCAN                                                     */}
      {/* ================================================================ */}

      <motion.div
        initial={{
          y: '-120%',
        }}
        whileInView={{
          y: '120%',
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 1.4,
          delay: index * 0.12,
          ease: 'easeInOut',
        }}
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          z-20
          h-20
          bg-gradient-to-b
          from-transparent
          via-signal/[0.08]
          to-transparent
        "
      />


      {/* ================================================================ */}
      {/* CORNER SYSTEM                                                    */}
      {/* ================================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-10
          w-10
          border-l
          border-t
          border-signal/40
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          h-10
          w-10
          border-b
          border-r
          border-signal/20
        "
      />


      {/* ================================================================ */}
      {/* CONTENT                                                           */}
      {/* ================================================================ */}

      <div className="relative z-10 flex h-full flex-col p-6">

        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                border
                border-signal/30
                bg-signal/[0.03]
                text-signal
              "
            >

              <Award
                size={14}
                strokeWidth={1.5}
              />

            </div>


            <div>

              <p
                className="
                  font-mono
                  text-[7px]
                  tracking-[0.2em]
                  text-signal
                "
              >
                ARTIFACT
              </p>

              <p
                className="
                  mt-0.5
                  font-mono
                  text-[7px]
                  text-ash
                "
              >
                ID-{String(
                  index + 1,
                ).padStart(3, '0')}
              </p>

            </div>

          </div>


          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: 360,
                  }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="
              text-signal/30
            "
          >

            <Orbit
              size={20}
              strokeWidth={1}
            />

          </motion.div>

        </div>


        {/* Status */}
        <div
          className="
            mt-7
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
                      0.35,
                      1,
                      0.35,
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
              text-[7px]
              tracking-[0.18em]
              text-signal
            "
          >
            VERIFIED ARTIFACT
          </span>

        </div>


        {/* Title */}
        <h3
          className="
            mt-4
            max-w-[18rem]
            font-display
            text-xl
            leading-tight
            text-bone
            transition-colors
            duration-300
            group-hover:text-signal
          "
        >
          {cert.title}
        </h3>


        {/* Issuer */}
        <div className="mt-auto">

          <div
            className="
              mb-5
              mt-8
              h-px
              bg-gradient-to-r
              from-signal/40
              via-void-line
              to-transparent
            "
          />


          <div
            className="
              grid
              grid-cols-2
              gap-4
            "
          >

            <div>

              <p
                className="
                  font-mono
                  text-[7px]
                  tracking-[0.15em]
                  text-ash
                "
              >
                ISSUER
              </p>

              <p
                className="
                  mt-1
                  font-body
                  text-xs
                  text-bone-muted
                "
              >
                {cert.issuer}
              </p>

            </div>


            <div className="text-right">

              <p
                className="
                  font-mono
                  text-[7px]
                  tracking-[0.15em]
                  text-ash
                "
              >
                DATE
              </p>

              <p
                className="
                  mt-1
                  font-mono
                  text-xs
                  text-spectral-bright
                "
              >
                {cert.date}
              </p>

            </div>

          </div>


          {/* Bottom telemetry */}
          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              border-t
              border-void-line
              pt-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Fingerprint
                size={11}
                className="
                  text-ash
                "
              />

              <span
                className="
                  font-mono
                  text-[7px]
                  text-ash
                "
              >
                AUTHENTICATED
              </span>

            </div>


            <ChevronRight
              size={12}
              className="
                text-signal
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />

          </div>

        </div>

      </div>

    </motion.article>
  );
}


/* ============================================================================
   ACHIEVEMENT FEED
============================================================================ */

function AchievementFeed({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      variants={reveal}
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
        bg-void-raised
      "
    >

      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-void-line
          px-5
          py-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              border
              border-ember-bright/30
              text-ember-bright
            "
          >

            <Trophy
              size={14}
            />

          </div>


          <div>

            <p
              className="
                font-mono
                text-[7px]
                tracking-[0.2em]
                text-ash
              "
            >
              ACHIEVEMENT LOG
            </p>

            <p
              className="
                mt-1
                font-display
                text-lg
                text-bone
              "
            >
              Field Records
            </p>

          </div>

        </div>


        <span
          className="
            font-mono
            text-[7px]
            text-signal
          "
        >
          {achievements.length}
          {' '}
          RECORDS
        </span>

      </div>


      {/* Achievement rows */}
      <div>

        {achievements.map(
          (achievement, index) => (
            <motion.div
              key={achievement}
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
                delay: index * 0.07,
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      x: 5,
                    }
              }
              className="
                group
                relative
                flex
                items-start
                gap-4
                border-b
                border-void-line
                px-5
                py-5
                last:border-b-0
              "
            >

              {/* Index */}
              <span
                className="
                  mt-0.5
                  font-mono
                  text-[8px]
                  text-ash/50
                "
              >
                {String(
                  index + 1,
                ).padStart(2, '0')}
              </span>


              {/* Node */}
              <div
                className="
                  mt-1
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-signal/30
                  transition-colors
                  duration-300
                  group-hover:border-signal
                "
              >

                <CheckCircle2
                  size={10}
                  className="
                    text-signal
                  "
                />

              </div>


              {/* Text */}
              <p
                className="
                  flex-1
                  font-body
                  text-sm
                  leading-6
                  text-bone-muted
                  transition-colors
                  duration-300
                  group-hover:text-bone
                "
              >
                {achievement}
              </p>


              <ChevronRight
                size={12}
                className="
                  mt-1
                  text-ash/40
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-signal
                "
              />

            </motion.div>
          ),
        )}

      </div>

    </motion.div>
  );
}


/* ============================================================================
   VAULT TELEMETRY
============================================================================ */

function VaultTelemetry({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      className="
        grid
        gap-px
        border
        border-void-line
        bg-void-line
        sm:grid-cols-3
      "
    >

      {[
        {
          icon: ShieldCheck,
          label: 'AUTHENTICATION',
          value: 'VERIFIED',
        },
        {
          icon: Database,
          label: 'ARTIFACTS',
          value: String(
            certifications.length,
          ).padStart(2, '0'),
        },
        {
          icon: Cpu,
          label: 'SYSTEM STATE',
          value: 'ONLINE',
        },
      ].map(
        (item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -3,
                    }
              }
              className="
                group
                bg-void-raised
                p-5
                transition-colors
                duration-300
                hover:bg-white/[0.015]
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <Icon
                  size={13}
                  className="
                    text-signal
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                <span
                  className="
                    font-mono
                    text-[7px]
                    text-ash
                  "
                >
                  0{index + 1}
                </span>

              </div>


              <p
                className="
                  mt-5
                  font-mono
                  text-[7px]
                  tracking-[0.16em]
                  text-ash
                "
              >
                {item.label}
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
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-signal
                  "
                />

                <span
                  className="
                    font-display
                    text-lg
                    text-bone
                  "
                >
                  {item.value}
                </span>

              </div>

            </motion.div>
          );
        },
      )}

    </motion.div>
  );
}


/* ============================================================================
   MAIN SECTION
============================================================================ */

export function Certifications() {
  const reduceMotion =
    useReducedMotion();


  return (
    <section
      id="certifications"
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
      {/* ATMOSPHERIC BACKGROUND                                             */}
      {/* ================================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >

        {/* Technical grid */}
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
              '52px 52px',
          }}
        />


        {/* Radial field */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)',
            backgroundSize:
              '20px 20px',
          }}
        />


        {/* Green core */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [
                    0,
                    80,
                    0,
                  ],
                  y: [
                    0,
                    -40,
                    0,
                  ],
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
            left-[-15%]
            top-[5%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-signal/10
            blur-[170px]
          "
        />


        {/* Ember core */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [
                    0,
                    -70,
                    0,
                  ],
                  y: [
                    0,
                    40,
                    0,
                  ],
                  scale: [
                    1,
                    1.12,
                    1,
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
            right-[-10%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-ember-bright/10
            blur-[160px]
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
          max-w-5xl
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
                      rotate: 180,
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
                border-signal/50
              "
            >

              <span
                className="
                  font-mono
                  text-lg
                  text-signal
                "
              >
                06
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
                  border-ember-bright
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
                THE ARTIFACT VAULT
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
                証明 // VERIFIED KNOWLEDGE
              </p>

            </div>

          </div>


          <div
            className="
              mt-8
              grid
              gap-10
              lg:grid-cols-[1fr_250px]
              lg:items-end
            "
          >

            <div>

              <h2
                className="
                  max-w-3xl
                  font-display
                  text-3xl
                  leading-[1.08]
                  text-bone
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Knowledge tested.
                <br />

                <span
                  className="
                    text-signal
                  "
                >
                  Capability verified.
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
                Certifications and achievements
                preserved as evidence of completed
                learning, tested capability and
                practical progression.
              </p>

            </div>


            {/* Vault terminal */}
            <div
              className="
                border
                border-void-line
                bg-black/20
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-void-line
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <LockKeyhole
                    size={11}
                    className="
                      text-signal
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
                    VAULT ACCESS
                  </span>

                </div>


                <span
                  className="
                    font-mono
                    text-[7px]
                    text-signal
                  "
                >
                  OPEN
                </span>

              </div>


              <div className="p-4">

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
                    SECURITY
                  </span>

                  <span
                    className="
                      font-mono
                      text-[7px]
                      text-signal
                    "
                  >
                    LEVEL 06
                  </span>

                </div>


                <div
                  className="
                    mt-3
                    flex
                    gap-1
                  "
                >

                  {Array.from({
                    length: 12,
                  }).map(
                    (_, index) => (
                      <motion.span
                        key={index}
                        initial={{
                          scaleY: 0,
                        }}
                        whileInView={{
                          scaleY: 1,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          delay:
                            index *
                            0.035,
                        }}
                        className="
                          h-4
                          flex-1
                          origin-bottom
                          bg-signal
                        "
                      />
                    ),
                  )}

                </div>

              </div>

            </div>

          </div>

        </motion.div>


        {/* ================================================================= */}
        {/* TELEMETRY                                                         */}
        {/* ================================================================= */}

        <div className="mt-12">

          <VaultTelemetry
            reduceMotion={
              Boolean(
                reduceMotion,
              )
            }
          />

        </div>


        {/* ================================================================= */}
        {/* CERTIFICATIONS                                                    */}
        {/* ================================================================= */}

        <div className="mt-12">

          <div
            className="
              mb-6
              flex
              items-center
              justify-between
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <Binary
                size={12}
                className="
                  text-signal
                "
              />

              <span
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.2em]
                  text-ash
                "
              >
                CERTIFICATION ARCHIVE
              </span>

            </div>


            <span
              className="
                font-mono
                text-[7px]
                text-ash
              "
            >
              SCROLL TO ACCESS
            </span>

          </div>


          <div
            className="
              grid
              gap-5
              md:grid-cols-2
              lg:grid-cols-3
            "
          >

            {certifications.map(
              (cert, index) => (
                <ArtifactCard
                  key={cert.id}
                  cert={cert}
                  index={index}
                  reduceMotion={
                    Boolean(
                      reduceMotion,
                    )
                  }
                />
              ),
            )}

          </div>

        </div>


        {/* ================================================================= */}
        {/* ACHIEVEMENTS                                                       */}
        {/* ================================================================= */}

        <div className="mt-16">

          <div
            className="
              mb-6
              flex
              items-center
              gap-3
            "
          >

            <Zap
              size={12}
              className="
                text-ember-bright
              "
            />

            <span
              className="
                font-mono
                text-[8px]
                tracking-[0.2em]
                text-ash
              "
            >
              FIELD ACHIEVEMENTS
            </span>

          </div>


          <AchievementFeed
            reduceMotion={
              Boolean(
                reduceMotion,
              )
            }
          />

        </div>


        {/* ================================================================= */}
        {/* FOOTER SIGNAL                                                      */}
        {/* ================================================================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          className="
            mt-10
            flex
            flex-col
            gap-3
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

            <ScanLine
              size={11}
              className="
                text-signal
              "
            />

            <span
              className="
                font-mono
                text-[7px]
                tracking-[0.16em]
                text-ash
              "
            >
              ARTIFACTS VERIFIED //
              CAPABILITY ARCHIVED
            </span>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
              font-mono
              text-[7px]
              text-ash
            "
          >

            <Sparkles
              size={10}
              className="
                text-ember-bright
              "
            />

            <span>
              NEXT ARC // CONTINUOUS LEARNING
            </span>

          </div>

        </motion.div>

      </div>

    </section>
  );
}