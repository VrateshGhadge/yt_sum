import { EmptyFeature } from '../EmptyFeature'
import { MarkdownText } from '../MarkdownText'

export function NotesPanel({
  notes,
  busy,
  onGenerate,
}: {
  notes: string | null
  busy: string | null
  onGenerate: () => void
}) {
  if (notes) return <MarkdownText value={notes} />
  return (
    <EmptyFeature
      title="No notes yet"
      text="Turn this video into study notes you can read later."
      action="Generate notes"
      disabled={Boolean(busy)}
      onClick={onGenerate}
    />
  )
}
