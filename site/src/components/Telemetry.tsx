/**
 * The live readout, bottom-left. BRIEF.md Part 7.1 Beat 3, Part 8 moment 9.
 *
 * `01 / 14 — opening — 04%`. Updates on scroll, never animated on its own,
 * hidden below 768px. The most instrument-grade detail on the site, and
 * nearly free.
 */

import { useEffect, useState } from 'react'
import { subscribe } from '../lib/raf'

const SECTIONS = [
  'opening', 'the silent build', 'the ledger', 'the loop', 'the app',
  'the retest', 'the panel', 'your own past', "what we don't sell",
  "what we can't tell you yet", 'what a membership includes', 'questions',
  'the close', 'footer',
]

export default function Telemetry() {
  const [state, setState] = useState({ index: 0, pct: 0 })

  useEffect(() => {
    return subscribe((y) => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const pct = max <= 0 ? 0 : Math.round((y / max) * 100)

      // Which section owns the middle of the viewport right now.
      let index = 0
      document.querySelectorAll('[data-section]').forEach((el, i) => {
        const r = el.getBoundingClientRect()
        if (r.top <= window.innerHeight * 0.5) index = i
      })
      setState((s) => (s.index === index && s.pct === pct ? s : { index, pct }))
    })
  }, [])

  const name = SECTIONS[state.index] ?? SECTIONS[0]
  return (
    <p className="telemetry t-telemetry" aria-hidden="true">
      {String(state.index + 1).padStart(2, '0')} / 14 — {name} — {String(state.pct).padStart(2, '0')}%
    </p>
  )
}
