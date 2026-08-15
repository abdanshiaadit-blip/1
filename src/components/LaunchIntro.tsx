import { useEffect, useState } from 'react'
import './../styles/intro.css'

/* ==========================================================================
   Launch sequence — an additive overlay, nothing more.

   Renders inside PhoneFrame's `.screen`, which already clips to the device
   radius and carries the safe areas, so this needs no frame of its own and
   never touches the app underneath. When the sequence ends the component
   unmounts and the app is exactly as it was.

   WHITE → HUMAN → DESCRIPTION → APP

   The wordmark and the description are never mounted at the same time: each
   phase renders one or the other, so they cannot overlap even for a frame.
   ========================================================================== */

const KEY = 'human.intro.played'

const DESCRIPTION =
  'HUMAN is a preventive healthcare platform that helps people book blood tests, understand their health, and follow personalized plans to improve it over time.'

/** `?intro=true` always plays and overrides the session flag. */
export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (new URLSearchParams(window.location.search).get('intro') === 'true') return true
    return window.sessionStorage.getItem(KEY) !== '1'
  } catch {
    // Storage unavailable (private mode). Play once for this page load.
    return true
  }
}

type Phase = 'white' | 'mark' | 'markOut' | 'desc' | 'descOut' | 'reveal' | 'done'

/** [phase, duration]. Totals ~5.0s, matching the specified beats. */
const TIMELINE: [Phase, number][] = [
  ['white', 400], //           0.0–0.4  pure white
  ['mark', 1400], //           0.4–1.8  wordmark fades in (800) then holds (600)
  ['markOut', 400], //         1.8–2.2  wordmark fades fully out
  ['desc', 1800], //           2.2–4.0  description fades in (500) then holds (1300)
  ['descOut', 400], //         4.0–4.4  description fades out
  ['reveal', 600], //          4.4–5.0  overlay clears to the app
]

/** Reduced motion: same reading time, no fades, no empty gaps to sit through. */
const TIMELINE_REDUCED: [Phase, number][] = [
  ['white', 150],
  ['mark', 900],
  ['markOut', 0],
  ['desc', 1900],
  ['descOut', 0],
  ['reveal', 150],
]

export default function LaunchIntro() {
  const [phase, setPhase] = useState<Phase>('white')

  useEffect(() => {
    try {
      window.sessionStorage.setItem(KEY, '1')
    } catch {
      /* storage unavailable — the sequence simply plays again next load */
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeline = reduced ? TIMELINE_REDUCED : TIMELINE

    const timers: number[] = []
    let at = 0
    for (const [next, hold] of timeline) {
      const fireAt = at
      timers.push(window.setTimeout(() => setPhase(next), fireAt))
      at += hold
    }
    timers.push(window.setTimeout(() => setPhase('done'), at))

    return () => timers.forEach(window.clearTimeout)
  }, [])

  if (phase === 'done') return null

  const showMark = phase === 'mark' || phase === 'markOut'
  const showDesc = phase === 'desc' || phase === 'descOut'

  return (
    <div className={`intro ${phase === 'reveal' ? 'is-clearing' : ''}`}>
      {showMark && (
        <div className={`intro__mark ${phase === 'mark' ? 'is-in' : 'is-out'}`}>HUMAN</div>
      )}
      {showDesc && (
        <p className={`intro__desc ${phase === 'desc' ? 'is-in' : 'is-out'}`}>{DESCRIPTION}</p>
      )}
    </div>
  )
}
