/**
 * 7.0 The intro sequence, and the first half of 7.1's boot. BRIEF.md Part 7.0.
 *
 * "An instrument powering on, printing its name, and getting out of the way."
 *
 * The wordmark is not faded in and is not typed — it is **printed onto a
 * baseline** by a mask wiping left to right, the way a plotter lays down a
 * trace. Then the wordmark goes, and **the baseline stays.**
 *
 * That surviving rule is the whole idea. It is not an intro that ends and a
 * site that begins: the rule the instrument drew is handed to the hero, where
 * it becomes the headline's baseline. She never sees a seam.
 *
 * 7.0.6 is explicit that this and the hero boot are ONE state machine with two
 * entry points, not two animations that happen to look similar — if both run
 * you get two rules on screen and a visible overlap. So the hero's own
 * baseline draw is suppressed whenever this component is mounted, and runs in
 * full when it is not.
 *
 * What this must not be: no percentage counter, no progress bar, no spinner,
 * no "loading" text, no typewriter, no letters flying in, no curtain, no
 * particle burst, no sound, and **no logo that draws itself with a
 * stroke-dashoffset outline** — the most overused agency intro of the last
 * five years.
 */

import { useEffect, useRef, useState } from 'react'
import wordmark from '../config/wordmark.json'
import { usePrefersReducedMotion } from '../lib/motion'

const KEY = 'human.intro.played'

/** Once per session. A reload, or coming back from the prototype tab, goes
 *  straight to the settled hero. Never replays on route or hash change. */
export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(KEY) !== '1'
  } catch {
    return true // storage unavailable (private mode): play once for this load
  }
}

interface Beats {
  hold: number
  rule: number
  print: number
  stagger: number
  ticks: number
  fade: number
  total: number
  ruleWidth: number
  tickCount: number
}

const DESKTOP: Beats = {
  hold: 120, rule: 680, print: 500, stagger: 55, ticks: 1150,
  fade: 1400, total: 1800, ruleWidth: 360, tickCount: 5,
}
/* She is arriving from a reel with no patience; 1.4s is the ceiling. */
const MOBILE: Beats = {
  hold: 80, rule: 500, print: 380, stagger: 45, ticks: 900,
  fade: 1050, total: 1400, ruleWidth: 220, tickCount: 3,
}

type Phase = 'hold' | 'rule' | 'print' | 'ticks' | 'fade' | 'hand' | 'done'

export default function Intro({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>('hold')
  const [aborted, setAborted] = useState(false)
  const done = useRef(false)

  /* Beat 5. The surviving rule travels onto the hero's baseline and the two
     become one element — "It is not an intro that ends and a site that begins".
     Measured rather than assumed, because the baseline's position depends on
     the type cell, which depends on the grid, which depends on the viewport. */
  const [hand, setHand] = useState<{ dx: number; dy: number; sx: number } | null>(null)
  const ruleEl = useRef<HTMLSpanElement>(null)

  const beats =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
      ? MOBILE
      : DESKTOP

  const finish = () => {
    if (done.current) return
    done.current = true
    try {
      window.sessionStorage.setItem(KEY, '1')
    } catch {
      /* private mode: the intro simply plays again next load */
    }
    onDone()
  }

  /* Skippable by ANYTHING. No skip button, and none is shown. */
  useEffect(() => {
    if (reduced) return
    const abort = () => {
      if (done.current) return
      setAborted(true)
      setPhase('fade')
      window.setTimeout(finish, 200)
    }
    const opts = { passive: true, once: true } as const
    window.addEventListener('wheel', abort, opts)
    window.addEventListener('scroll', abort, opts)
    window.addEventListener('touchstart', abort, opts)
    window.addEventListener('pointerdown', abort, opts)
    window.addEventListener('keydown', abort, opts)
    return () => {
      window.removeEventListener('wheel', abort)
      window.removeEventListener('scroll', abort)
      window.removeEventListener('touchstart', abort)
      window.removeEventListener('pointerdown', abort)
      window.removeEventListener('keydown', abort)
    }
  }, [reduced])

  /* Fixed duration. Assets load in parallel behind it — coupling the intro to
     network state produces an intro that is sometimes four seconds long on 4G,
     the worst possible outcome. */
  useEffect(() => {
    if (reduced) {
      // Wordmark and rule static at full opacity for 300ms, then fade over
      // 300ms. Total 600ms.
      const a = window.setTimeout(() => setPhase('fade'), 300)
      const b = window.setTimeout(finish, 600)
      return () => {
        window.clearTimeout(a)
        window.clearTimeout(b)
      }
    }
    const timers = [
      window.setTimeout(() => setPhase('rule'), beats.hold),
      window.setTimeout(() => setPhase('print'), beats.print),
      window.setTimeout(() => setPhase('ticks'), beats.ticks),
      window.setTimeout(() => setPhase('fade'), beats.fade),
      window.setTimeout(() => {
        const from = ruleEl.current?.getBoundingClientRect()
        const to = document
          .querySelector('[data-hero-baseline]')
          ?.getBoundingClientRect()
        if (from && to && from.width > 0 && to.width > 0) {
          setHand({
            dx: to.left + to.width / 2 - (from.left + from.width / 2),
            dy: to.top - from.top,
            sx: to.width / from.width,
          })
        }
        setPhase('hand')
      }, beats.total),
      window.setTimeout(finish, beats.total + 500),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [reduced])

  const drawn = reduced || phase !== 'hold'
  const printing = reduced || ['print', 'ticks', 'fade', 'hand', 'done'].includes(phase)
  const ticked = reduced || ['ticks', 'fade', 'hand', 'done'].includes(phase)
  const fading = ['fade', 'hand', 'done'].includes(phase)
  const handing = phase === 'hand' && hand !== null

  return (
    <div
      className={`intro ${fading ? 'is-out' : ''}`}
      /* Never in the tab order, never traps focus, and a screen reader reaches
         the hero immediately. */
      aria-hidden="true"
      role="presentation"
      style={{ transitionDuration: aborted ? '200ms' : '400ms' }}
    >
      {/* The opaque ground. This is what fades — not the rule. */}
      <div
        className="intro__veil"
        style={{ transitionDuration: aborted ? '200ms' : '400ms' }}
      />

      <div className="intro__mark" style={{ width: beats.ruleWidth }}>
        {/* Outlines, not live text: as live text the first thing anyone sees
            would flash in a fallback face while the webfont loads. */}
        <svg
          className="intro__wordmark"
          viewBox={`0 0 ${wordmark.width} ${wordmark.height}`}
          style={{
            width: beats.ruleWidth,
            opacity: fading ? 0 : 1,
            transitionDuration: aborted ? '200ms' : '400ms',
          }}
        >
          {wordmark.letters.map((l, i) => (
            <path
              key={l.ch}
              d={l.d}
              fill="var(--text)"
              className="intro__letter m-anim"
              style={{
                /* G2: a hard-edged mask wipes left to right, leaving the
                   letter behind it. The letter itself does not move. */
                clipPath: printing ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                transitionDelay: reduced ? '0ms' : `${i * beats.stagger}ms`,
              }}
            />
          ))}
        </svg>

        {/* G1: 1px hairline-lit, centre-out, to the full wordmark width.
            It never fades — it survives into the hero. */}
        <span
          ref={ruleEl}
          className="intro__rule m-anim"
          style={
            handing
              ? {
                  transform: `translate(${hand.dx}px, ${hand.dy}px) scaleX(${hand.sx})`,
                  transition: 'transform 500ms var(--ease-instrument)',
                }
              : {
                  transform: `scaleX(${drawn ? 1 : 0})`,
                  transitionDuration: reduced ? '0ms' : `${beats.rule}ms`,
                  transitionProperty: 'transform',
                  transitionTimingFunction: 'var(--ease-instrument)',
                }
          }
        />

        {/* G3: one tick beneath each letter. */}
        <span className="intro__ticks" style={{ opacity: fading ? 0 : 1 }}>
          {Array.from({ length: beats.tickCount }, (_, i) => (
            <span
              key={i}
              className="intro__tick m-anim"
              style={{
                opacity: ticked ? 1 : 0,
                transitionDelay: reduced ? '0ms' : `${i * 40}ms`,
                left: `${((i + 0.5) / beats.tickCount) * 100}%`,
              }}
            />
          ))}
        </span>
      </div>
    </div>
  )
}
