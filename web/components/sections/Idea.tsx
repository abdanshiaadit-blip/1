'use client'

import { useEffect, useRef, useState } from 'react'
import { idea } from '@/lib/content'

/**
 * 3 — The idea.
 *
 * Six nodes on a circle. They light in order as the section is scrolled, the
 * arc draws behind them, and at the end the loop closes and every node is
 * back at full strength — because the point is that it is a loop, not a
 * sequence with a winner.
 *
 * An inactive node rests at 0.55 opacity and never below it. The description
 * lives in a reserved box beneath the ring, so it can never overlap it and
 * changing the text can never move anything.
 *
 * On a phone the ring is not there at all: six rows, each with its line
 * already open. Same content, same order, no scrubbing.
 */
const N = idea.nodes.length
const R = 42 // percent of the ring box
/* Where the arc closes and the six nodes finish. `--ring-end` in sections.css
   is the same number; the phrase in the middle of the ring arrives just after
   it, and needs the tail of the section to be read in. */
const RING_END = 0.72

export function Idea() {
  const el = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const node = el.current
    if (!node) return
    let raf = 0
    const read = () => {
      raf = 0
      const p = parseFloat(getComputedStyle(node).getPropertyValue('--p')) || 0
      const i = Math.min(N - 1, Math.max(0, Math.floor((p / RING_END) * N)))
      setActive(i)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick, { passive: true })
    kick()
    return () => {
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /** Scroll to the point in this section where a given node is active. */
  const goTo = (i: number) => {
    const node = el.current
    if (!node) return
    const p = ((i + 0.5) / N) * RING_END
    const top = node.getBoundingClientRect().top + window.scrollY
    const travel = node.offsetHeight - window.innerHeight
    window.scrollTo({
      top: top + travel * p,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }

  const shown = hover ?? active
  const node = idea.nodes[shown]

  return (
    <section ref={el} className="scene idea" data-scene aria-labelledby="idea-h">
      <div className="scene__pin idea__pin">
        <div className="idea__grid wrap">
          <header>
            <p className="t-label" style={{ color: 'var(--ink-3)' }}>
              {idea.label}
            </p>
            <h2 id="idea-h" className="t-section" style={{ marginTop: 'var(--s-16)' }}>
              Test → Understand → Choose → Act → Track → Improve.
            </h2>
          </header>

          <div className="idea__ringwrap">
            <svg className="idea__svg" viewBox="0 0 100 100" aria-hidden="true">
              <circle className="idea__track" cx="50" cy="50" r={R} />
              <circle
                className="idea__arc"
                cx="50"
                cy="50"
                r={R}
                pathLength={1}
                transform="rotate(-90 50 50)"
              />
            </svg>

            {idea.nodes.map((n, i) => {
              const a = (i / N) * Math.PI * 2 - Math.PI / 2
              const ux = Math.cos(a)
              const uy = Math.sin(a)
              return (
                <span
                  key={n.key}
                  className={`idea__node ${i === shown ? 'is-on' : ''}`}
                  style={{
                    ['--x' as string]: (ux * R * 3.4).toFixed(1),
                    ['--y' as string]: (uy * R * 3.4).toFixed(1),
                  }}
                >
                  <button
                    type="button"
                    className="idea__hit"
                    onClick={() => goTo(i)}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    aria-label={`${n.key} — ${n.line}`}
                  >
                    <span className="idea__dot" />
                  </button>
                  <span
                    className="idea__label"
                    style={{
                      ['--lx' as string]: (ux * 46).toFixed(0),
                      ['--ly' as string]: (uy * 30).toFixed(0),
                    }}
                    aria-hidden="true"
                  >
                    {n.key}
                  </span>
                </span>
              )
            })}

            <div className="idea__centre">
              <p className="t-sub idea__centretext">{idea.centre}</p>
            </div>
          </div>

          {/* Reserved box. Changing the text inside can never move the ring. */}
          <div className="idea__desc reserve">
            <div>
              <p className="t-label idea__desckey">{node.key}</p>
              <p className="t-body idea__descline">{node.line}</p>
            </div>
          </div>

          {/* The phone's version of the same six beats. */}
          <ul className="idea__list">
            {idea.nodes.map((n) => (
              <li key={n.key} className="idea__listrow">
                <p className="t-label idea__desckey">{n.key}</p>
                <p className="t-body idea__descline">{n.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
