import { MarkdownText } from '../MarkdownText'

export function SummaryPanel({ summary }: { summary: string }) {
  if (!summary.trim()) {
    return <p className="muted-note">No summary was returned for this video.</p>
  }
  return <MarkdownText value={summary} />
}
