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
    <form className="w-full" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="youtube-url">YouTube video URL</label>
      <div className="flex items-center gap-2.5 rounded-[18px] bg-paper py-[9px] pl-3.5 pr-[9px] shadow-[0_0_0_1px_rgba(26,24,21,0.06),0_2px_4px_rgba(26,24,21,0.04),0_16px_34px_-14px_rgba(26,24,21,0.16)] transition-shadow duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:shadow-[0_0_0_1px_rgba(26,24,21,0.14),0_2px_4px_rgba(26,24,21,0.05),0_18px_38px_-14px_rgba(26,24,21,0.20)]">
        <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-sunken text-ink-4 max-[700px]:h-[30px] max-[700px]:w-[30px]" aria-hidden="true">
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
          className="min-w-0 flex-1 border-0 bg-transparent py-2 text-base text-ink outline-none placeholder:text-ink-5 focus-visible:outline-none"
        />
        <button
          type="submit"
          className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-[13px] bg-ink px-5 text-[14.5px] font-[550] text-paper transition-colors duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#2f2b25] max-[700px]:min-h-10 max-[700px]:px-[15px] max-[700px]:text-[13.5px]"
          disabled={Boolean(busy)}
        >
          Summarize
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
