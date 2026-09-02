'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { MarkerOverTime } from '@/components/charts/MarkerOverTime'
import { TwoYears } from '@/components/charts/TwoYears'
import { ScopeLine } from '@/components/ui/ScopeLine'
import { WaitlistButton } from '@/components/waitlist/WaitlistButton'
import { reveal, sceneTimeline, staggerFrom, useSectionAnimation } from '@/lib/animation'
import { PINNED_QUERY, UNPINNED_QUERY } from '@/lib/tokens'

const SCENE_COUNT = 3

/**
 * 10-week12 — the emotional and strategic centrepiece, and one of only
 * three centred moments on the site.
 *
 * Every step derives from a single scrubbed progress value, so scrolling
 * back up reverses the whole scene exactly. "Your LDL fell 14%" sits in a
 * reserved fixed-height slot from first paint, so the chart above it can
 * never shift (Law 4).
 */
export function Week12() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(
    root,
    ({ root: node }) => {
      const track = node.querySelector('[data-scene-track]')
      if (!track) return
      const tl = sceneTimeline(track)

      staggerFrom(
        tl,
        node.querySelectorAll('[data-w12-open] > *'),
        { opacity: 0, y: 16, duration: 0.12 },
        { stagger: 0.03 },
      )
      tl.from('[data-c3-axis], [data-c3-band]', { opacity: 0, duration: 0.2 }, 0.15)
        .from('[data-c3-point="0"]', { opacity: 0, duration: 0.12 }, 0.2)
        .from('[data-c3-line]', { strokeDashoffset: 100, duration: 0.25 }, 0.35)
        .from('[data-c3-point="1"]', { opacity: 0, duration: 0.1 }, 0.5)
        .from('[data-w12-headline], [data-w12-close-lead]', { opacity: 0, y: 12, duration: 0.12 }, 0.6)
        .from('[data-c3-point="2"]', { opacity: 0, duration: 0.08 }, 0.72)

      // The coda and the closing block sit below the pin, in normal flow,
      // and use the standard reveal. A 100dvh scene cannot hold the whole
      // section without clipping text, and clipped text is never the
      // answer (Law 9). The scrubbed part keeps what the section is for:
      // the chart drawing and the number landing.
      reveal(node.querySelectorAll('[data-w12-coda]'))
      reveal(node.querySelectorAll('[data-w12-close] > *'), { stagger: 0.08 })
    },
    { query: PINNED_QUERY },
  )

  // §10 mobile and short viewports — no pinning. C3 draws once on entry
  // with a timed 1.2s animation rather than a scrub.
  useSectionAnimation(
    root,
    ({ root: node, gsap }) => {
      reveal(node.querySelectorAll('[data-w12-open] > *'))
      reveal(node.querySelectorAll('[data-w12-headline], [data-w12-close-lead]'), { stagger: 0.08 })
      const line = node.querySelector('[data-c3-line]')
      if (line) {
        gsap.from(line, {
          strokeDashoffset: 100,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: line, start: 'top 80%', once: true },
        })
      }
      reveal(node.querySelectorAll('[data-w12-coda]'))
      reveal(node.querySelectorAll('[data-w12-close] > *'), { stagger: 0.08 })
    },
    { query: UNPINNED_QUERY },
  )

  return (
    <Section
      id="10-week12"
      tone="forest"
      navDark
      labelledBy="10-week12-heading"
      className="w12"
      style={{ ['--scene-count' as string]: SCENE_COUNT }}
      ref={root}
    >
      <div className="scene-track" data-scene-track>
        <div className="scene-sticky">
          <Container className="w12__container">
            <Grid>
              <div className="place-centre w12__content">
                <div data-w12-open>
                  <h2 id="10-week12-heading" className="t-h2 measure-head w12__heading">
                    At week 12, we come back and check.
                  </h2>
                  <p className="t-body measure-body w12__para">
                    Your retest is booked the day you join — before the motivation fades, and before life
                    gets in the way. It’s already paid for, so cost is never the reason you skip it.
                  </p>
                  <p className="t-body measure-body w12__para">
                    At week 10, 11 and 12, someone from our team messages you. Not a notification. A person
                    whose job is making sure you come back.
                  </p>
                  <p className="t-body measure-body w12__para">
                    Then we draw your blood again, and put the new number next to the old one.
                  </p>
                </div>

                <div className="w12__chart">
                  <MarkerOverTime />
                </div>

                {/* Reserved slot, held from first paint (Law 4). */}
                <div className="w12__headline-slot">
                  <h3 className="t-h2" data-w12-headline>
                    Your LDL fell 14%.
                  </h3>
                </div>

                <p className="t-body measure-body w12__para w12__para--after" data-w12-close-lead>
                  That is a different experience from two PDFs, three months apart.
                </p>

              </div>
            </Grid>
          </Container>
        </div>
      </div>

      <Container className="w12__tail">
        <Grid>
          <div className="place-centre w12__content">
            <div className="w12__coda" data-w12-coda>
              <TwoYears />
            </div>

            <div className="w12__close" data-w12-close>
              <p className="t-body measure-body w12__lead-line">Then we do it again.</p>
              <p className="t-body measure-body w12__para">
                Six months in, the full panel runs again. Every before-and-after builds a record of what
                actually worked for your body — something no report can give you, because it only exists if
                you were there for it.
              </p>
              <div className="w12__cta">
                <WaitlistButton />
              </div>
            </div>

            <div className="w12__scope">
              <ScopeLine />
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  )
}
