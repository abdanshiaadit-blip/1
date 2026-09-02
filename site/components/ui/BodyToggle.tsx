'use client'

import { useId, useRef } from 'react'
import { useBody } from '@/context/BodyContext'
import { BODY_LABEL, type Body } from '@/lib/content'

const ORDER: Body[] = ['women', 'men']

/**
 * §11.4 — a two-state segmented control, defaulting to Women.
 *
 * Rendered once in section 06 and again in section 12; both instances read
 * and write the same context. Implemented as the ARIA tabs pattern: a
 * tablist of two tabs driving tabpanels elsewhere in the section.
 *
 * Without JavaScript the control is meaningless, so it is hidden and both
 * content sets render in full under visible sub-headings instead. The
 * `js` class on <html> is set before first paint, so there is no flash.
 */
export function BodyToggle({ idPrefix }: { idPrefix: string }) {
  const { body, setBody } = useBody()
  const listRef = useRef<HTMLDivElement>(null)
  const labelId = useId()

  function onKeyDown(event: React.KeyboardEvent) {
    const index = ORDER.indexOf(body)
    let next: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % ORDER.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + ORDER.length - 1) % ORDER.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = ORDER.length - 1
    if (next === null) return
    event.preventDefault()
    setBody(ORDER[next])
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }

  return (
    <div className="body-toggle-wrap">
      <span id={labelId} className="sr-only-h">
        Show the panel for
      </span>
      <div
        ref={listRef}
        role="tablist"
        aria-labelledby={labelId}
        className="body-toggle"
        data-active={body}
        onKeyDown={onKeyDown}
      >
        {ORDER.map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${option}`}
            aria-selected={body === option}
            aria-controls={`${idPrefix}-panel-${option}`}
            tabIndex={body === option ? 0 : -1}
            className="body-toggle__label t-small"
            onClick={() => setBody(option)}
          >
            {BODY_LABEL[option]}
          </button>
        ))}
        <span aria-hidden="true" className="body-toggle__underline" />
      </div>
    </div>
  )
}

/**
 * The stacked container both states share. Because they occupy the same
 * grid cell, the container is always as tall as the taller state — so the
 * page height cannot change when the toggle flips, which is the failure
 * §11.4 exists to prevent. No measurement, nothing to fall out of sync.
 */
export function BodyPanels({
  idPrefix,
  women,
  men,
}: {
  idPrefix: string
  women: React.ReactNode
  men: React.ReactNode
}) {
  const { body } = useBody()
  return (
    <div className="body-panels">
      {ORDER.map((option) => (
        <div
          key={option}
          role="tabpanel"
          id={`${idPrefix}-panel-${option}`}
          aria-labelledby={`${idPrefix}-tab-${option}`}
          className="body-panel"
          data-state={body === option ? 'active' : 'inactive'}
        >
          <h3 className="body-panel__nojs-heading t-h3">{BODY_LABEL[option]}</h3>
          {option === 'women' ? women : men}
        </div>
      ))}
    </div>
  )
}
