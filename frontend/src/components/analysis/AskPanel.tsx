import type { FormEvent } from 'react'
import type { Answer } from '../../types'
import { MarkdownText } from '../MarkdownText'
import { TimestampButton } from '../TimestampButton'

export function AskPanel({
  question,
  answer,
  busy,
  onQuestionChange,
  onSubmit,
  onSeek,
}: {
  question: string
  answer: Answer | null
  busy: string | null
  onQuestionChange: (question: string) => void
  onSubmit: (event: FormEvent) => void
  onSeek: (ms: number) => void
}) {
  return (
    <>
      <p className="grounded">Answers are based on this video’s transcript.</p>
      <form className="ask-form" onSubmit={onSubmit}>
        <textarea
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="Ask anything about this video…"
          rows={3}
        />
        <button
          className="primary-button"
          disabled={Boolean(busy) || !question.trim()}
        >
          Ask AI
        </button>
      </form>
      {answer && (
        <div className="answer">
          <MarkdownText value={answer.answer} />
          <div className="citations">
            {answer.citations.map((citation, index) => (
              <button key={index} onClick={() => onSeek(citation.startMs)}>
                <TimestampButton
                  ms={citation.startMs}
                  label={citation.timecode}
                  onSeek={onSeek}
                />
                <span>{citation.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
