'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { useInView } from '@/lib/useInView'
import { india } from '@/lib/content'

/**
 * 7 — Built for India.
 *
 * Three reasons, and one statistic. The statistic is the only real number on
 * this website and it carries its source, which is a link. Everything else
 * here is an observation about infrastructure, not a claim about a market.
 *
 * No maps. No flags. No stock photography.
 */
export function India() {
  return (
    <section className="india" aria-labelledby="india-h">
      <div className="wrap">
        <Reveal as="p" className="t-label" style={{ color: 'var(--ink-3)' }}>
          {india.label}
        </Reveal>
        <Reveal as="h2" i={1} id="india-h" className="t-section india__head" style={{ marginTop: 'var(--s-16)' }}>
          {india.h2}
        </Reveal>

        <div className="india__grid">
          {india.blocks.map((b, i) => (
            <Reveal key={b.head} i={i} as="div">
              <h3 className="t-sub">{b.head}</h3>
              <p className="t-body india__line">{b.line}</p>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" className="india__stat">
          <p className="t-data india__statline">
            <CountUp to={india.stat.value} /> <span className="india__statnum">{india.stat.unit}</span>{' '}
            {india.stat.lead} <CountUp to={india.stat.pct} suffix="%" />{' '}
            {india.stat.tail}
          </p>
          <a
            className="india__cite"
            href={india.stat.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {india.stat.source}
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * Counts once, on entry, and never again. A number that re-counts every time
 * it scrolls back into view reads as a glitch rather than as emphasis.
 *
 * The final string is rendered underneath, hidden, and the counting digits sit
 * on top of it. Without that, "0" is narrower than "101" and the rest of the
 * sentence slides sideways for the whole second the number is counting — the
 * one place on the site where an animation was moving layout.
 */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>('0px 0px -20% 0px', 0.4)
  const [n, setN] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (!seen || done.current) return
    done.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(to)
      return
    }
    const start = performance.now()
    const dur = 1100
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      // The same decelerating curve the rest of the site uses.
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(to * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])

  return (
    <span ref={ref} className="num count">
      <span className="count__slot" aria-hidden="true">
        {to}
        {suffix}
      </span>
      <span className="count__live">
        {n}
        {suffix}
      </span>
    </span>
  )
}
