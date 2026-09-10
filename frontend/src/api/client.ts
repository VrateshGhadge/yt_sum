import type { Citation, HistoryItem, QuizQuestion, SummaryMode, VideoData } from '../types'
import { readableError } from '../lib/format'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
type TokenGetter = () => Promise<string | null>
type Envelope<T> = { success: boolean; data: T; message?: string }

async function request<T>(path: string, getToken: TokenGetter, init?: RequestInit): Promise<T> {
  const token = await getToken()
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}`, ...init?.headers } })
  const body = await response.json().catch(() => null) as Envelope<T> | null
  if (!response.ok || !body?.success) throw new Error(readableError(response.status, body?.message))
  return body.data
}

export const api = {
  summary(getToken: TokenGetter, input: { youtubeUrl: string; mode: SummaryMode; includeTranscript: boolean }) { return request<VideoData>('/api/summary', getToken, { method: 'POST', body: JSON.stringify(input) }) },
  ask(getToken: TokenGetter, input: { question: string; videoId: string }) { return request<{ answer: string; citations: Citation[] }>('/api/ask', getToken, { method: 'POST', body: JSON.stringify(input) }) },
  notes(getToken: TokenGetter, videoId: string) { return request<{ notes: string }>('/api/notes', getToken, { method: 'POST', body: JSON.stringify({ videoId }) }) },
  quiz(getToken: TokenGetter, videoId: string, questionCount = 5) { return request<{ questions: QuizQuestion[] }>('/api/quiz', getToken, { method: 'POST', body: JSON.stringify({ videoId, questionCount }) }) },
  history(getToken: TokenGetter) { return request<{ items: HistoryItem[] }>('/api/history', getToken).then(({ items }) => items) },
  historyItem(getToken: TokenGetter, id: string) { return request<HistoryItem>(`/api/history/${id}`, getToken) },
  deleteHistory(getToken: TokenGetter, id: string) { return request<unknown>(`/api/history/${id}`, getToken, { method: 'DELETE' }) },
  transcript(getToken: TokenGetter, youtubeUrl: string) { return request<{ transcript: string; videoId: string }>('/api/transcript', getToken, { method: 'POST', body: JSON.stringify({ youtubeUrl }) }) },
}
