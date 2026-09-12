import { SignInButton } from '@clerk/clerk-react'
import { ArrowRight, Rocket } from 'lucide-react'

/* The last thing on the page: one dark band that asks, and one white button that
   answers, then the footer. */
export function LandingClosing() {
  return (
    <>
      <section className="landing-section">
        <div className="landing-band">
          <span className="landing-band-mark" aria-hidden="true">
            <Rocket size={22} />
          </span>

          <div className="landing-band-copy">
            <p className="landing-band-title">Ready to turn your next video into knowledge?</p>
            <p className="landing-band-note">Join thousands of learners and start summarizing for free.</p>
          </div>

          <SignInButton mode="modal">
            <button type="button" className="landing-band-button">
              Get started now
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </SignInButton>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <a className="landing-brand" href="/" aria-label="Summify">
              <img className="header-mark" src="/logo-mark-ink.png" alt="" />
              <img className="header-word" src="/logo-wordmark.png" alt="Summify" />
            </a>
            <p>
              Small videos.
              <br />
              Big ideas.
            </p>
          </div>

          <div className="landing-footer-col">
            <p className="landing-footer-head">Product</p>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
          </div>

          <p className="landing-footer-note">© 2026 Summify. Built for learners.</p>
        </div>
      </footer>
    </>
  )
}
