import type { Chapter, Segment } from '../types'

/* The chapter list is the transcript's own sections, numbered. Nothing here is
   generated: a chapter's span is the gap between one section and the next, and
   its heading is the opening words of the section it points at. */

const TITLE_MAX = 68

/* A section opens with a sentence, so the heading is that sentence when it is
   short enough to sit on one line and the body follows it as the excerpt. When
   the section opens mid-thought, the heading is its first line's worth instead
   and the excerpt picks up from there. */
function splitLeading(text: string) {
  const clean = text.trim().replace(/\s+/g, ' ')
  const sentence = clean.match(/^[^.!?]{0,90}?[.!?]/)

  if (sentence && sentence[0].length <= TITLE_MAX && sentence[0].length < clean.length) {
    return { title: sentence[0], note: clean.slice(sentence[0].length).trim() }
  }

  if (clean.length <= TITLE_MAX) return { title: clean, note: '' }

  const cut = clean.slice(0, TITLE_MAX)
  const space = cut.lastIndexOf(' ')
  const title = `${cut.slice(0, space > 24 ? space : cut.length)}…`
  return { title, note: clean.slice(title.length - 1).trim() }
}

export function chaptersFromSegments(segments: Segment[]): Chapter[] {
  return segments.map((segment, index) => {
    const next = segments[index + 1]
    const { title, note } = splitLeading(segment.text)

    return {
      title,
      note,
      startMs: segment.offsetMs,
      endMs: next ? next.offsetMs : segment.offsetMs + (segment.durationMs || 0),
    }
  })
}

/* Words every transcript shares carry no location, so they are not counted. */
const COMMON = new Set([
  'about', 'after', 'again', 'against', 'almost', 'along', 'already', 'also', 'although',
  'always', 'because', 'become', 'becomes', 'before', 'being', 'between', 'business',
  'could', 'doing', 'during', 'either', 'else', 'enough', 'especially', 'everything',
  'going', 'gonna', 'great', 'having', 'here', 'however', 'itself', 'maybe', 'might',
  'maybe', 'never', 'other', 'others', 'really', 'right', 'should', 'since', 'something',
  'still', 'stuff', 'their', 'there', 'these', 'thing', 'things', 'think', 'those',
  'through', 'under', 'until', 'using', 'very', 'want', 'wanted', 'well', 'what',
  'whatever', 'when', 'where', 'which', 'while', 'whole', 'with', 'without', 'would',
  'your', 'youre',
])

function keywords(text: string) {
  return new Set(
    text
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word.length >= 5 && !COMMON.has(word)),
  )
}

/* Where in the video a written section came from. The summary is prose, so the
   best we can do is find the passage it shares the most distinctive words with —
   and only call it a location when the overlap is too large to be coincidence.
   Matching runs forward, because the summary follows the video's own order. */
export function locateSections(sections: string[], segments: Segment[]): (number | null)[] {
  if (segments.length === 0) return sections.map(() => null)

  const passageWords = segments.map((segment) => keywords(segment.text))
  const locations: (number | null)[] = []
  let cursor = 0

  for (const section of sections) {
    const words = keywords(section)
    let best = -1
    let bestScore = 0

    for (let index = cursor; index < segments.length; index++) {
      let score = 0
      for (const word of words) if (passageWords[index].has(word)) score += 1
      if (score > bestScore) {
        bestScore = score
        best = index
      }
    }

    if (best >= 0 && bestScore >= 3) {
      locations.push(segments[best].offsetMs)
      cursor = best + 1
    } else {
      locations.push(null)
    }
  }

  return locations
}
