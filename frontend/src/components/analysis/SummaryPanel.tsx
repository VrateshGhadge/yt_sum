import { Check, ChevronDown, ChevronUp, Copy, FileText, ListOrdered } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { SUMMARY_MODES } from '../../constants'
import { chaptersFromSegments, locateSections } from '../../lib/chapters'
import { formatTime } from '../../lib/format'
import type { Chapter, Segment, SummaryMode } from '../../types'

/* The model returns plain text with light markdown, and each style is told a
   different shape, so the panel splits it differently rather than re-styling one
   blob four ways:
     bullets   -> lines beginning "- "
     keypoints -> lines beginning "1. ", "2. " ...
     detailed  -> blank-line separated paragraphs
     concise   -> a single paragraph
   Anything that does not match falls back to the whole text, so a model that
   ignores the format still renders. */
function bulletLines(summary: string) {
  const lines = summary
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /^[-•*]\s+/.test(line))
    .map((line) => line.replace(/^[-•*]\s+/, ''))
  return lines.length > 1 ? lines : null
}

function numberedLines(summary: string) {
  const lines = summary
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /^\d+[.)]\s+/.test(line))
    .map((line) => line.replace(/^\d+[.)]\s+/, ''))
  return lines.length > 1 ? lines : null
}

function paragraphs(summary: string) {
  const blocks = summary.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  return blocks.length > 1 ? blocks : null
}

function stripInlineMd(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/[*_`]/g, '').trim()
}

/* A bullet or numbered point often leads with a short label before a colon or
   dash. Splitting there gives the design's heading-plus-detail shape without
   inventing anything: the label is the model's own words. */
function splitLead(text: string) {
  const match = text.match(/^(.{3,64}?)\s*[:—–]\s+(.{12,})$/)
  if (!match) return { lead: null, rest: stripInlineMd(text) }
  return { lead: stripInlineMd(match[1]), rest: stripInlineMd(match[2]) }
}

const DOTS = ['clay', 'sky', 'moss', 'plum', 'gold', 'rose'] as const

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className="copy-button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch {
          // Clipboard access can be refused; the button simply does not confirm.
        }
      }}
    >
      {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      {copied ? 'Copied' : label}
    </button>
  )
}

function SectionHead({ icon, title, note }: { icon: ReactNode; title: string; note: string }) {
  return (
    <div className="summary-head">
      <span className="card-icon" aria-hidden="true">{icon}</span>
      <div>
        <h2 className="summary-head-title">{title}</h2>
        <p className="summary-head-note">{note}</p>
      </div>
    </div>
  )
}

const SPARKLE = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
)

/* Concise: the passage in the card that names it, then the video's own sections
   as a numbered table of contents. */
function ConciseView({
  text,
  chapters,
  onSeek,
}: {
  text: string
  chapters: Chapter[]
  onSeek: (ms: number) => void
}) {
  const [open, setOpen] = useState(false)
  const visible = open ? chapters : chapters.slice(0, 4)

  return (
    <div className="summary-block">
      <section className="summary-card">
        <div className="summary-card-head">
          <span className="card-icon" aria-hidden="true">{SPARKLE}</span>
          <h2 className="summary-card-title">AI Summary</h2>
          <CopyButton text={text} label="Copy" />
        </div>
        <p className="summary-card-text">{stripInlineMd(text)}</p>
      </section>

      {chapters.length > 0 && (
        <section className="chapters" aria-label="Chapters">
          <div className="chapters-head">
            <span className="card-icon" aria-hidden="true"><ListOrdered size={14} /></span>
            <span className="chapters-title">Chapters</span>
            <button
              type="button"
              className="chapters-count"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {chapters.length} sections
              {open ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
            </button>
          </div>

          <ol className="chapter-list">
            {visible.map((chapter, index) => (
              <li key={chapter.startMs}>
                <button
                  type="button"
                  className="chapter"
                  onClick={() => onSeek(chapter.startMs)}
                  title={`Play from ${formatTime(chapter.startMs)}`}
                >
                  <span className="chapter-num" aria-hidden="true">{index + 1}</span>
                  <span>
                    <span className="chapter-title">{chapter.title}</span>
                    {chapter.note ? <span className="chapter-note">{chapter.note}</span> : null}
                  </span>
                  <span className="chapter-time">
                    {formatTime(chapter.startMs)} – {formatTime(chapter.endMs)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}

/* Detailed: numbered sections. Each one carries the moment of the video it
   shares its vocabulary with, and only when the overlap is strong enough to
   mean a location rather than a coincidence. */
function DetailedView({
  text,
  transcript,
  onSeek,
}: {
  text: string
  transcript: Segment[]
  onSeek: (ms: number) => void
}) {
  const blocks = paragraphs(text)

  if (!blocks) {
    return (
      <div className="summary-block">
        <SectionHead
          icon={<FileText size={15} />}
          title="Detailed Summary"
          note="A comprehensive overview of this video with key points, context, and insights."
        />
        <p className="section-text">{stripInlineMd(text)}</p>
      </div>
    )
  }

  const locations = locateSections(blocks, transcript)

  return (
    <div className="summary-block">
      <SectionHead
        icon={<FileText size={15} />}
        title="Detailed Summary"
        note="A comprehensive overview of this video with key points, context, and insights."
      />
      <ol className="sections">
        {blocks.map((block, index) => {
          const { lead, rest } = splitLead(block)
          const at = locations[index]
          return (
            <li key={index} className="section">
              <span className="section-num" aria-hidden="true">{index + 1}</span>
              <div>
                <div className="section-head">
                  {lead ? <h3 className="section-lead">{lead}</h3> : <span className="section-lead" />}
                  {at !== null ? (
                    <button
                      type="button"
                      className="section-time"
                      onClick={() => onSeek(at)}
                      title={`Play from ${formatTime(at)}`}
                    >
                      {formatTime(at)}
                    </button>
                  ) : null}
                </div>
                <p className="section-text">{rest}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* Bullets: a mark per point, the hue cycling so the list can be scanned. */
function BulletsView({ text }: { text: string }) {
  const items = bulletLines(text)

  return (
    <div className="summary-block">
      <SectionHead
        icon={<ListOrdered size={15} />}
        title="Key Takeaways"
        note="A clear, structured summary of the most important points from this video."
      />
      {items ? (
        <ul className="points">
          {items.map((item, index) => {
            const { lead, rest } = splitLead(item)
            return (
              <li key={index} className="point">
                <span className={`point-dot is-${DOTS[index % DOTS.length]}`} aria-hidden="true" />
                <span>
                  {lead ? <span className="point-lead">{lead}</span> : null}
                  <span className="point-text">{rest}</span>
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="section-text">{stripInlineMd(text)}</p>
      )}
    </div>
  )
}

/* Key points: the same list, ordered, with the number carrying the hue. */
function KeyPointsView({ text }: { text: string }) {
  const items = numberedLines(text)

  return (
    <div className="summary-block">
      <SectionHead
        icon={<ListOrdered size={15} />}
        title="Key Points"
        note="The most important takeaways from this video."
      />
      {items ? (
        <ol className="keypoints">
          {items.map((item, index) => {
            const { lead, rest } = splitLead(item)
            return (
              <li key={index} className="keypoint">
                <span className={`keypoint-num is-${DOTS[index % DOTS.length]}`} aria-hidden="true">
                  {index + 1}
                </span>
                <span>
                  {lead ? <span className="keypoint-lead">{lead}</span> : null}
                  <span className="keypoint-text">{rest}</span>
                </span>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="section-text">{stripInlineMd(text)}</p>
      )}
    </div>
  )
}

export function SummaryPanel({
  summary,
  mode,
  busy,
  onModeChange,
  transcript,
  onSeek,
}: {
  summary: string
  mode: SummaryMode
  busy: boolean
  onModeChange: (mode: SummaryMode) => void
  transcript: Segment[]
  onSeek: (ms: number) => void
}) {
  const text = summary.trim()
  const chapters = chaptersFromSegments(transcript)

  return (
    <>
      <div className="mode-row">
        <div className="mode-col">
          <span className="field-label" id="summary-style">Summary style</span>
          <div className="mode-group" role="group" aria-labelledby="summary-style">
            {SUMMARY_MODES.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={mode === option.value}
                disabled={busy}
                onClick={() => onModeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {text && mode !== 'concise' ? <CopyButton text={text} label="Copy summary" /> : null}
      </div>

      {!text ? (
        <div className="summary-block">
          <p className="muted-note">No summary was returned for this video.</p>
        </div>
      ) : null}

      {text && mode === 'concise' && (
        <ConciseView text={text} chapters={chapters} onSeek={onSeek} />
      )}

      {text && mode === 'detailed' && (
        <DetailedView text={text} transcript={transcript} onSeek={onSeek} />
      )}

      {text && mode === 'bullets' && <BulletsView text={text} />}

      {text && mode === 'keypoints' && <KeyPointsView text={text} />}
    </>
  )
}
