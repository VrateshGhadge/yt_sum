import type { CSSProperties } from 'react'

/**
 * iOS-style segmented control with a sliding white pill indicator.
 * Ported from OpenSource UI: https://opensourceui.in/components/segmented-toggle-button
 *
 * MIT License — Copyright (c) OpenSource UI
 * https://github.com/bidyut10/opensourceui/blob/main/LICENSE
 *
 * Adapted to this project's plain-CSS approach (no clsx/tailwind-merge) and
 * generalized: the pill width/offset are derived from `--count`/`--index`
 * instead of hardcoded per-option Tailwind classes, so any number of options
 * works (the original capped at 5).
 */
export function SegmentedToggleButton<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel,
}: {
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  ariaLabel?: string
}) {
  const count = options.length
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="segmented-toggle"
      style={{ '--count': count, '--index': activeIndex } as CSSProperties}
    >
      <span aria-hidden="true" className="segmented-indicator" />
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={activeIndex === index}
          tabIndex={activeIndex === index ? 0 : -1}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className="segmented-option"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
