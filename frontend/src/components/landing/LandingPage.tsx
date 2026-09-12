import { BookOpen, Briefcase, Code2, GraduationCap, Users } from 'lucide-react'
import { LandingClosing } from './LandingClosing'
import { LandingFaq } from './LandingFaq'
import { LandingFeatures } from './LandingFeatures'
import { LandingHeader } from './LandingHeader'
import { LandingHero } from './LandingHero'
import { LandingProof } from './LandingProof'

/* What someone meets before they have an account: the promise, the product, who
   it is for, and one way in. Everything behind it needs a session, so this page
   never shows a control that would not work. */
const AUDIENCE = [
  { icon: GraduationCap, label: 'Students' },
  { icon: Code2, label: 'Developers' },
  { icon: BookOpen, label: 'Researchers' },
  { icon: Briefcase, label: 'Professionals' },
  { icon: Users, label: 'Lifelong Learners' },
]

export function LandingPage() {
  return (
    <div className="landing">
      <LandingHeader />

      <main id="main-content">
        <LandingHero />

        <section className="landing-trust">
          <p className="landing-trust-title">Trusted by curious learners, builders, and professionals</p>
          <ul className="landing-audience">
            {AUDIENCE.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={20} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </section>

        <LandingFeatures />
        <LandingProof />
        <LandingFaq />
        <LandingClosing />
      </main>
    </div>
  )
}
