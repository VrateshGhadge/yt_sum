import { UserButton } from '@clerk/clerk-react'
import { Clock3 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Brand } from './Brand'

export function AppHeader({
  onHome,
  onOpenHistory,
  children,
}: {
  onHome: () => void
  onOpenHistory: () => void
  children?: ReactNode
}) {
  return (
    <header>
      <button className="brand" onClick={onHome} aria-label="Go to home">
        <Brand />
      </button>
      <nav>
        <button onClick={onOpenHistory}>
          <Clock3 size={18} />
          History
        </button>
        {children}
        <UserButton afterSignOutUrl="/" />
      </nav>
    </header>
  )
}
