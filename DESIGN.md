# Design

<!-- impeccable:design-schema 1 -->

## Character

A plain reading app. One link in, readable text out. The interface is a well-set
document and a few honest controls: no theme, no metaphor, and no word the user has to
decode. Authority comes from weight, scale and spacing rather than from a display face or
an accent colour.

## Color

Monochrome. There is no accent colour — active state is simply ink.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#fdfdfd` | page and pane ground |
| `--sunken` | `#f4f5f5` | app ground, hover fills, inset surfaces |
| `--ink` | `#131517` | primary text, buttons, active fills — 18.0:1 |
| `--ink-2` | `#3b4045` | reading text — 10.3:1 |
| `--ink-3` | `#555b60` | secondary text — 6.8:1 |
| `--ink-4` | `#676d73` | metadata — 5.2:1 |
| `--ink-5` | `#6a7076` | placeholders — 4.6:1 (lightest value allowed for text) |
| `--mark` | `#9aa0a6` | decorative marks only, never text |
| `--danger` | `#9b2c22` | errors and destructive hover only |
| `--line` / `--line-2` / `--line-3` | `rgba(19,21,23, .10/.22/.42)` | hairline rules |

Every text token clears WCAG AA on both grounds. The paper is deliberately cool (blue and
green channels above red); a warm cream ground is the reflex this replaces.

## Type

One family: **Inter Variable** (self-hosted via `@fontsource-variable/inter`). No display
face, no second family, no serif.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Screen title | 26px | 660 | `-0.03em` |
| Welcome headline | `clamp(28px, 3.6vw, 44px)` | 640 | `-0.032em`, `text-wrap: balance` |
| Pane title | 19px | 620 | `-0.02em` |
| Reading text | 15px | 400 | line-height 1.68 |
| Secondary / labels | 13–13.5px | 400–550 | |
| Micro labels | 11px | 600 | uppercase, `0.07em` |
| Timestamps / code | 11–12.5px | 400–500 | `--mono`, `font-variant-numeric: tabular-nums` |

**Reading measure is set in rem, not `ch`** — `ch` measures the "0" glyph and overstates
how much running prose actually fits. Prose caps at `30rem` (≈69 characters), the
transcript at `28rem` (≈67), both verified by measuring rendered line boxes.

## Form

- Radius: `4px`, everywhere. No pills.
- Hairline rules do the work that borders and shadows do elsewhere. There are no shadows
  in the product.
- Buttons: `34px` min height; `.btn` is an ink fill, `.btn-quiet` is transparent with a
  hairline. Use them as alternates, never stacked.
- Focus: `2px solid var(--ink)` at `2px` offset, via `:focus-visible` only.

## Layout

| Viewport | Composition |
|---|---|
| ≥1081px | Two panes: video + transcript (≈1.15fr) beside the summary pane (≥400px), full-bleed, capped at 1680px |
| ≤1080px | Stacked, with the analysis pane *first* — the summary is the product, the transcript follows |
| ≤700px | Single column, 12px gutters, tabs scroll horizontally |

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

Three earlier directions were rejected and are recorded here as anti-references:

1. **Cream + high-contrast serif + red accent** — the stock "AI-generated interface"
   cluster. Removed: serif import, cream ground, red accent, gradient wash.
2. **Broadcast-studio metaphor** — the app was dressed as a TV rundown with studio jargon
   ("file it", "stories", "cutting the show", "on air", "TRT") for a simple summarizer.
   Removed entirely; the user called this overcomplicating.
3. **Centred hero with a feature row** — replaced by a left-aligned statement of what
   happens.

## Rules for future work

- No accent colour. If a state needs emphasis, use weight, ink value, or a rule.
- No new fonts, no display face, no serif.
- No shadows, no gradients, no decorative blur.
- Every label uses the vocabulary a normal user already has. No metaphors.
- Density over air: space goes to content, never to margins.
- Any new text colour must be checked against both `--paper` and `--sunken` for AA.
