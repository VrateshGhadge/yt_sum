import { FileText, GraduationCap, ListOrdered, MessageCircle } from 'lucide-react'

/* What the product does, once, as four cards. Each one names an output of the
   single input the product takes. */
const FEATURES = [
  {
    icon: ListOrdered,
    tile: 'bg-sky-wash text-sky',
    title: 'AI Summary',
    text: 'Get concise, detailed, or bullet-point summaries in seconds.',
  },
  {
    icon: MessageCircle,
    tile: 'bg-plum-wash text-plum',
    title: 'Ask Questions',
    text: 'Chat with the video. Get accurate answers with timestamps and sources.',
  },
  {
    icon: FileText,
    tile: 'bg-moss-wash text-moss',
    title: 'Study Notes',
    text: 'Generate clean, structured notes to revise and save for later.',
  },
  {
    icon: GraduationCap,
    tile: 'bg-violet-wash text-violet',
    title: 'Practice Quiz',
    text: 'Create custom quizzes to test your understanding and retain more.',
  },
]

export function LandingFeatures() {
  return (
    <section
      className="mx-auto w-[min(100%-48px,1520px)] scroll-mt-24 pt-[88px] max-[700px]:w-[min(100%-36px,1520px)] max-[700px]:pt-16"
      id="features"
    >
      <div className="text-center">
        <h2 className="text-[clamp(26px,2.6vw,34px)] font-[680] leading-[1.15] tracking-[-0.03em] text-ink">
          Everything you need from a single video
        </h2>
        <p className="mx-auto mt-2.5 max-w-[58ch] text-[15.5px] leading-[1.6] text-ink-3">
          Turn any YouTube video into structured, actionable knowledge.
        </p>
      </div>

      <ul className="mt-[34px] grid grid-cols-4 gap-5 max-[1080px]:grid-cols-2 max-[700px]:grid-cols-1">
        {FEATURES.map(({ icon: Icon, tile, title, text }) => (
          <li
            key={title}
            className="rounded-2xl border border-line bg-card px-5 pb-6 pt-[22px] transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:shadow-[0_16px_32px_-16px_rgba(26,24,21,0.22)] motion-reduce:hover:translate-y-0"
          >
            <span className={`grid h-11 w-11 place-items-center rounded-[13px] ${tile}`} aria-hidden="true">
              <Icon size={20} />
            </span>
            <h3 className="mt-4 text-[16.5px] font-[650] tracking-[-0.015em] text-ink">{title}</h3>
            <p className="mt-[7px] text-sm leading-[1.6] text-ink-3">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
