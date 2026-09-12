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
    <section className="landing-hero">
      <div className="landing-hero-copy">
        <p className="home-eyebrow">
          <Sparkles size={13} aria-hidden="true" />
          Turn Videos Into Knowledge
        </p>

        <h1 className="landing-title">
          Watch Less.
          <span>Learn More.</span>
        </h1>

        <p className="landing-lede">
          Summify uses AI to summarize YouTube videos, answer your questions, generate study notes,
          and create quizzes — so you can go from video to knowledge, in minutes.
        </p>

        <div className="landing-cta-row">
          <SignInButton mode="modal">
            <button type="button" className="btn landing-primary">
              Get started for free
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </SignInButton>

          {/* No recording exists yet, so this walks a visitor through the product
              itself rather than promising a video that is not there. */}
          <a className="btn-quiet landing-demo" href="#features">
            <Play size={15} aria-hidden="true" />
            Watch demo
          </a>
        </div>

        <dl className="landing-offer">
          {OFFER.map(({ figure, label }) => (
            <div key={label}>
              <dt>{figure}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="landing-hero-shot">
        <AppShot />
      </div>
    </section>
  )
}
