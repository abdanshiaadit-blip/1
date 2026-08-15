import { useState } from 'react'
import { useApp } from '../state/app'
import {
  GlassCard,
  SectionHeader,
  Reveal,
  StateDot,
  ListRow,
  Pager,
  PageDots,
  Chip,
  STATE_LABEL,
} from '../components/primitives'
import { SystemViz, Sparkline, TrendChart } from '../components/viz'
import type { SystemId } from '../data/types'

export default function Health() {
  const { p, openSheet } = useApp()
  const [page, setPage] = useState(0)
  const [group, setGroup] = useState<SystemId | 'all'>('all')

  const systems = p.systems
  const active = systems[page]

  const markers =
    group === 'all' ? p.biomarkers : p.biomarkers.filter((b) => b.systemId === group)

  const groups: (SystemId | 'all')[] = [
    'all',
    ...Array.from(new Set(p.biomarkers.map((b) => b.systemId))),
  ]
  const groupLabel = (g: SystemId | 'all') =>
    g === 'all' ? 'All' : (systems.find((s) => s.id === g)?.name ?? g)

  return (
    <div className="scroll screen__scroll">
      <header className="pagehead">
        <h1 className="t-display">Health</h1>
        <p className="t-body">
          {p.systems.length} body systems, {p.biomarkers.length} tracked markers,{' '}
          {p.timeline.length} recorded events.
        </p>
      </header>

      {/* --------------------------------- ONE unified body-systems card */}
      <section className="pad">
        <div className="bsys">
          <div className="bsys__top">
            <div>
              <div className="t-cap">Body systems</div>
              <div className="bsys__count num">
                {page + 1} <em>/ {systems.length}</em>
              </div>
            </div>
            <Chip state={active.id === 'women' ? 'women' : active.state}>
              {STATE_LABEL[active.state]}
            </Chip>
          </div>

          <Pager count={systems.length} index={page} onIndex={setPage}>
            {systems.map((s) => (
              <article
                key={s.id}
                className={`bsys__panel ${s.id === 'women' ? 'st-women' : `st-${s.state}`}`}
              >
                <div className="bsys__name">{s.name}</div>
                <div className="bsys__metric">
                  <span className="bsys__val num">{s.metric.value}</span>
                  {s.metric.unit && <span className="bsys__unit">{s.metric.unit}</span>}
                  <span className="bsys__mlabel">{s.metric.label}</span>
                </div>
                <p className="bsys__headline">{s.headline}</p>
                <SystemViz series={s.series} state={s.state} label={s.seriesLabel} />
                <button type="button" className="bsys__open" onClick={() => openSheet('system', s.id)}>
                  Open {s.name.toLowerCase()}
                  <span className="bsys__chev" aria-hidden="true" />
                </button>
              </article>
            ))}
          </Pager>

          <PageDots count={systems.length} index={page} onIndex={setPage} />
        </div>
      </section>

      {/* ------------------------------------------ Health Intelligence trend */}
      <Reveal>
        <section className="pad">
          <SectionHeader title="Health Intelligence" action="Method" onAction={() => openSheet('intel')} />
          <GlassCard className="intelcard">
            <div className="intelcard__row">
              <div>
                <div className="intelcard__now num">{p.intel.score}</div>
                <div className="t-foot">
                  from {p.intel.baselineScore} at baseline · {p.user.memberSince}
                </div>
              </div>
              <Chip state="optimal">+{p.intel.delta}</Chip>
            </div>
            <TrendChart
              points={p.intel.history.map((h) => ({ date: h.date, value: h.score }))}
              state="optimal"
              height={132}
            />
            <div className="intelcard__events">
              {p.intel.history
                .filter((h) => h.event)
                .map((h) => (
                  <span key={h.date} className="t-foot">
                    <StateDot state="stable" size={5} /> {h.date} — {h.event}
                  </span>
                ))}
            </div>
          </GlassCard>
        </section>
      </Reveal>

      {/* --------------------------------------------------- Biomarker trends */}
      <Reveal delay={40}>
        <section className="pad">
          <SectionHeader title="Biomarkers" />
          <div className="filters">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                className={`filter ${group === g ? 'is-on' : ''}`}
                onClick={() => setGroup(g)}
              >
                {groupLabel(g)}
              </button>
            ))}
          </div>
          <GlassCard className="list">
            {markers.map((b, i) => (
              <button
                key={b.id}
                type="button"
                className={`bmrow ${i === markers.length - 1 ? 'row--last' : ''}`}
                onClick={() => openSheet('biomarker', b.id)}
              >
                <StateDot state={b.state} />
                <span className="bmrow__main">
                  <span className="bmrow__name">{b.short}</span>
                  <span className="bmrow__delta">{b.deltaLabel}</span>
                </span>
                <Sparkline data={b.history.map((h) => h.value)} state={b.state} w={54} h={22} />
                <span className={`bmrow__val num st-${b.state}`}>
                  {b.value}
                  <em>{b.unit}</em>
                </span>
                <span className="row__chev" aria-hidden="true" />
              </button>
            ))}
          </GlassCard>
        </section>
      </Reveal>

      {/* ------------------------------------------------ Outcome intelligence */}
      <Reveal delay={60}>
        <section className="pad">
          <SectionHeader
            eyebrow="Outcome intelligence"
            title="What we've learned about you"
            action="All"
            onAction={() => openSheet('learnings')}
          />
          <GlassCard className="learn" onClick={() => openSheet('learnings')}>
            <p className="learn__statement">{p.learnings[0].statement}</p>
            <p className="learn__basis">{p.learnings[0].basis}</p>
            <div className="learn__caveat">
              <span className="learn__mark" aria-hidden="true" />
              <span>{p.learnings[0].caveat}</span>
            </div>
          </GlassCard>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------ Passport */}
      <Reveal delay={80}>
        <section className="pad">
          <SectionHeader title="Health Passport" action="Open" onAction={() => openSheet('passport')} />
          <GlassCard className="ppreview" onClick={() => openSheet('passport')}>
            <div className="ppreview__years">
              {Array.from(new Set(p.timeline.map((t) => t.year)))
                .sort()
                .map((y) => (
                  <span key={y} className="ppreview__y num">
                    {y}
                  </span>
                ))}
            </div>
            <div className="ppreview__rail">
              {p.timeline
                .slice()
                .reverse()
                .map((t) => (
                  <span key={t.id} className={`ppreview__tick tick--${t.type}`} />
                ))}
            </div>
            <p className="t-body">
              {p.timeline.length} events across {new Set(p.timeline.map((t) => t.year)).size} years —
              tests, results, imaging, prescriptions, symptoms and every intervention you have tried.
            </p>
          </GlassCard>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------- Reports */}
      <Reveal delay={100}>
        <section className="pad">
          <SectionHeader title="Reports & records" />
          <GlassCard className="list">
            {p.reports.slice(0, 4).map((r, i) => (
              <ListRow
                key={r.id}
                title={r.name}
                sub={`${r.date} · ${r.lab}${r.markerCount ? ` · ${r.markerCount} markers` : ''}`}
                onClick={() => openSheet('reports')}
                last={i === 3}
              />
            ))}
          </GlassCard>
        </section>
      </Reveal>

      <p className="footnote">
        Reference ranges are laboratory ranges for an Indian adult population. Individual results
        should be interpreted with your clinician.
      </p>
      <div className="tabspace" />
    </div>
  )
}
