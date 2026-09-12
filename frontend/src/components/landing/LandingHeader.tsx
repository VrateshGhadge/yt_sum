import { SignInButton } from '@clerk/clerk-react'

/* The landing page's own header. A signed-out visitor has no avatar and no
   workspace to go back to, so this is the brand, the page's own sections, and
   the one thing they can do. */
export function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <a className="landing-brand" href="/" aria-label="Summify">
          <img className="header-mark" src="/logo-mark-ink.png" alt="" />
          <img className="header-word" src="/logo-wordmark.png" alt="Summify" />
        </a>

        <nav className="landing-nav" aria-label="Sections">
          <a href="/#features">Features</a>
          <a href="/#testimonials">Testimonials</a>
          <a href="/#faq">FAQ</a>
        </nav>

        <div className="landing-actions">
          <SignInButton mode="modal">
            <button type="button" className="btn-quiet landing-signin">Sign in</button>
          </SignInButton>
          <SignInButton mode="modal">
            <button type="button" className="btn landing-start">
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
