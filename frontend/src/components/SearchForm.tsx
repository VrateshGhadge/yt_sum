import { ArrowRight, Link2 } from 'lucide-react'
import type { FormEvent } from 'react'

/* The one field on the home screen, set in a card of its own so it reads as
   the thing to do rather than one line among many. */
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
        <span className="url-form-icon" aria-hidden="true">
          <Link2 size={17} />
        </span>
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
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
