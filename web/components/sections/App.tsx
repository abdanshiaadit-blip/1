'use client'

import { useEffect, useRef, useState } from 'react'
import { DeviceFrame } from '@/components/ui/DeviceFrame'
import { AppScreen } from '@/components/app-screens/screens'
import { app, appTour, SCOPE_LINE } from '@/lib/content'

/**
 * 5 — The app. The longest section on the site, deliberately.
 *
 * Eight screens, and they are the prototype's own. The brief guessed at a
 * different list and said to check: the product has four tabs — Home, Health,
 * Action, Profile — a booking flow and a set of detail sheets, so that is
 * what this shows, in the app's own words. The screens the brief imagined and
 * the product does not have are not here.
 *
 * Two of the eight carry the morphs, and they are the point of the section:
 * marker rows collapse into three ranked jobs, and the top job becomes
 * something to do today. Both happen inside a single screen driven by one
 * clamped number, so the transition cannot strand a half-flown element — the
 * failure a cross-component FLIP invites and this client has already been
 * burned by.
 */
export function AppSection() {
  const el = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const [frac, setFrac] = useState(0)
  const N = appTour.length

  useEffect(() => {
    const node = el.current
    if (!node) return
    let raf = 0
    const read = () => {
      raf = 0
      const p = parseFloat(getComputedStyle(node).getPropertyValue('--p')) || 0
      const t = Math.min(0.9999, Math.max(0, p)) * N
      const i = Math.min(N - 1, Math.floor(t))
      setStep(i)
      setFrac(t - i)
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
  }, [N])

  const goTo = (i: number) => {
    const node = el.current
    if (!node) return
    const top = node.getBoundingClientRect().top + window.scrollY
    const travel = node.offsetHeight - window.innerHeight
    window.scrollTo({
      top: top + travel * ((i + 0.5) / N),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }

  const stop = appTour[step]

  return (
    <section ref={el} className="scene app" data-scene id="app" aria-labelledby="app-h">
      <div className="scene__pin app__pin">
        <div className="app__wash" aria-hidden="true" />

        <div className="app__grid wrap">
          <div className="app__copy">
            <p className="t-label app__label">
              <span className="hero__chipdot" aria-hidden="true" />
              {app.label}
            </p>

            <h2 id="app-h" className="t-section" style={{ maxWidth: '16ch' }}>
              {app.h2}
            </h2>

            {/* Fixed height, sized to the longest caption, so the column never
                shifts as the caption changes. */}
            <div className="app__captionbox reserve">
              <div className="app__caption">
                <p className="t-label app__captionname">
                  {stop.tab} · {stop.name}
                </p>
                <p className="t-lede">{stop.caption}</p>
              </div>
            </div>

            <div
              className="app__dots"
              role="tablist"
              aria-label="Jump to a screen of the prototype"
            >
              {appTour.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === step}
                  aria-label={`${s.name}: ${s.caption}`}
                  className={`app__dot ${i < step ? 'is-past' : ''} ${i === step ? 'is-on' : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            <p className="t-body" style={{ color: 'var(--ink-2)' }}>
              {app.closing}
            </p>

            <p className="app__scope">{SCOPE_LINE}</p>
          </div>

          <div className="app__stage">
            <DeviceFrame
              className="app__device"
              label={`The HUMAN app prototype, showing ${stop.name}`}
            >
              <div className="reserve" style={{ position: 'absolute', inset: 0 }}>
                {appTour.map((s, i) => (
                  <div
                    key={s.id}
                    style={{
                      opacity: i === step ? 1 : 0,
                      translate: i === step ? '0' : '0 12px',
                      transition:
                        'opacity var(--t-ui) var(--ease), translate var(--t-ui) var(--ease)',
                      pointerEvents: 'none',
                    }}
                    aria-hidden={i !== step}
                  >
                    <AppScreen id={s.id} t={i === step ? frac : 0} />
                  </div>
                ))}
              </div>
            </DeviceFrame>
          </div>
        </div>

        {/* Below a laptop the panel stops scrubbing and the eight screens
            become something you swipe. Same screens, same order, same
            captions — and the collapse into three ranked jobs is kept as a
            one-shot, because it is the idea the section exists for. */}
        <div className="app__rail" role="group" aria-label="The HUMAN prototype, screen by screen">
          {appTour.map((s) => (
            <figure key={s.id} className="app__slide">
              <DeviceFrame
                className="app__slidedevice"
                tilt={false}
                label={`The HUMAN app prototype, showing ${s.name}`}
              >
                <AppScreen id={s.id} t={1} />
              </DeviceFrame>
              <figcaption>
                <p className="t-label app__captionname">
                  {s.tab} · {s.name}
                </p>
                <p className="t-body">{s.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
