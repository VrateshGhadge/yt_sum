import { CircleHelp } from 'lucide-react'
import type { QuizQuestion } from '../../types'
import { EmptyFeature } from '../EmptyFeature'
import { Quiz } from '../Quiz'

export function QuizPanel({
  questions,
  onGenerate,
}: {
  questions: QuizQuestion[] | null
  onGenerate: () => void
}) {
  if (questions) return <Quiz questions={questions} onRestart={onGenerate} />
  return (
    <EmptyFeature
      icon={<CircleHelp size={20} />}
      title="Check what stuck."
      text="Generate a five-question quiz based on this video."
      action="Create quiz"
      onClick={onGenerate}
    />
  )
}
