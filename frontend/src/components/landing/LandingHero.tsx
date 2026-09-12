import { SignInButton } from '@clerk/clerk-react'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { AppShot } from './AppShot'

/* What the product promises, and the product itself beside it. The numbers are
   the offer, not metrics: how many ways it reads a video, how much faster that
   is than watching, and what it costs. */
const OFFER = [
  { figure: '4+', label: 'Ways to learn' },
  { figure: '10x', label: 'Faster learning' },
  { figure: '100%', label: 'Free to get started' },
]

export function LandingHero() {
  return (
    <section className="mx-auto grid w-[min(100%-48px,1520px)] grid-cols-[minmax(0,0.58fr)_minmax(0,1fr)] items-center gap-[18px] pb-[34px] pt-[68px] max-[1080px]:grid-cols-[minmax(0,1fr)] max-[1080px]:gap-10 max-[1080px]:pt-[34px] max-[700px]:gap-[34px] max-[700px]:pb-[18px] max-[700px]:pt-[26px]">
      <div>
        <p className="inline-flex h-7 items-center gap-[7px] rounded-full bg-accent-wash pl-[11px] pr-[13px] text-xs font-medium text-accent">
          <Sparkles size={13} aria-hidden="true" />
          Turn Videos Into Knowledge
        </p>

        <h1 className="mt-5 font-display text-[clamp(40px,4.7vw,78px)] font-[640] leading-[1.06] tracking-[-0.025em] text-ink">
          Watch Less.
          <span className="block text-accent">Learn More.</span>
        </h1>

        <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-ink-3 max-[700px]:text-[15px]">
          Summify uses AI to summarize YouTube videos, answer your questions, generate study notes,
          and create quizzes — so you can go from video to knowledge, in minutes.
        </p>

        <div className="mt-[30px] flex flex-wrap gap-3">
          <SignInButton mode="modal">
            <button
              type="button"
              className="inline-flex min-h-[52px] items-center justify-center gap-1.5 rounded-xl bg-ink px-6 text-[15.5px] font-[550] text-paper hover:bg-ink-2"
            >
              Get started for free
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </SignInButton>

          {/* No recording exists yet, so this walks a visitor through the product
              itself rather than promising a video that is not there. */}
          <a
            className="inline-flex min-h-[52px] items-center justify-center gap-1.5 rounded-xl border border-line-2 bg-card px-6 text-[15.5px] font-[550] text-ink-2 hover:border-ink-4 hover:text-ink"
            href="/#features"
          >
            <Play size={15} aria-hidden="true" />
            Watch demo
          </a>
        </div>

        <dl className="mt-[46px] flex max-[700px]:flex-wrap max-[700px]:gap-y-4 [&>div]:px-[26px] [&>div+div]:border-l [&>div+div]:border-line-2 [&>div:first-child]:pl-0 max-[700px]:[&>div]:px-[18px]">
          {OFFER.map(({ figure, label }) => (
            <div key={label}>
              <dt className="text-[29px] font-[680] tracking-[-0.03em] text-accent">{figure}</dt>
              <dd className="mt-px whitespace-nowrap text-[13.5px] text-ink-3">{label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="[container-type:inline-size]">
        <AppShot />
      </div>
    </section>
  )
}
