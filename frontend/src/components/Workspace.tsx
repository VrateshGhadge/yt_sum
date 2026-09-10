import { AnimatePresence, motion } from 'framer-motion'
import { WORKSPACE_TABS } from '../constants'
import { useWorkspace } from '../hooks/useWorkspace'
import type { TokenGetter } from '../types'
import { AskPanel } from './analysis/AskPanel'
import { NotesPanel } from './analysis/NotesPanel'
import { QuizPanel } from './analysis/QuizPanel'
import { SummaryPanel } from './analysis/SummaryPanel'
import { AppHeader } from './AppHeader'
import { HistoryPage } from './HistoryPage'
import { Loading } from './Loading'
import { LoadingOverlay } from './LoadingOverlay'
import { SearchForm } from './SearchForm'
import { VideoColumn } from './VideoColumn'
import { WelcomeScreen } from './WelcomeScreen'

export function Workspace({ getToken }: { getToken: TokenGetter }) {
  const {
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
  } = useWorkspace(getToken)

  // The mode selector only makes sense once a video is open (in the header).
  const searchFormProps = {
    url,
    mode,
    busy,
    onUrlChange: setUrl,
    onModeChange: setMode,
    onSubmit: generate,
  }

  return (
    <div className="app-shell">
      <AppHeader onHome={goHome} onOpenHistory={() => setHistoryOpen(true)}>
        {video ? (
          <div className="header-search">
            <SearchForm {...searchFormProps} />
          </div>
        ) : null}
      </AppHeader>
      {historyOpen ? (
        <HistoryPage
          history={history}
          onClose={() => setHistoryOpen(false)}
          onOpen={openHistory}
          onDelete={deleteHistory}
        />
      ) : video ? (
        <main className="workspace-grid">
          <VideoColumn video={video} seek={seek} onSeek={setSeek} />
          <section className="analysis-column">
            <div className="analysis-tabs">
              {WORKSPACE_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={tab === id ? 'selected' : ''}
                  onClick={() => setTab(id)}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
            {busy && <Loading label={busy} />}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                className="analysis-content"
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.16 }}
              >
                {tab === 'summary' && (
                  <SummaryPanel
                    summary={video.summary}
                    mode={mode}
                    busy={busy}
                    onModeChange={changeSummaryMode}
                  />
                )}
                {tab === 'ask' && (
                  <AskPanel
                    question={question}
                    answer={answer}
                    busy={busy}
                    onQuestionChange={setQuestion}
                    onSubmit={ask}
                    onSeek={setSeek}
                  />
                )}
                {tab === 'notes' && (
                  <NotesPanel notes={notes} onGenerate={createNotes} />
                )}
                {tab === 'quiz' && (
                  <QuizPanel questions={quiz} onGenerate={createQuiz} />
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      ) : (
        <WelcomeScreen
          includeTranscript={includeTranscript}
          onIncludeTranscriptChange={setIncludeTranscript}
          error={error}
        >
          <SearchForm {...searchFormProps} showModeSelector={false} />
        </WelcomeScreen>
      )}
      {analyzing && <LoadingOverlay label="Analyzing video" />}
    </div>
  )
}
