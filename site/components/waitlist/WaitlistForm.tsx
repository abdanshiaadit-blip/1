'use client'

import { useRef, useState } from 'react'
import { CITIES } from '@/lib/content'
import { hasErrors, validateWaitlist, type FieldErrors } from '@/lib/validation'

type Status = 'idle' | 'submitting' | 'done'

/**
 * §16.2 / §16.3 — the waitlist form.
 *
 * It is a real `<form>` with a real `action`, so it submits and succeeds
 * with JavaScript disabled; the client handler only intercepts to keep the
 * visitor in the modal. Validation runs here and again on the server.
 */
export function WaitlistForm({
  source,
  onDone,
  autoFocus = false,
}: {
  source: string
  onDone?: () => void
  autoFocus?: boolean
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const startedAt = useRef(Date.now())

  if (status === 'done') {
    return <WaitlistSuccess onDone={onDone} />
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const input = {
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      city: String(data.get('city') ?? ''),
      managing: String(data.get('managing') ?? ''),
    }

    const { errors: found } = validateWaitlist(input)
    setErrors(found)
    setFormError(null)
    if (hasErrors(found)) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    setStatus('submitting')
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...input, source, startedAt: startedAt.current, website: '' }),
      })
      const payload = (await response.json()) as {
        ok?: boolean
        errors?: FieldErrors
        formError?: string
      }
      if (!response.ok || !payload.ok) {
        setErrors(payload.errors ?? {})
        setFormError(
          payload.formError ??
            (payload.errors ? null : 'We could not save your details just now. Please try again in a moment.'),
        )
        setStatus('idle')
        return
      }
      setStatus('done')
    } catch {
      setFormError('We could not reach us just now. Please check your connection and try again.')
      setStatus('idle')
    }
  }

  const submitting = status === 'submitting'

  return (
    <form className="wl-form" method="post" action="/api/waitlist" onSubmit={onSubmit} noValidate>
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="startedAt" value={startedAt.current} />
      <div className="wl-field wl-field--honeypot" aria-hidden="true">
        <label htmlFor={`wl-website-${source}`}>Leave this empty</label>
        <input id={`wl-website-${source}`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field
        id={`wl-name-${source}`}
        name="name"
        label="Name"
        autoComplete="name"
        error={errors.name}
        autoFocus={autoFocus}
      />
      <Field
        id={`wl-phone-${source}`}
        name="phone"
        label="WhatsApp number"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={errors.phone}
      />

      <div className="wl-field">
        <label className="t-small wl-label" htmlFor={`wl-city-${source}`}>
          City
        </label>
        <select
          id={`wl-city-${source}`}
          name="city"
          className="wl-input t-body"
          defaultValue=""
          aria-invalid={errors.city ? true : undefined}
          aria-describedby={errors.city ? `wl-city-${source}-error` : undefined}
        >
          <option value="" disabled>
            Choose your city
          </option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && (
          <p id={`wl-city-${source}-error`} className="wl-error t-caption">
            {errors.city}
          </p>
        )}
      </div>

      <div className="wl-field">
        <label className="t-small wl-label" htmlFor={`wl-managing-${source}`}>
          Anything you’re already managing? <span className="wl-optional">Optional</span>
        </label>
        <textarea
          id={`wl-managing-${source}`}
          name="managing"
          rows={3}
          maxLength={500}
          className="wl-input t-body"
          aria-invalid={errors.managing ? true : undefined}
          aria-describedby={errors.managing ? `wl-managing-${source}-error` : undefined}
        />
        {errors.managing && (
          <p id={`wl-managing-${source}-error`} className="wl-error t-caption">
            {errors.managing}
          </p>
        )}
      </div>

      {/* §16.3 — specific and purpose-limited. Nothing is pre-ticked
          because nothing is ticked: joining is the consent, and it is
          stated in full immediately above the button that gives it. */}
      <p className="t-caption wl-consent">
        By joining, you agree that HUMAN may contact you on WhatsApp about your place in the founding cohort.
        We won’t use your number for anything else. You can ask us to delete your details at any time — see
        our{' '}
        <a className="link-inline" href="/privacy">
          privacy policy
        </a>
        .
      </p>

      {formError && (
        <p className="wl-error t-small" role="alert">
          {formError}
        </p>
      )}

      <button type="submit" className="btn btn--primary wl-submit" disabled={submitting}>
        {submitting ? 'Joining…' : 'Join the waitlist'}
      </button>

      <p className="t-caption wl-foot">We’ll only message you about your place. Nothing else.</p>
    </form>
  )
}

function Field({
  id,
  name,
  label,
  error,
  ...rest
}: {
  id: string
  name: string
  label: string
  error?: string
} & React.ComponentProps<'input'>) {
  return (
    <div className="wl-field">
      <label className="t-small wl-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        className="wl-input t-body"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="wl-error t-caption">
          {error}
        </p>
      )}
    </div>
  )
}

/** §11.3 — the panel's content is replaced, not stacked with a new modal. */
export function WaitlistSuccess({ onDone }: { onDone?: () => void }) {
  return (
    <div className="wl-success" role="status">
      <h2 className="t-h2">You’re on the list.</h2>
      <p className="t-body measure-body">
        We’ll message you on WhatsApp when a place in the founding cohort opens. Nothing else, and nothing
        before then.
      </p>
      {onDone && (
        <button type="button" className="btn btn--secondary" onClick={onDone}>
          Close
        </button>
      )}
    </div>
  )
}
