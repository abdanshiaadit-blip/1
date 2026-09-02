import { CITIES } from './content'

export type WaitlistInput = {
  name: string
  phone: string
  city: string
  managing: string
}

export type FieldErrors = Partial<Record<keyof WaitlistInput, string>>

/**
 * §16.2 — accept and normalise `+91`, spaces and hyphens. Indian mobile
 * numbers are ten digits beginning 6, 7, 8 or 9.
 */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, '').replace(/^\+/, '')
  const local = digits.replace(/^(0091|91|0)/, '')
  if (!/^[6-9]\d{9}$/.test(local)) return null
  return `+91${local}`
}

/**
 * §16.2 — validated server-side as well as in the browser. Errors state
 * what is wrong and how to fix it; never a generic "something went wrong".
 */
export function validateWaitlist(input: WaitlistInput): {
  errors: FieldErrors
  value: WaitlistInput & { phone: string }
} {
  const errors: FieldErrors = {}
  const name = input.name.trim()
  const managing = input.managing.trim()
  const city = input.city.trim()

  if (name.length < 2 || name.length > 60) {
    errors.name = 'Please enter your name, between 2 and 60 characters.'
  }

  const phone = normalisePhone(input.phone ?? '')
  if (!phone) {
    errors.phone = 'Please enter a 10-digit Indian mobile number, with or without +91.'
  }

  if (!(CITIES as readonly string[]).includes(city)) {
    errors.city = 'Please choose your city from the list.'
  }

  if (managing.length > 500) {
    errors.managing = 'Please keep this under 500 characters.'
  }

  return { errors, value: { name, phone: phone ?? '', city, managing } }
}

export const hasErrors = (errors: FieldErrors) => Object.keys(errors).length > 0
