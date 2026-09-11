import { formatDate } from '../lib/format'
import type { HistoryItem } from '../types'
import { DeleteButton } from './DeleteButton'
import { Link } from './Link'

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
      <div className="history-head">
        <div>
          <h1>History</h1>
          <p className="muted-note">Videos you have summarized, newest first.</p>
        </div>
        <Link to="/" className="btn btn-quiet">
          Back to summarizer
        </Link>
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
            <li key={item._id} className="history-row">
              <Link to={`/video/${item.videoId}`} className="history-open">
                <img src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`} alt="" />
                <span className="history-body">
                  <span className="history-title">{item.title || 'Untitled video'}</span>
                  <span className="history-meta">
                    {item.author || 'YouTube'} · {item.summaryMode} · {formatDate(item.createdAt)}
                  </span>
                </span>
              </Link>
              <DeleteButton
                label={`Delete ${item.title || 'this video'}`}
                onConfirm={() => onDelete(item)}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
