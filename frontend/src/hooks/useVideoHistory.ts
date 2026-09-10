import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { HistoryItem, TokenGetter } from '../types'

export function useVideoHistory(getToken: TokenGetter) {
  const [history, setHistory] = useState<HistoryItem[]>([])

  const reload = useCallback(
    () =>
      api
        .history(getToken)
        .then(setHistory)
        .catch(() => undefined),
    [getToken],
  )

  useEffect(() => {
    reload()
  }, [reload])

  const remove = useCallback(
    async (id: string) => {
      await api.deleteHistory(getToken, id)
      setHistory((items) => items.filter((entry) => entry._id !== id))
    },
    [getToken],
  )

  return { history, reload, remove }
}
