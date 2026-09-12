/* The subject chips on a video page come from the only place we hold them: the
   title. Every word a title uses to sell the video — "NEW", "INSANE",
   "EXPLAINED" — is dropped, so what stays is what the video is about. */

const NOISE = new Set([
  'and', 'are', 'best', 'breaking', 'but', 'complete', 'crush', 'crushes',
  'destroy', 'destroys', 'ep', 'episode', 'epic', 'ever', 'every', 'explained',
  'for', 'from', 'full', 'gets', 'her', 'his', 'how', 'insane', 'into', 'its',
  'latest', 'live', 'make', 'makes', 'more', 'most', 'new', 'not', 'now',
  'official', 'only', 'part', 'reaction', 'review', 'shocking', 'shorts',
  'that', 'the', 'their', 'this', 'top', 'trailer', 'ultimate', 'update',
  'very', 'video', 'vs', 'versus', 'what', 'why', 'will', 'with', 'you',
  'your',
])

function isVersion(token: string) {
  return /^\d+(\.\d+)*$/.test(token)
}

export function topicsFromTitle(title: string, limit = 6): string[] {
  const tokens = title
    .split(/[^\p{L}\p{N}.]+/u)
    .map((token) => token.replace(/^\.+|\.+$/g, ''))
    .filter(Boolean)

  const topics: string[] = []
  const seen = new Set<string>()

  function add(topic: string) {
    const key = topic.toLowerCase()
    if (seen.has(key) || topics.length === limit) return
    seen.add(key)
    topics.push(topic)
  }

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    const next = tokens[index + 1]

    // "GPT 5.6" and "Opus 4.1" name one thing, not two.
    if (/^[A-Z0-9]{2,5}$/.test(token) && next && isVersion(next)) {
      add(`${token} ${next}`)
      index += 1
      continue
    }

    if (isVersion(token)) continue
    if (token.length < 3) continue
    if (NOISE.has(token.toLowerCase())) continue

    add(token)
  }

  return topics
}
