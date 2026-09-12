import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/* An inline-confirm delete control, adapted from Rare UI's delete button.
   The bin's lid lifts and a panel slides out with confirm and cancel, so a
   destructive action is confirmed where it happens instead of in a browser
   dialog the rest of the page cannot style. */

const HINGE = '3px 6px'
const LID_OPEN = -35
const WALL_TOP = 6
const WALL_TOP_OPEN = 13.5
const WALL_BASE = 20

// How long the resolved state holds before the control returns to idle.
const HOLD = { deleted: 1400, kept: 600 }

const EASE = [0.32, 0.72, 0, 1] as const
const EASE_LID = [0.34, 1.1, 0.64, 1] as const

const LID = { duration: 0.6, ease: EASE_LID } as const
const WALL = { duration: 0.56, ease: EASE } as const
const IN = { duration: 0.44, ease: EASE, delay: 0.14 } as const
const OUT = { duration: 0.3, ease: EASE } as const
const TAP = { duration: 0.2, ease: EASE } as const
const SWAP = { duration: 0.22, ease: EASE } as const
const SETTLE = { duration: 0.45, ease: EASE } as const
const PRESS = { type: 'spring', stiffness: 520, damping: 18, mass: 0.5 } as const
const INSTANT = { duration: 0 } as const

const ICON = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

const panelMotion = {
  // Mirrored for a control that sits at the row's right edge: the panel slides
  // out from behind the bin toward the left, and so it enters from the right.
  hidden: { opacity: 0, x: 6, transition: OUT },
  shown: { opacity: 1, x: 0, transition: { ...IN, staggerChildren: 0.07 } },
}

const circleMotion = {
  hidden: { opacity: 0, scale: 0.9, transition: OUT },
  shown: { opacity: 1, scale: 1, transition: IN },
}

/* Sized to the app's 34px control so it sits with the rest of the row, and
   chrome-free at rest — a filled tile at this size would read as a smudge. */
const CIRCLE =
  'grid h-6 w-6 place-items-center rounded-full bg-sunken transition-[background,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-paper focus-visible:outline-offset-[-2px]'

function Circle({
  label,
  onClick,
  tone,
  children,
}: {
  label: string
  onClick: () => void
  tone?: 'confirm'
  children: ReactNode
}) {
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div className="flex" variants={reduced ? undefined : circleMotion}>
      <motion.button
        type="button"
        aria-label={label}
        onClick={onClick}
        whileHover={reduced ? undefined : { scale: 1.03 }}
        whileTap={reduced ? undefined : { scale: 0.84 }}
        transition={PRESS}
        /* Confirm is the one destructive affordance in the product, so it is the
           only place the danger colour appears at rest. */
        className={
          tone === 'confirm'
            ? `${CIRCLE} text-danger hover:text-danger`
            : `${CIRCLE} text-ink-3 hover:text-ink`
        }
      >
        <svg {...ICON} width="12" height="12" stroke="currentColor" strokeWidth="4">
          {children}
        </svg>
      </motion.button>
    </motion.div>
  )
}

type Status = 'idle' | 'deleted' | 'kept'

export function DeleteButton({
  label,
  onConfirm,
  onCancel,
}: {
  label: string
  onConfirm?: () => void
  onCancel?: () => void
}) {
  const reduced = useReducedMotion() ?? false
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const trigger = useRef<HTMLButtonElement>(null)
  const timing = (transition: Transition) => (reduced ? INSTANT : transition)

  const top = useMotionValue(WALL_TOP)
  const wall = useTransform(top, (y) => WALL_BASE - y)
  const bin = useMotionTemplate`M19 ${top}v${wall}a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V${top}`
  const settle = useMotionValue(1)

  useEffect(() => {
    const walls = animate(top, open ? WALL_TOP_OPEN : WALL_TOP, reduced ? INSTANT : WALL)
    return () => walls.stop()
  }, [open, reduced, top])

  useEffect(() => {
    if (status === 'idle') return
    const nudge = status === 'kept' && !reduced ? animate(settle, [1, 0.86, 1], SETTLE) : null
    const done = setTimeout(() => setStatus('idle'), HOLD[status])
    return () => {
      nudge?.stop()
      clearTimeout(done)
    }
  }, [status, reduced, settle])

  const resolve = (next: Exclude<Status, 'idle'>) => {
    setOpen(false)
    setStatus(next)
    // Focus follows the control back to the bin, so a keyboard user is never
    // left focused on a button that has just been removed.
    trigger.current?.focus()
    ;(next === 'deleted' ? onConfirm : onCancel)?.()
  }

  return (
    <div
      className="relative h-[34px] w-[34px] shrink-0 self-center rounded-lg max-[700px]:static"
      data-state={open ? 'open' : 'closed'}
      data-status={status}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) resolve('kept')
      }}
    >
      <motion.button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => {
          if (open) return resolve('kept')
          setStatus('idle')
          setOpen(true)
        }}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        transition={TAP}
        className="relative z-10 grid h-[34px] w-[34px] place-items-center rounded-lg text-ink-4 transition-[color,background] duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sunken hover:text-ink"
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === 'deleted' ? (
            <motion.svg
              key="done"
              {...ICON}
              width="16"
              height="16"
              className="overflow-visible text-danger"
              strokeWidth="2.8"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={timing(SWAP)}
            >
              <motion.path
                d="M4 12.5 9.5 18 20 7"
                initial={reduced ? undefined : { pathLength: 0 }}
                animate={reduced ? undefined : { pathLength: 1 }}
                transition={SETTLE}
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="bin"
              {...ICON}
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2.4"
              className="overflow-visible"
              style={{ scale: settle }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={timing(SWAP)}
            >
              <motion.path d={bin} />
              <motion.g
                style={{ transformBox: 'view-box', transformOrigin: HINGE }}
                animate={{ rotate: open ? LID_OPEN : 0 }}
                transition={timing(LID)}
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </motion.g>
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <span role="status" aria-live="polite" className="sr-only">
        {status === 'deleted' ? 'Deleted' : status === 'kept' ? 'Kept' : ''}
      </span>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            /* Sits to the left of the tile, over the row's own background. On a
               phone it covers the whole row instead. */
            className="absolute right-[34px] top-0 z-20 flex h-[34px] w-[62px] items-center justify-center gap-1.5 rounded-lg bg-recess max-[700px]:inset-y-0 max-[700px]:left-0 max-[700px]:right-[34px] max-[700px]:h-auto max-[700px]:w-auto max-[700px]:rounded-none"
            variants={reduced ? undefined : panelMotion}
            initial="hidden"
            animate="shown"
            exit="hidden"
          >
            {/* A tick of the tile's own colour, so the panel reads as sliding out
                from behind it rather than appearing alongside it. */}
            <span
              aria-hidden="true"
              className="absolute right-[-5px] top-1/2 h-2 w-1.5 -translate-y-1/2 bg-recess [clip-path:polygon(0_0,100%_50%,0_100%)] max-[700px]:hidden"
            />
            <Circle label="Confirm delete" tone="confirm" onClick={() => resolve('deleted')}>
              <path d="M4 12.5 9.5 18 20 7" />
            </Circle>
            <Circle label="Cancel" onClick={() => resolve('kept')}>
              <path d="M6 6 18 18M18 6 6 18" />
            </Circle>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
