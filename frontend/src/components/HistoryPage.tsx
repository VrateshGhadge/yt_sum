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
    <main className="history">
      <p className="history-note" aria-hidden="true">
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

      <div className="history-head">
        <p className="history-eyebrow">Your learning journey</p>
        <div className="history-head-row">
          <div>
            {/* One word, two tones: the accent picks up where the ink stops. */}
            <h1 className="history-title">
              His<span>tory</span>
            </h1>
            <p className="muted-note">Videos you have summarized, newest first.</p>
          </div>
          <Link to="/" className="history-back">
            <ArrowLeft size={15} aria-hidden="true" />
            Back to summarizer
          </Link>
        </div>
      </div>

      {status === 'loading' && <p className="muted-note">Loading…</p>}

      {status === 'error' && (
        <div className="history-error" role="alert">
          <p>{error || 'Could not load your history.'}</p>
          <button type="button" className="btn btn-quiet" onClick={onRetry}>Try again</button>
        </div>
      )}

      {status === 'success' && items.length === 0 && (
        <div className="history-empty">
          <h2>Nothing here yet</h2>
          <p>Videos you summarize will be listed here so you can reopen them.</p>
        </div>
      )}

      {status === 'success' && items.length > 0 && (
        <ul className="history-list">
          {items.map((item) => (
            <li key={item._id} className="history-card">
              <Link to={`/video/${item.videoId}`} className="history-open">
                <span className="history-thumb">
                  <img
                    src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                  />
                  {item.durationMs ? (
                    <span className="history-duration">{formatTime(item.durationMs)}</span>
                  ) : null}
                </span>

                <span className="history-body">
                  <span className="history-title">{item.title || 'Untitled video'}</span>
                  <span className="history-meta">
                    {item.author || 'YouTube'}
                    <span className="history-dot" aria-hidden="true" />
                    {formatDate(item.createdAt)}
                  </span>
                  {/* Three chips, each a real field: what this is, how it was
                      summarized, and how much transcript it covers. */}
                  <span className="history-tags">
                    <span className="tag is-clay">Summary</span>
                    <span className="tag is-sky">{MODE_LABEL[item.summaryMode]}</span>
                    {item.segmentCount ? (
                      <span className="tag is-plum">{item.segmentCount} sections</span>
                    ) : null}
                  </span>
                </span>
              </Link>

              <div className="history-actions">
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
