import { LoaderCircle } from 'lucide-react'

export function Loading({ label }: { label: string }) {
  return (
    <div className="loading">
      <LoaderCircle className="spin" size={17} />
      {label}
    </div>
  )
}
