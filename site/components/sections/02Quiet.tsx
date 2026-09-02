'use client'

import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { Container, Grid } from '@/components/layout/Container'
import { reveal, useSectionAnimation } from '@/lib/animation'
import { MOTION_QUERY } from '@/lib/tokens'

const CONDITIONS = ['Diabetes', 'Fatty liver', 'Thyroid', 'PCOS']

/**
 * 02-quiet — make the visitor personally uneasy before showing them any
 * numbers. The right side is left empty on purpose; the asymmetry is the
 * design and this section is never centred.
 */
export function Quiet() {
  const root = useRef<HTMLElement>(null)

  useSectionAnimation(root, ({ root: node, gsap }) => {
    reveal(node.querySelectorAll('[data-quiet-prose] > *'), { trigger: node.querySelector('[data-quiet-prose]')! })

    // Each condition lands individually, slower than the standard stagger.
    const items = gsap.utils.toArray<HTMLElement>(node.querySelectorAll('[data-quiet-item]'))
    items.forEach((item, index) => {
      const at = index * (window.innerWidth < 1024 ? 0.07 : 0.09)
      gsap.from(item.querySelector('[data-quiet-rule]'), {
        scaleX: 0,
        duration: 0.4,
        ease: 'power3.out',
        delay: at,
        scrollTrigger: { trigger: node.querySelector('[data-quiet-list]'), start: 'top 85%', once: true },
      })
      gsap.from(item.querySelector('[data-quiet-label]'), {
        opacity: 0,
        y: 16,
        duration: 0.56,
        ease: 'power3.out',
        delay: at + 0.04,
        scrollTrigger: { trigger: node.querySelector('[data-quiet-list]'), start: 'top 85%', once: true },
      })
    })
  }, { query: MOTION_QUERY })

  return (
    <Section id="02-quiet" labelledBy="02-quiet-heading" ref={root}>
      <Container>
        <Grid className="quiet__grid">
          <div className="place-text quiet__prose" data-quiet-prose>
            <h2 id="02-quiet-heading" className="t-h2 measure-head">
              Nothing hurts. That’s the problem.
            </h2>
            <p className="t-body measure-body quiet__para">
              Diabetes doesn’t hurt at first. Neither does a fatty liver, a thyroid that has started to
              drift, PCOS, or the cholesterol that will eventually matter most.
            </p>
            <p className="t-body measure-body quiet__para">
              They build for years while you feel completely normal. By the time there is a symptom, you are
              not preventing anything — you are managing it.
            </p>
            <p className="t-body measure-body quiet__para">
              The only thing that finds them early is a blood test. Almost nobody is taking one.
            </p>
          </div>

          <ul className="quiet__list" data-quiet-list>
            {CONDITIONS.map((condition) => (
              <li key={condition} className="quiet__item" data-quiet-item>
                <span aria-hidden="true" className="quiet__rule rule-draw" data-quiet-rule />
                <span className="t-h3 quiet__label" data-quiet-label>
                  {condition}
                </span>
              </li>
            ))}
          </ul>
        </Grid>
      </Container>
    </Section>
  )
}
