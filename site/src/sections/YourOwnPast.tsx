/**
 * 7.8 Your own past — 165vh sticky. BRIEF.md Part 7.8.
 *
 * "Land the second differentiator — she is measured against herself, not a
 * textbook — and show the payoff of the loop."
 *
 * Beat 2 is the design: the axis extends to week 12 and **nothing else
 * happens for a quarter of the section.** She feels the twelve weeks. Do not
 * fill it.
 *
 * There is no y-axis. There are two points and a direction.
 */

import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Rule from '../components/Rule'
import StickyStage from '../components/StickyStage'
import { band } from '../lib/motion'

const W = 560
const H = 300
const X0 = 90
const X1 = 470
const Y0 = 96
const Y1 = 196

export default function YourOwnPast() {
  return (
    <StickyStage vh={165} vhMobile={115} name="your-own-past">
      {(p) => {
        const axis = band(p, 0, 0.3) // Beat 1 — the first result
        // Beat 2 (30–55%) — the wait. Deliberately empty.
        const second = band(p, 0.55, 0.85) // Beat 3 — the second result
        const bar = band(p, 0.85, 1) // Beat 4 — the range bar

        return (
          <div className="page grid12 past" data-section="your-own-past">
            <FrameCell name="past-text" cols={[1, 5]} className="past__text" minHeight={280}>
              <h2 className="t-display-m">
                <Print stagger>
                  <span className="line">Normal isn&rsquo;t the goal.</span>
                  <span className="line">Better than last time is.</span>
                </Print>
              </h2>
              <Print delay={370}>
                <p className="t-body-l past__sub">
                  Most reports tell you whether you sit inside a range built for everyone. We
                  show your number next to your own last one.
                </p>
              </Print>
              <p className="t-body past__delta" style={{ opacity: second }}>
                Falling since week 0.
              </p>
            </FrameCell>

            <FrameCell name="past-chart" cols={[7, 12]} className="past__stage">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="past__svg"
                role="img"
                aria-label="Sample data: one value at week zero and a lower value at week twelve, compared against itself rather than a population range."
              >
                {/* A surface-2 reference band, unlabelled and quiet. It stays
                    exactly where it is and is never highlighted, because it is
                    not the point. */}
                <rect x={0} y={Y0 - 34} width={W} height={110} fill="var(--surface-2)" opacity={0.8} />

                {/* G1: the x-axis draws left to right, then extends to week 12. */}
                <line
                  x1={X0}
                  y1={H - 60}
                  x2={X0 + (X1 - X0) * Math.max(axis, second > 0 ? 1 : axis)}
                  y2={H - 60}
                  stroke="var(--hairline-lit)"
                  strokeWidth="1"
                />

                {/* Week 0 */}
                <circle cx={X0} cy={Y0} r="4" fill="var(--text)" opacity={axis} />
                <text x={X0} y={H - 40} className="past__x" textAnchor="middle" opacity={axis}>
                  Week 0
                </text>

                {/* Week 12 — the line draws between the two over 900ms. */}
                <line
                  x1={X0}
                  y1={Y0}
                  x2={X0 + (X1 - X0) * second}
                  y2={Y0 + (Y1 - Y0) * second}
                  stroke="var(--jade)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx={X1} cy={Y1} r="4" fill="var(--jade)" opacity={second} />
                <text x={X1} y={H - 40} className="past__x" textAnchor="middle" opacity={second}>
                  Week 12
                </text>

                <text x={X0} y={Y0 - 18} className="past__v" textAnchor="middle" opacity={axis}>
                  212
                </text>
                <text x={X1} y={Y1 - 18} className="past__v past__v--now" textAnchor="middle" opacity={second}>
                  198
                </text>
              </svg>

              {/* Beat 4: ONE bar. Not a dashboard of six. */}
              <div className="past__bar" style={{ opacity: bar }}>
                <div className="past__track">
                  <span className="past__last" style={{ left: '62%' }} aria-hidden="true" />
                  {/* Part 3.3: transform only. Animating `left` animates
                      layout, and on a ~600px track 22% is 132px — far past the
                      28px Part 4.3 allows anything to travel. The tick sits at
                      its settled position and travels the token distance. */}
                  <span
                    className="past__now"
                    style={{ transform: `translateX(${(1 - bar) * 28}px)` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="past__barrule">
                  <Rule origin="left" progress={bar} tone="hairline" />
                </div>
              </div>

              <p className="t-telemetry past__sample">Sample data</p>
            </FrameCell>
          </div>
        )
      }}
    </StickyStage>
  )
}
