'use client';

import {
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

import {
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDot,
  GraduationCap,
  Languages as LanguagesIcon,
  Network,
  ScanLine,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';

import {
  coursework,
  education,
  internship,
  languages,
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


const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
    },
  },
};


/* ============================================================================
   HELPERS
============================================================================ */

function getLanguageLevel(
  level: string,
): number {
  const normalized =
    level.toLowerCase();

  if (
    normalized.includes('native') ||
    normalized.includes('fluent')
  ) {
    return 100;
  }

  if (
    normalized.includes('professional') ||
    normalized.includes('advanced')
  ) {
    return 85;
  }

  if (
    normalized.includes('intermediate')
  ) {
    return 65;
  }

  if (
    normalized.includes('basic') ||
    normalized.includes('beginner')
  ) {
    return 35;
  }

  /*
   * Unknown proficiency levels should
   * not be invented. Use a neutral visual
   * representation rather than claiming
   * a numeric proficiency.
   */
  return 50;
}


/* ============================================================================
   EDUCATION CARD
============================================================================ */

function EducationCard({
  item,
  index,
  reduceMotion,
}: {
  item: (typeof education)[number];
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        delay: index * 0.12,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -5,
            }
      }
      className="
        group
        relative
        overflow-hidden
        border
        border-void-line
        bg-void-raised
        transition-colors
        duration-500
        hover:border-signal/40
      "
    >

      {/* ================================================================ */}
      {/* HOVER GLOW                                                        */}
      {/* ================================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_0%_0%,rgba(100,255,190,.055),transparent_45%)]
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />


      {/* ================================================================ */}
      {/* TOP SCAN LINE                                                     */}
      {/* ================================================================ */}

      <motion.div
        initial={{
          x: '-120%',
        }}
        whileInView={{
          x: '120%',
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 1.1,
          delay: index * 0.12 + 0.25,
          ease: 'easeInOut',
        }}
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          z-20
          h-px
          w-1/3
          bg-gradient-to-r
          from-transparent
          via-signal
          to-transparent
        "
      />


      <div className="relative z-10">

        {/* ============================================================== */}
        {/* CARD HEADER                                                     */}
        {/* ============================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            border-b
            border-void-line
            p-6
            sm:flex-row
            sm:items-start
            sm:justify-between
            sm:p-7
          "
        >

          <div className="flex items-start gap-4">

            {/* Node */}
            <div
              className="
                relative
                mt-1
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                border
                border-signal/40
                bg-signal/[0.035]
                text-signal
              "
            >

              <GraduationCap
                size={17}
                strokeWidth={1.5}
              />

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-2
                  w-2
                  bg-signal
                "
              />

              <span
                className="
                  absolute
                  -bottom-1
                  -left-1
                  h-2
                  w-2
                  border
                  border-signal/60
                "
              />

            </div>


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
                    text-[8px]
                    tracking-[0.2em]
                    text-signal
                  "
                >
                  TRAINING NODE
                  {' '}
                  {String(
                    index + 1,
                  ).padStart(2, '0')}
                </span>

                <span
                  className="
                    h-px
                    w-5
                    bg-void-line
                  "
                />

                <span
                  className="
                    font-mono
                    text-[8px]
                    text-ash
                  "
                >
                  {item.period}
                </span>

              </div>


              <h3
                className="
                  mt-3
                  font-display
                  text-xl
                  leading-tight
                  text-bone
                  transition-colors
                  duration-300
                  group-hover:text-spectral-bright
                  sm:text-2xl
                "
              >
                {item.qualification}
              </h3>


              <p
                className="
                  mt-2
                  font-body
                  text-sm
                  leading-6
                  text-bone-muted
                "
              >
                {item.institution}
              </p>

            </div>

          </div>


          {/* ============================================================ */}
          {/* RESULT                                                        */}
          {/* ============================================================ */}

          <div
            className="
              shrink-0
              border
              border-void-line
              bg-black/20
              px-4
              py-3
              sm:min-w-[130px]
              sm:text-right
            "
          >

            <p
              className="
                font-mono
                text-[7px]
                tracking-[0.2em]
                text-ash
              "
            >
              OUTCOME
            </p>


            <div
              className="
                mt-2
                flex
                items-center
                gap-2
                sm:justify-end
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
                  text-[10px]
                  text-spectral-bright
                "
              >
                {item.result}
              </span>

            </div>

          </div>

        </div>


        {/* ============================================================== */}
        {/* CARD BODY                                                       */}
        {/* ============================================================== */}

        <div
          className="
            grid
            lg:grid-cols-[1fr_220px]
          "
        >

          <div className="p-6 sm:p-7">

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <BookOpen
                size={13}
                className="text-ember-bright"
              />

              <span
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.18em]
                  text-ash
                "
              >
                ACADEMIC RECORD
              </span>

            </div>


            <div
              className="
                mt-5
                grid
                gap-2
                sm:grid-cols-2
              "
            >

              {[
                'Structured learning',
                'Technical foundation',
                'Problem solving',
                'Applied knowledge',
              ].map(
                (itemText, itemIndex) => (
                  <motion.div
                    key={itemText}
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
                        index * 0.12 +
                        itemIndex * 0.05,
                    }}
                    className="
                      flex
                      items-center
                      gap-3
                      border-l
                      border-void-line
                      py-2
                      pl-3
                      transition-colors
                      duration-300
                      group-hover:border-signal/30
                    "
                  >

                    <Check
                      size={11}
                      className="text-signal"
                    />

                    <span
                      className="
                        font-body
                        text-xs
                        text-bone-muted
                      "
                    >
                      {itemText}
                    </span>

                  </motion.div>
                ),
              )}

            </div>

          </div>


          {/* ============================================================ */}
          {/* RECORD TELEMETRY                                              */}
          {/* ============================================================ */}

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

            <p
              className="
                font-mono
                text-[7px]
                tracking-[0.2em]
                text-ash
              "
            >
              RECORD TELEMETRY
            </p>


            <div className="mt-5">

              <div
                className="
                  flex
                  items-center
                  justify-between
                  font-mono
                  text-[7px]
                "
              >

                <span className="text-ash">
                  STATUS
                </span>

                <span className="text-signal">
                  VERIFIED
                </span>

              </div>


              <div
                className="
                  mt-2
                  flex
                  gap-1
                "
              >

                {Array.from({
                  length: 8,
                }).map(
                  (_, segment) => (
                    <motion.span
                      key={segment}
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
                          index *
                            0.1 +
                          segment *
                            0.045,
                      }}
                      className="
                        h-1
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


            <div
              className="
                mt-7
                border-t
                border-void-line
                pt-4
              "
            >

              <p
                className="
                  font-mono
                  text-[7px]
                  leading-5
                  text-ash/60
                "
              >
                NODE //
                {' '}
                {String(
                  index + 1,
                ).padStart(2, '0')}

                <br />

                PERIOD //
                {' '}
                {item.period}

                <br />

                STATE //
                VERIFIED
              </p>

            </div>

          </div>

        </div>

      </div>

    </motion.article>
  );
}


/* ============================================================================
   COMPLETED INTERNSHIP
============================================================================ */

function InternshipRecord({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.98,
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
        duration: 0.65,
        ease: 'easeOut',
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -5,
            }
      }
      className="
        group
        relative
        mt-16
        overflow-hidden
        border
        border-ember-bright/25
        bg-void-raised
        transition-colors
        duration-500
        hover:border-ember-bright/55
      "
    >
      {/* Ambient hover field */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_100%_0%,rgba(255,120,60,.08),transparent_42%)]
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      {/* Animated scan line */}
      <motion.div
        initial={{
          x: '-120%',
        }}
        whileInView={{
          x: '120%',
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 1.25,
          ease: 'easeInOut',
        }}
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          z-20
          h-px
          w-1/3
          bg-gradient-to-r
          from-transparent
          via-ember-bright
          to-transparent
        "
      />

      <div className="relative z-10">
        <div
          className="
            flex
            flex-col
            gap-5
            border-b
            border-void-line
            p-6
            sm:flex-row
            sm:items-start
            sm:justify-between
            sm:p-7
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                relative
                mt-1
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                border
                border-ember-bright/40
                bg-ember-bright/[0.035]
                text-ember-bright
              "
            >
              <Network
                size={17}
                strokeWidth={1.5}
              />

              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  h-2
                  w-2
                  bg-ember-bright
                "
              />

              <span
                className="
                  absolute
                  -bottom-1
                  -left-1
                  h-2
                  w-2
                  border
                  border-ember-bright/60
                "
              />
            </div>

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
                    text-[8px]
                    tracking-[0.2em]
                    text-ember-bright
                  "
                >
                  PROFESSIONAL TRAINING
                </span>

                <span
                  className="
                    h-px
                    w-5
                    bg-void-line
                  "
                />

                <span
                  className="
                    font-mono
                    text-[8px]
                    text-ash
                  "
                >
                  {internship.period}
                </span>
              </div>

              <h3
                className="
                  mt-3
                  font-display
                  text-xl
                  leading-tight
                  text-bone
                  transition-colors
                  duration-300
                  group-hover:text-ember-bright
                  sm:text-2xl
                "
              >
                Prompt Engineering – Web Development
              </h3>

              <p
                className="
                  mt-2
                  font-body
                  text-sm
                  leading-6
                  text-bone-muted
                "
              >
                {internship.company}
              </p>
            </div>
          </div>

          <div
            className="
              shrink-0
              border
              border-ember-bright/20
              bg-black/20
              px-4
              py-3
              sm:min-w-[145px]
              sm:text-right
            "
          >
            <p
              className="
                font-mono
                text-[7px]
                tracking-[0.2em]
                text-ash
              "
            >
              STATUS
            </p>

            <div
              className="
                mt-2
                flex
                items-center
                gap-2
                sm:justify-end
              "
            >
              <motion.span
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        opacity: [0.35, 1, 0.35],
                        scale: [0.9, 1.15, 0.9],
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
                  bg-ember-bright
                "
              />

              <span
                className="
                  font-mono
                  text-[10px]
                  text-ember-bright
                "
              >
                COMPLETED
              </span>
            </div>
          </div>
        </div>

        <div
          className="
            grid
            lg:grid-cols-[1fr_220px]
          "
        >
          <div className="p-6 sm:p-7">
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Sparkles
                size={13}
                className="text-ember-bright"
              />

              <span
                className="
                  font-mono
                  text-[8px]
                  tracking-[0.18em]
                  text-ash
                "
              >
                INTERNSHIP RECORD
              </span>
            </div>

            <div
              className="
                mt-5
                grid
                gap-2
                sm:grid-cols-2
              "
            >
              {[
                'Prompt engineering',
                'Web development',
                'AI-assisted workflows',
                'Practical project exposure',
              ].map((itemText, index) => (
                <motion.div
                  key={itemText}
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
                    delay: index * 0.06,
                  }}
                  className="
                    flex
                    items-center
                    gap-3
                    border-l
                    border-void-line
                    py-2
                    pl-3
                    transition-colors
                    duration-300
                    group-hover:border-ember-bright/30
                  "
                >
                  <Check
                    size={11}
                    className="text-ember-bright"
                  />

                  <span
                    className="
                      font-body
                      text-xs
                      text-bone-muted
                    "
                  >
                    {itemText}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

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
            <p
              className="
                font-mono
                text-[7px]
                tracking-[0.2em]
                text-ash
              "
            >
              COMPLETION TELEMETRY
            </p>

            <div className="mt-5">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  font-mono
                  text-[7px]
                "
              >
                <span className="text-ash">
                  STATE
                </span>

                <span className="text-ember-bright">
                  COMPLETE
                </span>
              </div>

              <div className="mt-2 flex gap-1">
                {Array.from({ length: 8 }).map(
                  (_, segment) => (
                    <motion.span
                      key={segment}
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
                        delay: segment * 0.045,
                      }}
                      className="
                        h-1
                        flex-1
                        origin-left
                        bg-gradient-to-r
                        from-ember-bright
                        to-signal
                      "
                    />
                  ),
                )}
              </div>
            </div>

            <div
              className="
                mt-7
                border-t
                border-void-line
                pt-4
              "
            >
              <p
                className="
                  font-mono
                  text-[7px]
                  leading-5
                  text-ash/60
                "
              >
                TYPE // INTERNSHIP
                <br />
                ROLE // PROMPT ENGINEERING
                <br />
                DOMAIN // WEB DEVELOPMENT
                <br />
                ORGANIZATION // {internship.company}
                <br />
                PERIOD // {internship.period}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}


/* ============================================================================
   COURSEWORK MATRIX
============================================================================ */

function CourseworkMatrix({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      variants={cardReveal}
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
        p-6
        sm:p-7
      "
    >

      {/* Decorative corner */}
      <div
        className="
          absolute
          right-0
          top-0
          h-20
          w-20
          border-l
          border-b
          border-signal/10
        "
      />


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
            gap-3
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              border
              border-ember-bright/30
              text-ember-bright
            "
          >
            <BrainCircuit
              size={15}
            />
          </div>


          <div>

            <p
              className="
                font-mono
                text-[8px]
                tracking-[0.2em]
                text-ash
              "
            >
              FOUNDATION MATRIX
            </p>

            <p
              className="
                mt-1
                font-display
                text-lg
                text-bone
              "
            >
              Coursework
            </p>

          </div>

        </div>


        <span
          className="
            font-mono
            text-[8px]
            text-ash
          "
        >
          {coursework.length}
          {' '}
          MODULES
        </span>

      </div>


      <div
        className="
          mt-6
          grid
          gap-2
          sm:grid-cols-2
        "
      >

        {coursework.map(
          (course, index) => (
            <motion.div
              key={course}
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay:
                  index * 0.035,
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      x: 3,
                    }
              }
              className="
                group
                flex
                items-center
                gap-3
                border
                border-void-line
                bg-black/10
                px-3
                py-3
                transition-all
                duration-300
                hover:border-signal/30
                hover:bg-white/[0.02]
              "
            >

              <span
                className="
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  border
                  border-void-line
                  text-ash
                  transition-colors
                  group-hover:border-signal/40
                  group-hover:text-signal
                "
              >

                <ChevronRight
                  size={10}
                />

              </span>


              <span
                className="
                  font-mono
                  text-[9px]
                  leading-5
                  text-bone-muted
                  transition-colors
                  group-hover:text-bone
                "
              >
                {course}
              </span>

            </motion.div>
          ),
        )}

      </div>

    </motion.div>
  );
}


/* ============================================================================
   LANGUAGE MATRIX
============================================================================ */

function LanguageMatrix({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      variants={cardReveal}
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
        p-6
        sm:p-7
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
            h-9
            w-9
            items-center
            justify-center
            border
            border-signal/30
            text-signal
          "
        >

          <LanguagesIcon
            size={15}
          />

        </div>


        <div>

          <p
            className="
              font-mono
              text-[8px]
              tracking-[0.2em]
              text-ash
            "
          >
            COMMUNICATION MATRIX
          </p>

          <p
            className="
              mt-1
              font-display
              text-lg
              text-bone
            "
          >
            Languages
          </p>

        </div>

      </div>


      <div className="mt-6 space-y-5">

        {languages.map(
          (language, index) => {
            const percentage =
              getLanguageLevel(
                language.level,
              );

            return (
              <motion.div
                key={language.name}
                initial={{
                  opacity: 0,
                  x: 15,
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
                    index * 0.08,
                }}
              >

                <div
                  className="
                    flex
                    items-baseline
                    justify-between
                    gap-4
                  "
                >

                  <span
                    className="
                      font-display
                      text-base
                      text-bone
                    "
                  >
                    {language.name}
                  </span>


                  <span
                    className="
                      font-mono
                      text-[8px]
                      text-ash
                    "
                  >
                    {language.level}
                  </span>

                </div>


                <div
                  className="
                    mt-2
                    flex
                    gap-1
                  "
                >

                  {Array.from({
                    length: 10,
                  }).map(
                    (_, segment) => {
                      const filled =
                        percentage >=
                        (segment + 1) *
                          10;

                      return (
                        <motion.span
                          key={
                            segment
                          }
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
                                0.08 +
                              segment *
                                0.025,
                          }}
                          className={`
                            h-1.5
                            flex-1
                            origin-bottom
                            ${
                              filled
                                ? 'bg-signal'
                                : 'bg-void-line'
                            }
                          `}
                        />
                      );
                    },
                  )}

                </div>

              </motion.div>
            );
          },
        )}

      </div>

    </motion.div>
  );
}


/* ============================================================================
   MAIN SECTION
============================================================================ */

export function Education() {
  const reduceMotion =
    useReducedMotion();


  return (
    <section
      id="education"
      className="
        relative
        overflow-hidden
        bg-void-raised
        px-5
        py-28
        sm:px-8
        sm:py-36
      "
    >

      {/* ================================================================== */}
      {/* BACKGROUND                                                         */}
      {/* ================================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >

        {/* Grid */}
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


        {/* Dot field */}
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


        {/* Green atmospheric glow */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [
                    0,
                    70,
                    0,
                  ],
                  y: [
                    0,
                    -30,
                    0,
                  ],
                  scale: [
                    1,
                    1.12,
                    1,
                  ],
                  opacity: [
                    0.025,
                    0.06,
                    0.025,
                  ],
                }
          }
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute
            left-[-10%]
            top-[10%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-signal/10
            blur-[150px]
          "
        />


        {/* Ember atmospheric glow */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [
                    0,
                    -60,
                    0,
                  ],
                  scale: [
                    1,
                    1.1,
                    1,
                  ],
                  opacity: [
                    0.02,
                    0.05,
                    0.02,
                  ],
                }
          }
          transition={{
            duration: 15,
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

            {/* Section number */}
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
                05
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
                THE TRAINING ARC
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
                修行 // FOUNDATION ARCHIVE
              </p>

            </div>

          </div>


          {/* Main heading */}
          <div
            className="
              mt-8
              grid
              gap-8
              lg:grid-cols-[1fr_220px]
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
                The foundation behind
                <br />

                <span
                  className="
                    text-signal
                  "
                >
                  the systems.
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
                Every system begins with
                fundamentals. This archive
                records the formal training,
                academic progression and
                foundational disciplines
                behind the work.
              </p>

            </div>


            {/* ============================================================= */}
            {/* HEADER TELEMETRY                                               */}
            {/* ============================================================= */}

            <div
              className="
                border
                border-void-line
                bg-black/20
              "
            >

              <div
                className="
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
                    justify-between
                  "
                >

                  <span
                    className="
                      font-mono
                      text-[7px]
                      tracking-[0.2em]
                      text-ash
                    "
                  >
                    TRAINING STATUS
                  </span>

                  <ScanLine
                    size={11}
                    className="
                      text-signal
                    "
                  />

                </div>

              </div>


              <div className="grid grid-cols-2">

                <div
                  className="
                    border-r
                    border-void-line
                    p-4
                  "
                >

                  <p
                    className="
                      font-mono
                      text-[7px]
                      text-ash
                    "
                  >
                    NODES
                  </p>

                  <p
                    className="
                      mt-1
                      font-display
                      text-2xl
                      text-bone
                    "
                  >
                    {education.length}
                  </p>

                </div>


                <div className="p-4">

                  <p
                    className="
                      font-mono
                      text-[7px]
                      text-ash
                    "
                  >
                    MODULES
                  </p>

                  <p
                    className="
                      mt-1
                      font-display
                      text-2xl
                      text-signal
                    "
                  >
                    {coursework.length}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </motion.div>


        {/* ================================================================= */}
        {/* PROFESSIONAL MILESTONE                                             */}
        {/* ================================================================= */}

        <InternshipRecord
          reduceMotion={Boolean(reduceMotion)}
        />


        {/* ================================================================= */}
        {/* TRAINING DASHBOARD                                                 */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="
            mt-5
            grid
            gap-px
            overflow-hidden
            border
            border-void-line
            bg-void-line
            sm:grid-cols-4
          "
        >
          {[
            {
              label: 'PRO TRAINING',
              value: '01',
              detail: 'COMPLETED',
              icon: Network,
            },
            {
              label: 'EDUCATION NODES',
              value: String(education.length).padStart(2, '0'),
              detail: 'ACADEMIC',
              icon: GraduationCap,
            },
            {
              label: 'FOUNDATION MODULES',
              value: String(coursework.length).padStart(2, '0'),
              detail: 'COURSEWORK',
              icon: BrainCircuit,
            },
            {
              label: 'LANGUAGE NODES',
              value: String(languages.length).padStart(2, '0'),
              detail: 'COMMUNICATION',
              icon: LanguagesIcon,
            },
          ].map((metric, index) => {
            const MetricIcon = metric.icon;

            return (
              <motion.div
                key={metric.label}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
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
                        y: -2,
                      }
                }
                className="
                  group
                  relative
                  overflow-hidden
                  bg-void-raised
                  p-5
                  transition-colors
                  duration-300
                  hover:bg-white/[0.015]
                "
              >
                <div
                  className="
                    absolute
                    right-0
                    top-0
                    h-10
                    w-10
                    border-l
                    border-b
                    border-void-line
                  "
                />

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <MetricIcon
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
                      tracking-[0.15em]
                      text-ash
                    "
                  >
                    0{index + 1}
                  </span>
                </div>

                <p
                  className="
                    mt-5
                    font-display
                    text-2xl
                    text-bone
                  "
                >
                  {metric.value}
                </p>

                <p
                  className="
                    mt-1
                    font-mono
                    text-[7px]
                    tracking-[0.14em]
                    text-ash
                  "
                >
                  {metric.label}
                </p>

                <div
                  className="
                    mt-3
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
                      font-mono
                      text-[7px]
                      text-signal
                    "
                  >
                    {metric.detail}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>


        {/* ================================================================= */}
        {/* EDUCATION TIMELINE                                                */}
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

            <Terminal
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
              ACADEMIC PROGRESSION
            </span>

          </div>


          <div className="relative">

            {/* Timeline rail */}
            <div
              className="
                absolute
                bottom-0
                left-[21px]
                top-0
                w-px
                bg-gradient-to-b
                from-signal
                via-signal/30
                to-transparent
                sm:left-[25px]
              "
            />


            {/* Animated rail */}
            <motion.div
              initial={{
                scaleY: 0,
              }}
              whileInView={{
                scaleY: 1,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
              }}
              className="
                absolute
                bottom-0
                left-[21px]
                top-0
                w-px
                origin-top
                bg-gradient-to-b
                from-signal
                via-ember-bright
                to-transparent
                sm:left-[25px]
              "
            />


            <div
              className="
                flex
                flex-col
                gap-5
              "
            >

              {education.map(
                (item, index) => (
                  <div
                    key={item.id}
                    className="
                      relative
                      pl-12
                      sm:pl-14
                    "
                  >

                    {/* Timeline node */}
                    <motion.div
                      initial={{
                        scale: 0,
                        opacity: 0,
                      }}
                      whileInView={{
                        scale: 1,
                        opacity: 1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay:
                          index * 0.12,
                        duration: 0.35,
                      }}
                      className="
                        absolute
                        left-[13px]
                        top-8
                        z-20
                        flex
                        h-[17px]
                        w-[17px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-signal/50
                        bg-void-raised
                        sm:left-[17px]
                      "
                    >

                      <CircleDot
                        size={7}
                        className="
                          text-signal
                        "
                      />

                    </motion.div>


                    <EducationCard
                      item={item}
                      index={index}
                      reduceMotion={
                        Boolean(
                          reduceMotion,
                        )
                      }
                    />

                  </div>
                ),
              )}

            </div>

          </div>

        </div>


        {/* ================================================================= */}
        {/* TRAINING PATH                                                      */}
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
            amount: 0.2,
          }}
          className="
            mt-8
            flex
            flex-wrap
            items-center
            gap-2
            border-y
            border-void-line
            py-4
          "
        >
          <span
            className="
              font-mono
              text-[7px]
              tracking-[0.18em]
              text-ash
            "
          >
            TRAINING PATH
          </span>

          <ChevronRight
            size={10}
            className="text-signal"
          />

          <span
            className="
              border
              border-ember-bright/30
              px-2
              py-1
              font-mono
              text-[7px]
              text-ember-bright
            "
          >
            PROFESSIONAL INTERNSHIP
          </span>

          <ChevronRight
            size={10}
            className="text-signal"
          />

          <span
            className="
              border
              border-void-line
              px-2
              py-1
              font-mono
              text-[7px]
              text-bone-muted
            "
          >
            FORMAL EDUCATION
          </span>

          <ChevronRight
            size={10}
            className="text-signal"
          />

          <span
            className="
              border
              border-void-line
              px-2
              py-1
              font-mono
              text-[7px]
              text-bone-muted
            "
          >
            FOUNDATION
          </span>

          <span
            className="
              ml-auto
              font-mono
              text-[7px]
              text-signal
            "
          >
            ACTIVE ARC
          </span>
        </motion.div>


        {/* ================================================================= */}
        {/* FOUNDATION MATRICES                                               */}
        {/* ================================================================= */}

        <div
          className="
            mt-16
            grid
            gap-5
            lg:grid-cols-[1.15fr_.85fr]
          "
        >

          <CourseworkMatrix
            reduceMotion={
              Boolean(
                reduceMotion,
              )
            }
          />


          <LanguageMatrix
            reduceMotion={
              Boolean(
                reduceMotion,
              )
            }
          />

        </div>


        {/* ================================================================= */}
        {/* END CAP                                                            */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="
            mt-10
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

            <Zap
              size={12}
              className="
                text-signal
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
              FOUNDATION COMPLETE //
              SYSTEMS READY
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
              LEARN
            </span>

            <ChevronRight
              size={10}
              className="
                text-signal
              "
            />

            <span>
              APPLY
            </span>

            <ChevronRight
              size={10}
              className="
                text-signal
              "
            />

            <span>
              BUILD
            </span>

            <Sparkles
              size={11}
              className="
                text-ember-bright
              "
            />

          </div>

        </motion.div>

      </div>

    </section>
  );
}