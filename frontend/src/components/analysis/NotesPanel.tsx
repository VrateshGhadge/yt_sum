import { BookOpen } from 'lucide-react'
import { EmptyFeature } from '../EmptyFeature'
import { MarkdownText } from '../MarkdownText'

export function NotesPanel({
  notes,
  onGenerate,
}: {
  notes: string | null
  onGenerate: () => void
}) {
  if (notes) return <MarkdownText value={notes} />
  return (
    <EmptyFeature
      icon={<BookOpen size={20} />}
      title="Notes, made from the video."
      text="Create structured study notes from the current transcript."
      action="Generate notes"
      onClick={onGenerate}
    />
  )
}
