/**
 * BRIEF.md Part 9 component 15, and Part 3.3.
 *
 * A height-reserved expander, chevron only. One of exactly two components on
 * the site permitted to animate a height — and only because the container
 * already reserves its maximum, so opening one cannot push anything below it.
 *
 * Multiple may be open at once. Forcing accordion behaviour makes people lose
 * their place (Part 7.12).
 */

import { useId, useRef, useState } from 'react'
import Rule from './Rule'
import Print from './Print'

interface Props {
  question: string
  answer: string
}

export default function Disclosure({ question, answer }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const body = useRef<HTMLDivElement>(null)

  return (
    <div className="disc">
      {/* Each divider is a G1 rule drawing left to right as the list enters. */}
      <div className="disc__rule">
        <Rule origin="left" duration={680} tone="hairline" />
      </div>

      <h3 className="disc__h">
        <button
          type="button"
          className="disc__btn"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="t-body-l disc__q">{question}</span>
          <span className={`chev ${open ? 'is-open' : ''}`} aria-hidden="true" />
        </button>
      </h3>

      <div
        id={id}
        ref={body}
        className="disc__body"
        style={{ height: open ? (body.current?.scrollHeight ?? 'auto') : 0 }}
      >
        <div className="disc__inner">
          {open && (
            <Print duration={280}>
              <p className="t-body disc__a">{answer}</p>
            </Print>
          )}
        </div>
      </div>
    </div>
  )
}
