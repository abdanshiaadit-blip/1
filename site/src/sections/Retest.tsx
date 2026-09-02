/**
 * 7.6 The retest — 165vh sticky. BRIEF.md Part 7.6.
 *
 * "Land the single differentiator. If she remembers one thing from this page,
 * it must be this."
 *
 * What stays still: the text cell — and, critically, **the week-12 marker.**
 * It is placed at the very start and never moves, never pulses, never glows,
 * while eleven weeks scroll past it. The stillness of that one mark is the
 * argument.
 */

import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Rule from '../components/Rule'
import StickyStage from '../components/StickyStage'
import { band } from '../lib/motion'

const CHASE = ['We call you.', 'We call you again.', 'A phlebotomist comes to your home.']

export default function Retest() {
  return (
    <StickyStage vh={165} vhMobile={105} name="retest">
      {(p) => {
        const rail = band(p, 0, 0.2) // Beat 1 — the mark is set
        const weeks = band(p, 0.2, 0.7) // Beat 2 — the weeks pass
        const chase = band(p, 0.7, 1) // Beat 3 — the chase

        return (
          <div className="page grid12 retest" data-section="retest">
            <FrameCell name="retest-text" cols={[1, 5]} className="retest__text" minHeight={300}>
              <h2 className="t-display-m">
                <Print stagger>
                  <span className="line">On the day you join,</span>
                  <span>we book your second blood test.</span>
                </Print>
              </h2>
              <Print delay={370}>
                <p className="t-body-l retest__sub">
                  Twelve weeks later. Already paid for, inside the price. Someone calls you at
                  week ten, eleven and twelve to make sure you turn up.
                </p>
              </Print>
              {/* The only movement in the text cell in the whole section, and
                  it is a fade with no travel. */}
              <div className="retest__closing" style={{ opacity: chase }}>
                <p className="t-body-l">
                  It&rsquo;s the only promise on this page that costs us money.
                  <br />
                  That&rsquo;s why nobody else makes it.
                </p>
              </div>
            </FrameCell>

            <FrameCell name="retest-rail" cols={[7, 12]} className="retest__stage">
              <div className="retest__col">
                <p className="t-telemetry retest__day0">Day 0</p>

                <div className="retest__railwrap">
                  <div className="retest__rail">
                    <Rule origin="top" progress={rail} />
                  </div>

                  <ol className="retest__weeks">
                    {Array.from({ length: 11 }, (_, i) => {
                      const at = (i + 1) / 12
                      return (
                        <li
                          key={i}
                          className="retest__week t-telemetry"
                          style={{ opacity: weeks > at ? 0.55 : 0 }}
                        >
                          <span className="retest__tick" aria-hidden="true" />
                          {i + 1}
                        </li>
                      )
                    })}

                    {/* Placed immediately, before anything else, and then held
                        at full brightness for the rest of the section. */}
                    <li className="retest__week retest__week--12" style={{ opacity: rail }}>
                      <span className="retest__tick retest__tick--lit" aria-hidden="true" />
                      <span className="t-body retest__w12">Week 12 — booked.</span>
                    </li>
                  </ol>
                </div>

                <div className="retest__chase" style={{ opacity: chase > 0 ? 1 : 0 }}>
                  {CHASE.map((line, i) => (
                    <p
                      key={line}
                      className="t-caption retest__chaseline"
                      style={{
                        clipPath:
                          chase > 0.2 + i * 0.22 ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </FrameCell>
          </div>
        )
      }}
    </StickyStage>
  )
}
