import { ChevronDown, ChevronUp, Plus, User, VideoOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formatDate, formatTime } from '../lib/format'
import { topicsFromTitle } from '../lib/topics'
import type { Segment } from '../types'

/* How many transcript lines to show before the card asks to be expanded. The
   design hides the rest behind "Show more" rather than scrolling a long list. */
const COLLAPSED_LINES = 4

/* Three subjects fit the row beside the title; the rest wait behind the +. */
const VISIBLE_TOPICS = 3
const TOPIC_TONES = [
  'bg-chip-sky-wash text-chip-sky',
  'bg-chip-clay-wash text-chip-clay',
  'bg-chip-plum-wash text-chip-plum',
  'bg-gold-wash text-gold',
]

const TAG = 'inline-flex h-[22px] items-center rounded-full px-2.5 text-[11.5px] font-medium'

/** The video, its title and source, and the timestamped transcript. */
export function VideoPane({
  videoId,
  title,
  author,
  createdAt,
  transcript,
  currentMs,
  onSeek,
}: {
  videoId: string
  title: string
  author: string
  createdAt?: string
  transcript: Segment[]
  currentMs: number
  onSeek: (ms: number) => void
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)
  // The embed is not mounted until asked for: opening a video should show a
  // still, never start playing.
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [allTopics, setAllTopics] = useState(false)

  useEffect(() => {
    setReady(false)
    setPlaying(false)
    setExpanded(false)
    setAllTopics(false)
  }, [videoId])

  useEffect(() => {
    if (!ready || !frame.current) return
    frame.current.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'seekTo', args: [currentMs / 1000, true] }),
      'https://www.youtube.com',
    )
  }, [ready, currentMs])

  const visible = expanded ? transcript : transcript.slice(0, COLLAPSED_LINES)
  const topics = topicsFromTitle(title)
  const shownTopics = allTopics ? topics : topics.slice(0, VISIBLE_TOPICS)

  return (
    <div className="min-w-0 pb-[26px] max-[1080px]:pb-1.5">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-[#12100e]">
        {playing ? (
          <iframe
            ref={frame}
            title={title || 'Video'}
            onLoad={() => setReady(true)}
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&playsinline=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="block h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            className="group relative block h-full w-full cursor-pointer border-0 bg-[#12100e] p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title || 'video'}`}
          >
            <img
              className="block h-full w-full object-cover"
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
            />
            <span className="absolute inset-0 grid place-items-center text-paper" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
                className="h-[54px] w-[54px] rounded-full bg-[rgba(26,24,21,0.78)] p-4 transition-colors duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-ink"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <h1 className="mt-3.5 text-[19px] font-[620] leading-[1.28] tracking-[-0.022em] text-ink [overflow-wrap:anywhere]">
        {title || 'Untitled video'}
      </h1>
      <p className="mt-[7px] flex items-center gap-2 text-[12.5px] text-ink-4">
        <User className="shrink-0" size={13} aria-hidden="true" />
        {author || 'YouTube'}
        {createdAt ? (
          <>
            <span className="h-[3px] w-[3px] rounded-full bg-mark" aria-hidden="true" />
            {formatDate(createdAt)}
          </>
        ) : null}
      </p>

      {topics.length > 0 && (
        <div className="mt-[11px] flex flex-wrap gap-1.5">
          {shownTopics.map((topic, index) => (
            <span key={topic} className={`${TAG} ${TOPIC_TONES[index % TOPIC_TONES.length]}`}>
              {topic}
            </span>
          ))}
          {topics.length > VISIBLE_TOPICS ? (
            <button
              type="button"
              className="grid h-[22px] w-[22px] place-items-center rounded-full border border-line-2 bg-card text-ink-4 transition-colors duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-line-3 hover:text-ink"
              aria-expanded={allTopics}
              aria-label={allTopics ? 'Show fewer subjects' : 'Show every subject'}
              onClick={() => setAllTopics((value) => !value)}
            >
              <Plus size={12} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      )}

      <div className="mt-4 rounded-[14px] border border-line bg-card px-3.5">
        <div className="flex items-center gap-2.5 border-b border-line pb-[11px] pt-3">
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-wash text-accent"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M16 13H8M16 17H8M10 9H8" />
            </svg>
          </span>
          <span className="flex-1 text-[13.5px] font-[620] text-ink">Transcript</span>
          <span className="inline-flex items-center gap-[7px] text-[12.5px] text-ink-4">
            {transcript.length} sections
            {transcript.length > COLLAPSED_LINES ? (
              <button
                type="button"
                className="grid h-[22px] w-[22px] place-items-center rounded-full text-ink-4 hover:bg-sunken hover:text-ink"
                aria-expanded={expanded}
                aria-label={expanded ? 'Collapse transcript' : 'Expand transcript'}
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            ) : null}
          </span>
        </div>

        {transcript.length === 0 ? (
          <p className="flex items-center gap-[7px] py-3 text-[13px] leading-[1.55] text-ink-4">
            <VideoOff size={14} aria-hidden="true" />
            No transcript was saved for this video.
          </p>
        ) : (
          <>
            <div className="max-h-[520px] overflow-y-auto pb-[9px] pt-[5px]">
              {visible.map((line, index) => {
                const next = transcript[index + 1]
                const isCurrent = currentMs >= line.offsetMs && (!next || currentMs < next.offsetMs)
                return (
                  <button
                    key={index}
                    type="button"
                    className={`grid w-full grid-cols-[44px_8px_minmax(0,1fr)] items-baseline gap-2.5 rounded-[9px] px-2 py-[9px] text-left transition-colors duration-[130ms] hover:bg-sunken max-[700px]:grid-cols-[40px_7px_minmax(0,1fr)] max-[700px]:gap-2 ${
                      isCurrent ? 'bg-sunken' : ''
                    }`}
                    onClick={() => {
                      // Cueing a moment is a deliberate play, so start the video.
                      setPlaying(true)
                      onSeek(line.offsetMs)
                    }}
                  >
                    <span
                      className={`text-[11.5px] [font-variant-numeric:tabular-nums] ${isCurrent ? 'text-ink' : 'text-ink-4'}`}
                    >
                      {formatTime(line.offsetMs)}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 self-center rounded-full ${isCurrent ? 'bg-ink' : 'bg-mark'}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`max-w-[28rem] text-[13.5px] leading-[1.62] [overflow-wrap:anywhere] ${isCurrent ? 'text-ink' : 'text-ink-2'}`}
                    >
                      {line.text}
                    </span>
                  </button>
                )
              })}
            </div>

            {transcript.length > COLLAPSED_LINES ? (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 pb-[11px] pt-[9px] text-[12.5px] font-medium text-ink-3 hover:text-ink"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? 'Show less' : 'Show more'}
                {expanded ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
