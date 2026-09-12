import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

/* The questions the page's own navigation promises. Every answer is a fact about
   the product as it stands: nothing here describes a plan or a feature that has
   not been built. */
const QUESTIONS = [
  {
    q: 'Is Summify free?',
    a: 'Yes. There is no subscription, no billing account, and no API key to set up.',
  },
  {
    q: 'What do I need to start?',
    a: 'One YouTube link. Paste it and Summify reads the video’s captions and writes the summary.',
  },
  {
    q: 'How long does it take?',
    a: 'Around half a minute for a typical video, and a little longer for very long ones.',
  },
  {
    q: 'What if a video has no captions?',
    a: 'Summify reads captions, so a video without them cannot be summarized. It says so plainly rather than guessing.',
  },
]

/* One answer at a time: opening a question closes the one before it, so the
   section stays the height of the question someone is actually reading. */
export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="landing-section landing-faq" id="faq">
      <div className="landing-head">
        <h2 className="landing-h2">FAQ</h2>
      </div>

      <div className="landing-questions">
        {QUESTIONS.map(({ q, a }, index) => {
          const isOpen = open === index

          return (
            <div key={q} className={`landing-question${isOpen ? ' is-open' : ''}`}>
              <h3>
                <button
                  type="button"
                  id={`faq-q-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  {q}
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
              </h3>

              <div
                id={`faq-a-${index}`}
                className="landing-answer"
                role="region"
                aria-labelledby={`faq-q-${index}`}
              >
                <div>
                  <p>{a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
