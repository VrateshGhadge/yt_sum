import { BarChart3, Brain, FileText, GraduationCap, Sparkles, Target } from 'lucide-react'
import type { QuizQuestion } from '../../types'
import { Quiz } from '../Quiz'

/* The four things a quiz does here, in the order someone meets them. */
const QUIZ_FEATURES = [
  { icon: FileText, label: '5 smart questions', note: 'Based on key concepts', tile: 'bg-sky-wash text-sky' },
  { icon: Brain, label: 'Test your understanding', note: 'From real video content', tile: 'bg-plum-wash text-plum' },
  { icon: BarChart3, label: 'Instant feedback', note: 'See correct answers', tile: 'bg-gold-wash text-gold' },
  { icon: Target, label: 'Learn faster', note: 'Turn watching into active learning', tile: 'bg-clay-wash text-clay' },
]

const STRIP =
  'grid w-full grid-cols-[repeat(4,minmax(0,1fr))] gap-px overflow-hidden rounded-xl border border-line bg-line max-[700px]:grid-cols-[repeat(2,minmax(0,1fr))]'
const ITEM = 'grid justify-items-center gap-[5px] bg-card px-3 py-[13px] text-center'
const ACTION =
  'inline-flex min-h-10 items-center justify-center justify-self-center gap-1.5 rounded-[10px] bg-ink px-[16px] text-[13.5px] font-[550] text-paper hover:bg-ink-2'

export function QuizPanel({
  questions,
  busy,
  onGenerate,
}: {
  questions: QuizQuestion[] | null
  busy: string | null
  onGenerate: () => void
}) {
  if (questions) return <Quiz questions={questions} onNewQuiz={onGenerate} />

  return (
    <div className="grid justify-items-center gap-3 text-center">
      <span className="grid h-[42px] w-[42px] place-items-center rounded-[13px] bg-accent-wash text-accent" aria-hidden="true">
        <GraduationCap size={20} />
      </span>
      <h2 className="text-[17px] font-[620] tracking-[-0.02em] text-ink">No quiz yet</h2>
      <p className="max-w-[46ch] text-[13.5px] leading-[1.6] text-ink-4">
        Generate a personalized quiz with 5 questions based on what this video actually said.
      </p>

      <button type="button" className={ACTION} disabled={Boolean(busy)} onClick={onGenerate}>
        <Sparkles size={15} aria-hidden="true" />
        Create quiz
      </button>

      <ul className={STRIP}>
        {QUIZ_FEATURES.map(({ icon: Icon, label, note, tile }) => (
          <li key={label} className={ITEM}>
            <span className={`grid h-[26px] w-[26px] place-items-center rounded-lg ${tile}`} aria-hidden="true">
              <Icon size={15} />
            </span>
            <span className="text-[12.5px] font-semibold text-ink">{label}</span>
            <span className="text-[11.5px] leading-[1.45] text-ink-4">{note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
