---
version: 1
slug: "frontend-src-app-tsx"
primary_target: "frontend/src/App.tsx"
related_targets: []
---

# Surface: Summify app

Scope: the whole app — welcome, workspace, and history.
Visitor mode: Operate.

## Audience and job

Someone with a long YouTube video they would rather read than watch. At a desk, other
tabs open. Job: paste a link, read the summary, switch how it is written, read the
transcript, ask a question, take the quiz, find it again in history.

## Constraints

The feature set is fixed and small: 4 summary modes, timestamped transcript, Q&A with
timestamps, notes, quiz, history, Clerk auth. No new dependencies. Backend unchanged.
Nothing may be added to make the product look larger than it is.

The user rejected two earlier directions as overcomplicating — a broadcast-studio
metaphor with invented jargon, and the cream/serif/red visual cluster. Plain language and
a plain visual world are now binding, not preferred.

## Direction contract

THESIS: a plain reading app. One link in, readable text out. A well-set document and a
few honest controls, with no theme, no metaphor, and no word the user must decode. It
refuses the AI-summary reflex (centred hero, pill input, gradient wash, feature cards),
the cream + serif + red cluster, and the stylised world whose vocabulary describes a
product that does not exist.

OWN-WORLD: cool near-white paper, never cream; one neutral ink in five steps, all
clearing WCAG AA; hairline rules, no shadows, one 4px radius; Inter for everything, with
authority from weight and scale rather than a display face; tabular figures for every
number. Monochrome — no accent colour, and active state is simply ink. Density is high:
the measure is set for reading and space goes to content.

STORY: the visitor sees a summarizer, trusts it because the promise is literal, pastes a
link, and reads. Switching mode, reading the transcript, asking, quizzing, and reopening
from history are each one click from the same screen.

FIRST VIEWPORT: an app bar; a short left-aligned statement of exactly what happens; one
ruled input line with a Summarize button; the transcript checkbox; three plain facts. On
the video screen, a sticky two-pane split — video and transcript on the left, tabbed
summary pane on the right — with no empty margins in either.

FORM: a plain reading layout, pinned by the user. Seed key 3fdb439a; the pin supersedes
the roll.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Prior verdict

Reviewed once (verdict: fix). All high-severity findings were resolved and re-verified:

- `.btn-quiet` was rendering ink-on-ink at 1.75:1 — now transparent with a hairline
  (10.3:1 ink on paper).
- The "desk" metaphor survived in the page title and loading line — removed.
- The transcript had no reading measure (≈100 characters per line) — now capped at 28rem,
  measured at 67.
- Prose measured 94 characters per line — now 30rem, measured at 69.
- Placeholders sat at 4.03:1 — `--ink-5` darkened to 4.6:1.
- `theme-color` was cream — now `#fdfdfd`.
- The analysis pane left a 40% dead field below it — the workspace now fills the viewport.
- Stacked layouts put the transcript before the summary — the analysis pane now leads.
- Clerk's violet avatar was unthemed — `appearance` added.
- The dev capture harness was wired into the shipped entry — removed.

## Unresolved

- The 30–60s generation wait has no progress signal beyond the overlay; a slow connection
  and a hung request look identical.
- URL validation is native only, so a wrong-but-valid link fails after the full wait.
- History deletion uses `window.confirm`, which is undesigned.
