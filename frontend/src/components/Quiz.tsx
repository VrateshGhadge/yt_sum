import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { QuizQuestion } from '../types'

export function Quiz({
  questions,
  onRestart,
}: {
  questions: QuizQuestion[]
  onRestart: () => void
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const q = questions[index]
  if (index === questions.length)
    return (
      <div className="quiz-finish">
        <span className="section-kicker">Quiz complete</span>
        <strong>
          {score} / {questions.length}
        </strong>
        <p>{Math.round((score / questions.length) * 100)}% correct</p>
        <button className="primary-button" onClick={onRestart}>
          Restart quiz
        </button>
      </div>
    )
  function next() {
    if (selected === q.answerIndex) setScore((value) => value + 1)
    if (index === questions.length - 1) setIndex(questions.length)
    else {
      setIndex((value) => value + 1)
      setSelected(null)
      setSubmitted(false)
    }
  }
  return (
    <div className="quiz">
      <div className="quiz-meta">
        Question {index + 1} of {questions.length}
        <span>
          <i style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </span>
      </div>
      <h2>{q.question}</h2>
      <div className="choices">
        {q.options.map((option, optionIndex) => (
          <button
            key={option}
            className={`${selected === optionIndex ? 'selected' : ''} ${submitted && optionIndex === q.answerIndex ? 'correct' : ''} ${submitted && selected === optionIndex && optionIndex !== q.answerIndex ? 'incorrect' : ''}`}
            disabled={submitted}
            onClick={() => setSelected(optionIndex)}
          >
            <b>{String.fromCharCode(65 + optionIndex)}</b>
            {option}
          </button>
        ))}
      </div>
      {submitted && (
        <div className="explanation">
          <strong>{selected === q.answerIndex ? 'Correct' : 'Not quite'}</strong>
          <p>{q.explanation}</p>
        </div>
      )}
      <button
        className="primary-button"
        disabled={selected === null}
        onClick={() => (submitted ? next() : setSubmitted(true))}
      >
        {submitted
          ? index === questions.length - 1
            ? 'See results'
            : 'Next question'
          : 'Submit answer'}
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
