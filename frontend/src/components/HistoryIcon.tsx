/* The History glyph: a circular arrow around a document with a play badge,
   marking the list of videos already summarized. Authored rather than imported
   because no icon set carries this exact mark; it is drawn on lucide's 24px grid
   with matching round joins so it sits with the icons used elsewhere in the app.
   The mask is what keeps the badge legible where it crosses the document. */
export function HistoryIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id="summify-history-badge">
          <rect width="24" height="24" fill="#fff" />
          <circle cx="18.3" cy="14.7" r="5.1" fill="#000" />
        </mask>
      </defs>

      <path d="M4.6 4.5A10.4 10.4 0 1 1 1.4 12" />
      <path d="M1.2 2.6 5 4.6 1.7 7.1Z" fill="currentColor" stroke="none" />

      <g mask="url(#summify-history-badge)">
        <rect x="6.3" y="5.2" width="11.4" height="13.2" rx="1.5" />
        <path d="M9.3 8.6h6.2M9.3 11.4h3.4" />
      </g>

      <circle cx="18.3" cy="14.7" r="3.6" />
      <path d="m17.1 13.4 2.6 1.3-2.6 1.3Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
