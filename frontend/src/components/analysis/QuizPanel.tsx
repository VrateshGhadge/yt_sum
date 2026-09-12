import { BarChart3, Brain, FileText, GraduationCap, Sparkles, Target } from 'lucide-react'
import type { QuizQuestion } from '../../types'
import { Quiz } from '../Quiz'

/* The four things a quiz does here, in the order someone meets them. */
const QUIZ_FEATURES = [
  { icon: FileText, label: '5 smart questions', note: 'Based on key concepts', tone: 'sky' },
  { icon: Brain, label: 'Test your understanding', note: 'From real video content', tone: 'plum' },
  { icon: BarChart3, label: 'Instant feedback', note: 'See correct answers', tone: 'gold' },
  { icon: Target, label: 'Learn faster', note: 'Turn watching into active learning', tone: 'clay' },
] as const

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
    <div className="quiz-empty">
      <span className="empty-badge" aria-hidden="true"><GraduationCap size={20} /></span>
      <h2>No quiz yet</h2>
      <p>
        Generate a personalized quiz with 5 questions based on what this video actually said.
      </p>

      <button type="button" className="btn empty-action" disabled={Boolean(busy)} onClick={onGenerate}>
        <Sparkles size={15} aria-hidden="true" />
        Create quiz
      </button>

      <ul className="feature-strip">
        {QUIZ_FEATURES.map(({ icon: Icon, label, note, tone }) => (
          <li key={label} className="feature-item">
            <span className={`feature-icon is-${tone}`} aria-hidden="true"><Icon size={15} /></span>
            <span className="feature-label">{label}</span>
            <span className="feature-note">{note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
