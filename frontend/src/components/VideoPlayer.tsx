import { useEffect, useRef } from 'react'

export function VideoPlayer({ videoId, seekTo }: { videoId?: string; seekTo: number }) {
  const frame = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (!videoId || !frame.current) return
    // YouTube's seekTo command expects seconds; our timestamps are in ms.
    frame.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [seekTo / 1000, true] }), '*')
  }, [seekTo, videoId])
  if (!videoId) return <div className="player-placeholder"><span>Paste a YouTube link to begin</span><small>Your video and research tools will live here.</small></div>
  return <div className="player"><iframe ref={frame} title="Current YouTube video" src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
}
