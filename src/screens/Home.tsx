import { useApp } from '../state/app'
import {
  GlassCard,
  SectionHeader,
  Reveal,
  StateDot,
  ListRow,
  Chip,
} from '../components/primitives'
import { IntelligencePanel, LoopStrip, Sparkline, CycleArc } from '../components/viz'

export default function Home() {
  const { p, openSheet, setTab, openBooking, done, toggleAction } = useApp()

  const priority = p.priorities[0]
  const experiment = p.experiments.find((e) => !e.readout) ?? p.experiments[0]
  const todayAction = p.actions[0]
  const isDone = done[todayAction.id] ?? todayAction.doneToday
  const insight = p.insights[0]
  const movers = p.systems.slice(0, 3)

  return (
    <div className="scroll screen__scroll">
      {/* ---------------------------------------------------- brand header */}
      <header className="brandhead">
        <div className="brandhead__mark">HUMAN</div>
        <p className="brandhead__promise">
          Book your blood tests, discover what your body needs, and follow a personalized plan to
          stay healthier for years to come.
        </p>
      </header>

      {/* ------------------------------------------------------- HERO CARD */}
      <section className="pad">
        <div className="hero">
          {/* A slow-drifting colour field behind the glass. This is what the
              hero's material refracts — without it the card is a flat panel. */}
          <div className="hero__field" aria-hidden="true" />
          <div className="hero__sheen" aria-hidden="true" />

          {/* The delta now lives on the panel face, so the panel is a complete
              readout rather than a number needing a caption underneath. */}
          <button type="button" className="hero__panelwrap" onClick={() => openSheet('intel')}>
            <IntelligencePanel score={p.intel.score} delta={p.intel.delta} />
          </button>

          <div className="hero__rule" />

          <div className="hero__meta">
            <div className="hero__metacell">
              <div className="t-cap">Current stage</div>
              <div className="hero__stage">{p.loop.stage}</div>
            </div>
            <div className="hero__metacell hero__metacell--end">
              <div className="t-cap">Next review</div>
              <div className="hero__review num">{p.loop.nextReviewDate}</div>
            </div>
          </div>

          <button type="button" className="hero__priority" onClick={() => openSheet('priority', priority.id)}>
            <div className="t-cap">Your priority</div>
            <div className="hero__ptitle">{priority.title}</div>
            <p className="hero__pdesc">{priority.whyShort}</p>
            <div className="hero__exp">
              <span className="hero__expdot" />
              <span className="hero__explabel">{experiment.title}</span>
              <span className="hero__expweek num">
                Week {experiment.weekNow} of {experiment.weeks}
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* ----------------------------------------------------------- TODAY */}
      <Reveal>
        <section className="pad">
          <SectionHeader title="Today" action="Plan" onAction={() => setTab('action')} />
          <GlassCard className="today" tone={isDone ? 'optimal' : 'attention'}>
            <button
              type="button"
              className={`today__check ${isDone ? 'is-on' : ''}`}
              onClick={() => toggleAction(todayAction.id)}
              aria-label={isDone ? 'Mark not done' : 'Mark done'}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="today__main">
              <div className="today__title">{todayAction.title}</div>
              <p className="today__why">{todayAction.why}</p>
              <div className="today__prog">
                <div className="today__bar">
                  <span
                    style={{
                      width: `${(todayAction.progress.done / todayAction.progress.total) * 100}%`,
                    }}
                  />
                </div>
                <span className="t-foot num">
                  {todayAction.progress.done} / {todayAction.progress.total} days
                </span>
              </div>
            </div>
          </GlassCard>
        </section>
      </Reveal>

      {/* ------------------------------------------------- WOMEN'S HEALTH
          Third on the screen, directly under Today. For a member whose whole
          picture is longitudinal women's health, sitting below Movement and
          Insight buried the pillar. The card carries the connection HUMAN has
          found, not just a cycle day - that is what makes it worth opening. */}
      {p.womens && (
        <Reveal delay={30}>
          <section className="pad">
            <SectionHeader
              title="Women's Health"
              action="Open"
              onAction={() => openSheet('womens')}
            />
            <GlassCard className="wcard" tone="women" onClick={() => openSheet('womens')}>
              <div className="wcard__top">
                <CycleArc day={p.womens.cycleDay} length={p.womens.cycleLength} size={104} />
                <div className="wcard__l">
                  <div className="wcard__day num">Day {p.womens.cycleDay}</div>
                  <div className="wcard__phase">{p.womens.phase} phase</div>
                  <p className="wcard__note">Next expected {p.womens.nextPredicted}</p>
                  <Chip state="attention">{p.womens.variability}</Chip>
                </div>
              </div>
              <div className="wcard__cxn">
                <p className="wcard__stmt">{p.womens.insights[0].statement}</p>
                <span className="wcard__more">
                  {p.womens.insights.length} connections tracked
                </span>
              </div>
            </GlassCard>
          </section>
        </Reveal>
      )}

      {/* ------------------------------------------------------- LOOP STRIP */}
      <Reveal delay={40}>
        <section className="pad">
          <GlassCard className="loopcard" onClick={() => openSheet('loop')}>
            <div className="loopcard__head">
              <span className="t-cap">Your health loop · cycle {p.loop.cycleNumber}</span>
              <span className="loopcard__more">How this works</span>
            </div>
            <LoopStrip stage={p.loop.stage} />
          </GlassCard>
        </section>
      </Reveal>

      {/* -------------------------------------------------------- MOVEMENT */}
      <Reveal delay={60}>
        <section className="pad">
          <SectionHeader title="Movement" action="All systems" onAction={() => setTab('health')} />
          <GlassCard className="movers">
            {movers.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`mover ${i === movers.length - 1 ? 'mover--last' : ''}`}
                onClick={() => openSheet('system', s.id)}
              >
                <StateDot state={s.id === 'women' ? 'women' : s.state} />
                <span className="mover__name">{s.name}</span>
                <span className="mover__val num">
                  {s.metric.value}
                  {s.metric.unit && <em>{s.metric.unit}</em>}
                </span>
                <Sparkline data={s.series} state={s.state} />
              </button>
            ))}
          </GlassCard>
        </section>
      </Reveal>

      {/* --------------------------------------------------------- INSIGHT */}
      <Reveal delay={80}>
        <section className="pad">
          <GlassCard className="insight" onClick={() => openSheet('insight', insight.id)}>
            <div className="t-cap insight__eyebrow">{insight.eyebrow}</div>
            <p className="insight__statement">{insight.statement}</p>
            <span className="insight__more">Read why</span>
          </GlassCard>
        </section>
      </Reveal>

      {/* -------------------------------------------------------- UPCOMING */}
      <Reveal delay={100}>
        <section className="pad">
          <SectionHeader title="Coming up" />
          <GlassCard className="list">
            <ListRow
              title="Plan review"
              sub={`${priority.title} · ${p.loop.nextReviewIn} days away`}
              value={p.loop.nextReviewDate}
              onClick={() => openSheet('priority', priority.id)}
            />
            <ListRow
              title={priority.retest.panelName}
              sub="Re-measure only what your plan is working on"
              value={priority.retest.dueDate.split(' ').slice(0, 2).join(' ')}
              onClick={() => openSheet('retest', priority.id)}
              last
            />
          </GlassCard>
        </section>
      </Reveal>

      {/* -------------------------------------------- CARE CIRCLE + PASSPORT */}
      <Reveal delay={110}>
        <section className="pad">
          <GlassCard className="list">
            <ListRow
              title="Care Circle"
              sub={`${p.careCircle.length} people · you control what each one sees`}
              onClick={() => openSheet('careCircle')}
              icon={
                <span className="avstack">
                  {p.careCircle.map((m) => (
                    <span key={m.id} className="av" style={{ background: m.accent }}>
                      {m.initials}
                    </span>
                  ))}
                </span>
              }
            />
            <ListRow
              title="Health Passport"
              sub={`Your health since ${p.timeline[p.timeline.length - 1].year}`}
              onClick={() => openSheet('passport')}
              last
            />
          </GlassCard>
        </section>
      </Reveal>

      {/* ---------------------------------------------------------- BOOKING */}
      <Reveal delay={120}>
        <section className="pad">
          <button type="button" className="bookcta" onClick={() => openBooking()}>
            <div>
              <div className="bookcta__t">Book a blood test</div>
              <div className="bookcta__s">Home collection across {p.user.city} · results in 48 hours</div>
            </div>
            <span className="bookcta__chev" aria-hidden="true" />
          </button>
        </section>
      </Reveal>

      <p className="footnote">
        HUMAN supports your health decisions. It does not diagnose conditions or replace your
        clinician.
      </p>
      <div className="tabspace" />
    </div>
  )
}

export { }
