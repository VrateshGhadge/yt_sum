/**
 * Ink Wash background — minimal sumi-e ink clouds on warm paper.
 * Ported from OpenSource UI: https://opensourceui.in/components/ink-wash-background
 *
 * MIT License — Copyright (c) OpenSource UI
 * https://github.com/bidyut10/opensourceui/blob/main/LICENSE
 *
 * Adapted to this project's plain-CSS approach (no clsx/tailwind-merge) and
 * rendered as a fixed full-viewport layer so the wash stays consistent across
 * every page and does not stretch with page length.
 */
export function InkWashBackground() {
  return (
    <div className="ink-wash" aria-hidden="true">
      <div className="ink-wash-base" />
      <div className="ink-wash-blobs">
        <div className="ink-blob ink-blob-a" />
        <div className="ink-blob ink-blob-b" />
        <div className="ink-blob ink-blob-c" />
        <div className="ink-blob ink-blob-d" />
      </div>
      <div className="ink-wash-grain" />
    </div>
  )
}
