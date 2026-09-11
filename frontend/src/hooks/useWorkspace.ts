import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { api } from '../api/client'
import { videoUrl } from '../lib/format'
import { navigate, useRoute } from '../lib/router'
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
  const route = useRoute()
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

  const {
    history,
    status: historyStatus,
    error: historyError,
    reload: reloadHistory,
    remove: removeHistory,
  } = useVideoHistory(getToken)

  async function generate(event: FormEvent) {
    event.preventDefault()
    setError('')
    setBusy('Summarizing video')
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
      setSeek(0)
      reloadHistory()
      navigate(`/video/${result.videoId}`)
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
    setError('')
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
    setError('')
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
    setError('')
    setBusy('Searching the video')
    try {
      setAnswer(await api.ask(getToken, { question, videoId: video.videoId }))
    } catch (e) {
      setError(errorMessage(e, 'Unable to answer that question.'))
    } finally {
      setBusy(null)
    }
  }

  // Load a saved record into the workspace. The route effect below calls this,
  // so clicking a history row and pasting its URL take the same path.
  const openRecord = useCallback(
    async (item: HistoryItem) => {
      setBusy('Opening saved video')
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
        // Everything below is per-video. Without clearing it, the previous
        // video's answer, notes and quiz stay on screen against the new video.
        setTab('summary')
        setNotes(null)
        setQuiz(null)
        setAnswer(null)
        setQuestion('')
        setSeek(0)
        setError('')
      } catch (e) {
        setError(errorMessage(e, 'Unable to open this video.'))
      } finally {
        setBusy(null)
      }
    },
    [getToken],
  )

  // One load attempt per visit to a video URL: without this, a failed fetch would
  // re-arm the effect and retry forever.
  const attemptedRef = useRef<string | null>(null)

  // Leaving the video route clears the guard, so a link that failed once is
  // allowed to try again when the visitor comes back to it.
  useEffect(() => {
    if (route.name !== 'video') attemptedRef.current = null
  }, [route])

  useEffect(() => {
    if (route.name !== 'video') return
    if (video?.videoId === route.videoId) return
    if (attemptedRef.current === route.videoId) return
    // A deep link arrives before the list does; wait for it to settle so the
    // video can be resolved by id.
    if (historyStatus === 'idle' || historyStatus === 'loading') return

    const item = history.find((entry) => entry.videoId === route.videoId)
    if (!item) {
      setError(
        historyStatus === 'error'
          ? historyError || 'Unable to load your history.'
          : 'That video is not in your history.',
      )
      navigate('/', { replace: true })
      return
    }

    attemptedRef.current = route.videoId
    void openRecord(item)
  }, [route, video?.videoId, history, historyStatus, historyError, openRecord])

  // The confirmation happens in the row itself, so this only performs the
  // delete once the visitor has confirmed there.
  async function deleteHistory(item: HistoryItem) {
    try {
      await removeHistory(item._id)
    } catch (e) {
      setError(errorMessage(e, 'Unable to delete this analysis.'))
    }
  }

  // Brand click: reset the workspace. The link moves the URL.
  function goHome() {
    setVideo(null)
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
    historyStatus,
    historyError,
    reloadHistory,
    generate,
    changeSummaryMode,
    createNotes,
    createQuiz,
    ask,
    deleteHistory,
    goHome,
  }
}
