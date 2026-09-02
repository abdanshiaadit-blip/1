type Tone = 'neutral' | 'good' | 'watch' | 'act'

const TONE_FILL: Record<Tone, string> = {
  neutral: 'var(--color-mist)',
  good: 'var(--color-signal-good)',
  watch: 'var(--color-signal-watch)',
  act: 'var(--color-signal-act)',
}

/**
 * §6.6 — the atom of every results visual. Marker name left, value right
 * in tabular figures, a 4px signal bar, a 1px bottom rule. Radius 0.
 *
 * Rows are not clickable (§11.5), so there is no hover affordance beyond
 * the row tint and the bar widening, and no `:focus-visible` is owed.
 */
export function MarkerRow({
  name,
  value,
  tone = 'neutral',
}: {
  name: string
  value: string
  tone?: Tone
}) {
  return (
    <li className="marker-row">
      <span aria-hidden="true" className="marker-row__bar" style={{ background: TONE_FILL[tone] }} />
      <span className="marker-row__name t-body">{name}</span>
      <span className="marker-row__value t-small">{value}</span>
    </li>
  )
}
