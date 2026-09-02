import type { Metadata } from 'next'
import Link from 'next/link'
import { Container, Grid } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'Terms',
  description: 'The terms that apply to using this website and joining the HUMAN founding-cohort waitlist.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <div className="page-plain">
      <Container>
        <Grid>
          <div className="place-text legal">
            <h1 className="t-h1 measure-head">Terms of use</h1>
            <p className="t-caption legal__updated">Last updated 2 September 2026</p>

            <p className="t-body">
              These terms cover this website and the founding-cohort waitlist. They do not cover the HUMAN
              membership, which is not open and has its own terms that will be published before it is.
            </p>

            <h2 className="t-h3">What this site is</h2>
            <p className="t-body">
              A description of a product we are building, and a form to register interest in it. Nothing on
              this site is an offer to sell, and no price is published anywhere on it.
            </p>

            <h2 className="t-h3">Joining the waitlist</h2>
            <p className="t-body">
              A place on the waitlist is not a purchase and does not guarantee a place in the founding
              cohort. We may close the waitlist, change what the membership includes, or decide not to launch
              at all. You can ask to be removed at any time.
            </p>

            <h2 className="t-h3">Health information on this site</h2>
            <p className="t-body">
              Everything written here is general information, not medical advice about you. See our{' '}
              <Link className="link-inline" href="/medical-disclaimer">
                medical disclaimer
              </Link>
              , which forms part of these terms.
            </p>

            <h2 className="t-h3">Accuracy</h2>
            <p className="t-body">
              Statistics on this site carry their source. We check them when we publish and correct them when
              they change. Descriptions of the app describe what it does today; features described here are
              not promises about what a future membership will include.
            </p>

            <h2 className="t-h3">Our content</h2>
            <p className="t-body">
              The text, design and app screens on this site belong to HUMAN. You are welcome to quote and
              link to them with attribution. You may not copy the site wholesale or present it as your own.
            </p>

            <h2 className="t-h3">Liability</h2>
            <p className="t-body">
              We provide this site as it is. To the extent the law allows, we are not liable for loss arising
              from relying on general information published here. Nothing in these terms limits liability
              that cannot be limited by law.
            </p>

            <h2 className="t-h3">Governing law</h2>
            <p className="t-body">
              These terms are governed by the laws of India, and the courts of India have jurisdiction over
              any dispute arising from them.
            </p>

            <h2 className="t-h3">Contact</h2>
            <p className="t-body">
              Write to{' '}
              <a className="link-inline" href="mailto:hello@humanhealth.in">
                hello@humanhealth.in
              </a>
              .
            </p>
          </div>
        </Grid>
      </Container>
    </div>
  )
}
