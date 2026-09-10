import { Play, Search } from 'lucide-react'
import type { FormEvent } from 'react'
import { SUMMARY_MODES } from '../constants'
import type { SummaryMode } from '../types'

export function SearchForm({
  url,
  mode,
  busy,
  showModeSelector = true,
  onUrlChange,
  onModeChange,
  onSubmit,
}: {
  url: string
  mode: SummaryMode
  busy: string | null
  showModeSelector?: boolean
  onUrlChange: (url: string) => void
  onModeChange: (mode: SummaryMode) => void
  onSubmit: (event: FormEvent) => void
}) {
  return (
    <form className="url-form" onSubmit={onSubmit}>
      <Search size={19} />
      <input
        value={url}
        onChange={(event) => onUrlChange(event.target.value)}
        placeholder="Analyze a YouTube URL…"
        aria-label="YouTube URL"
      />
      {showModeSelector && (
        <select
          value={mode}
          onChange={(event) => onModeChange(event.target.value as SummaryMode)}
          aria-label="Summary mode"
        >
          {SUMMARY_MODES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      )}
      <button aria-label="Analyze video" disabled={Boolean(busy)}>
        <Play size={15} />
      </button>
    </form>
  )
}
