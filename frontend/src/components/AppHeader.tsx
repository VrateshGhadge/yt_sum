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
    <header className="sticky top-0 z-20 bg-transparent px-5 py-2.5 before:fixed before:inset-x-0 before:top-0 before:-z-10 before:h-[var(--header-h)] before:bg-paper before:content-[''] max-[700px]:px-3 max-[700px]:py-2">
      <div className="mx-auto flex h-[var(--pill-h)] max-w-[1680px] items-center justify-between gap-4 rounded-[14px] bg-paper pl-[21px] pr-4 shadow-[0_0_0_1px_rgba(26,24,21,0.06),0_2px_4px_rgba(26,24,21,0.05),0_10px_30px_-6px_rgba(26,24,21,0.10)] max-[700px]:rounded-xl max-[700px]:pl-[18px] max-[700px]:pr-3.5">
        <Link
          to="/"
          className="flex items-center gap-[13px] rounded-[10px] no-underline transition-opacity duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-[0.72]"
          onClick={onHome}
          aria-label="Summify — new summary"
        >
          <img className="block h-[25px] w-auto shrink-0 max-[700px]:h-[22px]" src="/logo-mark-ink.png" alt="" />
          <img
            className="block h-[18.5px] w-auto shrink-0 translate-y-[1.7px] max-[700px]:h-4 max-[700px]:translate-y-[1.5px]"
            src="/logo-wordmark.png"
            alt="Summify"
          />
        </Link>

        <nav className="flex items-center gap-[17px] max-[700px]:gap-3.5" aria-label="Account">
          <Link
            to="/history"
            className="inline-flex h-[41px] items-center justify-center gap-[9px] rounded-full bg-sunken pl-[17px] pr-[18px] text-[13px] font-[550] text-ink no-underline transition-colors duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[rgba(26,24,21,0.07)] max-[700px]:h-9 max-[700px]:gap-2 max-[700px]:pl-3.5 max-[700px]:pr-[15px] max-[700px]:text-[12.5px] [&>svg]:shrink-0"
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
