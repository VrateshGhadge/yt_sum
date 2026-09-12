import { ArrowUp, ArrowUpRight, Info, MessageCircle, Sparkles } from 'lucide-react'
import { useRef, type FormEvent } from 'react'
import { ASK_SUGGESTIONS } from '../../constants'
import type { Answer } from '../../types'
import { MarkdownText } from '../MarkdownText'

const FIELD_LABEL = 'block text-[12.5px] font-[550] text-ink-3'

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
    <div>
      <h2 className="text-[16.5px] font-[620] tracking-[-0.02em] text-ink">Ask anything about this video</h2>
      <p className="mt-[5px] text-[13px] leading-[1.55] text-ink-4">
        Get accurate answers from the video content with timestamps and sources.
      </p>

      <form onSubmit={onSubmit} aria-busy={Boolean(busy)}>
        <label className="sr-only" htmlFor="question">Ask a question about this video</label>
        <div className="mt-3.5 rounded-[14px] border border-line-2 bg-card px-[13px] pb-2.5 pt-3 transition-colors duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:border-line-3">
          <div className="flex items-start gap-[9px]">
            <span className="shrink-0 pt-0.5 text-accent" aria-hidden="true">
              <Sparkles size={15} />
            </span>
            <textarea
              id="question"
              ref={box}
              value={question}
              onChange={(event) => onQuestionChange(event.target.value)}
              placeholder="What was the main argument?"
              rows={3}
              className="min-h-[58px] min-w-0 flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-[1.6] text-ink outline-none placeholder:text-ink-5 focus-visible:outline-none"
            />
          </div>
          <div className="mt-2 flex items-center justify-end">
            <button
              type="submit"
              className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-colors duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink-2 disabled:bg-sunken disabled:text-ink-5"
              aria-label="Ask"
              disabled={Boolean(busy) || !question.trim()}
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>

      {answer ? (
        <div className="pt-[18px]" aria-live="polite">
          <MarkdownText value={answer.answer} />
          {answer.citations.length > 0 && (
            <div className="mt-5 border-t border-line">
              <span className={`${FIELD_LABEL} pt-3 pb-[5px]`}>Where this came from</span>
              {answer.citations.map((citation, index) => (
                <button
                  type="button"
                  key={index}
                  className="grid w-full grid-cols-[50px_minmax(0,1fr)_auto] items-baseline gap-3 rounded-[9px] px-2 py-[9px] text-left transition-colors duration-[130ms] hover:bg-sunken [&+&]:border-t [&+&]:border-line max-[700px]:grid-cols-[46px_minmax(0,1fr)]"
                  onClick={() => onSeek(citation.startMs)}
                >
                  <span className="text-[11.5px] text-ink [font-variant-numeric:tabular-nums]">{citation.timecode}</span>
                  <span className="text-[13px] leading-[1.55] text-ink-3 [overflow-wrap:anywhere]">{citation.text}</span>
                  <ArrowUpRight size={13} aria-hidden="true" className="self-center text-mark max-[700px]:hidden" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Four openers, and every one of them resolves inside the transcript. */}
          <div className="mt-5">
            <span className={FIELD_LABEL}>Try asking</span>
            <div className="mt-[9px] grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2 max-[700px]:grid-cols-[minmax(0,1fr)]">
              {ASK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="flex min-h-9 items-center gap-2 rounded-[10px] border border-line-2 bg-card px-3 text-left text-[12.5px] text-ink-3 transition-[color,border-color] duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-line-3 hover:text-ink [&>svg]:shrink-0 [&>svg]:text-ink-4"
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
          <p className="mt-[22px] flex items-center gap-[7px] text-xs text-ink-4">
            <Info className="shrink-0" size={13} aria-hidden="true" />
            Answers include timestamps so you can verify the information.
          </p>
        </>
      )}
    </div>
  )
}
