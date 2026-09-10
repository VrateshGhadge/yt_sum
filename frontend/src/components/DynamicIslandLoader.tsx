import { motion } from 'framer-motion'

/**
 * Dynamic Island loader — ported from Amicro (MIT).
 * https://amicro.vercel.app/loaders/dynamic-island
 *
 * A dark pill with a pulsing status dot and a small animated waveform.
 * Styling lives in styles.css to match this project's plain-CSS convention.
 */
export function DynamicIslandLoader({ label }: { label?: string }) {
  return (
    <motion.div
      className="dynamic-island"
      role="status"
      aria-label={label ?? 'Loading'}
      animate={{ width: [80, 118, 80] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.span
        className="dynamic-island-dot"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="dynamic-island-wave" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="dynamic-island-bar"
            animate={{ height: [3, 9, 3] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
        ))}
      </span>
    </motion.div>
  )
}
