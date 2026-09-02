/**
 * BRIEF.md Part 9 component 18, Part 7.13, Part 12.7.
 *
 * **One field.** inputmode="tel", +91 prefixed and non-editable, 10 digits.
 * No email, no name, no city, no checkbox.
 *
 * "This is not minimalism for taste. The business plan needs a 12%
 * click-to-waitlist rate to reach 839 signups from 6,990 creator clicks. A
 * two-field form does not hit 12%."
 *
 * On submit the field and button are replaced IN PLACE — no modal, no
 * redirect, no navigation.
 */

import { useState } from 'react'
import Button from './Button'
import Print from './Print'
import Rule from './Rule'
import Ticks from './Ticks'

type State = 'idle' | 'error' | 'done'

export default function WaitlistForm() {
  const [value, setValue] = useState('')
  const [state, setState] = useState<State>('idle')
  const [shared, setShared] = useState(false)

  const digits = value.replace(/\D/g, '').replace(/^91/, '')
  const valid = /^[6-9]\d{9}$/.test(digits)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return setState('error')
    setState('done')
  }

  if (state === 'done') {
    return (
      <div className="wl wl--done">
        <Print stagger>
          <p className="t-display-m wl__thanks">You&rsquo;re on the list.</p>
          <p className="t-body-l wl__thanksub">
            We&rsquo;ll message you on WhatsApp when the first batch opens.
          </p>
        </Print>
        {/* 600ms later, one quiet line. The only place a second action is
            offered, and only after conversion. */}
        <Print delay={600}>
          <p className="t-caption wl__share">
            Know someone this would help?{' '}
            <button
              type="button"
              className="wl__copy"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href)
                setShared(true)
              }}
            >
              {shared ? 'Link copied' : 'Copy link'}
            </button>
          </p>
        </Print>
      </div>
    )
  }

  return (
    <form className="wl" onSubmit={submit} noValidate>
      {/* A placeholder is not a label. */}
      <label className="t-telemetry wl__label" htmlFor="whatsapp">
        WhatsApp number
      </label>

      <div className="wl__field">
        <span className="wl__prefix t-body-l" aria-hidden="true">
          +91
        </span>
        <input
          id="whatsapp"
          name="whatsapp"
          className="wl__input t-body-l"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          maxLength={14}
          value={value}
          aria-invalid={state === 'error'}
          aria-describedby={state === 'error' ? 'wl-error' : undefined}
          onChange={(e) => {
            setValue(e.target.value)
            if (state === 'error') setState('idle')
          }}
          // Validation on blur, never on keystroke.
          onBlur={() => setState(value === '' || valid ? 'idle' : 'error')}
        />
        {/* The field's underline draws centre-out; on focus it brightens to
            jade — the only place a form element uses the accent. */}
        <span className="wl__underline">
          <Rule origin="center" duration={680} />
        </span>
      </div>

      <Ticks count={3} gap={18} delay={700} className="wl__ticks" />

      {state === 'error' && (
        <p id="wl-error" className="t-caption wl__error" role="alert">
          That doesn&rsquo;t look like a 10-digit Indian mobile number.
        </p>
      )}

      <Button type="submit" variant="primary" full>
        Join the waitlist
      </Button>
    </form>
  )
}
