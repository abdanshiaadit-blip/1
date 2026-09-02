'use client'

import { useState } from 'react'
import { ICMR_SOURCE } from '@/lib/content'

const BARS = [
  {
    id: 'diabetes',
    value: 101,
    label: 'living with diabetes',
    detail: '101 million Indians are living with diabetes.',
    tone: 'var(--color-signal-act)',
  },
  {
    id: 'prediabetes',
    value: 136,
    label: 'who can still turn back',
    detail: '136 million Indians are pre-diabetic and can still change direction.',
    tone: 'var(--color-signal-good)',
  },
]

const MAX = 136

/**
 * C1 — the reversible window (§10.3).
 *
 * Two bars. The second is longer, and that comparison is the entire point.
 * Labels sit in their own fixed grid cell so they never move with a bar.
 * The hover detail is supplementary only: the same figures are in the
 * caption, the copy and the source note, so nothing is hover-only (§13.3).
 */
export function ReversibleWindow() {
  // Pointer, keyboard and touch all resolve to one piece of state, so
  // there is no hover-only affordance and no CSS selector gymnastics.
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [pinnedId, setPinnedId] = useState<string | null>(null)
  const shownId = hoverId ?? pinnedId

  return (
    <figure className="c1">
      <div className="c1__rows" data-c1-rows>
        {BARS.map((bar) => (
          <div key={bar.id} className="c1__row">
            <button
              type="button"
              className="c1__track"
              aria-expanded={shownId === bar.id}
              aria-controls={`c1-detail-${bar.id}`}
              onClick={() => setPinnedId((current) => (current === bar.id ? null : bar.id))}
              onPointerEnter={() => setHoverId(bar.id)}
              onPointerLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(bar.id)}
              onBlur={() => setHoverId(null)}
            >
              <span className="sr-only-h">
                {bar.value} million {bar.label}
              </span>
              <span
                aria-hidden="true"
                className="c1__bar"
                data-c1-bar
                style={{ width: `${(bar.value / MAX) * 100}%`, background: bar.tone }}
              />
            </button>
            <p className="c1__label t-small">
              <span className="c1__figure">{bar.value}</span> million
            </p>
          </div>
        ))}
      </div>

      {/* Reserved slot: fixed height from first paint, so revealing a
          detail cannot move the chart above it (Law 4). */}
      <div className="c1__detail-slot">
        {BARS.map((bar) => (
          <p
            key={bar.id}
            id={`c1-detail-${bar.id}`}
            className="c1__detail t-caption"
            data-visible={shownId === bar.id}
          >
            {bar.detail} {ICMR_SOURCE}
          </p>
        ))}
      </div>

      <figcaption className="sr-only-h">
        Two bars comparing the number of Indians living with diabetes, 101 million, with the number who are
        pre-diabetic and can still turn back, 136 million. {ICMR_SOURCE}
      </figcaption>
    </figure>
  )
}
