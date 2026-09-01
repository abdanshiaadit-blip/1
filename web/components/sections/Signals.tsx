'use client'

import { useRef, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { signals } from '@/lib/content'

/**
 * 6 — What we read.
 *
 * After five minutes of being carried, the visitor gets to steer. This is the
 * one section that is not scroll-driven at all: five chips, click or arrow
 * keys, and the composition rebuilds. Blood is selected by default and drawn
 * with more weight, because it is the part nobody else has.
 *
 * The caption box is a fixed height, sized to the longest line, so choosing a
 * different signal never moves anything.
 */
export function Signals() {
  const [i, setI] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const n = signals.items.length

  const onKey = (e: React.KeyboardEvent) => {
    let next = i
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    else return
    e.preventDefault()
    setI(next)
    refs.current[next]?.focus()
  }

  const item = signals.items[i]

  return (
    <section className="sig" id="why" aria-labelledby="sig-h">
      <div className="wrap">
        <div className="sig__head">
          <Reveal as="p" className="t-label" style={{ color: 'var(--ink-3)' }}>
            {signals.label}
          </Reveal>
          <Reveal as="h2" i={1} className="t-section" id="sig-h" style={{ maxWidth: '20ch' }}>
            {signals.h2}
          </Reveal>
        </div>

        <div
          className="sig__chips"
          role="tablist"
          aria-label="Signals HUMAN reads"
          onKeyDown={onKey}
        >
          {signals.items.map((s, idx) => (
            <button
              key={s.key}
              ref={(el) => {
                refs.current[idx] = el
              }}
              type="button"
              role="tab"
              id={`sig-tab-${idx}`}
              aria-selected={idx === i}
              aria-controls="sig-panel"
              tabIndex={idx === i ? 0 : -1}
              className="sig__chip"
              onClick={() => setI(idx)}
            >
              {s.key}
            </button>
          ))}
        </div>

        <div className="sig__body">
          <div
            className="sig__visual"
            id="sig-panel"
            role="tabpanel"
            aria-labelledby={`sig-tab-${i}`}
          >
            <SignalVisual which={item.key} key={item.key} />
          </div>

          <div className="sig__captionbox reserve">
            <div>
              <p className="t-sub">{item.key}</p>
              <p className="t-body" style={{ color: 'var(--ink-2)', marginTop: 'var(--s-12)' }}>
                {item.line}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * One drawing per signal. They are diagrams of the shape of each signal, not
 * charts of invented values — nothing here claims to be a measurement.
 */
function SignalVisual({ which }: { which: string }) {
  const stroke = 'var(--jade)'
  const faint = 'rgba(12,22,19,.14)'

  return (
    <svg
      className="sig__svg sig__fade"
      viewBox="0 0 320 200"
      fill="none"
      role="img"
      aria-label={`An abstract diagram representing ${which}.`}
    >
      {which === 'Blood' && (
        <g>
          {/* Ninety-six marks, three of them called out. The density is the
              point: the picture is "a lot, ranked". */}
          {Array.from({ length: 96 }, (_, k) => {
            const col = k % 16
            const row = Math.floor(k / 16)
            const hot = k === 18 || k === 51 || k === 74
            return (
              <rect
                key={k}
                x={20 + col * 18}
                y={40 + row * 20}
                width="9"
                height="9"
                rx="2"
                fill={hot ? stroke : faint}
              />
            )
          })}
          <text x="20" y="26" fill="var(--ink-3)" fontSize="11" fontWeight="600" letterSpacing="1.6">
            96 MARKERS · 3 THAT MATTER NOW
          </text>
        </g>
      )}

      {which === 'Sleep' && (
        <g>
          <path
            d="M20 120 C60 60, 100 60, 140 110 S220 160, 300 70"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {[0, 1, 2, 3].map((k) => (
            <line
              key={k}
              x1={20 + k * 93}
              y1="150"
              x2={20 + k * 93}
              y2="170"
              stroke={faint}
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
          <text x="20" y="26" fill="var(--ink-3)" fontSize="11" fontWeight="600" letterSpacing="1.6">
            RECOVERY THROUGH THE NIGHT
          </text>
        </g>
      )}

      {which === 'Nutrition' && (
        <g>
          {[
            ['Dal', 74],
            ['Sabzi', 58],
            ['Rice', 40],
            ['Chai', 26],
          ].map(([k, v], idx) => (
            <g key={k as string}>
              <rect x="20" y={54 + idx * 32} width="240" height="10" rx="5" fill={faint} />
              <rect
                x="20"
                y={54 + idx * 32}
                width={(v as number) * 2.4}
                height="10"
                rx="5"
                fill={stroke}
              />
              <text x="272" y={63 + idx * 32} fill="var(--ink-3)" fontSize="11">
                {k as string}
              </text>
            </g>
          ))}
          <text x="20" y="30" fill="var(--ink-3)" fontSize="11" fontWeight="600" letterSpacing="1.6">
            BUILT ON INDIAN FOOD
          </text>
        </g>
      )}

      {which === 'Training' && (
        <g>
          {Array.from({ length: 7 }, (_, k) => (
            <rect
              key={k}
              x={26 + k * 42}
              y={150 - [40, 70, 20, 90, 55, 100, 30][k]}
              width="26"
              height={[40, 70, 20, 90, 55, 100, 30][k]}
              rx="6"
              fill={k === 5 ? stroke : faint}
            />
          ))}
          <line x1="20" y1="152" x2="300" y2="152" stroke={faint} strokeWidth="1.5" />
          <text x="20" y="30" fill="var(--ink-3)" fontSize="11" fontWeight="600" letterSpacing="1.6">
            WHAT YOU DID, AND WHAT ANSWERED
          </text>
        </g>
      )}

      {which === 'Recovery' && (
        <g>
          <circle cx="160" cy="110" r="58" stroke={faint} strokeWidth="10" />
          <circle
            cx="160"
            cy="110"
            r="58"
            stroke={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="0.32"
            transform="rotate(-90 160 110)"
          />
          <text x="20" y="30" fill="var(--ink-3)" fontSize="11" fontWeight="600" letterSpacing="1.6">
            HOW HARD THE LAST WEEK WAS
          </text>
        </g>
      )}
    </svg>
  )
}
