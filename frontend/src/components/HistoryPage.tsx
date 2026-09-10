import { ChevronRight, History, Trash2 } from 'lucide-react'
import { thumbnail } from '../lib/format'
import type { HistoryItem } from '../types'

export function HistoryPage({
  history,
  onClose,
  onOpen,
  onDelete,
}: {
  history: HistoryItem[]
  onClose: () => void
  onOpen: (item: HistoryItem) => void
  onDelete: (item: HistoryItem) => void
}) {
  return (
    <main className="history-page">
      <div className="history-heading">
        <div>
          <span className="section-kicker">Your library</span>
          <h1>History</h1>
        </div>
        <button className="back-button" onClick={onClose}>
          Back to workspace
        </button>
      </div>
      {history.length ? (
        <div className="history-list">
          {history.map((item) => (
            <article key={item._id}>
              <img src={thumbnail(item.videoId)} alt="" />
              <div>
                <span>
                  {item.summaryMode} ·{' '}
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <h2>{item.title || 'Untitled YouTube video'}</h2>
                <p>{item.author || 'YouTube'}</p>
              </div>
              <button onClick={() => onOpen(item)}>
                Open <ChevronRight size={16} />
              </button>
              <button
                className="delete"
                aria-label="Delete analysis"
                onClick={() => onDelete(item)}
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="history-empty">
          <History size={28} />
          <h2>No videos yet</h2>
          <p>Your analyzed videos will appear here.</p>
        </div>
      )}
    </main>
  )
}
