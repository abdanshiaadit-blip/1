/**
 * 7.3 The ledger — 165vh sticky. BRIEF.md Part 7.3.
 *
 * "Deliver the thesis. Afterwards she can explain HUMAN to someone else in one
 * sentence. Second most important section on the page."
 *
 * What stays still: the headline, and all four row labels, at full opacity,
 * from the moment the stage locks. She sees the whole argument immediately.
 * What resolves is the *verdict* on each row.
 *
 * It is a **ledger** — hairline rules, aligned columns, no boxes, no radius,
 * no icons beyond the check and the circle. Animating rows in one at a time
 * would read as a generic feature list and destroy the argument.
 */

import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Rule from '../components/Rule'
import StickyStage from '../components/StickyStage'
import { band } from '../lib/motion'

interface Row {
  label: string
  verdict: string
  detail: string
  solved: boolean
}

const ROWS: Row[] = [
  { label: 'Book a blood test', verdict: 'Solved', detail: 'Labs collect at your home in 2,500 towns.', solved: true },
  { label: 'Understand the numbers', verdict: 'Solved, and free', detail: 'Any app does this now.', solved: true },
  { label: 'Know what to fix first', verdict: 'Nobody does this', detail: '', solved: false },
  { label: 'Come back and check it worked', verdict: 'Nobody does this', detail: '', solved: false },
]

export default function Ledger() {
  return (
    <StickyStage vh={165} vhMobile={115} name="ledger">
      {(p) => {
        // Beat 1 (0–30%): rows 1 and 2 resolve, 200ms apart.
        // Beat 2 (30–55%): rows 3 and 4 stay open, then step in weight.
        // Beat 3 (55–100%): the territory fills and the claim prints.
        const rowProgress = (i: number) =>
          i < 2 ? band(p, 0.02 + i * 0.09, 0.16 + i * 0.09) : band(p, 0.30 + (i - 2) * 0.09, 0.44 + (i - 2) * 0.09)
        const emphasis = band(p, 0.44, 0.55)
        const fill = band(p, 0.55, 0.78)
        const claim = band(p, 0.78, 0.95)

        return (
          <div className="page ledger" data-section="ledger">
            <FrameCell name="ledger-head" cols={[1, 12]}>
              <h2 className="t-display-l ledger__h">
                Four things have to happen
                <br />
                before your health actually improves.
              </h2>
            </FrameCell>

            <FrameCell name="ledger-rows" cols={[1, 12]} className="ledger__rows">
              {/* The territory: a surface-2 field with a jade top hairline
                  filling the lower half from the bottom up. The page literally
                  divides into what is solved and what HUMAN owns. */}
              <div
                className="ledger__territory"
                aria-hidden="true"
                style={{ transform: `scaleY(${fill})` }}
              />

              {ROWS.map((row, i) => {
                const done = rowProgress(i)
                const dim = i < 2 ? 1 - fill * 0.65 : 1
                const lifted = i >= 2 ? emphasis : 0
                return (
                  <div className="ledger__row" key={row.label} style={{ opacity: dim }}>
                    <div
                      className="ledger__label t-body-l"
                      style={{
                        // The weight step from 400 to 450 IS the "these two
                        // matter" signal. Nothing else says it.
                        fontWeight: 400 + Math.round(lifted * 50),
                        color: `color-mix(in srgb, var(--text) ${Math.round(lifted * 100)}%, var(--text-2))`,
                      }}
                    >
                      {row.label}
                    </div>

                    <div className="ledger__rule">
                      <Rule origin="left" progress={done} />
                    </div>

                    <div className="ledger__verdict" style={{ opacity: done >= 1 ? 1 : done }}>
                      <span
                        className={`glyph ${row.solved ? 'glyph--check' : 'glyph--open'}`}
                        aria-hidden="true"
                      />
                      <span className="t-body">{row.verdict}</span>
                      {row.detail && <span className="t-caption ledger__detail">{row.detail}</span>}
                    </div>
                  </div>
                )
              })}
            </FrameCell>

            <FrameCell name="ledger-claim" cols={[1, 12]} className="ledger__claimcell">
              <Print progress={claim}>
                <p className="t-display-m ledger__claim">We built the second half.</p>
              </Print>
            </FrameCell>
          </div>
        )
      }}
    </StickyStage>
  )
}
