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

export interface Answer {
  answer: string
  citations: Citation[]
}

export type TokenGetter = () => Promise<string | null>
