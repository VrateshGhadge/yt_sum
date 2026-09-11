export function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** How long a wait has run. Free models answer in 13–84s, so the seconds count
    is the common case and the minute form is the fallback. */
export function formatElapsed(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000))
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export function videoUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export function readableError(status: number, fallback?: string) {
  if (status === 401) return 'Your session expired. Sign in again.'
  if (status === 404) return 'This video has no captions available.'
  // The backend reads the provider's reset time, and the daily cap and the
  // per-minute cap are very different waits — so its message is the useful one.
  if (status === 429) return fallback || 'The model is rate-limited right now. Try again in a moment.'
  if (status === 502) return 'The model is unavailable right now. Try again shortly.'
  if (status === 503) return 'That service is unavailable right now.'
  return fallback || 'Something went wrong. Please try again.'
}
