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
const TOPIC_TONES = ['sky', 'clay', 'plum', 'gold'] as const

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
    <div className="video-pane">
      <div className="video-frame">
        {playing ? (
          <iframe
            ref={frame}
            title={title || 'Video'}
            onLoad={() => setReady(true)}
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&origin=${encodeURIComponent(window.location.origin)}&rel=0&playsinline=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video-poster"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title || 'video'}`}
          >
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" />
            <span className="video-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <h1 className="video-title">{title || 'Untitled video'}</h1>
      <p className="video-meta">
        <User size={13} aria-hidden="true" />
        {author || 'YouTube'}
        {createdAt ? (
          <>
            <span className="video-meta-dot" aria-hidden="true" />
            {formatDate(createdAt)}
          </>
        ) : null}
      </p>

      {topics.length > 0 && (
        <div className="video-chips">
          {shownTopics.map((topic, index) => (
            <span key={topic} className={`tag is-${TOPIC_TONES[index % TOPIC_TONES.length]}`}>
              {topic}
            </span>
          ))}
          {topics.length > VISIBLE_TOPICS ? (
            <button
              type="button"
              className="chip-more"
              aria-expanded={allTopics}
              aria-label={allTopics ? 'Show fewer subjects' : 'Show every subject'}
              onClick={() => setAllTopics((value) => !value)}
            >
              <Plus size={12} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <span className="card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M16 13H8M16 17H8M10 9H8" />
            </svg>
          </span>
          <span className="card-title">Transcript</span>
          <span className="card-count">
            {transcript.length} sections
            {transcript.length > COLLAPSED_LINES ? (
              <button
                type="button"
                className="card-toggle"
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
          <p className="muted-note">
            <VideoOff size={14} aria-hidden="true" />
            No transcript was saved for this video.
          </p>
        ) : (
          <>
            <div className="transcript-list">
              {visible.map((line, index) => {
                const next = transcript[index + 1]
                const isCurrent =
                  currentMs >= line.offsetMs && (!next || currentMs < next.offsetMs)
                return (
                  <button
                    key={index}
                    type="button"
                    className={`transcript-line${isCurrent ? ' is-current' : ''}`}
                    onClick={() => {
                      // Cueing a moment is a deliberate play, so start the video.
                      setPlaying(true)
                      onSeek(line.offsetMs)
                    }}
                  >
                    <span className="transcript-time">{formatTime(line.offsetMs)}</span>
                    <span className="transcript-dot" aria-hidden="true" />
                    <span className="transcript-text">{line.text}</span>
                  </button>
                )
              })}
            </div>

            {transcript.length > COLLAPSED_LINES ? (
              <button
                type="button"
                className="transcript-more"
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
