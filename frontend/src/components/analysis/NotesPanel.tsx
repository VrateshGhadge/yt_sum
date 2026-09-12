import { BookOpen, Check, FileText, Lightbulb, ListOrdered, Sparkles, Target } from 'lucide-react'
import { MarkdownText } from '../MarkdownText'

/* What the notes are asked to be. Each line is a property of the prompt behind
   the button, so nothing here promises more than the notes deliver. */
const NOTES_FEATURES = [
  { icon: ListOrdered, label: 'Key concepts', note: 'Main ideas, simplified', tone: 'moss' },
  { icon: Lightbulb, label: 'Important details', note: 'Facts and examples', tone: 'gold' },
  { icon: BookOpen, label: 'Well structured', note: 'Easy to study later', tone: 'plum' },
  { icon: Target, label: 'Save time', note: 'Learn faster', tone: 'clay' },
] as const

const NOTES_INCLUDE = [
  'Key points and concepts',
  'Important examples and details',
  'Short headings and bullet points',
  'A clean, structured format',
]

export function NotesPanel({
  notes,
  busy,
  onGenerate,
}: {
  notes: string | null
  busy: string | null
  onGenerate: () => void
}) {
  if (notes) return <MarkdownText value={notes} />

  return (
    <div className="notes-empty">
      <span className="empty-badge" aria-hidden="true"><FileText size={20} /></span>
      <h2>Create study notes</h2>
      <p>Turn this video into clear, organized study notes.</p>

      <ul className="feature-strip">
        {NOTES_FEATURES.map(({ icon: Icon, label, note, tone }) => (
          <li key={label} className="feature-item">
            <span className={`feature-icon is-${tone}`} aria-hidden="true"><Icon size={15} /></span>
            <span className="feature-label">{label}</span>
            <span className="feature-note">{note}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="btn empty-action" disabled={Boolean(busy)} onClick={onGenerate}>
        <Sparkles size={15} aria-hidden="true" />
        Generate notes
      </button>

      <div className="include-list">
        <span className="field-label">Your notes will include:</span>
        <ul>
          {NOTES_INCLUDE.map((item) => (
            <li key={item}>
              <Check size={14} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
