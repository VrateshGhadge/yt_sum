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
  { figure: '10K+', label: 'Active users' },
  { figure: '50K+', label: 'Videos summarized' },
  { figure: '4.9/5', label: 'User satisfaction' },
]

export function LandingProof() {
  return (
    <section className="landing-section landing-proof" id="testimonials">
      <div className="landing-voices">
        <p className="landing-note landing-note-voices" aria-hidden="true">
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

        <ul className="landing-quotes">
          {VOICES.map(({ name, role, quote, photo }) => (
            <li key={name} className="landing-quote">
              <img src={photo} alt="" loading="lazy" />
              <span>
                <span className="landing-quote-text">“{quote}”</span>
                <span className="landing-quote-who">
                  {name}
                  <span>{role}</span>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="landing-join">
        <h2 className="landing-h2">
          Join thousands who
          <span>are learning smarter.</span>
        </h2>
        <p className="landing-sub">
          Students, professionals, and creators use Summify to save time, understand complex topics,
          and turn videos into real knowledge.
        </p>

        <dl className="landing-metrics">
          {METRICS.map(({ figure, label }) => (
            <div key={label}>
              <dt>
                {figure}
                {label === 'User satisfaction' ? (
                  <span className="landing-stars" aria-hidden="true">
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                    <Star size={15} fill="currentColor" />
                  </span>
                ) : null}
              </dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
