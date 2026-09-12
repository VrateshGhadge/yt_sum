import { Star } from 'lucide-react'

/* Three people who already use it. The rows are the shape a testimonial takes
   here: the quote in the visitor's own words, then who said it. */
const VOICES = [
  {
    name: 'Aarav S.',
    role: 'Student',
    quote: 'This saved me hours of watching long lectures!',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Priya M.',
    role: 'Developer',
    quote: 'Incredibly accurate summaries and references.',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Rohan K.',
    role: 'Researcher',
    quote: 'Perfect for research and staying up to date.',
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
]

const METRICS = [
  { figure: '10K+', label: 'Active users', stars: false },
  { figure: '50K+', label: 'Videos summarized', stars: false },
  { figure: '4.9/5', label: 'User satisfaction', stars: true },
]

export function LandingProof() {
  return (
    <section
      className="mx-auto grid w-[min(100%-48px,1520px)] scroll-mt-24 grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] items-center gap-14 pt-[88px] max-[1080px]:grid-cols-[minmax(0,1fr)] max-[1080px]:gap-11 max-[700px]:w-[min(100%-36px,1520px)] max-[700px]:pt-16"
      id="testimonials"
    >
      <div className="relative pl-28 max-[1180px]:pl-0">
        <p
          className="absolute left-0 right-auto top-[26px] text-right font-hand text-[17px] leading-[1.4] text-ink-4 opacity-75 pointer-events-none max-[1340px]:hidden [&>svg]:ml-auto [&>svg]:mt-1.5 [&>svg]:block [&>svg]:h-12 [&>svg]:w-24"
          aria-hidden="true"
        >
          Learn
          <br />
          Smarter
          <br />
          Not Harder
          <svg viewBox="0 0 120 60" fill="none">
            <path d="M116 8C92 10 54 26 22 50" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M12 30 22 50l14-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>

        <ul className="grid gap-[14px]">
          {VOICES.map(({ name, role, quote, photo }) => (
            <li
              key={name}
              className="flex items-center gap-[14px] rounded-full border border-line bg-card py-3 pl-3 pr-6 transition-shadow duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_12px_26px_-16px_rgba(26,24,21,0.22)] max-[700px]:rounded-2xl max-[700px]:p-3"
            >
              <img className="h-[46px] w-[46px] shrink-0 rounded-full bg-sunken object-cover" src={photo} alt="" loading="lazy" />
              <span>
                <span className="block text-[13px] leading-[1.45] text-ink-2">“{quote}”</span>
                <span className="mt-1 flex items-baseline gap-2 text-[13px] font-[620] text-ink">
                  {name}
                  <span className="text-xs font-normal text-ink-4">{role}</span>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-[clamp(26px,2.6vw,34px)] font-[680] leading-[1.15] tracking-[-0.03em] text-ink">
          Join thousands who
          <span className="block text-accent">are learning smarter.</span>
        </h2>
        <p className="mt-2.5 max-w-[48ch] text-[15.5px] leading-[1.6] text-ink-3">
          Students, professionals, and creators use Summify to save time, understand complex topics,
          and turn videos into real knowledge.
        </p>

        <dl className="mt-7 flex max-[700px]:flex-wrap max-[700px]:gap-y-4 [&>div]:px-[26px] [&>div+div]:border-l [&>div+div]:border-line-2 [&>div:first-child]:pl-0">
          {METRICS.map(({ figure, label, stars }) => (
            <div key={label}>
              <dt className="flex items-center gap-[9px] text-[26px] font-bold tracking-[-0.03em] text-accent">
                {figure}
                {stars ? (
                  <span className="inline-flex gap-0.5 text-star" aria-hidden="true">
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                  </span>
                ) : null}
              </dt>
              <dd className="mt-px text-[13px] text-ink-4">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
