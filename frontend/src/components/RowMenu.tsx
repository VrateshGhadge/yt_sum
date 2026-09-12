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
    <div className="relative" ref={wrap}>
      <button
        ref={trigger}
        type="button"
        className="grid h-[30px] w-[30px] place-items-center rounded-lg text-ink-4 transition-[color,background] duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sunken hover:text-ink"
        aria-label={`More actions for ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical size={16} aria-hidden="true" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-30 min-w-[168px] rounded-xl bg-paper p-[5px] shadow-[0_0_0_1px_rgba(26,24,21,0.07),0_12px_30px_-10px_rgba(26,24,21,0.24)]"
          role="menu"
        >
          <a
            className="block w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-ink-2 no-underline transition-colors duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sunken hover:text-ink"
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
            className="block w-full rounded-lg px-2.5 py-2 text-left text-[13px] text-danger transition-colors duration-[120ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-danger-wash"
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
