/**
 * 7.2 The silent build — 180vh sticky. BRIEF.md Part 7.2.
 *
 * "Serious things build for years while you feel completely fine. The only
 * place on the site that should feel close to fear — and it must come from
 * *data*, not language."
 *
 * What stays still: the text cell. The headline is set when the stage locks
 * and does not move, fade or reposition for the entire 180vh. It is the anchor
 * she reads while the data moves beside it.
 *
 * Chart rules: no shadow, no gradient fill under the line, no data-point dots,
 * no legend, no y-axis numbers. A line, two bands, and years. The marker is
 * never named — the axis says "Blood sugar, over time" and nothing more.
 */

import FrameCell from '../components/FrameCell'
import NumeralBlock from '../components/NumeralBlock'
import Print from '../components/Print'
import StickyStage from '../components/StickyStage'
import { band } from '../lib/motion'

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
/** Eight years of a number climbing without drama. Sample data, and labelled
 *  as such — Part 1.4 requires it on every chart. */
const SERIES = [18, 22, 27, 33, 38, 46, 55, 67]

const W = 620
const H = 340
const PAD = { l: 24, r: 24, t: 24, b: 34 }
const px = (i: number) => PAD.l + (i / (YEARS.length - 1)) * (W - PAD.l - PAD.r)
const py = (v: number) => H - PAD.b - (v / 100) * (H - PAD.t - PAD.b)

const LINE = SERIES.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ')
/** Where "You feel fine." prints: 2019, 2021, 2023, 2025. */
const FINE = [1, 3, 5, 7]

export default function SilentBuild() {
  return (
    <StickyStage vh={180} vhMobile={130} name="silent-build">
      {(p) => {
        const draw = band(p, 0.02, 0.45) // Beat 1 — the drift
        const cross = band(p, 0.45, 0.58) // Beat 2 — the crossing
        const cascade = band(p, 0.58, 1) // Beat 3 — the cascade
        const recede = 1 - cascade * 0.92

        return (
          <div className="page grid12 drift" data-section="silent-build">
            <FrameCell name="drift-text" cols={[1, 5]} className="drift__text" minHeight={260}>
              <h2 className="t-display-l">
                <Print stagger>
                  <span className="line">Diabetes doesn&rsquo;t begin</span>
                  <span>the day you&rsquo;re diagnosed.</span>
                </Print>
              </h2>
              <Print delay={370}>
                <p className="t-body-l drift__sub">
                  It builds for years,
                  <br />
                  while you feel completely fine.
                </p>
              </Print>
            </FrameCell>

            <FrameCell name="drift-stage" cols={[7, 12]} className="drift__stage">
              <div className="drift__chart" style={{ opacity: recede }}>
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="drift__svg"
                  role="img"
                  aria-label="Sample data: a blood sugar reading climbing steadily across eight years, crossing out of the healthy band without any symptom."
                >
                  {/* Two bands. The lower is jade-deep at 6%; the upper is
                      amber, rising from 6% to 22% as the line crosses into it.
                      Never red — HUMAN does not frighten people. */}
                  <rect x={0} y={py(55)} width={W} height={py(0) - py(55)} fill="var(--jade-deep)" opacity={0.06} />
                  <rect x={0} y={py(100)} width={W} height={py(55) - py(100)} fill="var(--amber)" opacity={0.06 + cross * 0.16} />

                  {/* G1, scroll-linked: the line itself is the rule. */}
                  <path
                    d={LINE}
                    fill="none"
                    stroke="var(--text)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }}
                  />

                  {/* G3: the x-axis years appear as the line passes them. */}
                  {YEARS.map((y, i) => (
                    <text
                      key={y}
                      x={px(i)}
                      y={H - 12}
                      className="drift__year"
                      textAnchor={i === 0 ? 'start' : i === YEARS.length - 1 ? 'end' : 'middle'}
                      opacity={draw > i / (YEARS.length - 1) ? 0.85 : 0}
                    >
                      {y}
                    </text>
                  ))}
                </svg>

                {/* G2 at four points. Identical every time — the repetition is
                    the whole idea. */}
                {FINE.map((i) => {
                  const at = i / (YEARS.length - 1)
                  const shown = draw > at
                  return (
                    <span
                      key={i}
                      className={`drift__fine t-caption ${at > 0.75 ? 'drift__fine--end' : ''}`}
                      style={{
                        left: `${(px(i) / W) * 100}%`,
                        top: `${(py(SERIES[i]) / H) * 100}%`,
                        clipPath: shown ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                      }}
                    >
                      You feel fine.
                    </span>
                  )
                })}

                {/* The emotional peak: a 16% opacity change and four words. */}
                <span
                  className="drift__crossing t-body"
                  style={{ clipPath: cross > 0.15 ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' }}
                >
                  Still nothing hurts.
                </span>

                <span className="drift__axis t-telemetry">Blood sugar, over time</span>
                <span className="drift__sample t-telemetry">Sample data</span>
              </div>

              {/* Beat 3. Three numerals ~14% of scroll apart. Each holds; the
                  previous falls to 20% rather than disappearing, so all three
                  end as a column with the last one live. */}
              <div className="drift__cascade" style={{ opacity: cascade > 0 ? 1 : 0 }}>
                <NumeralBlock
                  value={101}
                  suffix=" million"
                  caption="Indians live with diabetes."
                  progress={band(p, 0.6, 0.72)}
                  dim={band(p, 0.74, 0.86)}
                />
                <NumeralBlock
                  value={136}
                  suffix=" million"
                  caption="more are close to it, and can still turn back."
                  progress={band(p, 0.74, 0.86)}
                  dim={band(p, 0.88, 1)}
                />
                <NumeralBlock
                  value={43}
                  suffix=" in 100"
                  caption="have it and don’t know."
                  progress={band(p, 0.88, 1)}
                  dim={0}
                />
                <Print progress={band(p, 0.9, 1)}>
                  <p className="t-body drift__close">
                    A blood test would find all of this.
                    <br />
                    Almost nobody is looking.
                  </p>
                </Print>
                {/* A source on every disease statistic. Part 1.4. */}
                <p className="t-telemetry drift__src">
                  ICMR–INDIAB, Lancet Diabetes &amp; Endocrinology, 2023
                </p>
              </div>
            </FrameCell>
          </div>
        )
      }}
    </StickyStage>
  )
}
