import { BookOpen, Check, FileText, Lightbulb, ListOrdered, Sparkles, Target } from 'lucide-react'
import { MarkdownText } from '../MarkdownText'

/* What the notes are asked to be. Each line is a property of the prompt behind
   the button, so nothing here promises more than the notes deliver. */
const NOTES_FEATURES = [
  { icon: ListOrdered, label: 'Key concepts', note: 'Main ideas, simplified', tile: 'bg-moss-wash text-moss' },
  { icon: Lightbulb, label: 'Important details', note: 'Facts and examples', tile: 'bg-gold-wash text-gold' },
  { icon: BookOpen, label: 'Well structured', note: 'Easy to study later', tile: 'bg-plum-wash text-plum' },
  { icon: Target, label: 'Save time', note: 'Learn faster', tile: 'bg-clay-wash text-clay' },
]

const NOTES_INCLUDE = [
  'Key points and concepts',
  'Important examples and details',
  'Short headings and bullet points',
  'A clean, structured format',
]

/* Four promises in one frame, divided by the frame itself: the gap shows the
   rule colour through, so no item carries an edge of its own. */
const STRIP =
  'grid w-full grid-cols-[repeat(4,minmax(0,1fr))] gap-px overflow-hidden rounded-xl border border-line bg-line max-[700px]:grid-cols-[repeat(2,minmax(0,1fr))]'
const ITEM = 'grid justify-items-center gap-[5px] bg-card px-3 py-[13px] text-center'
const ACTION =
  'inline-flex min-h-10 items-center justify-center justify-self-center gap-1.5 rounded-[10px] bg-ink px-[16px] text-[13.5px] font-[550] text-paper hover:bg-ink-2'

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
    <div className="grid justify-items-start gap-3">
      <span className="grid h-[42px] w-[42px] place-items-center rounded-[13px] bg-accent-wash text-accent" aria-hidden="true">
        <FileText size={20} />
      </span>
      <h2 className="text-[17px] font-[620] tracking-[-0.02em] text-ink">Create study notes</h2>
      <p className="max-w-[46ch] text-[13.5px] leading-[1.6] text-ink-4">
        Turn this video into clear, organized study notes.
      </p>

      <ul className={STRIP}>
        {NOTES_FEATURES.map(({ icon: Icon, label, note, tile }) => (
          <li key={label} className={ITEM}>
            <span className={`grid h-[26px] w-[26px] place-items-center rounded-lg ${tile}`} aria-hidden="true">
              <Icon size={15} />
            </span>
            <span className="text-[12.5px] font-semibold text-ink">{label}</span>
            <span className="text-[11.5px] leading-[1.45] text-ink-4">{note}</span>
          </li>
        ))}
      </ul>

      <button type="button" className={ACTION} disabled={Boolean(busy)} onClick={onGenerate}>
        <Sparkles size={15} aria-hidden="true" />
        Generate notes
      </button>

      <div className="mt-1 grid gap-[9px]">
        <span className="block text-[12.5px] font-[550] text-ink-3">Your notes will include:</span>
        <ul className="grid gap-2">
          {NOTES_INCLUDE.map((item) => (
            <li key={item} className="flex items-center gap-[9px] text-[13px] text-ink-3">
              <Check className="shrink-0 text-accent" size={14} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
