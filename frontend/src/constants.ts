import type { SummaryMode, WorkspaceTab } from './types'

export const SUMMARY_MODES: { value: SummaryMode; label: string }[] = [
  { value: 'concise', label: 'Concise' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'bullets', label: 'Bullets' },
  { value: 'keypoints', label: 'Key points' },
]

/** The transcript is shown beside the video, so it is not a tab. */
export const TABS: { id: WorkspaceTab; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'ask', label: 'Ask' },
  { id: 'notes', label: 'Notes' },
  { id: 'quiz', label: 'Quiz' },
]
