import { Fragment, type ReactNode } from 'react'

function inline(value: string): ReactNode[] {
  const parts = value.split(/(\*\*.*?\*\*|`.*?`)/g)
  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}

/**
 * Models sometimes run a whole list onto one line ("- a - b - c"), especially
 * when a bullet's own text contains a hyphen. Split those back out so every
 * item starts on its own line.
 */
function splitInlineList(line: string): string[] {
  const bulletParts = line.split(/\s+[-*]\s+/)
  if (bulletParts.length > 2) {
    return bulletParts.map((part, i) => (i === 0 ? part : `- ${part}`))
  }
  const numberParts = line.split(/\s+(?=\d+[.)]\s+)/)
  if (numberParts.length > 2) return numberParts
  return [line]
}

/* The reading block, written as utilities against its own children: what it
   styles is generated from model output, so there is nothing in the markup to
   put a class on. Reading measure is set in rem, not ch — `ch` measures the "0"
   glyph and overstates how much running prose actually fits. */
const PROSE = [
  'mt-4 max-w-[30rem] text-[15px] leading-[1.68] text-ink-2',
  '[&>*+*]:mt-[13px]',
  '[&_h3]:mt-[22px] [&_h3]:border-t [&_h3]:border-line [&_h3]:pt-3 [&_h3]:text-[13px] [&_h3]:font-[680] [&_h3]:text-ink',
  '[&_h3:first-child]:mt-0 [&_h3:first-child]:border-t-0 [&_h3:first-child]:pt-0',
  '[&_ul]:grid [&_ul]:gap-1.5 [&_ol]:grid [&_ol]:gap-1.5 [&_ol]:[counter-reset:n]',
  '[&_ul>li]:relative [&_ul>li]:pl-4 [&_ul>li::before]:absolute [&_ul>li::before]:left-0.5 [&_ul>li::before]:text-mark [&_ul>li::before]:content-["•"]',
  '[&_ol>li]:relative [&_ol>li]:pl-6 [&_ol>li]:[counter-increment:n]',
  '[&_ol>li::before]:absolute [&_ol>li::before]:left-0 [&_ol>li::before]:text-[12.5px] [&_ol>li::before]:text-ink-4 [&_ol>li::before]:content-[counter(n)_"."]',
  '[&_code]:rounded-[3px] [&_code]:border [&_code]:border-line [&_code]:bg-sunken [&_code]:px-1 [&_code]:py-px [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:text-ink',
  '[&_strong]:font-[640] [&_strong]:text-ink',
].join(' ')

export function MarkdownText({ value }: { value: string }) {
  // Normalise first, then parse: the rest of the parser can assume one item per line.
  const lines = value.split('\n').flatMap(splitInlineList)
  const content: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    // Blank line: paragraph separator.
    if (!line.trim()) {
      index += 1
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^[-*]\s+/, ''))
        index += 1
      }
      content.push(<ul key={`ul-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ul>)
      continue
    }

    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\d+[.)]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+[.)]\s+/, ''))
        index += 1
      }
      content.push(<ol key={`ol-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>)}</ol>)
      continue
    }
    if (/^#{1,3}\s+/.test(line)) {
      content.push(<h3 key={index}>{inline(line.replace(/^#+\s+/, ''))}</h3>)
      index += 1
      continue
    }

    // Paragraph: consecutive non-blank lines are soft wraps of one paragraph,
    // so join them rather than emitting a <p> per line.
    const paragraph: string[] = []
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^[-*]\s+/.test(lines[index]) &&
      !/^\d+[.)]\s+/.test(lines[index]) &&
      !/^#{1,3}\s+/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    content.push(<p key={index}>{inline(paragraph.join(' '))}</p>)
  }

  return <div className={PROSE}>{content}</div>
}
