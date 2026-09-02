import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { People } from '@/components/sections/14People'
import { Refusals } from '@/components/sections/11Refusals'
import { Waitlist } from '@/components/sections/15Waitlist'
import { Container, Grid } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who is building HUMAN, what a doctor signs off before the app can say it, and the scope we are clear about.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About HUMAN"
        lede="A preventive health membership for India, built by a small team, with a doctor deciding what it is allowed to say."
      />
      <People />
      <Refusals />
      <Section id="contact" labelledBy="contact-heading" tone="raised">
        <Container>
          <Grid>
            <div className="place-text">
              <h2 id="contact-heading" className="t-h2 measure-head">
                Contact
              </h2>
              <p className="t-body measure-body page-prose">
                For anything about your details, including a request to delete them, write to{' '}
                <a className="link-inline" href="mailto:privacy@humanhealth.in">
                  privacy@humanhealth.in
                </a>
                . For anything else, write to{' '}
                <a className="link-inline" href="mailto:hello@humanhealth.in">
                  hello@humanhealth.in
                </a>
                .
              </p>
            </div>
          </Grid>
        </Container>
      </Section>
      <Waitlist />
    </>
  )
}
