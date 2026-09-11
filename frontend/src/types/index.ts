export type SummaryMode = 'concise' | 'detailed' | 'bullets' | 'keypoints'

export interface Segment {
  text: string
  offsetMs: number
  durationMs: number
}

export interface Citation {
  text: string
  startMs: number
  endMs: number
  timecode: string
  index: number
}

export interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface VideoData {
  historyId?: string | null
  videoId: string
  title: string | null
  author: string | null
  mode?: SummaryMode
  summary: string
  transcript?: string
  timestamps?: Segment[]
}

export interface HistoryItem {
  _id: string
  videoId: string
  videoUrl: string | null
  title: string | null
  author: string | null
  summaryMode: SummaryMode
  summary: string
  createdAt: string
  transcriptText?: string
  segments?: Segment[]
}

export type WorkspaceTab = 'summary' | 'ask' | 'notes' | 'quiz'

/* The three screens, addressed. `notFound` exists so a mistyped URL can be sent
   home rather than rendering a page its address does not describe. */
export type Route =
  | { name: 'welcome' }
  | { name: 'history' }
  | { name: 'video'; videoId: string }
  | { name: 'notFound' }

export interface Answer {
  answer: string
  citations: Citation[]
}

export type TokenGetter = () => Promise<string | null>
