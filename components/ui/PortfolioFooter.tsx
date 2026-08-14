'use client';

import {
  ArrowUp,
  ChevronRight,
  Code2,
  Mail,
  MapPin,
  Navigation as NavigationIcon,
  Radio,
  Sparkles,
  Terminal,
} from 'lucide-react';

import {
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

import { profile } from '@/lib/content';


/* ============================================================================
   ANIMATION
============================================================================ */

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(8px)',
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
   FOOTER
============================================================================ */

export function PortfolioFooter() {
  const reduceMotion =
    useReducedMotion();


  const currentYear =
    new Date().getFullYear();


  return (
    <footer
      id="footer"
      className="
        relative
        overflow-hidden
        border-t
        border-void-line
        bg-void
        px-5
        pb-8
        pt-20
        sm:px-8
        sm:pt-24
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
                rgba(255,255,255,.7) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.7) 1px,
                transparent 1px
              )
            `,
            backgroundSize:
              '52px 52px',
          }}
        />


        {/* Dot field */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
          "
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)',
            backgroundSize:
              '22px 22px',
          }}
        />


        {/* Scanlines */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.015]
            [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px)]
            [background-size:100%_4px]
          "
        />


        {/* Atmospheric signal */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [
                    0,
                    100,
                    0,
                  ],
                  opacity: [
                    0.02,
                    0.055,
                    0.02,
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
            left-[10%]
            top-[-30%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-signal/10
            blur-[170px]
          "
        />

      </div>


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
        {/* FINAL TRANSMISSION                                                */}
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
            grid
            gap-12
            lg:grid-cols-[1.4fr_0.6fr]
            lg:items-end
          "
        >

          {/* Main closing statement */}
          <div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  border
                  border-signal/40
                  text-signal
                "
              >

                <Terminal
                  size={14}
                  strokeWidth={1.5}
                />

                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    h-1.5
                    w-1.5
                    bg-signal
                  "
                />

              </div>


              <div>

                <p
                  className="
                    font-mono
                    text-[8px]
                    tracking-[0.25em]
                    text-signal
                  "
                >
                  SYSTEM TERMINAL
                </p>

                <p
                  className="
                    mt-1
                    font-mono
                    text-[7px]
                    tracking-[0.15em]
                    text-ash
                  "
                >
                  SESSION COMPLETE
                </p>

              </div>

            </div>


            <h2
              className="
                mt-8
                max-w-3xl
                font-display
                text-3xl
                leading-[1.05]
                text-bone
                sm:text-4xl
                lg:text-5xl
              "
            >
              Built with curiosity.
              <br />

              <span
                className="
                  text-signal
                "
              >
                Driven by systems.
              </span>
            </h2>


            <p
              className="
                mt-6
                max-w-xl
                font-body
                text-sm
                leading-7
                text-bone-muted
              "
            >
              This portfolio is a living record of
              experiments, systems, projects and
              continuous evolution.
            </p>

          </div>


          {/* Terminal status */}
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

                <Radio
                  size={11}
                  className="text-signal"
                />

                <span
                  className="
                    font-mono
                    text-[7px]
                    tracking-[0.18em]
                    text-ash
                  "
                >
                  SYSTEM STATUS
                </span>

              </div>


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

            </div>


            <div className="p-4">

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
                  PORTFOLIO
                </span>

                <span className="text-signal">
                  ONLINE
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
                  length: 14,
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
                          index * 0.035,
                      }}
                      className="
                        h-3
                        flex-1
                        origin-bottom
                        bg-signal
                      "
                    />
                  ),
                )}

              </div>


              <div
                className="
                  mt-4
                  border-t
                  border-void-line
                  pt-3
                  font-mono
                  text-[7px]
                  leading-5
                  text-ash
                "
              >
                NODE // PORTFOLIO
                <br />
                STATUS // ACTIVE
                <br />
                ARC // CONTINUING
              </div>

            </div>

          </div>

        </motion.div>


        {/* ================================================================= */}
        {/* NAVIGATION                                                        */}
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
            mt-16
            grid
            gap-8
            border-y
            border-void-line
            py-8
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {/* Navigation */}
          <div>

            <p
              className="
                mb-4
                font-mono
                text-[8px]
                tracking-[0.2em]
                text-ash
              "
            >
              NAVIGATION
            </p>

            <div className="space-y-2">

              {[
                ['01', 'Hero', '#hero'],
                ['02', 'Origin', '#about'],
                ['03', 'Codex', '#skills'],
                ['04', 'Campaigns', '#projects'],
                ['05', 'Training Arc', '#education'],
                ['06', 'Artifact Vault', '#certifications'],
                ['07', 'Next Arc', '#contact'],
              ].map(
                ([number, label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      font-mono
                      text-[8px]
                      text-ash
                      transition-colors
                      duration-300
                      hover:text-signal
                    "
                  >

                    <span
                      className="
                        text-ash/40
                      "
                    >
                      {number}
                    </span>

                    <span>
                      {label}
                    </span>

                    <ChevronRight
                      size={9}
                      className="
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-1
                        group-hover:opacity-100
                      "
                    />

                  </a>
                ),
              )}

            </div>

          </div>


          {/* Connect */}
          <div>

            <p
              className="
                mb-4
                font-mono
                text-[8px]
                tracking-[0.2em]
                text-ash
              "
            >
              CONNECT
            </p>

            <div className="space-y-3">

              <a
                href={`mailto:${profile.email}`}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  font-mono
                  text-[8px]
                  text-ash
                  transition-colors
                  hover:text-signal
                "
              >

                <Mail
                  size={11}
                />

                <span>
                  Email
                </span>

              </a>


              <a
                href={`tel:${profile.phone}`}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  font-mono
                  text-[8px]
                  text-ash
                  transition-colors
                  hover:text-signal
                "
              >

                <NavigationIcon
  size={11}
/>
                <span>
                  Direct Contact
                </span>

              </a>


              <a
                href="#contact"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  font-mono
                  text-[8px]
                  text-ash
                  transition-colors
                  hover:text-signal
                "
              >

                <Radio
                  size={11}
                />

                <span>
                  Transmission
                </span>

              </a>

            </div>

          </div>


          {/* Location */}
          <div>

            <p
              className="
                mb-4
                font-mono
                text-[8px]
                tracking-[0.2em]
                text-ash
              "
            >
              CURRENT NODE
            </p>

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <MapPin
                size={12}
                className="
                  mt-0.5
                  shrink-0
                  text-signal
                "
              />

              <div>

                <p
                  className="
                    font-body
                    text-sm
                    text-bone-muted
                  "
                >
                  {profile.location}
                </p>

                <p
                  className="
                    mt-2
                    font-mono
                    text-[7px]
                    leading-5
                    text-ash
                  "
                >
                  NODE ACTIVE
                  <br />
                  OPEN TO COLLABORATION
                </p>

              </div>

            </div>

          </div>


          {/* Return */}
          <div>

            <p
              className="
                mb-4
                font-mono
                text-[8px]
                tracking-[0.2em]
                text-ash
              "
            >
              RETURN
            </p>

            <a
              href="#hero"
              className="
                group
                inline-flex
                items-center
                gap-3
                border
                border-void-line
                bg-black/10
                px-4
                py-3
                font-mono
                text-[8px]
                text-ash
                transition-all
                duration-300
                hover:border-signal/40
                hover:bg-signal/[0.025]
                hover:text-signal
              "
            >

              <ArrowUp
                size={12}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-1
                "
              />

              BACK TO ORIGIN

            </a>

          </div>

        </motion.div>


        {/* ================================================================= */}
        {/* SOCIAL / IDENTITY STRIP                                           */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
          }}
          className="
            flex
            flex-col
            gap-5
            py-7
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

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                border
                border-signal/30
                text-signal
              "
            >

              <Code2
                size={13}
              />

            </div>


            <div>

              <p
                className="
                  font-display
                  text-sm
                  text-bone
                "
              >
                {profile.name}
              </p>

              <p
                className="
                  mt-0.5
                  font-mono
                  text-[7px]
                  text-ash
                "
              >
                FULL STACK · AI · SYSTEMS
              </p>

            </div>

          </div>


          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

            {/* Replace these URLs with the exact URLs from your
                profile/content data if those fields exist. */}

            <a
              href="#contact"
              className="
                inline-flex
                items-center
                gap-2
                border
                border-void-line
                px-3
                py-2
                font-mono
                text-[7px]
                text-ash
                transition-colors
                hover:border-signal/40
                hover:text-signal
              "
            >

              <Mail
                size={10}
              />

              CONTACT

            </a>

          </div>

        </motion.div>


        {/* ================================================================= */}
        {/* COPYRIGHT / TERMINAL END                                          */}
        {/* ================================================================= */}

        <div
          className="
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

          <p
            className="
              font-mono
              text-[7px]
              tracking-[0.12em]
              text-ash/60
            "
          >
            © {currentYear} {profile.name}
            {' '}— ALL SYSTEMS RESERVED.
          </p>


          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <span
              className="
                font-mono
                text-[7px]
                text-ash/50
              "
            >
              BUILT WITH
            </span>

            <Sparkles
              size={9}
              className="text-ember-bright"
            />

            <span
              className="
                font-mono
                text-[7px]
                text-signal
              "
            >
              CURIOSITY
            </span>

            <span
              className="
                text-ash/40
              "
            >
              ·
            </span>

            <span
              className="
                font-mono
                text-[7px]
                text-signal
              "
            >
              CODE
            </span>

          </div>

        </div>


        {/* ================================================================= */}
        {/* VOID END                                                          */}
        {/* ================================================================= */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-4
            pb-2
            pt-10
          "
        >

          <span
            className="
              h-px
              flex-1
              bg-gradient-to-r
              from-transparent
              to-void-line
            "
          />

          <span
            className="
              font-mono
              text-[7px]
              tracking-[0.35em]
              text-ash/40
            "
          >
            THE VOID
          </span>

          <span
            className="
              h-px
              flex-1
              bg-gradient-to-l
              from-transparent
              to-void-line
            "
          />

        </div>

      </div>

    </footer>
  );
}