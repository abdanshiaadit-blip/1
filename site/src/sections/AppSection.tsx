/**
 * 7.5 The app — 400vh sticky. THE CENTREPIECE. BRIEF.md Part 7.5.
 *
 * "She must finish knowing exactly what she would open each morning — because
 * she has watched the real app work, and then used it herself."
 *
 * What stays still: **the phone.** From 12% scroll progress to 100% the frame
 * does not move, scale, rotate or drift by a single pixel. Everything that
 * changes, changes inside it. That discipline is what makes this read as a
 * product demonstration rather than a scroll animation.
 *
 * The copy cell crossfades and never slides. Two things sliding at once is
 * what makes a site feel cheap.
 */

import { useEffect, useRef, useState } from 'react'
import Annotation from '../components/Annotation'
import Button from '../components/Button'
import DeviceFrame from '../components/DeviceFrame'
import FrameCell from '../components/FrameCell'
import Rule from '../components/Rule'
import StickyStage from '../components/StickyStage'
import { ANNOTATIONS } from '../config/annotations'
import * as AppStage from '../lib/AppStage'
import type { ScreenId } from '../lib/AppStage'
import { PROTOTYPE_URL } from '../lib/constants'
import { band, usePrefersReducedMotion } from '../lib/motion'

interface Screen {
  id: ScreenId
  heading: string
  body: string
}

/** Copy caps at 34 words a screen. The copy cell reserves the height of the
 *  longest of the five, so a screen change cannot resize it. */
const SCREENS: Screen[] = [
  {
    id: 'timeline',
    heading: 'Your results, in one place',
    body: 'Blood tests, past reports and prescriptions on one timeline you keep for years. Never a PDF you have to open.',
  },
  {
    id: 'score',
    heading: 'Your HUMAN Score',
    body: 'One number for how your body is doing, plus your body’s age. A plain explainer sits behind every marker.',
  },
  {
    id: 'priorities',
    heading: 'The three things to fix',
    body: 'Not all ninety-six. Three, in order, this quarter — each one from a set our doctor has approved.',
  },
  {
    id: 'plan',
    heading: 'Start your day',
    body: 'Today’s actions on one screen. One tap to confirm. Your watch and cycle sync on their own.',
  },
  {
    id: 'week12',
    heading: 'Week twelve',
    body: 'We test again and put the new number next to the old one. That is the whole point.',
  },
]

const MOBILE_SCREENS: ScreenId[] = ['timeline', 'priorities', 'week12']

export default function AppSection() {
  const reduced = usePrefersReducedMotion()
  const [mobile, setMobile] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [live, setLive] = useState(false)
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setMobile(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  /* Part 5.7: do not mount the live app on mobile. Below 768px the section
     runs DEGRADED by design — real screenshots, same choreography. On a
     phone, the full-screen real app in a new tab is a better demo than a
     postage-stamp embed, and it costs her nothing to come back.
     Part 4.10: reduced motion is DEGRADED too. */
  const useLiveApp = !mobile && !reduced

  useEffect(() => {
    if (!useLiveApp || !host.current) return
    void AppStage.mount(host.current).then(() => setLive(AppStage.getState() === 'live'))
  }, [useLiveApp])

  // Escape returns to LIVE from INTERACTIVE.
  useEffect(() => {
    if (!interactive) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') release()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [interactive])

  function take() {
    AppStage.setInteractive(true)
    setInteractive(true)
  }
  function release() {
    AppStage.setInteractive(false)
    setInteractive(false)
    document.getElementById('take-control')?.focus()
  }

  const list = mobile ? SCREENS.filter((s) => MOBILE_SCREENS.includes(s.id)) : SCREENS

  return (
    <StickyStage vh={400} vhMobile={280} name="app">
      {(p, inView) => {
        // Beat 1 (0–12%): the frame's outline draws, the frame rises 28px and
        // locks, and the glow ignites. Then it never moves again.
        const rise = band(p, 0, 0.12)
        // Beat 3 (18–92%): five equal bands. Within each, the screen holds for
        // the first 70%, then advances during the remaining 30%.
        const seq = band(p, 0.18, 0.92)
        const slot = Math.min(list.length - 1, Math.floor(seq * list.length))
        const withinBand = seq * list.length - slot
        /* Never true on the last screen, and never under reduced motion. At
           progress 1 — which is exactly what a collapsed reduced-motion stage
           reports — an unclamped test hides the copy and suppresses every
           annotation, so the poster version would show a phone and no words. */
        const advancing = !reduced && withinBand > 0.7 && slot < list.length - 1
        const screen = list[slot]
        // Beat 4 (92–100%): the control prints in beneath the frame.
        const control = band(p, 0.92, 1)

        return (
          <AppStageBody
            p={p}
            inView={inView}
            rise={rise}
            screen={screen}
            slot={slot}
            total={list.length}
            advancing={advancing}
            control={control}
            useLiveApp={useLiveApp}
            live={live}
            interactive={interactive}
            mobile={mobile}
            host={host}
            onTake={take}
            onRelease={release}
          />
        )
      }}
    </StickyStage>
  )
}

interface BodyProps {
  p: number
  inView: boolean
  rise: number
  screen: Screen
  slot: number
  total: number
  advancing: boolean
  control: number
  useLiveApp: boolean
  live: boolean
  interactive: boolean
  mobile: boolean
  host: React.RefObject<HTMLDivElement | null>
  onTake: () => void
  onRelease: () => void
}

function AppStageBody({
  rise,
  screen,
  slot,
  total,
  advancing,
  control,
  useLiveApp,
  live,
  interactive,
  mobile,
  host,
  onTake,
  onRelease,
}: BodyProps) {
  // Drive the real app. Idempotent and debounced inside AppStage, so a hard
  // flick through the section coalesces to the last screen rather than queuing
  // five navigations.
  useEffect(() => {
    if (useLiveApp && live) AppStage.show(screen.id)
  }, [screen.id, useLiveApp, live])

  const annotations = ANNOTATIONS[screen.id] ?? []
  // Annotations never share the screen with a transition, and they clear the
  // moment she takes control — the training wheels come off.
  const showAnnotations = !advancing && !interactive

  return (
    <div className="page grid12 app" data-section="app">
      <FrameCell name="app-copy" cols={[1, 5]} className="app__copy" minHeight={280}>
        <p className="t-telemetry app__count">
          {String(slot + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>

        <div className="app__rail" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`app__mark ${i === slot ? 'is-on' : ''}`} />
          ))}
        </div>

        {/* Crossfade only. The copy never slides. */}
        <div className={`app__text ${advancing ? 'is-out' : ''}`}>
          <h2 className="t-display-m app__h">{screen.heading}</h2>
          <p className="t-body app__b">{screen.body}</p>
        </div>

        <p className="t-telemetry app__state">
          {interactive ? (
            <span className="app__you">you have control</span>
          ) : live ? (
            <span className="app__live">live</span>
          ) : (
            'sample data'
          )}
        </p>
      </FrameCell>

      <FrameCell name="app-device" cols={[7, 12]} className="app__devicecell">
        <div
          className="app__riser"
          style={{
            // The only entrance travel on the site: 28px, once, then locked.
            transform: `translateY(${(1 - rise) * 28}px) scale(${0.985 + rise * 0.015})`,
            opacity: rise,
          }}
        >
          <DeviceFrame
            glow={rise}
            annotations={
              showAnnotations
                ? annotations.map((a, i) => (
                    <Annotation key={a.label} {...a} delay={i * 220} mobile={mobile} />
                  ))
                : null
            }
            lane={
              mobile
                ? showAnnotations && annotations.length
                  ? annotations[annotations.length - 1].label
                  : ''
                : undefined
            }
            footer={
              <div className="app__control" style={{ opacity: control }}>
                {!mobile && useLiveApp ? (
                  interactive ? (
                    <Button variant="ghost" onClick={onRelease}>
                      Release
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={onTake} className="app__take">
                      Take control
                    </Button>
                  )
                ) : (
                  <Button variant="ghost" href={PROTOTYPE_URL}>
                    {mobile ? 'Open the app' : 'Try the prototype'}
                  </Button>
                )}
                {/* Part 5.6: verbatim, and adjacent to the frame in every
                    state — not only when the prototype link happens to be the
                    control on show. */}
                <p className="t-caption app__proto">
                  It&rsquo;s a prototype, running on sample data.
                </p>
              </div>
            }
          >
            {useLiveApp ? (
              <div className={`appstage ${interactive ? 'is-live' : ''}`} ref={host}>
                {/* The poster holds underneath until the framed document has
                    painted, and keeps holding forever if it never does. */}
                <img
                  className={`appstage__poster ${live ? 'is-hidden' : ''}`}
                  src={`/app/screen-${screen.id}.webp`}
                  alt=""
                  width={390}
                  height={844}
                  decoding="async"
                />
              </div>
            ) : (
              <img
                src={`/app/screen-${screen.id}.webp`}
                alt={`The HUMAN app: ${screen.heading}.`}
                width={390}
                height={844}
              />
            )}
          </DeviceFrame>

          {interactive && (
            <span className="app__ring" aria-hidden="true">
              <Rule origin="center" duration={400} />
            </span>
          )}
        </div>
      </FrameCell>
    </div>
  )
}
