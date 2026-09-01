'use client'

import { useEffect, useRef, useState } from 'react'
import { DeviceFrame } from '@/components/ui/DeviceFrame'
import { AppScreen } from '@/components/app-screens/screens'
import { howItWorks, type ScreenId } from '@/lib/content'

/**
 * 4 — How it works.
 *
 * The rail on the left, the product on the right, and they move together. The
 * device is the same object the hero handed over; it does not get swapped for
 * a picture of one.
 *
 * An inactive step rests at 0.42 opacity — quiet, but still legible. Its line
 * is always in the layout, so making a step active cannot push the rail
 * around. Rail and device are separate grid columns with a 48px gutter, so
 * they cannot overlap at any width.
 */

/* Each step shows the screen where that step actually happens in the app. */
const SCREEN_FOR_STEP: ScreenId[] = [
  'home',
  'booking',
  'marker',
  'priority',
  'action',
  'progress',
]

export function HowItWorks() {
  const el = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const N = howItWorks.steps.length

  useEffect(() => {
    const node = el.current
    if (!node) return
    let raf = 0
    const read = () => {
      raf = 0
      const p = parseFloat(getComputedStyle(node).getPropertyValue('--p')) || 0
      setStep(Math.min(N - 1, Math.max(0, Math.floor(p * N))))
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

  return (
    <section ref={el} className="scene how" data-scene id="how" aria-labelledby="how-h">
      <div className="scene__pin how__pin">
        <div className="how__grid wrap">
          <div>
            <p className="t-label" style={{ color: 'var(--ink-3)' }}>
              {howItWorks.label}
            </p>
            <h2 id="how-h" className="t-section" style={{ margin: 'var(--s-12) 0 clamp(8px, 2vh, 24px)', maxWidth: '20ch' }}>
              {howItWorks.h2}
            </h2>

            <ol className="how__rail">
              {howItWorks.steps.map((s, i) => (
                <li key={s.n}>
                  <button
                    type="button"
                    className={`how__step ${i === step ? 'is-on' : ''}`}
                    onClick={() => goTo(i)}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    <span className="how__n num">{s.n}</span>
                    <span className="t-sub">{s.head}</span>
                  </button>
                </li>
              ))}
            </ol>

            {/* One reserved box, sized to the longest line, holding whichever
                step is active. Six paragraphs stacked in the rail could not
                fit inside one screen at laptop heights, and a row that grows
                when you select it moves everything under it. This holds a
                constant height and never shifts. */}
            <div className="how__detail reserve">
              <p className="t-body how__line">{howItWorks.steps[step].line}</p>
            </div>
          </div>

          <div className="how__stage">
            <DeviceFrame
              className="how__device"
              label={`The HUMAN app prototype, showing step ${step + 1}: ${howItWorks.steps[step].head}`}
            >
              {/* Every screen stays mounted and stacked in one cell; only the
                  active one is shown. Changing screens is opacity and 12px of
                  Y — never a scale, never a clip. */}
              <div className="reserve" style={{ position: 'absolute', inset: 0 }}>
                {SCREEN_FOR_STEP.map((id, i) => (
                  <div
                    key={`${id}-${i}`}
                    style={{
                      opacity: i === step ? 1 : 0,
                      translate: i === step ? '0' : '0 12px',
                      transition:
                        'opacity var(--t-ui) var(--ease), translate var(--t-ui) var(--ease)',
                      pointerEvents: 'none',
                    }}
                    aria-hidden={i !== step}
                  >
                    <AppScreen id={id} t={1} />
                  </div>
                ))}
              </div>
            </DeviceFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
