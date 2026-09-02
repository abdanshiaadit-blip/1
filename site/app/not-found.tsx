import Link from 'next/link'
import { Container, Grid } from '@/components/layout/Container'

/** §16.5 — no illustration, no humour, no search box. */
export default function NotFound() {
  return (
    <div className="page-plain">
      <Container>
        <Grid>
          <div className="place-text">
            <h1 className="t-h2 measure-head">That page doesn’t exist.</h1>
            <p className="t-body measure-body page-prose">
              The link may be old, or the address may have a typo in it.
            </p>
            <p className="t-body page-prose">
              <Link className="link-inline" href="/">
                Go back to the home page
              </Link>
            </p>
          </div>
        </Grid>
      </Container>
    </div>
  )
}
