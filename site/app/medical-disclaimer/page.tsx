import type { Metadata } from 'next'
import { Container, Grid } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'Medical disclaimer',
  description:
    'HUMAN informs and supports your care. It does not replace a doctor, and nothing here is a diagnosis. The full scope-of-practice statement.',
  alternates: { canonical: '/medical-disclaimer' },
}

export default function MedicalDisclaimerPage() {
  return (
    <div className="page-plain">
      <Container>
        <Grid>
          <div className="place-text legal">
            <h1 className="t-h1 measure-head">Medical disclaimer</h1>
            <p className="t-caption legal__updated">Last updated 2 September 2026</p>

            <p className="t-body">
              HUMAN informs and supports your care. It does not replace a doctor, and nothing on this site or
              in the app is a diagnosis.
            </p>

            <h2 className="t-h3">What HUMAN does</h2>
            <p className="t-body">
              We arrange blood tests through accredited partner laboratories, present the results in plain
              words, rank what is worth attention, and build a plan from a protocol a doctor has approved. We
              retest and show you whether anything moved.
            </p>

            <h2 className="t-h3">What HUMAN does not do</h2>
            <ul className="t-body">
              <li>We do not diagnose conditions. A blood result is not a diagnosis.</li>
              <li>We do not prescribe, and we do not tell you to start or stop any medicine.</li>
              <li>We do not treat disease, and we do not claim to prevent it.</li>
              <li>We do not replace your doctor, your physician or any specialist you see.</li>
              <li>We are not an emergency service.</li>
            </ul>

            <h2 className="t-h3">The coach</h2>
            <p className="t-body">
              The in-app coach can only answer from a protocol a doctor has approved. It cannot invent advice
              and it cannot go beyond what has been signed off. It is not a doctor and it is not a substitute
              for speaking to one.
            </p>

            <h2 className="t-h3">If something looks urgent</h2>
            <p className="t-body">
              If a result looks urgent, we will tell you to see a doctor. That is advice to seek care, not
              care itself. If you have symptoms that worry you, do not wait for a test result — see a doctor
              or go to a hospital.
            </p>

            <h2 className="t-h3">Reference ranges</h2>
            <p className="t-body">
              We use reference levels appropriate to Indian populations where the clinical protocol specifies
              them. Reference ranges vary between laboratories and between people. A number outside a range is
              a reason to look further, not a conclusion.
            </p>

            <h2 className="t-h3">Questions</h2>
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
