import type { QuizQuestion } from '../../types'
import { EmptyFeature } from '../EmptyFeature'
import { Quiz } from '../Quiz'

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
    <EmptyFeature
      title="No quiz yet"
      text="Generate five questions about what this video actually said."
      action="Create quiz"
      disabled={Boolean(busy)}
      onClick={onGenerate}
    />
  )
}
