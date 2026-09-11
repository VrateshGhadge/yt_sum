# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Someone who has a YouTube video they need to get through — a lecture, a talk, an
interview, a long explainer — and would rather read it than watch it. They are at a
desk, in daylight, usually with other tabs open. They are not power users of this
product; they arrive with a link and a limited amount of patience.

## Product Purpose

Summify turns one YouTube link into something readable: a summary, a timestamped
transcript, answers to questions about the video, study notes, and a quiz. Success is
one person understanding a long video in a few minutes and being able to point at the
exact moment anything came from.

## Positioning

Every part of the pipeline is free and keyless: captions come from YouTube, generation
runs on OpenRouter's free-tier models, and no billing account is required anywhere. A
competing tool assumes an OpenAI key and a per-token cost. This one does not.

## Operating Context

- The input is one URL. The outputs are text the user reads.
- The source is long-form video, usually unwatched.
- Sessions are short and task-shaped: paste, read, maybe switch summary mode, maybe ask
  one question or take the quiz, leave.
- History exists so a video summarized once can be reopened instead of re-run.

## Capabilities and Constraints

This is deliberately a **small, single-purpose tool**. Everything below is the complete
feature set, and nothing here should be expanded or embellished:

- Paste a URL to summarize it.
- Read the summary in four modes: concise, detailed, bullets, key points.
- Read the timestamped transcript; clicking a timestamp seeks the video.
- Ask a question about the video and get an answer with the timestamps it came from.
- Generate study notes.
- Generate a multiple-choice quiz with explanations and a score.
- A history page listing previously summarized videos, with open and delete.

Constraints:

- React 18 + Vite + TypeScript, plain CSS. No new dependencies.
- Frontend lives in `frontend/`; backend contracts are unchanged.
- Generation takes 30–60s on free models; the UI must carry that wait honestly.
- Only assets on hand: the Summify mark and wordmark in `frontend/public/`.

## Brand Commitments

- The product is called **Summify** everywhere it appears, including page metadata and
  the Clerk application name.
- Assets: `frontend/public/logo-yt-sum.png` (mark), `frontend/public/logo-txt.png`
  (wordmark). Both carry roughly 23% transparent padding.
- No gradients, neon, or decorative treatments.

## Evidence on Hand

- A working product against a live Clerk instance and a local MongoDB.
- Real data from a real video: 513 caption fragments over a 21:36 runtime, grouped into
  44 sections. Usable as demonstration content.
- No customers, testimonials, benchmarks, pricing, or metrics exist. Do not fabricate
  them.

## Product Principles

1. **Plain language.** Every label says what the thing does. No metaphors, no invented
   vocabulary, no jargon the user would have to decode.
2. **The text is the product.** Summary and transcript are the deliverable; the
   interface around them should disappear.
3. **Density over air.** Space is spent on content, not on margins.
4. **Every claim is locatable.** Anything said about a video traces to a timestamp.
5. **Scope stays small.** This is one job done well; features are not added to make the
   product look bigger than it is.

## Accessibility & Inclusion

No product-specific standard was established. Inherit the platform baseline: keyboard
operability, visible focus, semantic structure, reduced-motion support, and WCAG AA
contrast for all text.
