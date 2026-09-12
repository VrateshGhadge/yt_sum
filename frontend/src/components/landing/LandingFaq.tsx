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
    <section
      className="mx-auto w-[min(100%-48px,1520px)] scroll-mt-24 pt-[88px] max-[700px]:w-[min(100%-36px,1520px)] max-[700px]:pt-16"
      id="faq"
    >
      <div className="text-center">
        <h2 className="text-[clamp(26px,2.6vw,34px)] font-[680] leading-[1.15] tracking-[-0.03em] text-ink">FAQ</h2>
      </div>

      <div className="mx-auto mt-7 max-w-[860px] [&>div+div]:border-t [&>div+div]:border-line">
        {QUESTIONS.map(({ q, a }, index) => {
          const isOpen = open === index

          return (
            <div key={q}>
              <h3>
                <button
                  type="button"
                  id={`faq-q-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="group flex w-full items-center justify-between gap-[18px] rounded-xl px-4 py-[19px] text-left text-base font-[620] text-ink transition-colors duration-[160ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sunken"
                >
                  {q}
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`shrink-0 text-ink-4 transition-[transform,color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>
              </h3>

              {/* Opens by animating the row track from 0fr to 1fr, so the height
                  is real rather than a guessed maximum. */}
              <div
                id={`faq-a-${index}`}
                role="region"
                aria-labelledby={`faq-q-${index}`}
                className={`grid transition-[grid-template-rows] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div
                  className={`overflow-hidden transition-[visibility] delay-[280ms] ${
                    isOpen ? 'visible delay-0' : 'invisible'
                  }`}
                >
                  <p className="max-w-[70ch] px-4 pb-5 text-[14.5px] leading-[1.62] text-ink-3">{a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
