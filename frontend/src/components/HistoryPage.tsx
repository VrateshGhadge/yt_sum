import { ArrowLeft } from 'lucide-react'
import { formatDate, formatTime, videoUrl } from '../lib/format'
import type { HistoryItem, SummaryMode } from '../types'
import { DeleteButton } from './DeleteButton'
import { Link } from './Link'
import { RowMenu } from './RowMenu'

/* The modes read as words a visitor already knows. "keypoints" is the stored
   value; "Key points" is what it means. */
const MODE_LABEL: Record<SummaryMode, string> = {
  concise: 'Concise',
  detailed: 'Detailed',
  bullets: 'Bullets',
  keypoints: 'Key points',
}

const MUTED = 'flex items-center gap-[7px] text-[13px] leading-[1.55] text-ink-4'
const TAG = 'inline-flex h-[22px] items-center rounded-full px-2.5 text-[11.5px] font-medium'
const CARD =
  'relative flex items-center rounded-2xl bg-paper shadow-[0_0_0_1px_rgba(26,24,21,0.05),0_2px_6px_-2px_rgba(26,24,21,0.06)] transition-shadow duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_0_1px_rgba(26,24,21,0.09),0_10px_24px_-12px_rgba(26,24,21,0.22)]'

export function HistoryPage({
  items,
  status,
  error,
  onDelete,
  onRetry,
}: {
  items: HistoryItem[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string
  onDelete: (item: HistoryItem) => void
  onRetry: () => void
}) {
  return (
    <main className="relative mx-auto min-h-[calc(100dvh-var(--header-h))] max-w-[940px] px-5 pb-20 pt-5 max-[700px]:px-3 max-[700px]:pb-[60px] max-[700px]:pt-[22px]">
      <p
        className="pointer-events-none absolute right-[-112px] top-1 z-[1] text-right font-hand text-base leading-[1.35] text-ink-4 opacity-75 max-[1200px]:hidden [&>svg]:ml-auto [&>svg]:mt-0.5 [&>svg]:block [&>svg]:h-[38px] [&>svg]:w-[76px]"
        aria-hidden="true"
      >
        Revisit
        <br />
        Learn
        <br />
        Go Further
        <svg viewBox="0 0 120 60" fill="none" aria-hidden="true">
          <path
            d="M116 8C92 10 54 26 22 50"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 30 22 50l14-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>

      <div className="pb-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-4">
          Your learning journey
        </p>
        <div className="mt-1.5 flex items-end justify-between gap-5 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-3.5">
          <div>
            {/* One word, two tones: the accent picks up where the ink stops. */}
            <h1 className="text-[40px] font-[640] leading-[1.06] tracking-[-0.035em] text-ink max-[700px]:text-[30px]">
              His<span className="text-accent">tory</span>
            </h1>
            <p className={`${MUTED} mt-[5px]`}>Videos you have summarized, newest first.</p>
          </div>
          <Link
            to="/"
            className="inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-full bg-paper px-4 text-[13.5px] font-medium text-ink no-underline shadow-[0_0_0_1px_rgba(26,24,21,0.07),0_2px_4px_rgba(26,24,21,0.04)] transition-shadow duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_0_1px_rgba(26,24,21,0.12),0_4px_10px_-3px_rgba(26,24,21,0.10)]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to summarizer
          </Link>
        </div>
      </div>

      {status === 'loading' && <p className={MUTED}>Loading…</p>}

      {status === 'error' && (
        <div className="rounded border border-line-2 bg-danger-wash p-4" role="alert">
          <p className="text-[13.5px] text-danger">{error || 'Could not load your history.'}</p>
          <button
            type="button"
            className="mt-2.5 inline-flex min-h-[34px] items-center justify-center gap-1.5 rounded border border-line-2 bg-transparent px-[13px] text-[13px] font-[550] text-ink-2 hover:border-ink-4 hover:text-ink"
            onClick={onRetry}
          >
            Try again
          </button>
        </div>
      )}

      {status === 'success' && items.length === 0 && (
        <div className="pt-12">
          <h2 className="text-[17px] font-[640] text-ink">Nothing here yet</h2>
          <p className="mt-1.5 max-w-[46ch] text-[13.5px] leading-[1.6] text-ink-4">
            Videos you summarize will be listed here so you can reopen them.
          </p>
        </div>
      )}

      {status === 'success' && items.length > 0 && (
        <ul className="grid gap-[11px]">
          {items.map((item) => (
            <li key={item._id} className={CARD}>
              <Link
                to={`/video/${item.videoId}`}
                className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-5 py-3.5 pl-[15px] pr-[76px] max-[700px]:grid-cols-[minmax(0,1fr)] max-[700px]:gap-0 max-[700px]:py-[13px] max-[700px]:pl-[13px] max-[700px]:pr-[62px]"
              >
                <span className="relative block aspect-video w-[140px] shrink-0 overflow-hidden rounded-[9px] bg-sunken max-[700px]:hidden">
                  <img
                    className="block h-full w-full object-cover"
                    src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                  />
                  {item.durationMs ? (
                    <span className="absolute bottom-[5px] right-[5px] rounded px-[5px] py-px text-[10.5px] font-medium text-paper [font-variant-numeric:tabular-nums] bg-[rgba(26,24,21,0.82)]">
                      {formatTime(item.durationMs)}
                    </span>
                  ) : null}
                </span>

                <span className="grid min-w-0 gap-[5px]">
                  <span className="text-[14.5px] font-semibold leading-[1.35] tracking-[-0.012em] text-ink [overflow-wrap:anywhere]">
                    {item.title || 'Untitled video'}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-[9px] gap-y-1 text-[12.5px] text-ink-4">
                    {item.author || 'YouTube'}
                    <span className="h-[3px] w-[3px] rounded-full bg-mark" aria-hidden="true" />
                    {formatDate(item.createdAt)}
                  </span>
                  {/* Three chips, each a real field: what this is, how it was
                      summarized, and how much transcript it covers. */}
                  <span className="mt-[3px] flex flex-wrap gap-1.5">
                    <span className={`${TAG} bg-chip-clay-wash text-chip-clay`}>Summary</span>
                    <span className={`${TAG} bg-chip-sky-wash text-chip-sky`}>{MODE_LABEL[item.summaryMode]}</span>
                    {item.segmentCount ? (
                      <span className={`${TAG} bg-chip-plum-wash text-chip-plum`}>{item.segmentCount} sections</span>
                    ) : null}
                  </span>
                </span>
              </Link>

              <div className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5 max-[700px]:right-2.5">
                <RowMenu
                  videoUrl={item.videoUrl || videoUrl(item.videoId)}
                  label={item.title || 'this video'}
                  onDelete={() => onDelete(item)}
                />
                <DeleteButton
                  label={`Delete ${item.title || 'this video'}`}
                  onConfirm={() => onDelete(item)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
