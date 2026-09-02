import type { Metadata } from 'next'
import { Container, Grid } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What HUMAN collects at the waitlist stage, why, how long we keep it, and how to have it deleted.',
  alternates: { canonical: '/privacy' },
}

/**
 * §16.3 — DPDP applies from the first submission. This policy names a
 * grievance contact and states a retention period, both of which the Act
 * requires. It is a draft written against what the site actually collects
 * today and must be reviewed by a lawyer before launch.
 */
export default function PrivacyPage() {
  return (
    <div className="page-plain">
      <Container>
        <Grid>
          <div className="place-text legal">
            <h1 className="t-h1 measure-head">Privacy</h1>
            <p className="t-caption legal__updated">Last updated 2 September 2026</p>

            <p className="t-body">
              HUMAN is not open yet. The only personal data this site collects is what you type into the
              founding-cohort waitlist form. This page says what happens to it.
            </p>

            <h2 className="t-h3">What we collect</h2>
            <ul className="t-body">
              <li>Your name.</li>
              <li>Your WhatsApp number.</li>
              <li>Your city, chosen from a list.</li>
              <li>Anything you choose to write in the optional free-text field.</li>
              <li>The date and time you submitted, and which page you submitted from.</li>
            </ul>
            <p className="t-body">
              We do not collect health records, test results or payment details at this stage, because there
              is nothing to buy and no test to book.
            </p>

            <h2 className="t-h3">Why we collect it</h2>
            <p className="t-body">
              To hold your place in the founding cohort and to message you on WhatsApp when a place is
              available. That is the whole purpose, and we do not use your number for anything else. We do
              not sell it, rent it or share it for advertising.
            </p>

            <h2 className="t-h3">Consent</h2>
            <p className="t-body">
              You give consent by submitting the form, and the purpose is stated in full immediately above
              the button that gives it. Nothing is pre-ticked, and marketing consent is not bundled into it.
              You can withdraw consent at any time by writing to the address below; withdrawing it removes
              you from the waitlist.
            </p>

            <h2 className="t-h3">How long we keep it</h2>
            <p className="t-body">
              Until the founding cohort closes and you have either joined or told us you are not interested,
              and in any case no longer than 24 months from the date you submitted. After that, the record is
              deleted. If you ask us to delete it sooner, we do.
            </p>

            <h2 className="t-h3" id="delete">
              Asking us to delete your details
            </h2>
            <p className="t-body">
              Write to{' '}
              <a className="link-inline" href="mailto:privacy@humanhealth.in?subject=Delete%20my%20details">
                privacy@humanhealth.in
              </a>{' '}
              from any address, or message the WhatsApp number we contact you on, and say that you want your
              details deleted. We will confirm within 7 days and delete within 30. You do not have to give a
              reason, and we will not ask for one.
            </p>
            <p className="t-body">
              You can also ask us for a copy of what we hold about you, or ask us to correct it, at the same
              address.
            </p>

            <h2 className="t-h3">Analytics</h2>
            <p className="t-body">
              This site uses cookieless analytics that count page views without identifying you and without
              storing anything on your device. There is no Google Analytics, no advertising pixel and no
              session recording, which is why there is no cookie banner.
            </p>

            <h2 className="t-h3">Grievance contact</h2>
            <p className="t-body">
              Under the Digital Personal Data Protection Act, 2023, you may raise a grievance with our
              grievance officer at{' '}
              <a className="link-inline" href="mailto:grievance@humanhealth.in">
                grievance@humanhealth.in
              </a>
              . We will respond within 30 days. If you are not satisfied with the response, you may complain
              to the Data Protection Board of India.
            </p>

            <h2 className="t-h3">Changes</h2>
            <p className="t-body">
              If this policy changes in a way that affects data we already hold, we will message the people
              it affects rather than quietly updating this page.
            </p>
          </div>
        </Grid>
      </Container>
    </div>
  )
}
