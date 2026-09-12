import { ArrowUp, ArrowUpRight, Info, MessageCircle, Sparkles } from 'lucide-react'
import { useRef, type FormEvent } from 'react'
import { ASK_SUGGESTIONS } from '../../constants'
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
  const box = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="ask">
      <h2 className="ask-title">Ask anything about this video</h2>
      <p className="ask-note">
        Get accurate answers from the video content with timestamps and sources.
      </p>

      <form onSubmit={onSubmit} aria-busy={Boolean(busy)}>
        <label className="sr-only" htmlFor="question">Ask a question about this video</label>
        <div className="ask-box">
          <div className="ask-row">
            <span className="ask-lead" aria-hidden="true"><Sparkles size={15} /></span>
            <textarea
              id="question"
              ref={box}
              value={question}
              onChange={(event) => onQuestionChange(event.target.value)}
              placeholder="What was the main argument?"
              rows={3}
            />
          </div>
          <div className="ask-foot">
            <button
              type="submit"
              className="ask-send"
              aria-label="Ask"
              disabled={Boolean(busy) || !question.trim()}
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>

      {answer ? (
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
      ) : (
        <>
          {/* Four openers, and every one of them resolves inside the transcript. */}
          <div className="ask-suggest">
            <span className="field-label">Try asking</span>
            <div className="ask-suggest-list">
              {ASK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="suggest-chip"
                  onClick={() => {
                    onQuestionChange(suggestion)
                    box.current?.focus()
                  }}
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          <p className="ask-info">
            <Info size={13} aria-hidden="true" />
            Answers include timestamps so you can verify the information.
          </p>
        </>
      )}
    </div>
  )
}
