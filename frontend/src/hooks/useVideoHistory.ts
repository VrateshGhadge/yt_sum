import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { HistoryItem, TokenGetter } from '../types'

export type HistoryStatus = 'idle' | 'loading' | 'success' | 'error'

export function useVideoHistory(getToken: TokenGetter) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [status, setStatus] = useState<HistoryStatus>('idle')
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      setHistory(await api.history(getToken))
      setStatus('success')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load history.')
      setStatus('error')
    }
  }, [getToken])

  useEffect(() => {
    void reload()
  }, [reload])

  const remove = useCallback(
    async (id: string) => {
      await api.deleteHistory(getToken, id)
      setHistory((items) => items.filter((entry) => entry._id !== id))
    },
    [getToken],
  )

  return { history, status, error, reload, remove, clearError: () => setError('') }
}
