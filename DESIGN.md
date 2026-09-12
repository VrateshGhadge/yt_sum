# Design

<!-- impeccable:design-schema 1 -->

## Character

A warm reading room. One link in, readable text out. The home screen states what the app
does in one centred column and then gets out of the way; everything after it is a
well-set document. Authority comes from weight, scale and spacing — the one chromatic note
is the accent that names the subject, and nothing else competes with it.

## Color

Warm paper, one ink family, and a single accent that is used sparingly.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#fdfbf8` | page and pane ground — warm, not neutral |
| `--sunken` | `#f5f2ec` | app ground, hover fills, inset surfaces |
| `--recess` | `#eae5dc` | inset surfaces that sit *below* `--sunken` |
| `--ink` | `#1a1815` | primary text, buttons, active fills |
| `--ink-2` | `#3e3a34` | reading text |
| `--ink-3` | `#5c5851` | secondary text |
| `--ink-4` | `#6e6a63` | metadata |
| `--ink-5` | `#7a756d` | placeholders — lightest value allowed for text |
| `--mark` | `#a8a29a` | decorative marks only, never text |
| `--accent` | `#b2714b` | the second headline line, the eyebrow, the feature card marks |
| `--accent-wash` | `rgba(178,113,75,.09)` | the eyebrow pill's fill |
| `--danger` | `#9b2c22` | errors and destructive actions only |
| `--line` / `--line-2` / `--line-3` | `rgba(26,24,21, .10/.20/.40)` | hairline rules |

**`--accent` is a large-text colour only.** It measures 3.8:1 on `--paper`: fine at the
headline's size, short of AA for body copy. Reach for `--ink-3` when you need coloured
prose. The four feature-card hues (`clay`, `sky`, `moss`, `plum`) are decoration on a 34px
tile — the labels beside them are ink and carry the meaning.

Every ink token clears WCAG AA on both grounds.

## Ground

The app ground is a halftone landscape, `public/background.webp` (with
`background-portrait.webp` below a 1:1 aspect ratio), drawn at **34% opacity** so it stays
scenery rather than a dark field behind the text. Paper then fades down from the top over
it, so the dunes rise out of the page instead of ending on a hard edge.

It is two fixed layers (`body::before` for the drawing, `body::after` for the wash), not
`background-attachment: fixed`, which iOS Safari ignores. The header band repaints the same
paper the wash ends in, so the scene stays continuous behind it.

**Reading surfaces are opaque.** The ground is chrome — the home screen's margins, the
header band, the outer columns. It is never a backdrop for running text.

## Type

One family: **Inter Variable** (self-hosted via `@fontsource-variable/inter`). No display
face, no second family, no serif.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Home headline | `clamp(36px, 4.8vw, 56px)` | 500 | `-0.03em`, two lines; the second in `--accent` |
| Screen title | 26px | 660 | `-0.03em` |
| Pane title | 19px | 620 | `-0.02em` |
| Reading text | 15px | 400 | line-height 1.68 |
| Secondary / labels | 12–13.5px | 400–620 | sentence case, never capitals |
| Corner labels | 10px | 500 | `0.2em`, uppercase — the one place capitals are earned, because they are signage, not labels |
| Timestamps | 11.5px | 400–500 | Inter with `tabular-nums` |

The margin notes (`From Videos to Knowledge`) are set in a system hand via `--hand`. They
are decoration on a promise the headline already makes; they disappear below 700px.

**Reading measure is set in rem, not `ch`** — `ch` measures the "0" glyph and overstates
how much running prose actually fits. Prose caps at `30rem` (≈69 characters), the
transcript at `28rem` (≈67), both verified by measuring rendered line boxes.

## Form

- Radius: `4px` for controls that are part of a field; `13–18px` for objects that float —
  the header pill, the home field, the feature cards.
- Hairline rules do the work that borders and shadows do elsewhere. Shadows are reserved
  for things that genuinely float: the header pill and the home field, both over the ground.
- Buttons: `34px` min height; `.btn` is an ink fill, `.btn-quiet` is transparent with a
  hairline. The home field's submit is `46px` because it sits in a 64px card.
- Focus: `2px solid var(--ink)` at `2px` offset, via `:focus-visible` only.

## Layout

| Viewport | Composition |
|---|---|
| Home ≥701px | One centred 700px column; margin notes and corner labels in the outer field |
| Home ≤700px | Same column, 18px gutters; notes hidden, features 2×2, corner labels hidden |
| Workspace ≥1081px | Two panes: video + transcript (≈1.15fr) beside the summary pane (≥400px), full-bleed, capped at 1680px |
| Workspace ≤1080px | Stacked, with the analysis pane *first* — the summary is the product, the transcript follows |
| Workspace ≤700px | Single column, 12px gutters, tabs scroll horizontally |

The workspace fills `calc(100dvh - header)` so neither pane leaves a dead field below it.

## Motion

Almost none, deliberately. Panel and hover transitions are `130–140ms` on
`cubic-bezier(0.16, 1, 0.3, 1)`. The only authored moment is the summarizing overlay: the
page blurs behind a small status pill. `prefers-reduced-motion` disables all of it.

## Browser surfaces

Themed, because they ship with the design: `::selection` inverts to ink, scrollbars are
9px hairlines with a hover state, `caret-color` inherits ink, and focus rings are visible
everywhere. Clerk's default violet avatar and blue focus are overridden via
`appearance` in `main.tsx`.

## What this replaces

Two earlier directions were rejected and are recorded here as anti-references:

1. **Broadcast-studio metaphor** — the app was dressed as a TV rundown with studio jargon
   ("file it", "stories", "cutting the show", "on air", "TRT") for a simple summarizer.
   Removed entirely; the user called this overcomplicating.
2. **Cool monochrome, no accent** — a near-white `#fdfdfd` paper, `#131517` ink, and no
   chromatic note anywhere. Replaced by the warm paper and the single accent, on the
   client's direction. The reasoning recorded there ("a warm cream ground is the reflex
   this replaces") is superseded, not lost: the accent is confined to large text and the
   four card marks, so it never becomes a theme.

## Rules for future work

- **One accent, and it does one job.** `--accent` names the subject in the headline and
  marks the four outputs. If a new state needs emphasis, use weight, ink value, or a rule —
  not the accent. It is a large-text colour; never set body copy in it.
- No new fonts, no display face, no serif. The hand is a system stack, not a download.
- Shadows only for surfaces that visibly float. There are two: the header pill and the home
  field. A shadow on a list row or a card that sits in flow is wrong.
- Every label uses the vocabulary a normal user already has. No metaphors.
- Any new text colour must be checked against both `--paper` and `--sunken` for AA.
- **No capitals for labels, and no tracked-out letter-spacing.** Emphasis comes from
  weight and ink value. `STYLE` and `TRANSCRIPT` were the previous house style; they are
  the chrome every generated interface ships. The corner labels are the single exception —
  they are signage in the margin, not labels on content.
- **No punctuation as decoration.** Fields are separated by space and ink value, not by
  middle dots (`A · B · C`) or spaced em dashes (`WORD — fragment`). The history meta line
  is the model.
- **No arrow glyph appended to a button or link**, with one exception: `Summarize →` on the
  home field, where the arrow states the direction of travel for the one action the page
  exists to start. It is not a habit to copy onto other controls.
- `--mono` is for code only. Nothing else in the product needs a second family; tabular
  figures in Inter handle alignment.
