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
    /* The page is drawn against a 1333px viewport. Below that the whole
       composition scales — type, spacing and the drawn app together — instead of
       only its columns narrowing while everything inside them stays full size. */
    <div id="landing" className="relative [zoom:min(1,calc(100vw/1333px))]">
      <LandingHeader />

      <main id="main-content">
        <LandingHero />

        <section className="px-6 pt-10 text-center max-[700px]:px-[18px] max-[700px]:pt-[34px]">
          <p className="text-[15px] font-[550] text-ink-3">
            Trusted by curious learners, builders, and professionals
          </p>
          <ul className="mt-[22px] flex flex-wrap justify-center gap-x-14 gap-y-4 max-[700px]:gap-x-7">
            {AUDIENCE.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-[14.5px] font-medium text-ink-2">
                <Icon className="text-ink-3" size={20} aria-hidden="true" />
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
