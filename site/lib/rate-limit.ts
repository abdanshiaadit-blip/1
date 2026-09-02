/**
 * §16.2 — rate limit by IP. A sliding window held in module memory, which
 * is correct for a single instance. Behind more than one instance this
 * must move to a shared store; the interface does not change.
 */
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5

const hits = new Map<string, number[]>()

export function rateLimit(ip: string): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000)
    hits.set(ip, recent)
    return { ok: false, retryAfterSeconds }
  }

  recent.push(now)
  hits.set(ip, recent)

  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }

  return { ok: true, retryAfterSeconds: 0 }
}
