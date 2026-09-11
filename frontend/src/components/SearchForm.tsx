import { ArrowRight } from 'lucide-react'
import type { FormEvent } from 'react'

export function SearchForm({
  url,
  busy,
  onUrlChange,
  onSubmit,
}: {
  url: string
  busy: string | null
  onUrlChange: (url: string) => void
  onSubmit: (event: FormEvent) => void
}) {
  return (
    <form className="url-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="youtube-url">YouTube video URL</label>
      <div className="url-form-row">
        <input
          id="youtube-url"
          type="url"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          required
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder="Paste a YouTube link"
        />
        <button type="submit" className="url-submit" disabled={Boolean(busy)}>
          Summarize
          <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
