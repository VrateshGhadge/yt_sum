function inline(value: string) { return value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>') }
export function MarkdownText({ value }: { value: string }) {
  return <div className="prose">{value.split('\n').map((line, index) => {
    const html = inline(line.replace(/^[-*]\s+/, '').replace(/^\d+[.)]\s+/, ''))
    if (/^#{1,3}\s+/.test(line)) return <h3 key={index}>{line.replace(/^#+\s+/, '')}</h3>
    if (/^[-*]\s+/.test(line)) return <li key={index} dangerouslySetInnerHTML={{ __html: html }} />
    if (/^\d+[.)]\s+/.test(line)) return <li key={index} className="numbered" dangerouslySetInnerHTML={{ __html: html }} />
    if (!line.trim()) return <br key={index} />
    return <p key={index} dangerouslySetInnerHTML={{ __html: html }} />
  })}</div>
}
