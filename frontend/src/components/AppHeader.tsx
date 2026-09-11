import { UserButton } from '@clerk/clerk-react'
import { HistoryIcon } from './HistoryIcon'
import { Link } from './Link'

export function AppHeader({
  view,
  onHome,
}: {
  view: 'welcome' | 'video' | 'history'
  onHome: () => void
}) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link
          to="/"
          className="header-brand"
          onClick={onHome}
          aria-label="Summify — new summary"
        >
          <img className="header-mark" src="/logo-mark-ink.png" alt="" />
          <img className="header-word" src="/logo-wordmark.png" alt="Summify" />
        </Link>

        <nav className="app-nav">
          <Link
            to="/history"
            className="nav-button"
            aria-current={view === 'history' ? 'page' : undefined}
          >
            <HistoryIcon />
            History
          </Link>
          <UserButton afterSignOutUrl="/" />
        </nav>
      </div>
    </header>
  )
}
