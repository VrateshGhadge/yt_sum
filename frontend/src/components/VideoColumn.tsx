import { Search } from 'lucide-react'
import { TimestampButton } from './TimestampButton'
import { VideoPlayer } from './VideoPlayer'
import type { VideoData } from '../types'

export function VideoColumn({
  video,
  seek,
  onSeek,
}: {
  video: VideoData
  seek: number
  onSeek: (ms: number) => void
}) {
  return (
    <section className="video-column">
      <VideoPlayer videoId={video.videoId} seekTo={seek} />
      <h1>{video.title || 'YouTube video'}</h1>
      <p className="video-byline">
        {video.author || 'Video analysis'} <i /> Analyzed just now
      </p>
      {video.timestamps?.length ? (
        <div className="transcript">
          <div className="transcript-heading">
            <span>Full transcript</span>
            <Search size={16} />
          </div>
          {video.timestamps.map((segment, index) => (
            <p key={index}>
              <TimestampButton ms={segment.offsetMs} onSeek={onSeek} />
              {segment.text}
            </p>
          ))}
        </div>
      ) : (
        <p className="no-transcript">
          A timestamped transcript was not included for this analysis.
        </p>
      )}
    </section>
  )
}
