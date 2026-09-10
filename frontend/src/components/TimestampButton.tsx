import { timecode } from '../lib/format'
export function TimestampButton({ ms, onSeek, label }: { ms: number; onSeek: (ms: number) => void; label?: string }) {
  return <button type="button" className="timestamp" onClick={() => onSeek(ms)} aria-label={`Seek video to ${label || timecode(ms)}`}>{label || timecode(ms)}</button>
}
