import { useEffect, useRef, useState } from 'react'
import { VideoOff } from 'lucide-react'
import { formatTime } from '../lib/format'

/** The video, its title and source, and the timestamped transcript. */
export function VideoPane({
  videoId,
  title,
  author,
  transcript,
  currentMs,
  onSeek,
}: {
  videoId: string
  title: string
  author: string
  transcript: { offsetMs: number; text: string }[]
  currentMs: number
  onSeek: (ms: number) => void
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)
  // The embed is not mounted until asked for: opening a video should show a
  // still, never start playing.
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setReady(false)
    setPlaying(false)
  }, [videoId])

  useEffect(() => {
    if (!ready || !frame.current) return
    frame.current.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'seekTo', args: [currentMs / 1000, true] }),
      'https://www.youtube.com',
    )
  }, [ready, currentMs])

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

      <h2 className="video-title">{title || 'Untitled video'}</h2>
      <p className="video-source">{author || 'YouTube'}</p>

      <div className="transcript-block">
        <div className="transcript-heading">
          Transcript
          <span>{transcript.length} sections</span>
        </div>
        {transcript.length === 0 ? (
          <p className="muted-note">
            <VideoOff size={14} aria-hidden="true" />
            No transcript was saved for this video.
          </p>
        ) : (
          <div className="transcript-list">
            {transcript.map((line, index) => {
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
                  <span className="transcript-text">{line.text}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
