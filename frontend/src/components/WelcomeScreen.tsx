import { FileText, GraduationCap, ListOrdered, MessageCircle, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

/* What the app does, in the order someone meets it. The copy names the four
   outputs of one link and nothing else. */
const FEATURES = [
  { icon: ListOrdered, label: 'AI Summary', note: 'Get key insights', tone: 'clay' },
  { icon: MessageCircle, label: 'Ask Questions', note: 'Grounded answers', tone: 'sky' },
  { icon: GraduationCap, label: 'Quiz Yourself', note: 'Test your knowledge', tone: 'moss' },
  { icon: FileText, label: 'Study Notes', note: 'Save what matters', tone: 'plum' },
] as const

export function WelcomeScreen({
  includeTranscript,
  onIncludeTranscriptChange,
  children,
}: {
  includeTranscript: boolean
  onIncludeTranscriptChange: (value: boolean) => void
  children: ReactNode
}) {
  return (
    <main className="home">
      {/* Margin notes, set in a hand. Decorative: the same promise is already
          in the headline and the lede, so nothing here is load-bearing. */}
      <p className="home-note home-note-left" aria-hidden="true">
        From
        <br />
        Videos to
        <br />
        Knowledge
        <svg viewBox="0 0 120 60" fill="none" aria-hidden="true">
          <path
            d="M4 6c26 4 64 18 92 44"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M108 30 96 50l-14-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>

      <p className="home-note home-note-right" aria-hidden="true">
        Learn
        <br />
        Faster
        <br />
        Go Further
        <svg viewBox="0 0 120 60" fill="none" aria-hidden="true">
          <path
            d="M116 54C90 50 52 36 24 10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 30 24 10l14 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>

      <div className="home-inner">
        <p className="home-eyebrow">
          <Sparkles size={13} aria-hidden="true" />
          Your AI YouTube Study Companion
        </p>

        {/* Two lines, and only the second carries the colour: the accent names
            the subject, which is the one thing the headline has to say. */}
        <h1 className="home-title">
          Summarize any
          <span className="home-title-accent">YouTube video.</span>
        </h1>

        <p className="home-lede">
          Ask it questions. Quiz yourself. Turn hours of content into knowledge in minutes.
        </p>

        <div className="home-field">
          {children}

          <label className="check">
            <input
              type="checkbox"
              checked={includeTranscript}
              onChange={(event) => onIncludeTranscriptChange(event.target.checked)}
            />
            Include the timestamped transcript
          </label>
        </div>

        <ul className="home-features">
          {FEATURES.map(({ icon: Icon, label, note, tone }) => (
            <li key={label} className="home-feature">
              <span className={`home-feature-icon is-${tone}`} aria-hidden="true">
                <Icon size={17} />
              </span>
              <span className="home-feature-label">{label}</span>
              <span className="home-feature-note">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
