import type { ReactNode } from 'react'

export function WelcomeScreen({
  includeTranscript,
  onIncludeTranscriptChange,
  error,
  children,
}: {
  includeTranscript: boolean
  onIncludeTranscriptChange: (value: boolean) => void
  error: string
  children: ReactNode
}) {
  return (
    <main className="welcome">
      <div>
        <img className="welcome-mark" src="/logo-yt-sum.png" alt="" />
        <p className="section-kicker">Video research, quietly done well</p>
        <h1>
          Give every video
          <br />
          your full attention.
        </h1>
        <p>
          Paste a link to get a clear summary, study notes, grounded answers,
          and a quick quiz.
        </p>
        {children}
        <label className="transcript-check">
          <input
            type="checkbox"
            checked={includeTranscript}
            onChange={(event) =>
              onIncludeTranscriptChange(event.target.checked)
            }
          />
          Include timestamped transcript
        </label>
        {error && <div className="error-message">{error}</div>}
      </div>
    </main>
  )
}
