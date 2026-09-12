import { useEffect, useState } from 'react'
import { useWorkspace } from '../hooks/useWorkspace'
import { useRoute } from '../lib/router'
import type { TokenGetter } from '../types'
import { AppHeader } from './AppHeader'
import { HistoryPage } from './HistoryPage'
import { LoadingOverlay } from './LoadingOverlay'
import { SearchForm } from './SearchForm'
import { StatusBanner } from './StatusBanner'
import { WelcomeScreen } from './WelcomeScreen'
import { WorkspaceView } from './WorkspaceView'

export function Workspace({ getToken }: { getToken: TokenGetter }) {
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const route = useRoute()
  const {
    url,
    setUrl,
    video,
    mode,
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
  } = useWorkspace(getToken)

  // A dismissal belongs to the error it dismissed, not to the session.
  useEffect(() => {
    setBannerDismissed(false)
  }, [route])

  const view = route.name === 'video' ? 'video' : route.name === 'history' ? 'history' : 'welcome'

  return (
    <div className="min-h-[100dvh]">
      <AppHeader view={view} onHome={goHome} />
      <StatusBanner
        message={bannerDismissed ? '' : error}
        onDismiss={() => setBannerDismissed(true)}
      />

      {route.name === 'history' ? (
        <HistoryPage
          items={history}
          status={historyStatus}
          error={historyError}
          onDelete={deleteHistory}
          onRetry={() => void reloadHistory()}
        />
      ) : route.name === 'video' ? (
        video ? (
          <WorkspaceView
            video={video}
            currentMs={seek}
            onSeek={setSeek}
            tab={tab}
            onTabChange={setTab}
            busy={busy}
            summary={video.summary}
            mode={mode}
            onModeChange={changeSummaryMode}
            question={question}
            answer={answer}
            onQuestionChange={setQuestion}
            onAsk={ask}
            notes={notes}
            onGenerateNotes={createNotes}
            quiz={quiz}
            onGenerateQuiz={createQuiz}
          />
        ) : (
          // A deep link resolves from history before the workspace can paint.
          <main className="grid min-h-[40dvh] place-items-center text-[13px] text-ink-4" role="status">
            Opening saved video
          </main>
        )
      ) : (
        <WelcomeScreen
          includeTranscript={includeTranscript}
          onIncludeTranscriptChange={setIncludeTranscript}
        >
          <SearchForm url={url} busy={busy} onUrlChange={setUrl} onSubmit={generate} />
        </WelcomeScreen>
      )}

      {analyzing && <LoadingOverlay label="Summarizing video" />}
    </div>
  )
}
