import type { ReactNode } from 'react'

/**
 * §6.6 — a large tabular figure, a short label beneath, an optional source.
 * Left-aligned. Never boxed.
 */
export function StatBlock({
  figure,
  label,
  source,
}: {
  figure: ReactNode
  label: string
  source?: string
}) {
  return (
    <div className="stat-block">
      <div className="t-stat stat-block__figure">{figure}</div>
      <p className="t-small stat-block__label">{label}</p>
      {source && <p className="t-caption source-note stat-block__source">{source}</p>}
    </div>
  )
}
