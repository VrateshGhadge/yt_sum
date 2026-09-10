import { DynamicIslandLoader } from './DynamicIslandLoader'

/**
 * Full-screen overlay shown while a long-running action is in flight.
 * The backdrop blur softens the page (and the ink-wash background) behind it
 * so the loader reads as the single point of focus.
 */
export function LoadingOverlay({ label }: { label: string }) {
  return (
    <div className="loading-overlay" role="presentation">
      <DynamicIslandLoader label={label} />
      <p className="loading-overlay-label">{label}</p>
    </div>
  )
}
