/**
 * 7.4 The loop — 140vh flow. BRIEF.md Part 7.4.
 *
 * "Make the cycle concrete and memorable. A deliberate quiet section between
 * two set pieces."
 *
 * One beat: the circuit draws itself as a single continuous stroke, from Test
 * through all six nodes and closing back into Test. As the stroke passes each
 * node, that node's label prints. When the circle closes, a single jade pulse
 * travels the full path once and stops.
 *
 * That closing pulse is one of only three things on this site that move
 * without the visitor causing it, and it happens exactly once.
 *
 * Numbering 1–6 is permitted here because this genuinely is a sequence. It is
 * the only place on the site where numbered markers appear.
 */

import { useEffect, useState } from 'react'
import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Section from '../components/Section'
import { usePrefersReducedMotion, useTriggered } from '../lib/motion'

const NODES = [
  { n: 1, name: 'Test', caption: 'A 96-marker panel, drawn at your home.' },
  { n: 2, name: 'Understand', caption: 'Every marker in plain words, plus one score for how your body is doing.' },
  { n: 3, name: 'Choose', caption: 'The three things worth fixing this quarter. Not all ninety-six.' },
  { n: 4, name: 'Act', caption: 'One plan, built on Indian food and the levels Indian bodies need.' },
  { n: 5, name: 'Track', caption: 'One tap a day. Your watch and cycle sync on their own.' },
  { n: 6, name: 'Improve', caption: 'We test again at week twelve and show you whether it moved.' },
]

/* The circuit is one closed path. Six nodes evenly spaced on a circle, drawn
   as a single stroke so it can be dashed into existence in one pass. */
const R = 132
const CX = 160
const CY = 160
const POINTS = NODES.map((_, i) => {
  const a = (i / NODES.length) * Math.PI * 2 - Math.PI / 2
  return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R }
})
const PATH =
  POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z'
const LEN = Math.PI * 2 * R // close enough for a hexagon's dash budget

export default function Loop() {
  const reduced = usePrefersReducedMotion()
  const [ref, on] = useTriggered<HTMLDivElement>(0.7)
  const [hover, setHover] = useState<number | null>(null)
  const [pulsed, setPulsed] = useState(false)

  useEffect(() => {
    if (!on || reduced || pulsed) return
    // The pulse fires once, 1400ms after the stroke starts, and never again.
    const t = window.setTimeout(() => setPulsed(true), 1400)
    return () => window.clearTimeout(t)
  }, [on, reduced, pulsed])

  return (
    <Section id="loop" vh={140} vhMobile={110}>
      <div className="page grid12 loop__grid" ref={ref}>
        <FrameCell name="loop-type" cols={[1, 5]} className="loop__type">
          <h2 className="t-display-m">
            <Print stagger>
              <span className="line">Not a report you get once.</span>
              <span className="line">A loop that runs for a year.</span>
            </Print>
          </h2>

          <ol className="loop__list">
            {NODES.map((node, i) => (
              <li
                key={node.n}
                className={`loop__item ${hover === i ? 'is-on' : ''}`}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              >
                <span className="t-telemetry loop__n">{node.n}</span>
                <span className="loop__body">
                  <span className="t-body loop__name">{node.name}</span>
                  <span className="t-caption loop__cap">{node.caption}</span>
                </span>
              </li>
            ))}
          </ol>
        </FrameCell>

        <FrameCell name="loop-circuit" cols={[7, 12]} className="loop__stage">
          <svg
            className="loop__svg"
            viewBox="0 0 320 320"
            role="img"
            aria-label="The HUMAN loop: test, understand, choose, act, track, improve, and back to test."
          >
            {/* G1: one continuous 1.5px stroke, 1400ms, one pass. */}
            <path
              className="loop__path m-anim"
              d={PATH}
              fill="none"
              stroke="var(--hairline-lit)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: LEN,
                strokeDashoffset: reduced ? 0 : on ? 0 : LEN,
                transition: reduced ? 'none' : 'stroke-dashoffset 1400ms var(--ease-move)',
              }}
            />

            {/* The single jade pulse. One pass, 600ms, then it stops for good. */}
            {pulsed && (
              <path
                className="loop__pulse"
                d={PATH}
                fill="none"
                stroke="var(--jade)"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ strokeDasharray: `${LEN * 0.14} ${LEN}` }}
              />
            )}

            {/* The six nodes are the ticks. */}
            {POINTS.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={3}
                fill={hover === i ? 'var(--jade)' : 'var(--hairline-lit)'}
                className="loop__node m-anim"
              />
            ))}
          </svg>
          <p className="t-telemetry loop__sample">Sample data</p>
        </FrameCell>
      </div>
    </Section>
  )
}
