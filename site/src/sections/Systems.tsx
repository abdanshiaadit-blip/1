import { useState } from 'react'
import { useReveal } from '../lib/hooks'
import Words from '../components/Words'
import { aadit, meera, systems as copy } from '../content/product'
import type { BodySystem } from '../../../src/data/types'

/* ==========================================================================
   07 · Nine systems — click-driven, not scroll-driven.

   After several minutes of being carried by the scroll, the visitor gets to
   steer. Every system, headline and summary here is read straight out of the
   prototype's own data.

   Aadit's profile carries eight systems; women's health is a first-class
   pillar in HUMAN and is shown from Meera's, with that stated plainly rather
   than blurred over.
   ========================================================================== */

const womens = meera.systems.find((s) => s.id === 'women')!
const list: { sys: BodySystem; member: string }[] = [
  ...aadit.systems.map((sys) => ({ sys, member: aadit.user.firstName })),
  { sys: womens, member: meera.user.firstName },
]

function Spark({ data, state }: { data: number[]; state: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const r = max - min || 1
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${34 - ((v - min) / r) * 28}`)
    .join(' ')
  return (
    <svg className={`hu-spark st-${state}`} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} className="hu-spark__line" vectorEffect="non-scaling-stroke" />
      <circle
        cx={100}
        cy={34 - ((data[data.length - 1] - min) / r) * 28}
        r="2.4"
        className="hu-spark__end"
      />
    </svg>
  )
}

export default function Systems() {
  const [i, setI] = useState(0)
  const head = useReveal<HTMLDivElement>()
  const { sys, member } = list[i]

  return (
    <section className="hu-sec sys" id="systems" aria-labelledby="sys-title">
      <div className="wrap">
        <div ref={head.ref} className={`sys__head headrev ${head.shown ? 'in' : ''}`}>
          <span className="cap">{copy.eyebrow}</span>
          <Words
            as="h2"
            id="sys-title"
            className="display sys__title"
            text={copy.title}
            shown={head.shown}
          />
          <p className="lead sys__lead">{copy.lead}</p>
        </div>

        <div className={`sys__body st-${sys.state}`}>
          <div className="sys__pick" role="tablist" aria-label="Body systems">
            {list.map((x, n) => (
              <button
                key={x.sys.id}
                type="button"
                role="tab"
                id={`systab-${x.sys.id}`}
                aria-selected={n === i}
                aria-controls="syspanel"
                tabIndex={n === i ? 0 : -1}
                className={`sys__b st-${x.sys.state} ${n === i ? 'is-on' : ''}`}
                onClick={() => setI(n)}
                onMouseEnter={() => setI(n)}
                onFocus={() => setI(n)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault()
                    setI((v) => (v + 1) % list.length)
                  }
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    setI((v) => (v - 1 + list.length) % list.length)
                  }
                }}
              >
                <span className="sys__dot" aria-hidden="true" />
                <span className="sys__name">{x.sys.name}</span>
              </button>
            ))}
          </div>

          <div
            className="sys__panel"
            id="syspanel"
            role="tabpanel"
            aria-labelledby={`systab-${sys.id}`}
            key={sys.id}
          >
            <div className="sys__panelhead">
              <span className={`sys__badge st-${sys.state}`}>{STATE_WORD[sys.state]}</span>
              <span className="sys__member">{member}’s data</span>
            </div>

            <h3 className="sys__headline">{sys.headline}</h3>
            <p className="sys__summary body">{sys.summary}</p>

            <div className="sys__metric">
              <div className="sys__metricval">
                <span className="sys__metriclabel">{sys.metric.label}</span>
                <span className="sys__metricnum tnum">
                  {sys.metric.value}
                  {sys.metric.unit && <em>{sys.metric.unit}</em>}
                </span>
              </div>
              <div className="sys__sparkwrap">
                <Spark data={sys.series} state={sys.state} />
                <span className="sys__sparklabel">{sys.seriesLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="sys__note">{copy.note}</p>
      </div>
    </section>
  )
}

const STATE_WORD: Record<string, string> = {
  optimal: 'Looking good',
  stable: 'Holding steady',
  monitor: 'Worth watching',
  attention: 'Needs attention',
  clinical: 'Talk to a doctor',
}
