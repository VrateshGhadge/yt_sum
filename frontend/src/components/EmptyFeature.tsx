import { ChevronRight } from 'lucide-react'

export function EmptyFeature({
  title,
  text,
  action,
  disabled,
  onClick,
}: {
  title: string
  text: string
  action: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{text}</p>
      <button type="button" className="btn" disabled={disabled} onClick={onClick}>
        {action}
        <ChevronRight size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
