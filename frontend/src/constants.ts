import { BookOpen, CircleHelp, FileText, MessageSquare } from 'lucide-react'
import type { SummaryMode, WorkspaceTab } from './types'

export const SUMMARY_MODES: { value: SummaryMode; label: string }[] = [
  { value: 'concise', label: 'Concise' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'bullets', label: 'Bullets' },
  { value: 'keypoints', label: 'Key points' },
]

export const WORKSPACE_TABS: {
  id: WorkspaceTab
  label: string
  icon: typeof FileText
}[] = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'ask', label: 'Ask AI', icon: MessageSquare },
  { id: 'notes', label: 'Notes', icon: BookOpen },
  { id: 'quiz', label: 'Quiz', icon: CircleHelp },
]
