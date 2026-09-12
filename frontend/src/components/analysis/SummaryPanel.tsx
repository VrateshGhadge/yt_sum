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

/* The mark each row carries, cycling so a list can be scanned. */
const DOTS = [
  'bg-clay-wash text-clay',
  'bg-sky-wash text-sky',
  'bg-moss-wash text-moss',
  'bg-plum-wash text-plum',
  'bg-gold-wash text-gold',
  'bg-rose-wash text-rose',
]

const BLOCK = 'grid gap-5 pt-4 max-[700px]:gap-[17px]'
const HEAD_TITLE = 'text-[14.5px] font-[620] tracking-[-0.015em] text-ink'
const HEAD_NOTE = 'mt-[3px] text-[12.5px] leading-[1.5] text-ink-4'
const CARD_ICON = 'grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-wash text-accent'
const LEAD = 'block text-[13.5px] font-[620] text-ink'
const TEXT = 'mt-0.5 block max-w-[30rem] text-[13.5px] leading-[1.6] text-ink-3'
const FALLBACK = 'mt-[5px] max-w-[30rem] text-[13.5px] leading-[1.62] text-ink-3'
const NUM = 'grid h-6 w-6 place-items-center rounded-[7px] bg-sunken text-[11.5px] font-[620] text-accent'
const TIME = 'shrink-0 whitespace-nowrap rounded-md bg-sunken px-2 py-0.5 text-[11px] text-ink-4 [font-variant-numeric:tabular-nums]'
const DIVIDED = '[&>li+li]:border-t [&>li+li]:border-line'

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className="inline-flex h-[30px] shrink-0 items-center gap-[7px] rounded-lg border border-line-2 bg-card px-[11px] text-[12.5px] font-medium text-ink-3 transition-[color,border-color] duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-line-3 hover:text-ink max-[700px]:self-start"
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
    <div className="flex gap-[11px]">
      <span className={CARD_ICON} aria-hidden="true">{icon}</span>
      <div>
        <h2 className={HEAD_TITLE}>{title}</h2>
        <p className={HEAD_NOTE}>{note}</p>
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
    <div className={BLOCK}>
      <section className="rounded-[14px] bg-sunken px-4 pb-[17px] pt-[15px]">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-card text-accent" aria-hidden="true">
            {SPARKLE}
          </span>
          <h2 className="flex-1 text-sm font-[620] text-ink">AI Summary</h2>
          <CopyButton text={text} label="Copy" />
        </div>
        <p className="mt-3 max-w-[30rem] text-[14.5px] leading-[1.68] text-ink-2">{stripInlineMd(text)}</p>
      </section>

      {chapters.length > 0 && (
        <section className="grid border-t border-line pt-4" aria-label="Chapters">
          <div className="flex items-center gap-2.5 pb-2">
            <span className={CARD_ICON} aria-hidden="true"><ListOrdered size={14} /></span>
            <span className="flex-1 text-[13.5px] font-[620] text-ink">Chapters</span>
            <button
              type="button"
              className="inline-flex items-center gap-[5px] text-xs text-ink-4 hover:text-ink"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {chapters.length} sections
              {open ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
            </button>
          </div>

          <ol className={DIVIDED}>
            {visible.map((chapter, index) => (
              <li key={chapter.startMs}>
                <button
                  type="button"
                  className="group grid w-full grid-cols-[24px_minmax(0,1fr)_auto] items-start gap-[11px] rounded-[9px] px-2 py-2.5 text-left transition-colors duration-[130ms] hover:bg-sunken max-[700px]:grid-cols-[22px_minmax(0,1fr)_auto] max-[700px]:gap-[9px] max-[700px]:px-1 max-[700px]:py-[9px]"
                  onClick={() => onSeek(chapter.startMs)}
                  title={`Play from ${formatTime(chapter.startMs)}`}
                >
                  <span className={`${NUM} group-hover:bg-card`} aria-hidden="true">{index + 1}</span>
                  <span>
                    <span className="block text-[13px] font-semibold leading-[1.45] text-ink">{chapter.title}</span>
                    {chapter.note ? (
                      <span className="mt-0.5 line-clamp-1 text-[12.5px] leading-[1.5] text-ink-4">{chapter.note}</span>
                    ) : null}
                  </span>
                  <span className={`${TIME} group-hover:text-ink-3`}>
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
      <div className={BLOCK}>
        <SectionHead
          icon={<FileText size={15} />}
          title="Detailed Summary"
          note="A comprehensive overview of this video with key points, context, and insights."
        />
        <p className={FALLBACK}>{stripInlineMd(text)}</p>
      </div>
    )
  }

  const locations = locateSections(blocks, transcript)

  return (
    <div className={BLOCK}>
      <SectionHead
        icon={<FileText size={15} />}
        title="Detailed Summary"
        note="A comprehensive overview of this video with key points, context, and insights."
      />
      <ol className={`grid ${DIVIDED}`}>
        {blocks.map((block, index) => {
          const { lead, rest } = splitLead(block)
          const at = locations[index]
          return (
            <li key={index} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3 py-[13px]">
              <span className={NUM} aria-hidden="true">{index + 1}</span>
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  {lead ? (
                    <h3 className="text-[13.5px] font-[620] text-ink">{lead}</h3>
                  ) : (
                    <span className="text-[13.5px] font-[620]" />
                  )}
                  {at !== null ? (
                    <button
                      type="button"
                      className={`${TIME} transition-colors duration-[140ms] hover:text-ink`}
                      onClick={() => onSeek(at)}
                      title={`Play from ${formatTime(at)}`}
                    >
                      {formatTime(at)}
                    </button>
                  ) : null}
                </div>
                <p className={FALLBACK}>{rest}</p>
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
    <div className={BLOCK}>
      <SectionHead
        icon={<ListOrdered size={15} />}
        title="Key Takeaways"
        note="A clear, structured summary of the most important points from this video."
      />
      {items ? (
        <ul className={`grid ${DIVIDED}`}>
          {items.map((item, index) => {
            const { lead, rest } = splitLead(item)
            return (
              <li key={index} className="grid grid-cols-[8px_minmax(0,1fr)] gap-[13px] py-[11px]">
                <span className={`mt-1.5 h-2 w-2 rounded-full ${DOTS[index % DOTS.length]}`} aria-hidden="true" />
                <span>
                  {lead ? <span className={LEAD}>{lead}</span> : null}
                  <span className={TEXT}>{rest}</span>
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className={FALLBACK}>{stripInlineMd(text)}</p>
      )}
    </div>
  )
}

/* Key points: the same list, ordered, with the number carrying the hue. */
function KeyPointsView({ text }: { text: string }) {
  const items = numberedLines(text)

  return (
    <div className={BLOCK}>
      <SectionHead
        icon={<ListOrdered size={15} />}
        title="Key Points"
        note="The most important takeaways from this video."
      />
      {items ? (
        <ol className={`grid ${DIVIDED}`}>
          {items.map((item, index) => {
            const { lead, rest } = splitLead(item)
            return (
              <li key={index} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3 py-3">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-[7px] text-xs font-[620] ${DOTS[index % DOTS.length]}`}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span>
                  {lead ? <span className={LEAD}>{lead}</span> : null}
                  <span className={TEXT}>{rest}</span>
                </span>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className={FALLBACK}>{stripInlineMd(text)}</p>
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
      <div className="flex items-end justify-between gap-3.5 border-b border-line pb-4 max-[700px]:flex-col max-[700px]:items-stretch max-[700px]:gap-3">
        <div className="grid min-w-0 gap-[9px]">
          <span className="block text-[12.5px] font-[550] text-ink-3" id="summary-style">
            Summary style
          </span>
          <div className="flex flex-wrap gap-[7px]" role="group" aria-labelledby="summary-style">
            {SUMMARY_MODES.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={mode === option.value}
                disabled={busy}
                onClick={() => onModeChange(option.value)}
                className="h-[30px] rounded-lg border border-line-2 bg-card px-[13px] text-[12.5px] font-medium text-ink-3 transition-[color,border-color,background] duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-line-3 hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {text && mode !== 'concise' ? <CopyButton text={text} label="Copy summary" /> : null}
      </div>

      {!text ? (
        <div className={BLOCK}>
          <p className="flex items-center gap-[7px] text-[13px] leading-[1.55] text-ink-4">
            No summary was returned for this video.
          </p>
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
