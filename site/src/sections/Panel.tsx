/**
 * 7.7 The panel — 145vh flow. BRIEF.md Part 7.7.
 *
 * "Prove the panel is built for her specifically, and defuse the marker-count
 * arms race before a competitor comparison occurs to her."
 *
 * Beat 1 is the visual argument of the entire company in one gesture: 96
 * uniform dots, all equal, and then 93 fade to 12% while 3 travel out to
 * become the three ranked priorities. **Ninety-six becomes three.** It should
 * be the cleanest animation on the site.
 *
 * Dot hover shows the CATEGORY only. Never individual marker names — naming
 * them turns the site into a lab menu.
 */

import { useState } from 'react'
import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Rule from '../components/Rule'
import Section from '../components/Section'
import { useTriggered } from '../lib/motion'

const CATEGORIES = ['Metabolic', 'Thyroid', 'Liver', 'Vitamins']
const COLS = 12
const ROWS = 8
/** The three that travel. Chosen from across the grid so the condensation
 *  reads as a selection, not a row being peeled off. */
const CHOSEN = [16, 45, 74]

const HER = [
  ['Ferritin, for every woman.', 'Iron deficiency is one of the most common and most missed conditions in Indian women, and you cannot find it without ferritin.'],
  ['A hormone panel, when your symptoms call for it.', 'We ask about your cycle, skin, hair and weight at signup, and order it only if you flag something. Running it on everybody would be over-testing.'],
  ['Thyroid is already inside the ninety-six.', ''],
]
const HIM = [
  ['Testosterone, for every man.', "The most asked-for male marker, and it isn't in a standard package."],
]

export default function Panel() {
  const [ref, on] = useTriggered<HTMLDivElement>()
  const [who, setWho] = useState<'her' | 'him'>('her')
  const [chip, setChip] = useState<{ i: number; label: string } | null>(null)
  const rows = who === 'her' ? HER : HIM

  return (
    <Section id="panel" vh={145} vhMobile={105}>
      <div className="page grid12 panel__grid" ref={ref}>
        <FrameCell name="panel-head" cols={[1, 5]} className="panel__head">
          <h2 className="t-display-m">
            <Print stagger>
              <span className="line">Ninety-six markers,</span>
              <span>plus the ones your body actually needs.</span>
            </Print>
          </h2>

          {/* Two segments, fixed-height content below, so switching cannot
              move anything beneath it. */}
          <div className="seg" role="tablist" aria-label="Panel by body">
            {(['her', 'him'] as const).map((k) => (
              <button
                key={k}
                role="tab"
                type="button"
                aria-selected={who === k}
                className={`seg__b ${who === k ? 'is-on' : ''}`}
                onClick={() => setWho(k)}
              >
                {k === 'her' ? 'For her' : 'For him'}
              </button>
            ))}
            <span className={`seg__ind seg__ind--${who}`} aria-hidden="true" />
          </div>

          <div className="panel__rows">
            {rows.map(([title, body]) => (
              <div className="panel__row" key={title}>
                <p className="t-body panel__rowt">{title}</p>
                {body && <p className="t-caption panel__rowb">{body}</p>}
              </div>
            ))}
          </div>

          <p className="t-body-l panel__close">More numbers isn&rsquo;t better. The right ones are.</p>
        </FrameCell>

        <FrameCell name="panel-grid" cols={[7, 12]} className="panel__stage">
          <div className="panel__dots" role="img" aria-label="Ninety-six markers, of which three are chosen as this quarter's priorities.">
            {Array.from({ length: COLS * ROWS }, (_, i) => {
              const chosen = CHOSEN.indexOf(i)
              return (
                <span
                  key={i}
                  className={`dot ${on ? 'is-resolved' : ''} ${chosen >= 0 ? 'dot--chosen' : ''}`}
                  style={{ transitionDelay: chosen >= 0 ? `${chosen * 80}ms` : '0ms' }}
                  onPointerEnter={() =>
                    setChip({ i, label: CATEGORIES[i % CATEGORIES.length] })
                  }
                  onPointerLeave={() => setChip(null)}
                />
              )
            })}
            {chip && (
              <span className="dot__chip t-telemetry" aria-hidden="true">
                {chip.label}
              </span>
            )}
          </div>

          {/* The three, each printing onto its own rule with a jade fill. */}
          <ol className={`panel__three ${on ? 'is-on' : ''}`}>
            {['Iron & energy', 'Cycle & insulin', 'Thyroid trajectory'].map((t, i) => (
              <li key={t} className="panel__prio" style={{ transitionDelay: `${300 + i * 80}ms` }}>
                <span className="t-telemetry panel__prion">{i + 1}</span>
                <span className="t-body">{t}</span>
                <span className="panel__priorule">
                  <Rule origin="left" duration={680} delay={300 + i * 80} />
                </span>
              </li>
            ))}
          </ol>
        </FrameCell>
      </div>
    </Section>
  )
}
