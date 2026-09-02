import { useEffect, useId, useRef, useState } from 'react'
import { waitlist } from '../copy'
import { config } from '../site.config'
import { Button, ShareGlyph } from './ui'
import './waitlist.css'

/* ── 12 · WaitlistForm · spec 2.2, 8.13 ───────────────────────────────────────
   One field. A WhatsApp number. Nothing else — no email, no name, no city.
   spec 2.2: "This is not a simplification for elegance; it is the business
   model." Validation on blur, never on keystroke. On success the field is
   replaced in place: no modal, no redirect, no page change.
   ───────────────────────────────────────────────────────────────────────────── */

let focusRequest: (() => void) | null = null

/** The header CTA and the mobile bar scroll here and focus the field. spec 8.15. */
export function focusWaitlist(): void {
  focusRequest?.()
}

const TEN_DIGITS = /^[6-9]\d{9}$/

function normalise(raw: string): string {
  return raw.replace(/[^\d]/g, '').replace(/^(?:0|91)(?=\d{10}$)/, '').slice(0, 10)
}

export function WaitlistForm() {
  const fieldId = useId()
  const errorId = useId()
  const input = useRef<HTMLInputElement | null>(null)

  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [done, setDone] = useState(false)
  const [shareVisible, setShareVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    focusRequest = () => input.current?.focus()
    return () => {
      focusRequest = null
    }
  }, [])

  /* spec 8.13: the secondary offer arrives 600ms after the confirmation, and
     only then. It is the only second action on the site. */
  useEffect(() => {
    if (!done) return
    const t = window.setTimeout(() => setShareVisible(true), 600)
    return () => window.clearTimeout(t)
  }, [done])

  const submit = (e: React.FormEvent): void => {
    e.preventDefault()
    const digits = normalise(value)
    if (!TEN_DIGITS.test(digits)) {
      setError(true)
      input.current?.focus()
      return
    }
    setError(false)
    if (config.waitlistEndpoint) {
      void fetch(config.waitlistEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ whatsapp: `+91${digits}` }),
      }).catch(() => {})
    }
    setDone(true)
  }

  const share = async (): Promise<void> => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ url })
        return
      } catch {
        /* dismissed — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="waitlist" data-done={done ? 'true' : 'false'}>
      {done ? (
        <div className="waitlist__confirm">
          <p className="t-body-l waitlist__confirm-heading">{waitlist.confirmHeading}</p>
          <p className="t-body waitlist__confirm-body">{waitlist.confirmBody}</p>
          <div className="waitlist__share" data-visible={shareVisible ? 'true' : 'false'}>
            <span className="t-caption">{waitlist.share}</span>
            <button type="button" className="waitlist__share-button t-caption" onClick={() => void share()}>
              <ShareGlyph />
              {copied ? waitlist.shareDone : waitlist.shareAction}
            </button>
          </div>
        </div>
      ) : (
        <form className="waitlist__form" onSubmit={submit} noValidate>
          <label className="waitlist__label t-caption" htmlFor={fieldId}>
            {waitlist.label}
          </label>
          <div className="waitlist__row">
            <div className="waitlist__field" data-error={error ? 'true' : 'false'}>
              <span className="waitlist__prefix t-body" aria-hidden="true">
                {waitlist.prefix}
              </span>
              <input
                id={fieldId}
                ref={input}
                className="waitlist__input t-body"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                name="whatsapp"
                maxLength={17}
                placeholder="00000 00000"
                aria-describedby={error ? errorId : undefined}
                aria-invalid={error || undefined}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => {
                  /* spec 8.13: validation happens on blur, never on keystroke. */
                  if (value.trim() === '') {
                    setError(false)
                    return
                  }
                  setError(!TEN_DIGITS.test(normalise(value)))
                }}
              />
            </div>
            <Button type="submit">Join</Button>
          </div>
          <p className="waitlist__error t-caption" id={errorId} role="alert">
            {error ? waitlist.error : ''}
          </p>
        </form>
      )}
    </div>
  )
}
