'use client';

import {
  FormEvent,
  useState,
} from 'react';

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

import {
  AtSign,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Cpu,
  Crosshair,
  ExternalLink,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Radio,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

import { profile } from '@/lib/content';


/* ============================================================================
   TYPES
============================================================================ */

type SubmissionState =
  | 'idle'
  | 'sending'
  | 'success'
  | 'error';


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
      duration: 0.75,
      ease: 'easeOut',
    },
  },
};


/* ============================================================================
   FORM FIELD
============================================================================ */

function FormField({
  id,
  name,
  label,
  type = 'text',
  required = true,
  textarea = false,
  disabled = false,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  disabled?: boolean;
}) {
  const commonClassName = `
    peer
    w-full
    border
    border-void-line
    bg-black/20
    px-4
    pb-3
    pt-6
    font-body
    text-sm
    text-bone
    outline-none
    transition-all
    duration-300
    placeholder:text-transparent
    hover:border-signal/30
    focus:border-signal/70
    focus:bg-signal/[0.025]
    focus:shadow-[0_0_30px_rgba(120,255,190,0.035)]
    disabled:cursor-not-allowed
    disabled:opacity-50
  `;

  return (
    <div className="group relative">

      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          rows={6}
          placeholder=" "
          className={`${commonClassName} min-h-[155px] resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          disabled={disabled}
          placeholder=" "
          className={`${commonClassName} h-[62px]`}
        />
      )}

      <label
        htmlFor={id}
        className="
          pointer-events-none
          absolute
          left-4
          top-2
          font-mono
          text-[8px]
          tracking-[0.16em]
          text-ash
          transition-all
          duration-300
          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:-translate-y-1/2
          peer-placeholder-shown:text-[10px]
          peer-placeholder-shown:text-ash
          peer-focus:top-2
          peer-focus:translate-y-0
          peer-focus:text-[8px]
          peer-focus:text-signal
        "
      >
        {label}
      </label>

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-px
          w-0
          bg-signal
          transition-all
          duration-500
          group-focus-within:w-full
        "
      />

    </div>
  );
}


/* ============================================================================
   CONTACT CHANNEL
============================================================================ */

function ContactChannel({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div
        className="
          relative
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          border
          border-void-line
          bg-black/20
          text-signal
          transition-all
          duration-300
          group-hover:border-signal/50
          group-hover:bg-signal/[0.04]
        "
      >
        <Icon
          size={15}
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

      <div className="min-w-0">

        <p
          className="
            font-mono
            text-[7px]
            tracking-[0.2em]
            text-ash
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            break-all
            font-body
            text-sm
            text-bone-muted
            transition-colors
            duration-300
            group-hover:text-bone
          "
        >
          {value}
        </p>

      </div>

      {href && (
        <ExternalLink
          size={11}
          className="
            ml-auto
            shrink-0
            text-ash/40
            transition-all
            duration-300
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
            group-hover:text-signal
          "
        />
      )}
    </>
  );

  if (!href) {
    return (
      <div
        className="
          group
          flex
          items-center
          gap-4
          border
          border-void-line
          bg-black/10
          p-4
          transition-colors
          duration-300
          hover:border-signal/30
        "
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      className="
        group
        flex
        items-center
        gap-4
        border
        border-void-line
        bg-black/10
        p-4
        transition-colors
        duration-300
        hover:border-signal/30
      "
    >
      {content}
    </a>
  );
}


/* ============================================================================
   COMMUNICATION CORE
============================================================================ */

function CommunicationCore({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <div
      className="
        relative
        mx-auto
        flex
        h-[250px]
        w-[250px]
        items-center
        justify-center
        sm:h-[290px]
        sm:w-[290px]
      "
    >

      {/* Outer ring */}
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="
          absolute
          inset-2
          rounded-full
          border
          border-dashed
          border-signal/20
        "
      />

      {/* Inner rotating ring */}
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: -360,
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="
          absolute
          inset-8
          rounded-full
          border
          border-void-line
        "
      />

      {/* Crosshair */}
      <div className="absolute inset-0">

        <span
          className="
            absolute
            left-1/2
            top-0
            h-8
            w-px
            bg-gradient-to-b
            from-signal
            to-transparent
          "
        />

        <span
          className="
            absolute
            bottom-0
            left-1/2
            h-8
            w-px
            bg-gradient-to-t
            from-signal
            to-transparent
          "
        />

        <span
          className="
            absolute
            left-0
            top-1/2
            h-px
            w-8
            bg-gradient-to-r
            from-signal
            to-transparent
          "
        />

        <span
          className="
            absolute
            right-0
            top-1/2
            h-px
            w-8
            bg-gradient-to-l
            from-signal
            to-transparent
          "
        />

      </div>

      {/* Orbital marker */}
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="
          absolute
          inset-12
        "
      >
        <span
          className="
            absolute
            -top-1
            left-1/2
            h-2
            w-2
            rounded-full
            bg-ember-bright
            shadow-[0_0_14px_rgba(255,120,70,.5)]
          "
        />
      </motion.div>

      {/* Core */}
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [
                  1,
                  1.05,
                  1,
                ],
                boxShadow: [
                  '0 0 20px rgba(100,255,190,.05)',
                  '0 0 55px rgba(100,255,190,.15)',
                  '0 0 20px rgba(100,255,190,.05)',
                ],
              }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="
          relative
          flex
          h-28
          w-28
          items-center
          justify-center
          rounded-full
          border
          border-signal/40
          bg-signal/[0.025]
          sm:h-32
          sm:w-32
        "
      >

        <span
          className="
            absolute
            inset-3
            rounded-full
            border
            border-signal/15
          "
        />

        <span
          className="
            absolute
            inset-6
            rounded-full
            border
            border-ember-bright/15
          "
        />

        <Radio
          size={30}
          strokeWidth={1}
          className="text-signal"
        />

        <motion.span
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [
                    0.7,
                    1.5,
                    0.7,
                  ],
                  opacity: [
                    0.4,
                    0,
                    0.4,
                  ],
                }
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
          }}
          className="
            absolute
            inset-10
            rounded-full
            border
            border-signal
          "
        />

      </motion.div>

      <span
        className="
          absolute
          left-0
          top-1/2
          -translate-x-2
          -translate-y-1/2
          font-mono
          text-[7px]
          tracking-[0.15em]
          text-ash
        "
      >
        RX
      </span>

      <span
        className="
          absolute
          right-0
          top-1/2
          translate-x-2
          -translate-y-1/2
          font-mono
          text-[7px]
          tracking-[0.15em]
          text-ash
        "
      >
        TX
      </span>

      <span
        className="
          absolute
          bottom-2
          left-1/2
          -translate-x-1/2
          font-mono
          text-[7px]
          tracking-[0.2em]
          text-signal
        "
      >
        CHANNEL READY
      </span>

    </div>
  );
}


/* ============================================================================
   SUBMISSION STATUS
============================================================================ */

function SubmissionStatus({
  state,
  onReset,
}: {
  state: SubmissionState;
  onReset: () => void;
}) {
  if (state === 'idle') {
    return null;
  }

  return (
    <AnimatePresence mode="wait">

      {state === 'sending' && (
        <motion.div
          key="sending"
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          className="
            flex
            items-center
            gap-4
            border
            border-signal/25
            bg-signal/[0.025]
            p-4
          "
          role="status"
          aria-live="polite"
        >

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Radio
              size={18}
              className="text-signal"
            />
          </motion.div>

          <div>

            <p
              className="
                font-mono
                text-[8px]
                tracking-[0.18em]
                text-signal
              "
            >
              TRANSMITTING
            </p>

            <p
              className="
                mt-1
                font-body
                text-xs
                text-bone-muted
              "
            >
              Establishing secure communication channel...
            </p>

          </div>

        </motion.div>
      )}


      {state === 'success' && (
        <motion.div
          key="success"
          initial={{
            opacity: 0,
            y: -15,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          className="
            relative
            overflow-hidden
            border
            border-signal/40
            bg-signal/[0.035]
            p-5
          "
          role="status"
          aria-live="polite"
        >

          {/* Success scan */}
          <motion.div
            initial={{
              x: '-100%',
            }}
            animate={{
              x: '100%',
            }}
            transition={{
              duration: 1.2,
              ease: 'easeInOut',
            }}
            className="
              pointer-events-none
              absolute
              inset-y-0
              w-1/3
              bg-gradient-to-r
              from-transparent
              via-signal/[0.08]
              to-transparent
            "
          />

          <div
            className="
              relative
              flex
              items-start
              gap-4
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                border
                border-signal/40
                bg-signal/[0.04]
              "
            >

              <CheckCircle2
                size={19}
                className="text-signal"
              />

            </div>


            <div className="flex-1">

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                <p
                  className="
                    font-display
                    text-lg
                    text-bone
                  "
                >
                  Transmission received.
                </p>

                <span
                  className="
                    border
                    border-signal/30
                    px-2
                    py-1
                    font-mono
                    text-[7px]
                    text-signal
                  "
                >
                  SUCCESS
                </span>

              </div>


              <p
                className="
                  mt-2
                  font-body
                  text-xs
                  leading-6
                  text-bone-muted
                "
              >
                Your message has been delivered successfully.
                The communication channel remains open on this
                portfolio.
              </p>


              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Check
                    size={11}
                    className="text-signal"
                  />

                  <span
                    className="
                      font-mono
                      text-[7px]
                      text-ash
                    "
                  >
                    DELIVERED
                  </span>

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Wifi
                    size={11}
                    className="text-signal"
                  />

                  <span
                    className="
                      font-mono
                      text-[7px]
                      text-ash
                    "
                  >
                    CHANNEL ACTIVE
                  </span>

                </div>


                <button
                  type="button"
                  onClick={onReset}
                  className="
                    ml-auto
                    flex
                    items-center
                    gap-2
                    font-mono
                    text-[7px]
                    text-ash
                    transition-colors
                    hover:text-signal
                  "
                >

                  <RotateCcw
                    size={10}
                  />

                  SEND ANOTHER

                </button>

              </div>

            </div>

          </div>

        </motion.div>
      )}


      {state === 'error' && (
        <motion.div
          key="error"
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          className="
            border
            border-ember-bright/35
            bg-ember-bright/[0.025]
            p-5
          "
          role="alert"
          aria-live="assertive"
        >

          <div
            className="
              flex
              items-start
              gap-4
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                border
                border-ember-bright/30
              "
            >

              <CircleAlert
                size={18}
                className="text-ember-bright"
              />

            </div>


            <div className="flex-1">

              <p
                className="
                  font-display
                  text-lg
                  text-bone
                "
              >
                Transmission interrupted.
              </p>

              <p
                className="
                  mt-2
                  font-body
                  text-xs
                  leading-6
                  text-bone-muted
                "
              >
                The message could not be delivered.
                Check your connection and try again.
              </p>

              <button
                type="button"
                onClick={onReset}
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  font-mono
                  text-[7px]
                  tracking-[0.12em]
                  text-ember-bright
                  transition-colors
                  hover:text-bone
                "
              >

                <RotateCcw
                  size={10}
                />

                REINITIALIZE CHANNEL

              </button>

            </div>

          </div>

        </motion.div>
      )}

    </AnimatePresence>
  );
}


/* ============================================================================
   MAIN
============================================================================ */

export function Contact() {
  const reduceMotion =
    useReducedMotion();

  const [submissionState, setSubmissionState] =
    useState<SubmissionState>('idle');


  /* ========================================================================
     FORM SUBMISSION
  ======================================================================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      submissionState === 'sending'
    ) {
      return;
    }

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    setSubmissionState('sending');

    try {
      const response =
        await fetch(
          'https://formspree.io/f/xrealqoa',
          {
            method: 'POST',

            body: formData,

            headers: {
              Accept:
                'application/json',
            },
          },
        );


      if (!response.ok) {
        throw new Error(
          'Form submission failed.',
        );
      }


      /*
       * Formspree has accepted the message.
       *
       * We intentionally do NOT navigate anywhere.
       * The visitor remains on the portfolio.
       */
      form.reset();

      setSubmissionState('success');

    } catch (error) {

      console.error(
        'Contact form submission error:',
        error,
      );

      setSubmissionState('error');
    }
  }


  /* ========================================================================
     RESET
  ======================================================================== */

  function resetSubmission() {
    setSubmissionState('idle');
  }


  return (
    <section
      id="contact"
      className="
        relative
        min-h-screen
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
              '21px 21px',
          }}
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.018]
            [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px)]
            [background-size:100%_4px]
          "
        />


        {/* Green atmosphere */}
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
                  y: [
                    0,
                    -50,
                    0,
                  ],
                  scale: [
                    1,
                    1.15,
                    1,
                  ],
                  opacity: [
                    0.02,
                    0.065,
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
            left-[-15%]
            top-[10%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-signal/10
            blur-[180px]
          "
        />


        {/* Ember atmosphere */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [
                    0,
                    -80,
                    0,
                  ],
                  scale: [
                    1,
                    1.1,
                    1,
                  ],
                }
          }
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="
            absolute
            bottom-[-20%]
            right-[-10%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-ember-bright/10
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
          className="text-center"
        >

          <div
            className="
              inline-flex
              items-center
              gap-3
              border
              border-signal/20
              bg-signal/[0.025]
              px-4
              py-2
            "
          >

            <motion.span
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: [
                        0.3,
                        1,
                        0.3,
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
                hud-label
                text-[9px]
                tracking-[0.3em]
                text-signal
              "
            >
              07 — THE NEXT ARC
            </span>

          </div>


          <h2
            className="
              mt-8
              font-display
              text-4xl
              leading-[1.05]
              text-bone
              sm:text-5xl
              lg:text-6xl
            "
          >
            The next system
            <br />

            <span
              className="text-signal"
            >
              might be ours.
            </span>

          </h2>


          <p
            className="
              mx-auto
              mt-6
              max-w-xl
              font-body
              text-sm
              leading-7
              text-bone-muted
            "
          >
            Have a project, idea, collaboration
            or system worth building?
            Establish a communication channel
            below.
          </p>

        </motion.div>


        {/* ================================================================= */}
        {/* TERMINAL                                                          */}
        {/* ================================================================= */}

        <div
          className="
            mt-16
            grid
            overflow-hidden
            border
            border-void-line
            bg-black/10
            lg:grid-cols-[0.8fr_1.2fr]
          "
        >

          {/* =============================================================== */}
          {/* LEFT SIDE                                                        */}
          {/* =============================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.8,
            }}
            className="
              relative
              overflow-hidden
              border-b
              border-void-line
              bg-black/20
              p-6
              sm:p-8
              lg:border-b-0
              lg:border-r
              lg:p-10
            "
          >

            {/* Terminal header */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-void-line
                pb-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <Terminal
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
                  COMMUNICATION TERMINAL
                </span>

              </div>


              <span
                className="
                  font-mono
                  text-[7px]
                  text-signal
                "
              >
                ONLINE
              </span>

            </div>


            {/* Core */}
            <div className="py-8">

              <CommunicationCore
                reduceMotion={
                  Boolean(
                    reduceMotion,
                  )
                }
              />

            </div>


            {/* System metadata */}
            <div
              className="
                grid
                grid-cols-2
                gap-px
                border
                border-void-line
                bg-void-line
              "
            >

              <div
                className="
                  bg-void-raised
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

                  <Cpu
                    size={11}
                    className="text-signal"
                  />

                  <span
                    className="
                      font-mono
                      text-[7px]
                      text-ash
                    "
                  >
                    NODE
                  </span>

                </div>


                <p
                  className="
                    mt-2
                    font-mono
                    text-[9px]
                    text-bone
                  "
                >
                  PORTFOLIO-07
                </p>

              </div>


              <div
                className="
                  bg-void-raised
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

                  <ShieldCheck
                    size={11}
                    className="text-signal"
                  />

                  <span
                    className="
                      font-mono
                      text-[7px]
                      text-ash
                    "
                  >
                    SECURITY
                  </span>

                </div>


                <p
                  className="
                    mt-2
                    font-mono
                    text-[9px]
                    text-signal
                  "
                >
                  VERIFIED
                </p>

              </div>

            </div>


            {/* Channels */}
            <div className="mt-5 space-y-2">

              <ContactChannel
                icon={Mail}
                label="PRIMARY CHANNEL"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />


              <ContactChannel
                icon={Phone}
                label="VOICE CHANNEL"
                value={profile.phone}
                href={`tel:${profile.phone}`}
              />


              <ContactChannel
                icon={MapPin}
                label="CURRENT NODE"
                value={profile.location}
              />

            </div>

          </motion.div>


          {/* =============================================================== */}
          {/* RIGHT SIDE                                                       */}
          {/* =============================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="p-6 sm:p-8 lg:p-10"
          >

            {/* Form heading */}
            <div
              className="
                flex
                flex-col
                gap-4
                border-b
                border-void-line
                pb-6
                sm:flex-row
                sm:items-start
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

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-signal/30
                    bg-signal/[0.025]
                    text-signal
                  "
                >

                  <MessageSquare
                    size={15}
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
                    TRANSMISSION PROTOCOL
                  </p>

                  <h3
                    className="
                      mt-1
                      font-display
                      text-xl
                      text-bone
                    "
                  >
                    Send a message
                  </h3>

                </div>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  border
                  border-signal/20
                  px-3
                  py-2
                "
              >

                <LockKeyhole
                  size={10}
                  className="text-signal"
                />

                <span
                  className="
                    font-mono
                    text-[7px]
                    text-signal
                  "
                >
                  SECURE CHANNEL
                </span>

              </div>

            </div>


            {/* ============================================================= */}
            {/* STATUS MESSAGE                                                 */}
            {/* ============================================================= */}

            <div className="mt-6">

              <SubmissionStatus
                state={submissionState}
                onReset={resetSubmission}
              />

            </div>


            {/* ============================================================= */}
            {/* FORM                                                           */}
            {/* ============================================================= */}

            <form
              id="contactForm"
              onSubmit={handleSubmit}
              className="
                mt-6
                space-y-4
              "
            >

              <FormField
                id="name"
                name="name"
                label="YOUR NAME"
                disabled={
                  submissionState ===
                  'sending'
                }
              />


              <FormField
                id="email"
                name="email"
                label="YOUR EMAIL"
                type="email"
                disabled={
                  submissionState ===
                  'sending'
                }
              />


              <FormField
                id="subject"
                name="subject"
                label="SUBJECT"
                disabled={
                  submissionState ===
                  'sending'
                }
              />


              <FormField
                id="message"
                name="message"
                label="YOUR MESSAGE"
                textarea
                disabled={
                  submissionState ===
                  'sending'
                }
              />


              {/* Formspree metadata */}
              <input
                type="hidden"
                name="_subject"
                value="New message from Portfolio Contact Form"
              />


              {/* Transmission info */}
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border
                  border-void-line
                  bg-black/10
                  p-4
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

                  <Crosshair
                    size={12}
                    className="text-signal"
                  />

                  <div>

                    <p
                      className="
                        font-mono
                        text-[7px]
                        tracking-[0.15em]
                        text-ash
                      "
                    >
                      TRANSMISSION
                    </p>

                    <p
                      className="
                        mt-1
                        font-mono
                        text-[8px]
                        text-bone-muted
                      "
                    >
                      DIRECT // FORM SUBMISSION
                    </p>

                  </div>

                </div>


                <div
                  className="
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
                      duration: 1.6,
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
                      text-signal
                    "
                  >
                    READY
                  </span>

                </div>

              </div>


              {/* =========================================================== */}
              {/* SUBMIT BUTTON                                                */}
              {/* =========================================================== */}

              <motion.button
                type="submit"
                disabled={
                  submissionState ===
                  'sending'
                }
                whileHover={
                  reduceMotion ||
                  submissionState ===
                    'sending'
                    ? undefined
                    : {
                        y: -2,
                      }
                }
                whileTap={
                  reduceMotion ||
                  submissionState ===
                    'sending'
                    ? undefined
                    : {
                        scale: 0.98,
                      }
                }
                className="
                  group
                  relative
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  overflow-hidden
                  border
                  border-signal/50
                  bg-signal/[0.035]
                  px-6
                  py-4
                  font-mono
                  text-[9px]
                  tracking-[0.2em]
                  text-signal
                  transition-all
                  duration-300
                  hover:border-signal
                  hover:bg-signal/[0.07]
                  hover:shadow-[0_0_40px_rgba(100,255,190,0.08)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {/* Animated sweep */}
                {submissionState !==
                  'sending' && (
                  <motion.span
                    initial={{
                      x: '-120%',
                    }}
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            x: '120%',
                          }
                    }
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: 'easeInOut',
                    }}
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      w-1/4
                      bg-gradient-to-r
                      from-transparent
                      via-white/[0.08]
                      to-transparent
                    "
                  />
                )}


                {submissionState ===
                'sending' ? (
                  <>
                    <motion.span
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Radio
                        size={13}
                      />
                    </motion.span>

                    <span>
                      TRANSMITTING...
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className="
                        relative
                        z-10
                      "
                    >
                      SEND TRANSMISSION
                    </span>

                    <Send
                      size={13}
                      className="
                        relative
                        z-10
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-0.5
                      "
                    />
                  </>
                )}

              </motion.button>

            </form>


            {/* Protocol footer */}
            <div
              className="
                mt-6
                flex
                items-center
                justify-between
                border-t
                border-void-line
                pt-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <AtSign
                  size={10}
                  className="text-ash"
                />

                <span
                  className="
                    font-mono
                    text-[7px]
                    text-ash
                  "
                >
                  DIRECT TRANSMISSION
                </span>

              </div>


              <div
                className="
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
                  FORMSPREE
                </span>

              </div>

            </div>

          </motion.div>

        </div>


        {/* ================================================================= */}
        {/* FINAL SIGNAL                                                       */}
        {/* ================================================================= */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
          }}
          className="
            mt-10
            flex
            flex-col
            items-center
            justify-between
            gap-4
            border-t
            border-void-line
            pt-5
            text-center
            sm:flex-row
            sm:text-left
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
              size={11}
              className="text-ember-bright"
            />

            <span
              className="
                font-mono
                text-[7px]
                tracking-[0.18em]
                text-ash
              "
            >
              THE STORY DOESN&apos;T END HERE.
            </span>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                font-mono
                text-[7px]
                text-ash
              "
            >
              NEXT ARC
            </span>

            <ChevronRight
              size={10}
              className="text-signal"
            />

            <span
              className="
                font-mono
                text-[7px]
                text-signal
              "
            >
              INITIALIZE
            </span>

            <Zap
              size={10}
              className="text-ember-bright"
            />

          </div>

        </motion.div>

      </div>

    </section>
  );
}