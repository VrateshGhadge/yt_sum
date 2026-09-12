import { LoaderCircle } from 'lucide-react'

export function Loading({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2 px-[18px] pt-4 text-[12.5px] text-ink-4" role="status">
      <LoaderCircle className="animate-spin" size={13} aria-hidden="true" />
      {label}
    </p>
  )
}
