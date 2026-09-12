import { SignInButton } from '@clerk/clerk-react'

/* The landing page's own header. A signed-out visitor has no avatar and no
   workspace to go back to, so this is the brand, the page's own sections, and
   the one thing they can do. */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-20 px-6 pt-[18px] pb-3 before:fixed before:inset-x-0 before:top-0 before:-z-10 before:h-24 before:bg-paper before:content-[''] max-[700px]:px-4 max-[700px]:pb-2 max-[700px]:pt-3 max-[700px]:before:h-[78px]">
      <div className="mx-auto flex w-[min(100%,1520px)] items-center justify-between gap-5">
        <a className="flex items-center gap-[13px] no-underline" href="/" aria-label="Summify">
          <img className="block h-[25px] w-auto shrink-0" src="/logo-mark-ink.png" alt="" />
          <img
            className="block h-[18.5px] w-auto shrink-0 translate-y-[1.7px]"
            src="/logo-wordmark.png"
            alt="Summify"
          />
        </a>

        <nav className="flex items-center gap-[30px] max-[1080px]:hidden" aria-label="Sections">
          <a className="text-[14.5px] font-medium text-ink-2 no-underline hover:text-ink" href="/#features">Features</a>
          <a className="text-[14.5px] font-medium text-ink-2 no-underline hover:text-ink" href="/#testimonials">Testimonials</a>
          <a className="text-[14.5px] font-medium text-ink-2 no-underline hover:text-ink" href="/#faq">FAQ</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <SignInButton mode="modal">
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[10px] border border-line-2 bg-transparent px-[18px] text-sm font-[550] text-ink-2 hover:border-ink-4 hover:text-ink max-[700px]:min-h-9 max-[700px]:px-3.5 max-[700px]:text-[13px]"
            >
              Sign in
            </button>
          </SignInButton>
          <SignInButton mode="modal">
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[10px] bg-ink px-[18px] text-sm font-[550] text-paper hover:bg-ink-2 max-[700px]:min-h-9 max-[700px]:px-3.5 max-[700px]:text-[13px]"
            >
              Get started
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </SignInButton>
        </div>
      </div>
    </header>
  )
}
