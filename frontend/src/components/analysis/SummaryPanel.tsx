import { SUMMARY_MODES } from '../../constants'
import type { SummaryMode } from '../../types'
import { MarkdownText } from '../MarkdownText'

export function SummaryPanel({
  summary,
  mode,
  busy,
  onModeChange,
}: {
  summary: string
  mode: SummaryMode
  busy: string | null
  onModeChange: (mode: SummaryMode) => void
}) {
  return (
    <>
      <div className="mode-switch">
        {SUMMARY_MODES.map((item) => (
          <button
            className={mode === item.value ? 'active' : ''}
            onClick={() => onModeChange(item.value)}
            disabled={Boolean(busy)}
            key={item.value}
          >
            {item.label}
          </button>
        ))}
      </div>
      <MarkdownText value={summary} />
    </>
  )
}
