/**
 * §6.6 — marker categories only. Sentence case. The count sits beside the
 * name as its own muted span rather than being joined to it by a middle
 * dot, which §2.3 bans.
 */
export function Tag({ name, count }: { name: string; count?: number }) {
  return (
    <li className="tag-h t-caption">
      <span>{name}</span>
      {count !== undefined && (
        <span style={{ color: 'var(--color-ink-faint)' }}>
          {count}
          <span className="sr-only-h"> markers</span>
        </span>
      )}
    </li>
  )
}
