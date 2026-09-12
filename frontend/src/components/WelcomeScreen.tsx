import { FileText, GraduationCap, ListOrdered, MessageCircle, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

/* What the app does, in the order someone meets it. The copy names the four
   outputs of one link and nothing else. */
const FEATURES = [
  { icon: ListOrdered, label: 'AI Summary', note: 'Get key insights', tile: 'bg-clay-wash text-clay' },
  { icon: MessageCircle, label: 'Ask Questions', note: 'Grounded answers', tile: 'bg-sky-wash text-sky' },
  { icon: GraduationCap, label: 'Quiz Yourself', note: 'Test your knowledge', tile: 'bg-moss-wash text-moss' },
  { icon: FileText, label: 'Study Notes', note: 'Save what matters', tile: 'bg-plum-wash text-plum' },
]

export function WelcomeScreen({
  includeTranscript,
  onIncludeTranscriptChange,
  children,
}: {
  includeTranscript: boolean
  onIncludeTranscriptChange: (value: boolean) => void
  children: ReactNode
}) {
  return (
    <main className="relative min-h-[calc(100dvh-var(--header-h))] px-6 pt-[clamp(76px,12vh,126px)] max-[700px]:px-[18px] max-[700px]:pt-[30px]">
      {/* Margin notes, set in a hand. Decorative: the same promise is already
          in the headline and the lede, so nothing here is load-bearing. */}
      <p
        className="pointer-events-none absolute left-[max(24px,calc(50%-470px))] top-[100px] z-[1] font-hand text-[17px] leading-[1.4] text-ink-4 opacity-75 max-[700px]:hidden [&>svg]:mt-1.5 [&>svg]:block [&>svg]:h-[54px] [&>svg]:w-[108px]"
        aria-hidden="true"
      >
        From
        <br />
        Videos to
        <br />
        Knowledge
        <svg viewBox="0 0 120 60" fill="none" aria-hidden="true">
          <path
            d="M4 6c26 4 64 18 92 44"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M108 30 96 50l-14-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>

      <p
        className="pointer-events-none absolute right-[max(24px,calc(50%-470px))] top-[162px] z-[1] text-right font-hand text-[17px] leading-[1.4] text-ink-4 opacity-75 max-[700px]:hidden [&>svg]:ml-auto [&>svg]:mt-1.5 [&>svg]:block [&>svg]:h-[54px] [&>svg]:w-[108px]"
        aria-hidden="true"
      >
        Learn
        <br />
        Faster
        <br />
        Go Further
        <svg viewBox="0 0 120 60" fill="none" aria-hidden="true">
          <path
            d="M116 54C90 50 52 36 24 10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 30 24 10l14 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </p>

      <div className="mx-auto flex w-[min(100%,700px)] flex-col items-center text-center">
        <p className="inline-flex h-7 items-center gap-[7px] rounded-full bg-accent-wash pl-[11px] pr-[13px] text-xs font-medium text-accent">
          <Sparkles size={13} aria-hidden="true" />
          Your AI YouTube Study Companion
        </p>

        {/* Two lines, and only the second carries the colour: the accent names
            the subject, which is the one thing the headline has to say. */}
        <h1 className="mt-5 text-[clamp(36px,4.8vw,56px)] font-medium leading-[1.08] tracking-[-0.03em] text-ink text-balance max-[700px]:mt-[18px] max-[700px]:text-[clamp(30px,8.4vw,42px)]">
          Summarize any
          <span className="block text-accent">YouTube video.</span>
        </h1>

        <p className="mt-4 max-w-[30em] text-[15.5px] leading-[1.55] text-ink-3 max-[700px]:mt-3.5 max-[700px]:text-[14.5px]">
          Ask it questions. Quiz yourself. Turn hours of content into knowledge in minutes.
        </p>

        <div className="mt-[22px] w-full max-[700px]:mt-5">
          {children}

          <label className="mt-3.5 flex cursor-pointer items-center gap-[9px] text-[13px] text-ink-3">
            <input
              type="checkbox"
              className="h-[15px] w-[15px] accent-ink"
              checked={includeTranscript}
              onChange={(event) => onIncludeTranscriptChange(event.target.checked)}
            />
            Include the timestamped transcript
          </label>
        </div>

        <ul className="mt-[26px] mb-16 grid w-full grid-cols-4 gap-3 max-[1080px]:grid-cols-4 max-[700px]:grid-cols-2 max-[700px]:gap-2.5">
          {FEATURES.map(({ icon: Icon, label, note, tile }) => (
            <li
              key={label}
              className="group flex flex-col items-center gap-[3px] rounded-[14px] bg-[rgba(253,251,248,0.66)] px-2.5 pb-[13px] pt-3.5 shadow-[0_0_0_1px_rgba(26,24,21,0.05)] transition-[transform,background,box-shadow] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:bg-paper hover:shadow-[0_0_0_1px_rgba(26,24,21,0.08),0_10px_24px_-10px_rgba(26,24,21,0.18)] motion-reduce:hover:translate-y-0"
            >
              <span
                className={`mb-[7px] grid h-[34px] w-[34px] place-items-center rounded-[10px] transition-transform duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08] motion-reduce:group-hover:scale-100 ${tile}`}
                aria-hidden="true"
              >
                <Icon size={17} />
              </span>
              <span className="text-[13.5px] font-[550] text-ink">{label}</span>
              <span className="text-xs text-ink-4 group-hover:text-ink-3">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
