import { LoaderCircle } from 'lucide-react'

export function Loading({ label }: { label: string }) {
  return (
    <p className="pending" role="status">
      <LoaderCircle size={13} aria-hidden="true" />
      {label}
    </p>
  )
}
