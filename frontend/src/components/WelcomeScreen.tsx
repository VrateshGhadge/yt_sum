import type { ReactNode } from 'react'

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
    <main className="welcome">
      <div data-impeccable-carbonize="954780d0" style={{ display: "contents" }}>
        {/* impeccable-carbonize-start 954780d0 */}
        <style data-impeccable-css="954780d0">{`
        /* V1 — Hierarchy: the headline carries the page; everything else is
        sized to stay beneath it. The rule under the field firms up so the
        one interactive element reads as deliberate, not default. */
        @scope ([data-impeccable-variant="1"]) {
        :scope > .v1 {
        width: min(100% - 48px, 900px); margin: 0 auto;
        padding: clamp(56px, 9vh, 104px) 0 72px;
        }
        .v1 h1 {
        font-size: calc(clamp(36px, 5.4vw, 68px) * var(--p-headline, 1));
        font-weight: 640; line-height: 1.02; letter-spacing: -0.038em;
        color: var(--ink); text-wrap: balance;
        }
        .v1 .welcome-lede {
        max-width: 44ch; margin-top: 24px;
        font-size: 15.5px; line-height: 1.6; color: var(--ink-3);
        }
        .v1 .url-form { margin-top: 42px; }
        .v1 .url-form-row { padding-bottom: 11px; }
        :scope[data-p-rule="hairline"] > .v1 .url-form-row { border-bottom: 1px solid var(--line-3); }
        :scope[data-p-rule="ink"] > .v1 .url-form-row { border-bottom: 2px solid var(--ink); }
        :scope[data-p-rule="heavy"] > .v1 .url-form-row { border-bottom: 3px solid var(--ink); }
        .v1 .url-form input { font-size: 18px; padding: 7px 0; }
        .v1 .url-submit { min-height: 44px; padding: 0 20px; font-size: 14px; }
        .v1 .check { margin-top: 22px; font-size: 13.5px; }
        }
        
        /* V2 — Layout topology: an asymmetric split with a hairline between the
        statement and the field. A rule, not a box: the form is a surface in
        the document, never a card. */
        @scope ([data-impeccable-variant="2"]) {
        :scope > .v2 {
        width: min(100% - 48px, 1140px); margin: 0 auto;
        padding: clamp(48px, 8vh, 96px) 0 72px;
        display: grid; grid-template-columns: 1.05fr 0.95fr;
        gap: clamp(32px, 5vw, 76px); align-items: start;
        }
        :scope[data-p-split="balanced"] > .v2 { grid-template-columns: 1fr 1fr; }
        .v2 h1 {
        font-size: clamp(30px, 3.4vw, 46px); font-weight: 640;
        line-height: 1.1; letter-spacing: -0.032em; color: var(--ink);
        text-wrap: balance;
        }
        .v2 .welcome-lede {
        margin-top: 18px; max-width: 42ch;
        font-size: 15px; line-height: 1.62; color: var(--ink-3);
        }
        .v2 .v2-field { padding-left: clamp(24px, 3vw, 44px); }
        :scope[data-p-divider] > .v2 .v2-field { border-left: 1px solid var(--line-2); }
        .v2 .url-form { margin-top: 0; }
        .v2 .url-form-row { padding-bottom: 9px; }
        .v2 .url-form input { font-size: 17px; }
        .v2 .url-submit { min-height: 40px; }
        .v2 .check { margin-top: 18px; }
        @media (max-width: 980px) {
        :scope > .v2 { grid-template-columns: 1fr; gap: 34px; }
        .v2 .v2-field {
        padding-left: 0; padding-top: 30px;
        border-left: 0; border-top: 1px solid var(--line-2);
        }
        }
        }
        
        /* V3 — Typographic system: the scale relationship inverts. The lede
        carries the page at reading size and the headline sits above it as a
        tight label, with the field on a firm rule and the checkbox as a
        quiet full-width row. */
        @scope ([data-impeccable-variant="3"]) {
        :scope > .v3 {
        width: min(100% - 48px, 860px); margin: 0 auto;
        padding: clamp(56px, 9vh, 104px) 0 72px;
        }
        .v3 h1 {
        font-size: clamp(24px, 2.6vw, 33px); font-weight: 620;
        line-height: 1.18; letter-spacing: -0.024em; color: var(--ink);
        max-width: 26ch;
        }
        .v3 .welcome-lede {
        margin-top: 18px;
        font-size: calc(var(--p-lede, 17) * 1px); line-height: 1.7;
        color: var(--ink-2);
        }
        :scope[data-p-measure="narrow"] > .v3 .welcome-lede { max-width: 44ch; }
        :scope[data-p-measure="wide"] > .v3 .welcome-lede { max-width: 64ch; }
        .v3 .url-form {
        margin-top: 38px; padding-top: 26px;
        border-top: 1px solid var(--line-2);
        }
        .v3 .url-form-row { padding-bottom: 12px; border-bottom: 2px solid var(--ink); }
        .v3 .url-form input { font-size: 17px; }
        .v3 .url-submit { min-height: 42px; padding: 0 19px; }
        .v3 .check {
        display: flex; width: 100%; margin-top: 0;
        padding: 14px 0; border-top: 1px solid var(--line);
        }
        }
        `}</style>
        {/* impeccable-param-values 954780d0: {"lede":17,"measure":"wide"} */}
        {/* impeccable-carbonize-end 954780d0 */}
        <div data-impeccable-variant="3" style={{ display: 'contents' }}>
          <div className="v3">
            <h1>
              Summarize any YouTube video.
              <br />
              Ask it questions. Quiz yourself.
            </h1>

            <p className="welcome-lede">
              Paste a link to get a summary you can read in four ways, a full transcript with
              timestamps, grounded answers with sources, study notes, and a quiz.
            </p>

            {children}

            <label className="check">
              <input
                type="checkbox"
                checked={includeTranscript}
                onChange={(event) => onIncludeTranscriptChange(event.target.checked)}
              />
              Include the timestamped transcript
            </label>
          </div>
        </div>
      </div>
    </main>
  )
}
