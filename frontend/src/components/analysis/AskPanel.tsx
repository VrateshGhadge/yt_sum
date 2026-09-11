import { ArrowUpRight } from 'lucide-react'
import type { FormEvent } from 'react'
import type { Answer } from '../../types'
import { MarkdownText } from '../MarkdownText'

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
  onQuestionChange: (q: string) => void
  onSubmit: (event: FormEvent) => void
  onSeek: (ms: number) => void
}) {
  return (
    <div className="ask">
      <form className="ask-form" onSubmit={onSubmit} aria-busy={Boolean(busy)}>
        <label className="field-label" htmlFor="question">Ask a question about this video</label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="What was the main argument?"
          rows={3}
        />
        <button type="submit" className="btn" disabled={Boolean(busy) || !question.trim()}>
          Ask
        </button>
      </form>

      {answer && (
        <div className="ask-answer" aria-live="polite">
          <MarkdownText value={answer.answer} />
          {answer.citations.length > 0 && (
            <div className="citations">
              <span className="field-label">Where this came from</span>
              {answer.citations.map((citation, index) => (
                <button
                  type="button"
                  key={index}
                  className="citation"
                  onClick={() => onSeek(citation.startMs)}
                >
                  <span className="citation-time">{citation.timecode}</span>
                  <span className="citation-text">{citation.text}</span>
                  <ArrowUpRight size={13} aria-hidden="true" className="citation-go" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
