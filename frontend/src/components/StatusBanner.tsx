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
    <div
      className="flex items-center gap-2.5 border-b border-line-2 bg-[linear-gradient(var(--danger-wash),var(--danger-wash)),var(--paper)] px-[18px] py-[9px] text-[13px] text-danger [&>button]:grid [&>button]:h-6 [&>button]:w-6 [&>button]:place-items-center [&>button]:rounded [&>button]:text-inherit [&>button:hover]:bg-[rgba(155,44,34,0.1)] [&>span]:flex-1"
      role="alert"
    >
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss">
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
