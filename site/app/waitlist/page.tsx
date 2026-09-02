import type { Metadata } from 'next'
import { Container, Grid } from '@/components/layout/Container'
import { WaitlistForm, WaitlistSuccess } from '@/components/waitlist/WaitlistForm'

export const metadata: Metadata = {
  title: 'Join the founding cohort',
  description:
    'We are opening HUMAN to a small first group. Leave your details and we will message you on WhatsApp when a place is available.',
  alternates: { canonical: '/waitlist' },
  robots: { index: true, follow: true },
}

/** §16.2 — errors say what is wrong and what to do, never "something went wrong". */
const ERROR_COPY: Record<string, string> = {
  '1': 'Some of your details need another look. Please check the fields below and send it again.',
  rate: 'That is a few too many attempts. Please try again a little later.',
  send: 'We could not save your details just now. Please try again in a moment.',
}

/**
 * §11.3 — a real page, for direct links and for visitors without
 * JavaScript. The modal is a convenience layered over this, never a
 * replacement for it.
 */
export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ joined?: string; error?: string }>
}) {
  const params = await searchParams
  const joined = params.joined === '1'

  return (
    <div className="page-plain">
      <Container>
        <Grid>
          <div className="place-text">
            {joined ? (
              <WaitlistSuccess />
            ) : (
              <>
                <h1 className="t-h1 measure-head">Join the founding cohort</h1>
                <p className="t-lead measure-lead page-header__lede">
                  We’re opening a small first group. Leave your details and we’ll message you on WhatsApp
                  when a place is available.
                </p>
                {params.error && (
                  <p className="wl-error t-small page-prose" role="alert">
                    {ERROR_COPY[params.error] ?? ERROR_COPY.send}
                  </p>
                )}
                <WaitlistForm source="/waitlist" />
              </>
            )}
          </div>
        </Grid>
      </Container>
    </div>
  )
}
