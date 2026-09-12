import { ArrowLeft, ClipboardList, FileText, GraduationCap, MessageCircle } from 'lucide-react'
import { useRef, type FormEvent, type KeyboardEvent } from 'react'
import { TABS } from '../constants'
import type { Answer, QuizQuestion, Segment, SummaryMode, WorkspaceTab } from '../types'
import { AskPanel } from './analysis/AskPanel'
import { NotesPanel } from './analysis/NotesPanel'
import { QuizPanel } from './analysis/QuizPanel'
import { SummaryPanel } from './analysis/SummaryPanel'
import { Link } from './Link'
import { Loading } from './Loading'
import { VideoPane } from './VideoPane'

/* Each tab wears the mark of the thing it holds: the list of the summary, the
   bubble of the questions, the page of the notes, the cap of the quiz. */
const TAB_ICONS = {
  summary: ClipboardList,
  ask: MessageCircle,
  notes: FileText,
  quiz: GraduationCap,
} as const

export function WorkspaceView({
  video,
  currentMs,
  onSeek,
  tab,
  onTabChange,
  busy,
  summary,
  mode,
  onModeChange,
  question,
  answer,
  onQuestionChange,
  onAsk,
  notes,
  onGenerateNotes,
  quiz,
  onGenerateQuiz,
}: {
  video: {
    videoId: string
    title: string | null
    author: string | null
    createdAt?: string
    timestamps?: Segment[]
  }
  currentMs: number
  onSeek: (ms: number) => void
  tab: WorkspaceTab
  onTabChange: (tab: WorkspaceTab) => void
  busy: string | null
  summary: string
  mode: SummaryMode
  onModeChange: (mode: SummaryMode) => void
  question: string
  answer: Answer | null
  onQuestionChange: (q: string) => void
  onAsk: (event: FormEvent) => void
  notes: string | null
  onGenerateNotes: () => void
  quiz: QuizQuestion[] | null
  onGenerateQuiz: () => void
}) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % TABS.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + TABS.length) % TABS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = TABS.length - 1
    else return
    event.preventDefault()
    onTabChange(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <main className="workspace" id="main-content">
      <Link to="/history" className="workspace-back">
        <ArrowLeft size={15} aria-hidden="true" />
        Back to history
      </Link>

      <VideoPane
        videoId={video.videoId}
        title={video.title ?? ''}
        author={video.author ?? ''}
        createdAt={video.createdAt}
        transcript={video.timestamps ?? []}
        currentMs={currentMs}
        onSeek={onSeek}
      />

      <section className="analysis-pane" aria-label="Summary and study tools">
        <div className="tabs" role="tablist" aria-label="Views">
          {TABS.map(({ id, label }, index) => {
            const Icon = TAB_ICONS[id]
            return (
              <button
                ref={(node) => { tabRefs.current[index] = node }}
                key={id}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                tabIndex={tab === id ? 0 : -1}
                className={tab === id ? 'is-on' : ''}
                onClick={() => onTabChange(id)}
                onKeyDown={(event) => move(event, index)}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>

        {busy && <Loading label={busy} />}

        <div
          id={`panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          tabIndex={-1}
          className="panel"
        >
          {tab === 'summary' && (
            <SummaryPanel
              summary={summary}
              mode={mode}
              busy={Boolean(busy)}
              onModeChange={onModeChange}
              transcript={video.timestamps ?? []}
              onSeek={onSeek}
            />
          )}

          {tab === 'ask' && (
            <AskPanel
              question={question}
              answer={answer}
              busy={busy}
              onQuestionChange={onQuestionChange}
              onSubmit={onAsk}
              onSeek={onSeek}
            />
          )}

          {tab === 'notes' && (
            <NotesPanel notes={notes} busy={busy} onGenerate={onGenerateNotes} />
          )}
          {tab === 'quiz' && (
            <QuizPanel questions={quiz} busy={busy} onGenerate={onGenerateQuiz} />
          )}
        </div>
      </section>
    </main>
  )
}
