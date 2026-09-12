import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { QuizQuestion } from '../types'

/* Buttons carry the app's own weight rather than a class of their own. */
const BTN =
  'mt-3.5 inline-flex min-h-[34px] items-center justify-center gap-1.5 rounded bg-ink px-[13px] text-[13px] font-[550] text-paper hover:enabled:bg-ink-2'
const QUIET =
  'inline-flex min-h-[34px] items-center justify-center gap-1.5 rounded border border-line-2 bg-transparent px-[13px] text-[13px] font-[550] text-ink-2 hover:enabled:border-ink-4 hover:enabled:text-ink'

const OPTION =
  'relative grid grid-cols-[24px_minmax(0,1fr)_auto] items-baseline gap-[11px] border-b border-line px-0.5 py-2.5 [&:has(input:focus-visible)]:outline-2 [&:has(input:focus-visible)]:outline-offset-[-2px] [&:has(input:focus-visible)]:outline-ink max-[420px]:grid-cols-[22px_minmax(0,1fr)]'

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
    return (
      <p className="flex items-center gap-[7px] text-[13px] leading-[1.55] text-ink-4">
        This video did not return any questions.
      </p>
    )
  }

  if (index === questions.length) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-[30rem]">
        <h3 className="text-[15px] font-[640] text-ink">Quiz complete</h3>
        <p className="mt-1 text-[40px] font-[680] leading-none tracking-[-0.035em] text-ink">
          {score} / {questions.length}
        </p>
        <p className="mt-1 text-[13px] leading-[1.55] text-ink-4">{pct}% correct</p>
        <button
          type="button"
          className={BTN}
          onClick={() => { setIndex(0); setPicked(null); setSubmitted(false); setScore(0) }}
        >
          Retake this quiz
        </button>
        <button type="button" className={`${QUIET} ml-2`} onClick={onNewQuiz}>
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
    <div className="max-w-[30rem]">
      <div className="flex items-center gap-3 border-b border-line-2 pb-3 text-xs text-ink-4">
        <span>Question {index + 1} of {questions.length}</span>
        <progress
          className="h-[3px] flex-1 accent-ink"
          value={index + 1}
          max={questions.length}
          aria-label={`Question ${index + 1} of ${questions.length}`}
        />
      </div>

      <fieldset className="m-0 min-w-0 border-0 px-0 pb-3 pt-4">
        <legend
          ref={legendRef}
          tabIndex={-1}
          className="text-[17px] font-[620] leading-[1.32] tracking-[-0.018em] text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          {q.question}
        </legend>
        <div className="grid">
          {q.options.map((option, optionIndex) => {
            const isAnswer = submitted && optionIndex === q.answerIndex
            const isWrong = submitted && picked === optionIndex && optionIndex !== q.answerIndex
            const isPicked = picked === optionIndex
            return (
              <label
                key={option}
                className={`${OPTION} cursor-pointer hover:bg-sunken ${isPicked ? 'bg-sunken' : ''}`}
              >
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={optionIndex}
                  checked={isPicked}
                  disabled={submitted}
                  onChange={() => setPicked(optionIndex)}
                  className="absolute h-px w-px opacity-0"
                />
                <span className={`text-xs font-semibold ${isPicked || isAnswer ? 'text-ink' : 'text-ink-4'}`}>
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span
                  className={`text-[13.5px] leading-[1.5] text-ink-2 [overflow-wrap:anywhere] ${
                    isWrong ? 'line-through decoration-mark' : ''
                  }`}
                >
                  {option}
                </span>
                {isAnswer && (
                  <Check
                    size={14}
                    className={`self-center text-ink max-[420px]:hidden ${isAnswer ? 'text-ink' : 'text-ink-4'}`}
                    aria-label="Correct answer"
                  />
                )}
                {isWrong && (
                  <X size={14} className="max-[420px]:hidden self-center text-ink" aria-label="Your answer" />
                )}
              </label>
            )
          })}
        </div>
      </fieldset>

      {submitted && (
        <div className="mt-3.5 border-l border-ink pl-[13px]" role="status">
          <strong className="text-[13px] text-ink">{right ? 'Correct' : 'Not quite'}</strong>
          <p className="mt-1 text-[13.5px] leading-[1.6] text-ink-3">{q.explanation}</p>
        </div>
      )}

      <button
        type="button"
        className={BTN}
        disabled={picked === null}
        onClick={() => (submitted ? next() : setSubmitted(true))}
      >
        {submitted ? (index === questions.length - 1 ? 'See results' : 'Next question') : 'Submit answer'}
      </button>
    </div>
  )
}
