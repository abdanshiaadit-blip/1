'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { AnimatedNumber } from '@/components/charts/AnimatedNumber'
import { ReversibleWindow } from '@/components/charts/ReversibleWindow'
import { BlindSpotGrid } from '@/components/charts/BlindSpotGrid'
import { ICMR_SOURCE } from '@/lib/content'
import { reveal, staggerFrom, useSectionAnimation } from '@/lib/animation'
import { MOTION_QUERY } from '@/lib/tokens'

/**
 * 03-scale — the site's one data-dense moment. It should read like a
 * well-set page of a serious annual report. Both charts animate once on
 * entry; neither is scrubbed and neither reverses.
 */
export function Scale() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(root, ({ root: node, gsap }) => {
    reveal(node.querySelectorAll('[data-scale-reveal]'))

    // C1 — the 101M bar starts first so the 136M bar visibly overtakes it.
    // That overtaking moment is the point of the chart.
    staggerFrom(
      gsap.timeline({
        scrollTrigger: { trigger: node.querySelector('[data-c1-rows]'), start: 'top 80%', once: true },
      }),
      node.querySelectorAll('[data-c1-bar]'),
      { scaleX: 0, duration: 0.8, ease: 'power3.out' },
      { stagger: 0.12 },
    )

    // C2 — grey dots first, then the 43 coloured ones. Total 1.2s.
    const grid = node.querySelector('[data-c2]')
    if (grid) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      })
      staggerFrom(
        tl,
        grid.querySelectorAll('[data-c2-dot="base"]'),
        { opacity: 0, duration: 0.4, ease: 'power3.out' },
        { stagger: 0.006 },
      )
      staggerFrom(
        tl,
        grid.querySelectorAll('[data-c2-dot="act"]'),
        { opacity: 0, duration: 0.6, ease: 'power3.out' },
        { stagger: 0.012, at: 0.4 },
      )
    }
  }, { query: MOTION_QUERY })

  return (
    <Section id="03-scale" tone="forest" navDark labelledBy="03-scale-heading" ref={root}>
      <Container>
        {/* Scene A */}
        <Grid>
          <div className="place-wide">
            <h2 id="03-scale-heading" className="t-h2 measure-head" data-scale-reveal>
              It is already most of the country.
            </h2>

            <div className="scale__stats">
              <div className="scale__stat" data-scale-reveal>
                <p className="t-stat">
                  <AnimatedNumber value={101} /> million
                </p>
                <p className="t-small scale__stat-label">Indians are living with diabetes.</p>
              </div>
              <div className="scale__stat" data-scale-reveal>
                <p className="t-stat">
                  <AnimatedNumber value={136} /> million
                </p>
                <p className="t-small scale__stat-label">
                  more are close to it — and can still turn back.
                </p>
              </div>
            </div>

            <div className="scale__chart">
              <ReversibleWindow />
            </div>

            <p className="t-body measure-body scale__para" data-scale-reveal>
              More Indians are heading towards diabetes than already have it. They can still change
              direction. Nothing today reaches them.
            </p>
          </div>
        </Grid>

        {/* Scene B */}
        <Grid className="scale__scene-b">
          <div className="place-split-a">
            <h3 className="t-h3 measure-head" data-scale-reveal>
              And most of them have no idea.
            </h3>
            <p className="t-stat scale__blind-figure" data-scale-reveal>
              <AnimatedNumber value={43} /> of every 100
            </p>
            <p className="t-body measure-body scale__para" data-scale-reveal>
              people who have diabetes do not know they have it.
            </p>
            <p className="t-body measure-body scale__para" data-scale-reveal>
              A blood test would find every one of them.
            </p>
            <p className="t-caption source-note scale__source" data-scale-reveal>
              {ICMR_SOURCE}
            </p>
          </div>
          <div className="place-split-b scale__grid-holder">
            <BlindSpotGrid />
          </div>
        </Grid>
      </Container>
    </Section>
  )
}
