import { FileText, GraduationCap, ListOrdered, MessageCircle } from 'lucide-react'

/* What the product does, once, as four cards. Each one names an output of the
   single input the product takes. */
const FEATURES = [
  {
    icon: ListOrdered,
    tone: 'sky',
    title: 'AI Summary',
    text: 'Get concise, detailed, or bullet-point summaries in seconds.',
  },
  {
    icon: MessageCircle,
    tone: 'plum',
    title: 'Ask Questions',
    text: 'Chat with the video. Get accurate answers with timestamps and sources.',
  },
  {
    icon: FileText,
    tone: 'moss',
    title: 'Study Notes',
    text: 'Generate clean, structured notes to revise and save for later.',
  },
  {
    icon: GraduationCap,
    tone: 'violet',
    title: 'Practice Quiz',
    text: 'Create custom quizzes to test your understanding and retain more.',
  },
] as const

export function LandingFeatures() {
  return (
    <section className="landing-section" id="features">
      <div className="landing-head">
        <h2 className="landing-h2">Everything you need from a single video</h2>
        <p className="landing-sub">Turn any YouTube video into structured, actionable knowledge.</p>
      </div>

      <ul className="landing-cards">
        {FEATURES.map(({ icon: Icon, tone, title, text }) => (
          <li key={title} className="landing-card">
            <span className={`landing-card-icon is-${tone}`} aria-hidden="true">
              <Icon size={20} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
