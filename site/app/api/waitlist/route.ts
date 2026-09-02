import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { storeSubmission } from '@/lib/store'
import { hasErrors, validateWaitlist } from '@/lib/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** §16.2 — a honeypot plus a submission timing check. No CAPTCHA. */
const MIN_FILL_MS = 1500

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''
  const wantsHtml = request.headers.get('accept')?.includes('text/html') ?? false

  let fields: Record<string, string> = {}
  if (contentType.includes('application/json')) {
    fields = (await request.json()) as Record<string, string>
  } else {
    const form = await request.formData()
    for (const [key, value] of form.entries()) fields[key] = String(value)
  }

  const respond = (status: number, body: Record<string, unknown>, redirect?: string) => {
    if (wantsHtml && redirect) {
      return NextResponse.redirect(new URL(redirect, request.url), 303)
    }
    return NextResponse.json(body, { status })
  }

  // Honeypot: a field no person can see, so anything in it is a bot.
  if (fields.website) {
    return respond(200, { ok: true }, '/waitlist?joined=1')
  }

  // Timing: a form filled in faster than a person can type was not typed.
  const startedAt = Number(fields.startedAt)
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    return respond(200, { ok: true }, '/waitlist?joined=1')
  }

  const limit = rateLimit(clientIp(request))
  if (!limit.ok) {
    return respond(
      429,
      { ok: false, formError: 'That is a few too many attempts. Please try again a little later.' },
      '/waitlist?error=rate',
    )
  }

  const { errors, value } = validateWaitlist({
    name: fields.name ?? '',
    phone: fields.phone ?? '',
    city: fields.city ?? '',
    managing: fields.managing ?? '',
  })

  if (hasErrors(errors)) {
    return respond(400, { ok: false, errors }, '/waitlist?error=1')
  }

  try {
    await storeSubmission({
      ...value,
      source: fields.source || '/',
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Waitlist submission failed', error)
    return respond(
      502,
      { ok: false, formError: 'We could not save your details just now. Please try again in a moment.' },
      '/waitlist?error=send',
    )
  }

  return respond(200, { ok: true }, '/waitlist?joined=1')
}
