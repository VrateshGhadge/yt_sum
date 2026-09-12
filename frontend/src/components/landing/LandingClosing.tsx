import { SignInButton } from '@clerk/clerk-react'
import { ArrowRight, Rocket } from 'lucide-react'

/* The last thing on the page: one dark band that asks, and one white button that
   answers, then the footer. The band is held narrower than the page's columns on
   purpose — at full width the question and its answer drift so far apart that the
   middle reads as a gap rather than as space. */
export function LandingClosing() {
  return (
    <>
      <section className="mx-auto w-[min(100%-48px,1520px)] pt-[88px] max-[700px]:w-[min(100%-36px,1520px)] max-[700px]:pt-16">
        <div className="mx-auto flex max-w-[1080px] items-center gap-5 rounded-[18px] bg-ink px-[26px] py-[22px] text-paper max-[700px]:flex-col max-[700px]:items-start max-[700px]:p-5">
          <span
            className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full bg-[rgba(253,251,248,0.10)] text-paper"
            aria-hidden="true"
          >
            <Rocket size={22} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-semibold tracking-[-0.015em] text-paper">
              Ready to turn your next video into knowledge?
            </p>
            <p className="mt-1 text-[13.5px] text-[rgba(253,251,248,0.66)]">
              Join thousands of learners and start summarizing for free.
            </p>
          </div>

          <SignInButton mode="modal">
            <button
              type="button"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-[9px] rounded-[11px] bg-paper px-5 text-[15px] font-semibold text-ink transition-colors duration-[140ms] hover:bg-card max-[700px]:w-full"
            >
              Get started now
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </SignInButton>
        </div>
      </section>

      {/* The footer is a white band, frosted rather than flat: the ground stops
          being scenery under the page's last line without the dunes disappearing
          entirely. */}
      <footer className="mt-20 border-t border-line bg-[rgba(255,255,255,0.78)] px-6 pb-[50px] pt-[30px] backdrop-blur-[20px] backdrop-saturate-[1.1] max-[700px]:px-4">
        <div className="mx-auto grid w-[min(100%,1520px)] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-6 max-[700px]:grid-cols-[minmax(0,1fr)]">
          <div>
            <a className="flex items-center gap-[13px] no-underline" href="/" aria-label="Summify">
              <img className="block h-[25px] w-auto shrink-0" src="/logo-mark-ink.png" alt="" />
              <img
                className="block h-[18.5px] w-auto shrink-0 translate-y-[1.7px]"
                src="/logo-wordmark.png"
                alt="Summify"
              />
            </a>
            <p className="mt-[14px] text-[13px] leading-[1.55] text-ink-4">
              Small videos.
              <br />
              Big ideas.
            </p>
          </div>

          <div className="grid gap-[9px]">
            <p className="text-[13px] font-[620] text-ink">Product</p>
            <a className="text-[13px] text-ink-4 no-underline hover:text-ink" href="/#features">Features</a>
            <a className="text-[13px] text-ink-4 no-underline hover:text-ink" href="/#faq">FAQ</a>
          </div>

          <p className="justify-self-end text-[13px] text-ink-4 max-[700px]:justify-self-start">
            © 2026 Summify. Built for learners.
          </p>
        </div>
      </footer>
    </>
  )
}
