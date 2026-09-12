import { MoreVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/* The row's overflow actions. There are only two, and one of them is destructive,
   so the menu is small enough to draw here rather than pull in a popover library.
   Escape and a click outside both close it, and focus returns to the trigger so
   the row does not lose the visitor's place. */
export function RowMenu({
  videoUrl,
  onDelete,
  label,
}: {
  videoUrl: string
  onDelete: () => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="row-menu" ref={wrap}>
      <button
        ref={trigger}
        type="button"
        className="row-menu-trigger"
        aria-label={`More actions for ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical size={16} aria-hidden="true" />
      </button>

      {open && (
        <div className="row-menu-list" role="menu">
          <a
            className="row-menu-item"
            role="menuitem"
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Open on YouTube
          </a>
          <button
            type="button"
            className="row-menu-item is-danger"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onDelete()
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
