import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { QuizQuestion } from '../types'

export function Quiz({ questions, onNewQuiz }: { questions: QuizQuestion[]; onNewQuiz: () => void }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const legendRef = useRef<HTMLLegendElement>(null)

  useEffect(() => {
    legendRef.current?.focus()
  }, [index])

  if (!questions.length) {
    return <p className="muted-note">This video did not return any questions.</p>
  }

  if (index === questions.length) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="quiz-done">
        <h3>Quiz complete</h3>
        <p className="quiz-score">{score} / {questions.length}</p>
        <p className="muted-note">{pct}% correct</p>
        <button type="button" className="btn" onClick={() => { setIndex(0); setPicked(null); setSubmitted(false); setScore(0) }}>
          Retake this quiz
        </button>
        <button type="button" className="btn-quiet quiz-new" onClick={onNewQuiz}>
          Generate a new quiz
        </button>
      </div>
    )
  }

  const q = questions[index]
  const right = picked === q.answerIndex

  function next() {
    if (right) setScore((value) => value + 1)
    if (index === questions.length - 1) setIndex(questions.length)
    else {
      setIndex((value) => value + 1)
      setPicked(null)
      setSubmitted(false)
    }
  }

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <span>Question {index + 1} of {questions.length}</span>
        <progress value={index + 1} max={questions.length} aria-label={`Question ${index + 1} of ${questions.length}`} />
      </div>

      <fieldset className="quiz-question">
        <legend ref={legendRef} tabIndex={-1}>{q.question}</legend>
        <div className="quiz-options">
          {q.options.map((option, optionIndex) => {
            const isAnswer = submitted && optionIndex === q.answerIndex
            const isWrong = submitted && picked === optionIndex && optionIndex !== q.answerIndex
            return (
              <label
                key={option}
                className={`quiz-option${picked === optionIndex ? ' is-picked' : ''}${isAnswer ? ' is-correct' : ''}${isWrong ? ' is-wrong' : ''}`}
              >
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={optionIndex}
                  checked={picked === optionIndex}
                  disabled={submitted}
                  onChange={() => setPicked(optionIndex)}
                />
                <span className="quiz-letter">{String.fromCharCode(65 + optionIndex)}</span>
                <span className="quiz-copy">{option}</span>
                {isAnswer && <Check size={14} className="quiz-mark" aria-label="Correct answer" />}
                {isWrong && <X size={14} className="quiz-mark" aria-label="Your answer" />}
              </label>
            )
          })}
        </div>
      </fieldset>

      {submitted && (
        <div className="quiz-explanation" role="status">
          <strong>{right ? 'Correct' : 'Not quite'}</strong>
          <p>{q.explanation}</p>
        </div>
      )}

      <button
        type="button"
        className="btn"
        disabled={picked === null}
        onClick={() => (submitted ? next() : setSubmitted(true))}
      >
        {submitted ? (index === questions.length - 1 ? 'See results' : 'Next question') : 'Submit answer'}
      </button>
    </div>
  )
}
