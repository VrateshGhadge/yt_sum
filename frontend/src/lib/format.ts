export function timecode(ms: number) {
  const seconds = Math.floor(ms / 1000); const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}
export function videoUrl(videoId: string) { return `https://www.youtube.com/watch?v=${videoId}` }
export function thumbnail(videoId: string) { return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` }
export function readableError(status: number, fallback?: string) {
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 404) return "This video doesn't have captions available."
  if (status === 429) return 'The AI provider is temporarily rate-limited. Try again in a moment.'
  if (status === 502) return 'The AI service is temporarily unavailable.'
  if (status === 503) return 'Some services are currently unavailable.'
  return fallback || 'Something went wrong. Please try again.'
}
