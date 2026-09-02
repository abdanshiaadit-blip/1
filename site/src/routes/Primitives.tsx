/**
 * The primitives harness. BRIEF.md Part 11, session 1 gate:
 * "The three motion primitives and the sticky primitive tested in isolation
 * against every rule in Part 3."
 *
 * Not a section of the site. A bench: every primitive, every mode, every
 * origin, laid out so a person can look at it and a test can walk it. It
 * stays in the repo because the primitives will be edited in later sessions
 * and this is what catches the edit.
 */

import FrameCell from '../components/FrameCell'
import Print from '../components/Print'
import Rule from '../components/Rule'
import SectionWash from '../components/SectionWash'
import StickyStage from '../components/StickyStage'
import Ticks from '../components/Ticks'
import { band } from '../lib/motion'

export default function Primitives() {
  return (
    <>
      <Bench title="G1 · Rule" sub="A rule never fades in. It always draws.">
        <Row label="left-to-right, triggered, 680ms">
          <Rule origin="left" />
        </Row>
        <Row label="centre-out, triggered, 680ms">
          <Rule origin="center" />
        </Row>
        <Row label="full-width draw, 1400ms">
          <Rule origin="left" duration={1400} />
        </Row>
        <Row label="hairline tone — the horizon rule, 40%, no ticks">
          <Rule origin="left" duration={900} tone="hairline" />
        </Row>
        <Row label="top-down, vertical, in a 96px cell">
          <div style={{ height: 96 }}>
            <Rule origin="top" />
          </div>
        </Row>
      </Bench>

      <Bench title="G2 · Print" sub="Only the mask moves. The content does not.">
        <Row label="one unit, left">
          <Print>
            <p className="t-body-l">Your body has been telling you for years.</p>
          </Print>
        </Row>
        <Row label="three units, staggered 55ms">
          <Print stagger>
            <p className="t-body">Book a blood test.</p>
            <p className="t-body">Understand the numbers.</p>
            <p className="t-body">Know what to fix first.</p>
          </Print>
        </Row>
        <Row label="nine units — caps at five groups, never nine beats">
          <Print stagger>
            {Array.from({ length: 9 }, (_, i) => (
              <p key={i} className="t-caption">
                Marker {String(i + 1).padStart(2, '0')}
              </p>
            ))}
          </Print>
        </Row>
        <Row label="right, and top">
          <Print direction="right">
            <p className="t-body">Printed right to left.</p>
          </Print>
          <Print direction="top" delay={200}>
            <p className="t-body">Printed top down.</p>
          </Print>
        </Row>
      </Bench>

      <Bench title="G3 · Ticks" sub="Opacity only. Never on a purely structural rule.">
        <Row label="five, on a drawn rule — the composed gesture">
          <Rule origin="left" />
          <div style={{ height: 8 }} />
          <Ticks count={5} delay={430} />
        </Row>
        <Row label="three — the mobile count">
          <Rule origin="center" />
          <div style={{ height: 8 }} />
          <Ticks count={3} delay={430} />
        </Row>
        <Row label="five at a fixed 24px interval — graduations, not decoration">
          <Rule origin="left" />
          <div style={{ height: 8 }} />
          <Ticks count={5} gap={24} delay={430} />
        </Row>
      </Bench>

      <Bench
        title="Frame cells"
        sub="Two cells, one full column of dead space, both clipped."
      >
        <div className="grid12">
          <FrameCell name="bench-text" cols={[1, 5]}>
            <p className="t-body">
              The text cell never contains anything that moves laterally. Text may crossfade in
              place. Nothing may ever enter it from outside.
            </p>
          </FrameCell>
          <FrameCell name="bench-stage" cols={[7, 12]}>
            {/* Deliberately oversized: it must be clipped by the cell, not
                permitted to escape into the gap or the text cell. */}
            <div className="bench__escape" aria-hidden="true" />
            <p className="t-telemetry">a 200% wide child, clipped to its cell</p>
          </FrameCell>
        </div>
      </Bench>

      <StickyStage vh={220} vhMobile={160} name="bench-a">
        {(p) => (
          <>
            <SectionWash />
            <div className="page grid12 bench__stage">
              <FrameCell name="bench-a-text" cols={[1, 5]} minHeight={220}>
                <p className="t-telemetry">scroll-linked · reversible · idempotent</p>
                <h2 className="t-display-m" style={{ marginTop: 'var(--s3)' }}>
                  A sticky stage is exactly one viewport tall.
                </h2>
                <p className="t-caption" style={{ marginTop: 'var(--s3)' }}>
                  progress {p.toFixed(3)}
                </p>
              </FrameCell>
              <FrameCell name="bench-a-stage" cols={[7, 12]}>
                <div className="bench__linked">
                  <Rule origin="left" progress={band(p, 0, 0.45)} />
                  <div style={{ height: 'var(--s4)' }} />
                  <Print progress={band(p, 0.25, 0.7)} stagger>
                    <p className="t-body">You feel fine.</p>
                    <p className="t-body">You feel fine.</p>
                    <p className="t-body">You feel fine.</p>
                  </Print>
                  <div style={{ height: 'var(--s4)' }} />
                  <Rule origin="center" progress={band(p, 0.7, 1)} />
                </div>
              </FrameCell>
            </div>
          </>
        )}
      </StickyStage>

      <StickyStage vh={180} vhMobile={140} name="bench-b">
        {(p) => (
          <div className="page grid12 bench__stage">
            <FrameCell name="bench-b-text" cols={[1, 5]} minHeight={220}>
              <p className="t-telemetry">40vh of flowing page sits above this stage</p>
              <h2 className="t-display-m" style={{ marginTop: 'var(--s3)' }}>
                Two stages never nest, and never animate at once.
              </h2>
            </FrameCell>
            <FrameCell name="bench-b-stage" cols={[7, 12]}>
              <div className="bench__linked">
                <Rule origin="top" progress={p} />
              </div>
            </FrameCell>
          </div>
        )}
      </StickyStage>

      <div className="page bench__tail">
        <p className="t-telemetry">end of bench</p>
      </div>
    </>
  )
}

function Bench({
  title,
  sub,
  children,
}: {
  title: string
  sub: string
  children: React.ReactNode
}) {
  return (
    <section className="bench">
      <div className="page">
        <FrameCell name={`bench-head-${title}`}>
          <h2 className="t-heading">{title}</h2>
          <p className="t-caption" style={{ marginTop: 'var(--s1)' }}>
            {sub}
          </p>
        </FrameCell>
        <div className="bench__rows">{children}</div>
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <FrameCell name={`bench-row-${label}`} className="bench__row">
      <p className="t-telemetry">{label}</p>
      <div className="bench__demo">{children}</div>
    </FrameCell>
  )
}
