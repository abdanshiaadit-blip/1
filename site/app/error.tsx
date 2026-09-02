'use client'

import { Container, Grid } from '@/components/layout/Container'

/** §16.5 — the same treatment as the 404, with a retry action. */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="page-plain">
      <Container>
        <Grid>
          <div className="place-text">
            <h1 className="t-h2 measure-head">Something went wrong on our side.</h1>
            <p className="t-body measure-body page-prose">
              Nothing you did caused this. Try again, and if it keeps happening, leave it with us.
            </p>
            <button type="button" className="btn btn--secondary page-prose" onClick={reset}>
              Try again
            </button>
          </div>
        </Grid>
      </Container>
    </div>
  )
}
