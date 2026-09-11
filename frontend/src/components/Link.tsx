import type { AnchorHTMLAttributes } from 'react'
import { navigate } from '../lib/router'

/* A link that navigates in place. It keeps a real href, so middle-click and
   open-in-new-tab behave the way a link should. */
export function Link({
  to,
  onClick,
  children,
  ...rest
}: { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        // Modified clicks belong to the browser: the visitor asked for a new tab
        // or window, and cancelling that gives them something else.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
