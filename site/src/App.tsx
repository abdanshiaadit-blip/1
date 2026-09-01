import { useEffect, useRef, useState } from 'react'
import { useActiveSection, useCursorLight, usePageProgress } from './lib/hooks'
import { register } from './lib/scroll'
import { PROTOTYPE_URL, legal } from './content/product'

import Hero from './sections/Hero'
import Problem from './sections/Problem'
import Loop from './sections/Loop'
import WhatIsHuman from './sections/WhatIsHuman'
import AppTour from './sections/AppTour'
import Transform from './sections/Transform'
import Systems from './sections/Systems'
import India from './sections/India'
import Philosophy from './sections/Philosophy'
import Founder from './sections/Founder'
import Explore from './sections/Explore'
import Closing from './sections/Closing'

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#app', label: 'The app' },
  { href: '#systems', label: 'What we read' },
  { href: '#india', label: 'For India' },
  { href: '#founder', label: 'Founder' },
]

const SECTION_IDS = LINKS.map((l) => l.href.slice(1))

export default function Site() {
  const bar = useRef<HTMLDivElement>(null)
  const light = useRef<HTMLDivElement>(null)
  const [navIn, setNavIn] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  useCursorLight(light)

  // One subscription drives both the hairline and the moment the wordmark
  // finishes its journey from the hero into the navigation bar.
  usePageProgress((p) => {
    bar.current?.style.setProperty('--pp', p.toFixed(4))
  })

  // The plain sections get the same run-up progress the pinned ones have, so
  // their content can lead as the section rises instead of waiting a full
  // viewport below the fold. Registered here rather than in five components,
  // because it is one behaviour, not five.
  useEffect(() => {
    const stops = [...document.querySelectorAll<HTMLElement>('main > section.hu-sec')].map(
      (el) => register(el, { mode: 'approach', prop: '--ap', initial: '1' }),
    )
    return () => stops.forEach((stop) => stop())
  }, [])

  useEffect(() => {
    const onScroll = () => setNavIn(window.scrollY > window.innerHeight * 0.75)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a className="skip" href="#app">
        Skip to the product
      </a>

      <div className="aurora" aria-hidden="true" />
      <div ref={light} className="cursorlight" aria-hidden="true" />
      <div ref={bar} className="pbar" aria-hidden="true" />

      <header className={`nav ${navIn ? 'in' : ''}`}>
        <a className="nav__mark" href="#top">
          HUMAN
        </a>
        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href.slice(1) ? 'is-here' : ''}
              aria-current={active === l.href.slice(1) ? 'true' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a className="nav__cta" href={PROTOTYPE_URL} target="_blank" rel="noreferrer noopener">
          Open the prototype
        </a>
      </header>

      <main>
        <Hero />
        <Problem />
        <Loop />
        <WhatIsHuman />
        <AppTour />
        <Transform />
        <Systems />
        <India />
        <Philosophy />
        <Founder />
        <Explore />
        <Closing />
      </main>

      <footer className="foot">
        <div className="wrap">
          <div className="foot__grid">
            <div>
              <div className="foot__mark">HUMAN</div>
              <p className="foot__note" style={{ marginTop: '0.7rem' }}>
                Preventive healthcare and personal health intelligence, built for India.
              </p>
            </div>
            <nav aria-label="Footer">
              <ul className="foot__links">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
                <li>
                  <a href={PROTOTYPE_URL} target="_blank" rel="noreferrer noopener">
                    Prototype
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <p className="foot__note" style={{ marginTop: '2rem' }}>
            {legal.prototype}
          </p>

          <div className="foot__legal">
            <span>{legal.safety}</span>
            <span>© {new Date().getFullYear()} HUMAN</span>
          </div>
        </div>
      </footer>
    </>
  )
}
