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

import { useId, useLayoutEffect, useRef, useState } from 'react'
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
  const inner = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  /* Measure AFTER the commit, not during the render that flips `open`.
     Read inline, `body.current.scrollHeight` is the height of the panel as it
     was a moment ago — before React has put the answer into it — so it
     measured nothing but the inner padding and every answer on the page
     animated open to 24px and stayed there, clipped to its first line by the
     panel's own `overflow: hidden`.

     useLayoutEffect runs after the children are in the DOM and before the
     browser paints, so the height is correct on the first frame of the
     transition rather than one frame late. */
  useLayoutEffect(() => {
    if (!open) {
      setHeight(0)
      return
    }
    const el = inner.current
    if (!el) return
    const measure = () => setHeight(el.getBoundingClientRect().height)
    measure()
    /* The answer prints in behind a mask and the webfont can land late; both
       change the height without changing `open`, and a panel that is 4px short
       clips a descender. */
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [open, answer])

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
        style={{ height }}
      >
        <div className="disc__inner" ref={inner}>
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
