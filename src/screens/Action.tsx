import { useApp } from '../state/app'
import {
  GlassCard,
  SectionHeader,
  Reveal,
  Chip,
  StateDot,
  ListRow,
  STATE_LABEL,
} from '../components/primitives'
import { AdherenceGrid, ProgressRing } from '../components/viz'

export default function Action() {
  const { p, openSheet, openBooking, done, toggleAction } = useApp()

  const priority = p.priorities[0]
  const active = p.experiments.find((e) => !e.readout) ?? p.experiments[0]
  const past = p.experiments.filter((e) => e.readout)
  const nextUp = p.priorities.filter((x) => x.suppressedReason)

  const doneCount = p.actions.filter((a) => (done[a.id] ?? a.doneToday)).length
  const adherenceDone = active.adherence.filter((d) => d === true).length
  const adherenceElapsed = active.adherence.filter((d) => d !== null).length

  return (
    <div className="scroll screen__scroll">
      <header className="pagehead">
        <h1 className="t-display">Action</h1>
        <p className="t-body">
          One priority at a time. {doneCount} of {p.actions.length} done today.
        </p>
      </header>

      {/* -------------------------------------------------------------- TODAY */}
      <section className="pad">
        <SectionHeader title="Today" />
        <div className="acts">
          {p.actions.map((a, i) => {
            const isDone = done[a.id] ?? a.doneToday
            return (
              <Reveal key={a.id} delay={i * 40}>
                <GlassCard className={`act ${isDone ? 'is-done' : ''}`} tone={isDone ? 'optimal' : undefined}>
                  <button
                    type="button"
                    className={`act__check ${isDone ? 'is-on' : ''}`}
                    onClick={() => toggleAction(a.id)}
                    aria-label={isDone ? `Mark ${a.title} not done` : `Mark ${a.title} done`}
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="act__main">
                    <div className="act__top">
                      <span className="act__title">{a.title}</span>
                      <span className="act__time">{a.time}</span>
                    </div>
                    <p className="act__why">{a.why}</p>
                    <div className="act__foot">
                      <div className="act__bar">
                        <span style={{ width: `${(a.progress.done / a.progress.total) * 100}%` }} />
                      </div>
                      <span className="t-foot num">
                        {a.progress.done}/{a.progress.total}
                      </span>
                      {a.streak > 0 && <span className="act__streak num">{a.streak}-day streak</span>}
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* --------------------------------------------------- CURRENT PRIORITY */}
      <Reveal delay={40}>
        <section className="pad">
          <SectionHeader eyebrow="Health Decision Engine" title="Your priority" />
          <GlassCard className="pcard" tone={priority.state} onClick={() => openSheet('priority', priority.id)}>
            <div className="pcard__head">
              <Chip state={priority.state}>{STATE_LABEL[priority.state]}</Chip>
              <span className="t-foot num">Review {priority.reviewDate.split(' ').slice(0, 2).join(' ')}</span>
            </div>
            <h3 className="pcard__title">{priority.title}</h3>
            <p className="pcard__why">{priority.whyShort}</p>

            <div className="pcard__signals">
              {priority.trackedSignals.slice(0, 3).map((s) => (
                <div key={s.label} className="psig">
                  <StateDot state={s.state} size={6} />
                  <span className="psig__l">{s.label}</span>
                  <span className="psig__v num">{s.value}</span>
                </div>
              ))}
            </div>

            <span className="pcard__more">Why this, and what we're tracking</span>
          </GlassCard>
        </section>
      </Reveal>

      {/* ------------------------------------------------- ACTIVE EXPERIMENT */}
      <Reveal delay={60}>
        <section className="pad">
          <SectionHeader eyebrow="Personal health experiment" title="Running now" />
          <GlassCard className="exp" onClick={() => openSheet('experiment', active.id)}>
            <div className="exp__head">
              <div>
                <h3 className="exp__title">{active.title}</h3>
                <p className="exp__q">{active.question}</p>
              </div>
              <ProgressRing
                value={active.weekNow}
                total={active.weeks}
                size={54}
                state="stable"
                label={`W${active.weekNow}`}
              />
            </div>

            <div className="exp__adh">
              <div className="exp__adhtop">
                <span className="t-cap">Adherence</span>
                <span className="t-foot num">
                  {adherenceDone} of {adherenceElapsed} days · {active.weeks * 7 - adherenceElapsed} to go
                </span>
              </div>
              <AdherenceGrid days={active.adherence} weeks={active.weeks} />
            </div>

            <div className="exp__signals">
              {active.trackedSignals.map((s) => (
                <div key={s.label} className={`esig st-${s.state}`}>
                  <span className="esig__l">{s.label}</span>
                  <span className="esig__v">
                    <em>{s.baseline}</em>
                    <svg width="13" height="9" viewBox="0 0 13 9" aria-hidden="true">
                      <path
                        d="M1 4.5h10M8 1.5l3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <strong>{s.now}</strong>
                  </span>
                </div>
              ))}
            </div>

            <span className="pcard__more">Open protocol</span>
          </GlassCard>
        </section>
      </Reveal>

      {/* -------------------------------------------------------- RE-MEASURE */}
      <Reveal delay={80}>
        <section className="pad">
          <SectionHeader title="Re-measure" />
          <GlassCard className="retest">
            <div className="retest__head">
              <div>
                <div className="t-cap">Recommended</div>
                <h3 className="retest__title">{priority.retest.panelName}</h3>
              </div>
              <span className="retest__date num">{priority.retest.dueDate}</span>
            </div>
            <p className="retest__why">{priority.retest.rationale}</p>
            <div className="retest__actions">
              <button
                type="button"
                className="retest__cta"
                onClick={() => openSheet('retest', priority.id)}
              >
                Why this timing
              </button>
              <button
                type="button"
                className="retest__cta retest__cta--go"
                onClick={() => openBooking(priority.retest.panelId)}
              >
                Book retest
              </button>
            </div>
          </GlassCard>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------ NEXT UP */}
      <Reveal delay={100}>
        <section className="pad">
          <SectionHeader
            title="Not now"
            action="Why"
            onAction={() => openSheet('nextup')}
          />
          <GlassCard className="list">
            {nextUp.map((x, i) => (
              <ListRow
                key={x.id}
                title={x.title}
                sub={x.whyShort}
                state={x.state}
                onClick={() => openSheet('priority', x.id)}
                last={i === nextUp.length - 1}
              />
            ))}
          </GlassCard>
          <p className="hint">
            HUMAN found {p.priorities.length} things worth acting on and is deliberately showing you
            one. Running several plans at once reliably produces worse adherence than running one.
          </p>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------ HISTORY */}
      {past.length > 0 && (
        <Reveal delay={120}>
          <section className="pad">
            <SectionHeader title="Completed" action="History" onAction={() => openSheet('history')} />
            <GlassCard className="list">
              {past.map((e, i) => (
                <ListRow
                  key={e.id}
                  title={e.title}
                  sub={`${e.weeks} weeks · ended ${e.endDate}`}
                  value={<span className="t-foot">Readout</span>}
                  onClick={() => openSheet('readout', e.id)}
                  last={i === past.length - 1}
                />
              ))}
            </GlassCard>
          </section>
        </Reveal>
      )}

      <p className="footnote">
        Experiments are structured observations of your own data. They are not clinical trials and
        cannot establish cause.
      </p>
      <div className="tabspace" />
    </div>
  )
}
