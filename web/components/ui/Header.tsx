'use client'

import { useEffect, useRef, useState } from 'react'
import { nav, PROTOTYPE_URL } from '@/lib/content'

/**
 * The header.
 *
 * Transparent over the hero, solid past 80px, hidden on the way down past
 * 400px and back on the way up. Over the dark block it inverts — and it works
 * out that it is over a dark block by watching the dark blocks themselves,
 * not by comparing scroll positions against numbers that stop being true the
 * moment anything above them changes height.
 *
 * On a phone it is the wordmark and the button. The page is one story and the
 * prototype is the only destination, so there is nothing for a menu to hold.
 */
export function Header() {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    let raf = 0
    const frame = () => {
      raf = 0
      const y = window.scrollY
      setSolid(y > 80)
      setHidden(y > 400 && y > lastY.current)
      lastY.current = y
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    window.addEventListener('scroll', kick, { passive: true })
    kick()
    return () => {
      window.removeEventListener('scroll', kick)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const darks = Array.from(document.querySelectorAll<HTMLElement>('[data-dark]'))
    if (!darks.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // The header occupies the top 64px. A dark block counts as "under
          // the header" when it covers that strip.
          const r = e.target.getBoundingClientRect()
          if (r.top <= 64 && r.bottom >= 64) setOnDark(true)
          else if (!darks.some((d) => {
            const q = d.getBoundingClientRect()
            return q.top <= 64 && q.bottom >= 64
          })) setOnDark(false)
        }
      },
      { threshold: [0, 0.01, 1], rootMargin: '-64px 0px 0px 0px' },
    )
    darks.forEach((d) => io.observe(d))

    // The observer only fires on crossings; a scroll that stays inside one
    // long dark block would never re-evaluate. One cheap check per frame of
    // actual scrolling covers it.
    let raf = 0
    const check = () => {
      raf = 0
      setOnDark(
        darks.some((d) => {
          const q = d.getBoundingClientRect()
          return q.top <= 64 && q.bottom >= 64
        }),
      )
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    window.addEventListener('scroll', kick, { passive: true })
    kick()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', kick)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <header
      className={`hdr ${solid ? 'is-solid' : ''} ${hidden ? 'is-hidden' : ''} ${onDark ? 'is-dark' : ''}`}
    >
      <div className="hdr__in">
        <a className="hdr__mark" href="#top">
          HUMAN
        </a>
        <nav className="hdr__nav" aria-label="Sections">
          {nav.links.map((l) => (
            <a key={l.href} className="hdr__link" href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a
          className="hdr__cta t-button"
          href={PROTOTYPE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {nav.cta}
        </a>
      </div>
    </header>
  )
}
