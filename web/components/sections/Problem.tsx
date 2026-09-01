'use client'

import { DriftChart, YEARS } from '@/components/charts/DriftChart'
import { problem } from '@/lib/content'

/**
 * 2 — The problem.
 *
 * One line, drawn across nine years, that stays inside the normal range for
 * six of them and then leaves. Underneath it, the same three words nine
 * times: you feel fine.
 *
 * The heading stays fully readable throughout — it never dims, never moves.
 * The chart dims to a third once the turn arrives, but it does not go away:
 * the turn only means something while the drift is still on screen.
 */
export function Problem() {
  return (
    <section className="scene prob" data-scene aria-labelledby="prob-h">
      <div className="scene__pin prob__pin">
        <div className="prob__grid wrap">
          <header className="prob__head">
            <p className="t-label" style={{ color: 'var(--ink-3)' }}>
              {problem.label}
            </p>
            <h2 id="prob-h" className="t-section" style={{ marginTop: 'var(--s-16)' }}>
              {problem.h2}
            </h2>
            <p className="t-body prob__support">{problem.support}</p>
          </header>

          <div className="prob__chartwrap">
            <div className="prob__dim">
              <DriftChart />
            </div>
            <ul className="prob__stamps prob__dim" aria-hidden="true">
              {Array.from({ length: YEARS }, (_, i) => (
                <li
                  key={i}
                  className={`prob__stamp ${i === YEARS - 1 ? 'is-last' : ''}`}
                  style={{ ['--i' as string]: i }}
                >
                  {problem.stamp}
                </li>
              ))}
            </ul>
            <p className="prob__caption">{problem.caption}</p>
          </div>

          <div className="prob__turn">
            <p className="t-sub prob__turnline">{problem.turn}</p>
            <p className="t-body prob__closer">{problem.closer}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
