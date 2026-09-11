import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { formatElapsed } from '../lib/format'

/**
 * Counts a wait up from mount. It lives in its own component so that ticking
 * once a second re-renders only this line, never the animated island above it.
 */
function Elapsed() {
  const startedAt = useRef(Date.now())
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    // Read the clock instead of counting ticks: browsers throttle timers in
    // background tabs, and a counted-up number would fall behind the real wait.
    const id = setInterval(() => setElapsedMs(Date.now() - startedAt.current), 500)
    return () => clearInterval(id)
  }, [])

  // Hidden from assistive tech — the label names the state, and a value that
  // changed every second would be announced over and over.
  return (
    <span className="overlay-timer" aria-hidden="true">
      {' · '}
      {formatElapsed(elapsedMs)}
    </span>
  )
}

/**
 * Shown while a video is being summarized. The page behind it blurs so the
 * wait is the only thing in focus.
 */
export function LoadingOverlay({ label }: { label: string }) {
  const still = useReducedMotion()

  return (
    <div className="overlay" role="status" aria-live="polite" aria-label={label}>
      <motion.div
        className="island"
        animate={still ? { width: 92 } : { width: [92, 124, 92] }}
        transition={still ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          className="island-dot"
          animate={still ? { opacity: 1 } : { opacity: [0.35, 1, 0.35] }}
          transition={still ? { duration: 0 } : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="island-wave" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="island-bar"
              animate={still ? { height: 5 } : { height: [3, 9, 3] }}
              transition={still ? { duration: 0 } : { duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
            />
          ))}
        </span>
      </motion.div>
      <span className="overlay-label">
        {label}
        <Elapsed />
      </span>
    </div>
  )
}
