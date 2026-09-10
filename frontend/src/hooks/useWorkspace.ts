import { useState, type FormEvent } from 'react'
import { api } from '../api/client'
import { videoUrl } from '../lib/format'
import { useVideoHistory } from './useVideoHistory'
import type {
  Answer,
  HistoryItem,
  QuizQuestion,
  SummaryMode,
  TokenGetter,
  VideoData,
  WorkspaceTab,
} from '../types'

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function useWorkspace(getToken: TokenGetter) {
  const [url, setUrl] = useState('')
  const [video, setVideo] = useState<VideoData | null>(null)
  const [mode, setMode] = useState<SummaryMode>('concise')
  const [includeTranscript, setIncludeTranscript] = useState(true)
  const [tab, setTab] = useState<WorkspaceTab>('summary')
  const [busy, setBusy] = useState<string | null>(null)
  // Dedicated flag for the main-page summarize run, so the full-screen loader
  // only covers that flow (not notes/quiz/history actions).
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [seek, setSeek] = useState(0)
  const [notes, setNotes] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)

  const { history, reload: reloadHistory, remove: removeHistory } =
    useVideoHistory(getToken)

  async function generate(event: FormEvent) {
    event.preventDefault()
    setError('')
    setBusy('Analyzing video')
    setAnalyzing(true)
    try {
      const result = await api.summary(getToken, {
        youtubeUrl: url,
        mode,
        includeTranscript,
      })
      setVideo(result)
      setTab('summary')
      setNotes(null)
      setQuiz(null)
      setAnswer(null)
      reloadHistory()
    } catch (e) {
      setError(errorMessage(e, 'Unable to analyze this video.'))
    } finally {
      setBusy(null)
      setAnalyzing(false)
    }
  }

  async function changeSummaryMode(next: SummaryMode) {
    setMode(next)
    if (!video) return
    const source = url || videoUrl(video.videoId)
    if (!source) return
    setError('')
    setBusy('Re-summarizing')
    try {
      setVideo(
        await api.summary(getToken, {
          youtubeUrl: source,
          mode: next,
          includeTranscript,
        }),
      )
    } catch (e) {
      setError(errorMessage(e, 'Unable to re-summarize this video.'))
    } finally {
      setBusy(null)
    }
  }

  async function createNotes() {
    if (!video) return
    setBusy('Creating notes')
    try {
      setNotes((await api.notes(getToken, video.videoId)).notes)
    } catch (e) {
      setError(errorMessage(e, 'Unable to create notes.'))
    } finally {
      setBusy(null)
    }
  }

  async function createQuiz() {
    if (!video) return
    setBusy('Creating quiz')
    try {
      setQuiz((await api.quiz(getToken, video.videoId)).questions)
    } catch (e) {
      setError(errorMessage(e, 'Unable to create quiz.'))
    } finally {
      setBusy(null)
    }
  }

  async function ask(event: FormEvent) {
    event.preventDefault()
    if (!video || !question.trim()) return
    setBusy('Searching the video')
    try {
      setAnswer(await api.ask(getToken, { question, videoId: video.videoId }))
    } catch (e) {
      setError(errorMessage(e, 'Unable to answer that question.'))
    } finally {
      setBusy(null)
    }
  }

  async function openHistory(item: HistoryItem) {
    setBusy('Opening saved analysis')
    try {
      const record = await api.historyItem(getToken, item._id)
      setVideo({
        historyId: record._id,
        videoId: record.videoId,
        title: record.title,
        author: record.author,
        mode: record.summaryMode,
        summary: record.summary,
        transcript: record.transcriptText,
        timestamps: record.segments,
      })
      setUrl(record.videoUrl || videoUrl(record.videoId))
      setMode(record.summaryMode)
      setHistoryOpen(false)
    } catch (e) {
      setError(errorMessage(e, 'Unable to open this analysis.'))
    } finally {
      setBusy(null)
    }
  }

  async function deleteHistory(item: HistoryItem) {
    if (!window.confirm(`Delete “${item.title || 'this video'}”?`)) return
    try {
      await removeHistory(item._id)
    } catch (e) {
      setError(errorMessage(e, 'Unable to delete this analysis.'))
    }
  }

  // Brand click: always return to the main page, from any state.
  function goHome() {
    setVideo(null)
    setHistoryOpen(false)
    setTab('summary')
    setUrl('')
    setError('')
    setNotes(null)
    setQuiz(null)
    setAnswer(null)
    setQuestion('')
  }

  return {
    url,
    setUrl,
    video,
    mode,
    setMode,
    includeTranscript,
    setIncludeTranscript,
    tab,
    setTab,
    busy,
    analyzing,
    error,
    seek,
    setSeek,
    notes,
    quiz,
    question,
    setQuestion,
    answer,
    history,
    historyOpen,
    setHistoryOpen,
    generate,
    changeSummaryMode,
    createNotes,
    createQuiz,
    ask,
    openHistory,
    deleteHistory,
    goHome,
  }
}
