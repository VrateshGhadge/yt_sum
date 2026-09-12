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

/* One sidebar row, shared by both stacks. */
const ITEM =
  'flex items-center gap-3 rounded-[11px] px-3 py-[9px] text-base text-ink-3 [&>svg]:h-[19px] [&>svg]:w-[19px] [&>svg]:shrink-0'

export function AppShot() {
  return (
    /* Drawn at the width the design draws it, then scaled to whatever column it
       lands in, so its proportions never depend on the window. */
    <div
      className="w-[950px] overflow-hidden rounded-[20px] border border-line bg-card shadow-[0_30px_60px_-28px_rgba(26,24,21,0.30),0_2px_6px_-2px_rgba(26,24,21,0.06)] [zoom:clamp(0.5,calc(100cqw/950px),1)] max-[900px]:w-auto max-[900px]:[zoom:1]"
      aria-hidden="true"
    >
      <div className="flex items-center gap-[9px] border-b border-line px-[22px] py-[18px]">
        <span className="h-3 w-3 rounded-full bg-[#e5a5a0]" />
        <span className="h-3 w-3 rounded-full bg-[#e8cfa2]" />
        <span className="h-3 w-3 rounded-full bg-[#abcba5]" />
      </div>

      <div className="grid grid-cols-[214px_minmax(0,1fr)] max-[700px]:grid-cols-[minmax(0,1fr)]">
        <aside className="flex flex-col gap-[18px] bg-sunken px-4 py-[22px] max-[700px]:hidden">
          <div className="flex items-center gap-[11px] px-[11px] text-[17.5px] font-[620] text-ink">
            <img className="h-[23px] w-auto" src="/logo-mark-ink.png" alt="" />
            Summify
          </div>

          <ul className="grid gap-1">
            {NAV.map(({ icon: Icon, label, on }) => (
              <li
                key={label}
                className={`${ITEM}${on ? ' bg-card font-semibold text-ink shadow-[0_1px_2px_rgba(26,24,21,0.08)]' : ''}`}
              >
                <Icon aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          <p className="px-[11px] text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-5">Tools</p>
          <ul className="grid gap-1">
            {TOOLS.map(({ icon: Icon, label }) => (
              <li key={label} className={ITEM}>
                <Icon aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          <p className={`${ITEM} mt-auto`}>
            <Settings aria-hidden="true" />
            Settings
          </p>
        </aside>

        <div className="px-[22px] pb-6 pt-[19px]">
          <div className="flex items-center gap-4">
            <span className="min-w-0 flex-1 rounded-full border border-line px-[19px] py-[11px] text-base text-ink-5">
              Paste a YouTube link…
            </span>
            <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-paper">
              V
            </span>
          </div>

          <div className="mt-5 grid grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] gap-6 max-[700px]:grid-cols-[minmax(0,1fr)]">
            <div>
              <div className="relative aspect-video overflow-hidden rounded-[13px] bg-[#12100e]">
                <img
                  className="block h-full w-full object-cover"
                  src="https://i.ytimg.com/vi/ngvOyccUzzY/hqdefault.jpg"
                  alt=""
                />
                <span className="absolute inset-0 grid place-items-center text-paper">
                  <Play
                    className="h-[51px] w-[51px] rounded-full bg-[rgba(26,24,21,0.58)] p-[15px]"
                    aria-hidden="true"
                  />
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-[linear-gradient(transparent,rgba(18,16,14,0.72))] px-[13px] py-[9px] text-sm text-paper [font-variant-numeric:tabular-nums] [&>svg]:h-4 [&>svg]:w-4 [&>span]:mr-auto">
                  <Play aria-hidden="true" />
                  <span>0:00 / 12:34</span>
                  <Volume2 aria-hidden="true" />
                  <Settings aria-hidden="true" />
                  <Maximize aria-hidden="true" />
                </span>
              </div>
              <p className="mt-[15px] text-[17.5px] font-[620] leading-[1.35] text-ink">
                David Goggins - How To Defeat Laziness &amp; Build Relentless Focus (4K)
              </p>
              <p className="mt-2 flex items-center gap-[7px] text-[15px] text-ink-4">
                <User className="h-[15px] w-[15px] shrink-0" aria-hidden="true" />
                Chris Williamson
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-[7px]">
                <span className="inline-flex h-[27px] items-center rounded-full bg-chip-sky-wash px-3 text-[13.5px] font-medium text-chip-sky">David</span>
                <span className="inline-flex h-[27px] items-center rounded-full bg-chip-clay-wash px-3 text-[13.5px] font-medium text-chip-clay">Goggins</span>
                <span className="inline-flex h-[27px] items-center rounded-full bg-chip-plum-wash px-3 text-[13.5px] font-medium text-chip-plum">Defeat</span>
                <span className="grid h-[27px] w-[27px] place-items-center rounded-full border border-line-2 text-ink-4">
                  <Plus className="h-[13px] w-[13px]" aria-hidden="true" />
                </span>
              </div>
            </div>

            <div>
              <div className="flex gap-5 border-b border-line pb-[13px] text-[15.5px] text-ink-4">
                {TABS.map((tab, index) => (
                  <span
                    key={tab}
                    className={index === 0 ? 'font-semibold text-ink shadow-[inset_0_-2px_0_var(--color-accent)]' : ''}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              <p className="mt-[13px] px-[11px] text-[15px] font-medium text-ink-5">Summary style</p>
              <div className="mt-[13px] flex flex-wrap gap-1">
                {MODES.map((mode, index) => (
                  <span
                    key={mode}
                    className={`rounded-[7px] border px-[9px] py-1 text-[13px] ${
                      index === 0 ? 'border-ink bg-ink text-paper' : 'border-line-2 text-ink-3'
                    }`}
                  >
                    {mode}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-[15px] bg-sunken px-4 pb-[18px] pt-[15px]">
                <div className="flex items-center gap-[9px] text-base font-[620] text-ink">
                  <Sparkles className="h-[17px] w-[17px] text-accent" aria-hidden="true" />
                  AI Summary
                  <span className="ml-auto rounded-lg border border-line-2 bg-card px-[11px] py-[3px] text-[13.5px] font-medium text-ink-3">
                    Copy
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-[1.58] text-ink-3">
                  David Goggins discusses his journey, emphasizing that mental toughness and
                  self-discipline are built through intentional hardship. He shares powerful lessons
                  on overcoming fear, staying consistent, and taking full responsibility for your
                  life, showing that extraordinary results come from doing what most people avoid.
                </p>
              </div>

              <span className="mt-[13px] inline-block text-[15px] text-ink-4">Show more</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
