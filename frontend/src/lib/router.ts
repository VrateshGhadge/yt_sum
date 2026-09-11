import { useEffect, useSyncExternalStore } from 'react'
import type { Route } from '../types'

/* Three screens, three URLs.
   The History API is enough for that, and it buys the back button, refresh and
   shareable links without pulling in a router dependency. */

const parsed = new Map<string, Route>()

function parse(path: string): Route {
  const cached = parsed.get(path)
  if (cached) return cached

  const clean = path.replace(/\/+$/, '') || '/'
  const video = /^\/video\/([^/]+)$/.exec(clean)

  let route: Route
  if (clean === '/') route = { name: 'welcome' }
  else if (clean === '/history') route = { name: 'history' }
  else if (video) route = { name: 'video', videoId: decodeURIComponent(video[1]) }
  else route = { name: 'notFound' }

  // Cached so a route keeps one identity across renders: the workspace keys an
  // effect on it, and a fresh object every render would re-fire that effect.
  parsed.set(path, route)
  return route
}

const currentPath = () => window.location.pathname

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

export function useRoute(): Route {
  const route = parse(useSyncExternalStore(subscribe, currentPath, () => '/'))

  // An unknown path is a dead end. Send it home rather than render a screen the
  // address does not name.
  useEffect(() => {
    if (route.name === 'notFound') navigate('/', { replace: true })
  }, [route])

  return route
}

export function navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
  if (window.location.pathname === to) return

  if (replace) window.history.replaceState(null, '', to)
  else {
    window.history.pushState(null, '', to)
    window.scrollTo(0, 0)
  }

  // pushState and replaceState are silent, so the store has to be told.
  window.dispatchEvent(new PopStateEvent('popstate'))
}
