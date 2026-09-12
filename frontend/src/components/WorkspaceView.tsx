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

const TAB =
  'inline-flex h-[38px] items-center gap-2 rounded-t-[10px] border-b-2 border-transparent px-3 text-[13px] font-[550] text-ink-4 transition-[color,background] duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sunken hover:text-ink-2 aria-selected:border-b-accent aria-selected:bg-sunken aria-selected:text-ink aria-selected:[&>svg]:text-accent max-[700px]:flex-none'

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
    <main
      className="mx-auto grid w-[min(100%,1440px)] min-h-[calc(100dvh-var(--header-h))] grid-cols-[minmax(0,1fr)_minmax(420px,1.04fr)] items-start gap-x-[22px] gap-y-4 rounded-b-[18px] bg-paper px-6 pb-11 pt-[15px] max-[1080px]:min-h-0 max-[1080px]:grid-cols-[minmax(0,1fr)] max-[1080px]:px-[18px] max-[1080px]:pb-9 max-[1080px]:pt-3.5 max-[700px]:gap-[13px] max-[700px]:rounded-b-[14px] max-[700px]:px-3 max-[700px]:pb-7"
      id="main-content"
    >
      <Link
        to="/history"
        className="col-span-full inline-flex h-[30px] items-center justify-self-start gap-2 self-start rounded-full border border-line-2 bg-card py-0 pl-[11px] pr-[13px] text-[12.5px] font-medium text-ink-2 no-underline transition-[border-color,color] duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-line-3 hover:text-ink max-[1080px]:order-[-2]"
      >
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

      <section
        className="min-w-0 overflow-hidden rounded-2xl border border-line bg-card max-[1080px]:order-[-1] max-[700px]:rounded-[14px]"
        aria-label="Summary and study tools"
      >
        <div
          className="flex gap-1 border-b border-line px-3.5 pt-2.5 max-[700px]:overflow-x-auto max-[700px]:px-2.5 max-[700px]:pt-2 max-[700px]:[scrollbar-width:none] max-[700px]:[&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Views"
        >
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
                className={TAB}
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
          className="px-[18px] pb-[26px] pt-[18px] focus-visible:outline-offset-[-2px] max-[700px]:px-3.5 max-[700px]:pb-5 max-[700px]:pt-[15px] [&>*:first-child]:mt-0"
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
