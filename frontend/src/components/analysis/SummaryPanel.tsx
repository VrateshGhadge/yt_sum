import { SUMMARY_MODES } from '../../constants'
import type { SummaryMode } from '../../types'
import { MarkdownText } from '../MarkdownText'
import { SegmentedToggleButton } from '../SegmentedToggleButton'

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
        <SegmentedToggleButton
          options={SUMMARY_MODES}
          value={mode}
          onChange={onModeChange}
          disabled={Boolean(busy)}
          ariaLabel="Summary mode"
        />
      </div>
      <MarkdownText value={summary} />
    </>
  )
}
