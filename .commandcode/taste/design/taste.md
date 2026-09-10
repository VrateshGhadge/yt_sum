# Design taste

- Prefers a minimal, simple, clean UI aesthetic; dislikes gradient-heavy, neon, and decorative "showy" treatments and wants those specific things (gradients, colors) removed when flagged. Confidence: 0.8
- Prefers Inter as the UI typeface when given the choice. Confidence: 0.85
- Rejects generic, templated-looking output as "AI slop" and rejects fonts/designs that "look AI generated"; expects a deliberately designed, high-end result. Confidence: 0.75
- When he dislikes a design, expects a full rebuild from scratch driven by the reference he names, not incremental restyling of the existing shell — the layout information architecture should change too, not just colors and fonts. Confidence: 0.7
- Communicates design feedback with reference screenshots and expects the implementation to match that reference's layout (including adding the screens/states it shows, e.g., a dedicated URL-entry page before the workspace). Confidence: 0.65
- Keeps iterating on visual direction and is comfortable with (and expects) wholesale redesigns across rounds rather than preserving earlier styling decisions. Confidence: 0.6
- Prefers modal/loading overlays to blur the underlying content and background (backdrop blur) so the active state is the sole point of focus. Confidence: 0.5
- Expects fluid, smooth animated transitions on interactive UI controls (e.g., a sliding-pill segmented toggle) — motion quality is an explicit, stated requirement, not an afterthought. Confidence: 0.55
- Prefers UI content consolidated into coarse, readable units over exposing raw granular data row-by-row (e.g., merging ~2s caption fragments into ~30s+ transcript paragraphs) — the presentation should look clean and "precise". Confidence: 0.5
