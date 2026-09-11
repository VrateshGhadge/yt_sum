import { X } from 'lucide-react'

/** A standing error — names the problem and offers an obvious dismissal. */
export function StatusBanner({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  if (!message) return null

  return (
    <div className="banner" role="alert">
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss">
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
