import {
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  Home,
  Maximize,
  MessageCircle,
  Play,
  Plus,
  Settings,
  Sparkles,
  User,
  Volume2,
} from 'lucide-react'

/* The product, drawn rather than photographed. It is the real workspace at a
   smaller scale — the same tabs, the same style row, the same summary card —
   so what a visitor sees here is what they get after signing in. */
const NAV = [
  { icon: Home, label: 'Home', on: true },
  { icon: Clock, label: 'History', on: false },
]

const TOOLS = [
  { icon: ClipboardList, label: 'Summary' },
  { icon: MessageCircle, label: 'Ask' },
  { icon: FileText, label: 'Notes' },
  { icon: GraduationCap, label: 'Quiz' },
]

const TABS = ['Summary', 'Ask', 'Notes', 'Quiz']
const MODES = ['Concise', 'Detailed', 'Bullets', 'Key points']

export function AppShot() {
  return (
    <div className="shot" aria-hidden="true">
      <div className="shot-bar">
        <span /><span /><span />
      </div>

      <div className="shot-body">
        <aside className="shot-side">
          <div className="shot-brand">
            <img src="/logo-mark-ink.png" alt="" />
            Summify
          </div>

          <ul className="shot-nav">
            {NAV.map(({ icon: Icon, label, on }) => (
              <li key={label} className={`shot-item${on ? ' is-on' : ''}`}>
                <Icon aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          <p className="shot-label">Tools</p>
          <ul className="shot-nav">
            {TOOLS.map(({ icon: Icon, label }) => (
              <li key={label} className="shot-item">
                <Icon aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          <p className="shot-item shot-foot">
            <Settings aria-hidden="true" />
            Settings
          </p>
        </aside>

        <div className="shot-main">
          <div className="shot-top">
            <span className="shot-input">Paste a YouTube link…</span>
            <span className="shot-avatar">V</span>
          </div>

          <div className="shot-grid">
            <div>
              <div className="shot-thumb">
                <img src="https://i.ytimg.com/vi/ngvOyccUzzY/hqdefault.jpg" alt="" />
                <span className="shot-play"><Play aria-hidden="true" /></span>
                <span className="shot-controls">
                  <Play aria-hidden="true" />
                  <span>0:00 / 12:34</span>
                  <Volume2 aria-hidden="true" />
                  <Settings aria-hidden="true" />
                  <Maximize aria-hidden="true" />
                </span>
              </div>
              <p className="shot-title">David Goggins - How To Defeat Laziness &amp; Build Relentless Focus (4K)</p>
              <p className="shot-author">
                <User aria-hidden="true" />
                Chris Williamson
              </p>
              <div className="shot-chips">
                <span className="tag is-sky">David</span>
                <span className="tag is-clay">Goggins</span>
                <span className="tag is-plum">Defeat</span>
                <span className="shot-plus"><Plus aria-hidden="true" /></span>
              </div>
            </div>

            <div className="shot-panel">
              <div className="shot-tabs">
                {TABS.map((tab, index) => (
                  <span key={tab} className={index === 0 ? 'is-on' : ''}>{tab}</span>
                ))}
              </div>

              <p className="shot-label">Summary style</p>
              <div className="shot-modes">
                {MODES.map((mode, index) => (
                  <span key={mode} className={index === 0 ? 'is-on' : ''}>{mode}</span>
                ))}
              </div>

              <div className="shot-card">
                <div className="shot-card-head">
                  <Sparkles aria-hidden="true" />
                  AI Summary
                  <span className="shot-copy">Copy</span>
                </div>
                <p>
                  David Goggins discusses his journey, emphasizing that mental toughness and
                  self-discipline are built through intentional hardship. He shares powerful lessons
                  on overcoming fear, staying consistent, and taking full responsibility for your
                  life, showing that extraordinary results come from doing what most people avoid.
                </p>
              </div>

              <span className="shot-more">Show more</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
