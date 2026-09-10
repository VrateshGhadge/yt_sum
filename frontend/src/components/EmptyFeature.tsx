import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyFeature({
  icon,
  title,
  text,
  action,
  onClick,
}: {
  icon: ReactNode
  title: string
  text: string
  action: string
  onClick: () => void
}) {
  return (
    <div className="empty-feature">
      <span>{icon}</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="primary-button" onClick={onClick}>
        {action}
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
