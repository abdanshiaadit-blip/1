import { appendFile } from 'node:fs/promises'
import { join } from 'node:path'

export type WaitlistRecord = {
  name: string
  phone: string
  city: string
  managing: string
  source: string
  createdAt: string
}

/**
 * §16.2 — the form needs a real destination, and the data must stay under
 * HUMAN's control. `WAITLIST_WEBHOOK_URL` points at whatever that ends up
 * being (a Supabase edge function, an Airtable proxy, a Sheets service
 * account endpoint). Until it is set, submissions append to a local
 * JSONL file so the flow is testable end to end — that file is a
 * development aid, not a launch destination.
 */
export async function storeSubmission(record: WaitlistRecord): Promise<void> {
  const endpoint = process.env.WAITLIST_WEBHOOK_URL

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(process.env.WAITLIST_WEBHOOK_TOKEN
          ? { authorization: `Bearer ${process.env.WAITLIST_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(record),
    })
    if (!response.ok) {
      throw new Error(`Waitlist destination responded ${response.status}`)
    }
    return
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('WAITLIST_WEBHOOK_URL is not configured')
  }

  await appendFile(join(process.cwd(), '.waitlist-submissions.jsonl'), `${JSON.stringify(record)}\n`, 'utf8')
}
