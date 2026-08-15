import { useApp, useLookups, type SheetRef } from '../state/app'
import {
  Sheet,
  GlassCard,
  Chip,
  StateDot,
  ListRow,
  SafetyNote,
  Button,
  Divider,
  STATE_LABEL,
} from './primitives'
import {
  TrendChart,
  RangeBar,
  AdherenceGrid,
  SystemViz,
  CycleArc,
  ConnectionChart,
  CYCLE_PHASES,
  ProgressRing,
} from './viz'
import { LOOP_STAGES } from '../data/types'
import { panels } from '../data/panels'

export default function SheetHost() {
  const { sheets } = useApp()
  return (
    <>
      {sheets.map((s, i) => (
        <SheetRouter key={`${s.kind}-${s.id ?? ''}-${i}`} sheet={s} depth={i} />
      ))}
    </>
  )
}

function SheetRouter({ sheet, depth }: { sheet: SheetRef; depth: number }) {
  const { closeSheet } = useApp()
  const props = { onClose: closeSheet, depth }
  switch (sheet.kind) {
    case 'intel': return <IntelSheet {...props} />
    case 'loop': return <LoopSheet {...props} />
    case 'priority': return <PrioritySheet id={sheet.id!} {...props} />
    case 'nextup': return <NextUpSheet {...props} />
    case 'system': return <SystemSheet id={sheet.id!} {...props} />
    case 'biomarker': return <BiomarkerSheet id={sheet.id!} {...props} />
    case 'experiment': return <ExperimentSheet id={sheet.id!} {...props} />
    case 'readout': return <ReadoutSheet id={sheet.id!} {...props} />
    case 'insight': return <InsightSheet id={sheet.id!} {...props} />
    case 'womens': return <WomensSheet {...props} />
    case 'passport': return <PassportSheet {...props} />
    case 'learnings': return <LearningsSheet {...props} />
    case 'careCircle': return <CareCircleSheet {...props} />
    case 'careMember': return <CareMemberSheet id={sheet.id!} {...props} />
    case 'membership': return <MembershipSheet {...props} />
    case 'reports': return <ReportsSheet {...props} />
    case 'retest': return <RetestSheet id={sheet.id!} {...props} />
    case 'devices': return <DevicesSheet {...props} />
    case 'privacy': return <PrivacySheet {...props} />
    case 'history': return <HistorySheet {...props} />
    case 'goals': return <GoalsSheet {...props} />
    case 'medical': return <MedicalSheet {...props} />
    default: return null
  }
}

type SP = { onClose: () => void; depth: number }

/* Cycle-chart geometry. Shared by the bars and the 35-day reference line so
   the two cannot drift apart. Mirrors .wcyc__track / .wcyc label heights. */
const CYCLE_TRACK_H = 104
const CYCLE_LABELS_H = 36
const CYCLE_MAX = 50

/* ================================================== Health Intelligence */

function IntelSheet({ onClose, depth }: SP) {
  const { p } = useApp()
  return (
    <Sheet title="Health Intelligence" eyebrow="How this number works" onClose={onClose} depth={depth}>
      <div className="sh">
        <div className="sh__big num">
          {p.intel.score}
          <span className="sh__bigsub">from {p.intel.baselineScore} at baseline</span>
        </div>

        <p className="t-body">{p.intel.methodNote}</p>

        <h3 className="sh__h">What is contributing right now</h3>
        <GlassCard className="list">
          {p.intel.contributions.map((c, i) => {
            const sys = p.systems.find((s) => s.id === c.systemId)
            return (
              <div key={c.systemId} className={`contrib ${i === p.intel.contributions.length - 1 ? 'row--last' : ''}`}>
                <StateDot state={c.systemId === 'women' ? 'women' : c.state} />
                <span className="contrib__name">{sys?.name ?? c.systemId}</span>
                <span className="contrib__bar">
                  <span className={`st-${c.state}`} style={{ width: `${c.weight * 3.6}%` }} />
                </span>
                <span className="contrib__w num">{c.weight}%</span>
              </div>
            )
          })}
        </GlassCard>

        <p className="t-foot">
          Weights shift as your health changes. A system you have addressed carries less influence;
          one that needs attention carries more. That is why the number can move without any single
          marker changing dramatically.
        </p>

        <SafetyNote>
          This score is a HUMAN construct built for this prototype. It is not a validated clinical
          instrument, it is not diagnostic, and it should not be compared between people. Use it to
          watch your own direction of travel.
        </SafetyNote>
      </div>
    </Sheet>
  )
}

/* ========================================================= Loop explainer */

const LOOP_COPY: Record<string, string> = {
  MEASURE: 'A blood assessment establishes what is actually happening, rather than what you assume.',
  UNDERSTAND: 'HUMAN interprets the results across every body system and puts them next to your history.',
  PRIORITIZE: 'The Decision Engine picks the single thing most worth your attention — and holds the rest back.',
  ACT: 'You get one plan: a daily action and a structured experiment with a defined end date.',
  'RE-MEASURE': 'We retest only the markers your plan targets, at the interval where a new value actually means something.',
  LEARN: 'We compare what changed against what you did, and state it as an observation — never as proof.',
  ADAPT: 'Continue, modify, or promote the next priority. The loop begins again with more context than before.',
}

function LoopSheet({ onClose, depth }: SP) {
  const { p } = useApp()
  const idx = LOOP_STAGES.indexOf(p.loop.stage)
  return (
    <Sheet title="The Health Action Loop" eyebrow={`Cycle ${p.loop.cycleNumber}`} onClose={onClose} depth={depth}>
      <div className="sh">
        <p className="t-body">
          Most healthcare stops at measurement. HUMAN is built around what happens next — a
          continuous loop that gets more useful every time it runs.
        </p>

        <div className="loopfull">
          {LOOP_STAGES.map((s, i) => (
            <div key={s} className={`lstage ${i === idx ? 'is-now' : ''} ${i < idx ? 'is-past' : ''}`}>
              <div className="lstage__rail">
                <span className="lstage__dot" />
                {i < LOOP_STAGES.length - 1 && <span className="lstage__line" />}
              </div>
              <div className="lstage__body">
                <div className="lstage__name">
                  {s}
                  {i === idx && <Chip state="stable">You are here</Chip>}
                </div>
                <p className="lstage__copy">{LOOP_COPY[s]}</p>
              </div>
            </div>
          ))}
        </div>

        <GlassCard className="sh__box">
          <div className="t-cap">This cycle</div>
          <p className="t-body">
            You are in <strong>{p.loop.stage}</strong>, since {p.loop.stageSince}. Your review is on{' '}
            {p.loop.nextReviewDate}, {p.loop.nextReviewIn} days away. After that we re-measure, compare,
            and decide whether to continue, change, or move to your next priority.
          </p>
        </GlassCard>
      </div>
    </Sheet>
  )
}

/* ============================================================== Priority */

function PrioritySheet({ id, onClose, depth }: SP & { id: string }) {
  const { p, openSheet } = useApp()
  const L = useLookups()
  const x = L.priority(id)
  if (!x) return null
  const actions = x.actionIds.map((a) => L.action(a)).filter(Boolean)

  return (
    <Sheet title={x.title} eyebrow={x.rank === 1 ? 'Your priority' : `Priority ${x.rank} · not now`} onClose={onClose} depth={depth}>
      <div className="sh">
        <Chip state={x.state}>{STATE_LABEL[x.state]}</Chip>

        <h3 className="sh__h">Why this matters</h3>
        <p className="t-body">{x.whyDetail}</p>

        {x.suppressedReason && (
          <GlassCard className="sh__box sh__box--muted">
            <div className="t-cap">Why HUMAN is holding this back</div>
            <p className="t-body">{x.suppressedReason}</p>
          </GlassCard>
        )}

        <h3 className="sh__h">The evidence</h3>
        <GlassCard className="list">
          {x.evidenceMarkerIds.map((mid, i) => {
            const m = L.marker(mid)
            if (!m) return null
            return (
              <ListRow
                key={mid}
                title={m.name}
                sub={m.deltaLabel}
                value={
                  <span className={`num st-${m.state}`}>
                    {m.value}
                    <em>{m.unit}</em>
                  </span>
                }
                state={m.state}
                onClick={() => openSheet('biomarker', mid)}
                last={i === x.evidenceMarkerIds.length - 1}
              />
            )
          })}
        </GlassCard>

        {actions.length > 0 && (
          <>
            <h3 className="sh__h">What to do</h3>
            <GlassCard className="list">
              {actions.map((a, i) => (
                <ListRow key={a!.id} title={a!.title} sub={a!.why} value={a!.target} last={i === actions.length - 1} />
              ))}
            </GlassCard>
          </>
        )}

        <h3 className="sh__h">What we're tracking</h3>
        <GlassCard className="list">
          {x.trackedSignals.map((s, i) => (
            <ListRow key={s.label} title={s.label} value={s.value} state={s.state} last={i === x.trackedSignals.length - 1} />
          ))}
        </GlassCard>

        <h3 className="sh__h">When we check again</h3>
        <GlassCard className="sh__box">
          <div className="kv">
            <span>Plan review</span>
            <strong>{x.reviewDate}</strong>
          </div>
          <div className="kv">
            <span>Re-measure</span>
            <strong>{x.retest.dueDate}</strong>
          </div>
          <Divider />
          <p className="t-foot">{x.retest.rationale}</p>
        </GlassCard>

        {x.clinicianNote && <SafetyNote>{x.clinicianNote}</SafetyNote>}

        {x.rank === 1 && (
          <Button full onClick={() => { onClose(); openSheet('retest', x.id) }}>
            Plan the re-measure
          </Button>
        )}
        <p className="t-foot">
          {p.user.firstName}, this is one priority out of {p.priorities.length} HUMAN identified.
          The others are deliberately queued.
        </p>
      </div>
    </Sheet>
  )
}

/* ========================================== Decision Engine — what's held back */

function NextUpSheet({ onClose, depth }: SP) {
  const { p, openSheet } = useApp()
  return (
    <Sheet title="What HUMAN is not showing you" eyebrow="Health Decision Engine" onClose={onClose} depth={depth}>
      <div className="sh">
        <p className="t-body">
          Your last panel produced {p.biomarkers.length} tracked markers and {p.priorities.length}{' '}
          findings worth acting on. Showing you all of them would be honest and useless. The Decision
          Engine ranks them and surfaces one.
        </p>

        <div className="rank">
          {p.priorities.map((x) => (
            <button
              key={x.id}
              type="button"
              className={`rankrow ${x.rank === 1 ? 'is-live' : ''}`}
              onClick={() => openSheet('priority', x.id)}
            >
              <span className="rankrow__n num">{x.rank}</span>
              <span className="rankrow__main">
                <span className="rankrow__t">{x.title}</span>
                <span className="rankrow__s">{x.rank === 1 ? 'Active now' : x.suppressedReason}</span>
              </span>
              <StateDot state={x.state} />
            </button>
          ))}
        </div>

        <GlassCard className="sh__box">
          <div className="t-cap">The principle</div>
          <p className="t-body">
            Attention is the scarcest resource in preventive health, not information. Running one
            plan properly beats running four badly — so HUMAN holds the rest until this one has been
            reviewed and re-measured.
          </p>
        </GlassCard>
      </div>
    </Sheet>
  )
}

/* ================================================================ System */

function SystemSheet({ id, onClose, depth }: SP & { id: string }) {
  const { openSheet } = useApp()
  const L = useLookups()
  const s = L.system(id)
  if (!s) return null
  const markers = s.markerIds.map((m) => L.marker(m)).filter(Boolean)

  return (
    <Sheet title={s.name} eyebrow="Body system" onClose={onClose} depth={depth}>
      <div className={`sh ${s.id === 'women' ? 'st-women' : `st-${s.state}`}`}>
        <div className="sysline">
          <Chip state={s.id === 'women' ? 'women' : s.state}>{STATE_LABEL[s.state]}</Chip>
          <span className="sysline__score num">{s.score}<em>/100</em></span>
        </div>

        <h3 className="sh__hlead">{s.headline}</h3>
        <p className="t-body">{s.summary}</p>

        <SystemViz series={s.series} state={s.state} label={s.seriesLabel} />

        {markers.length > 0 && (
          <>
            <h3 className="sh__h">Markers in this system</h3>
            <GlassCard className="list">
              {markers.map((m, i) => (
                <ListRow
                  key={m!.id}
                  title={m!.name}
                  sub={m!.deltaLabel}
                  value={
                    <span className={`num st-${m!.state}`}>
                      {m!.value}
                      <em>{m!.unit}</em>
                    </span>
                  }
                  state={m!.state}
                  onClick={() => openSheet('biomarker', m!.id)}
                  last={i === markers.length - 1}
                />
              ))}
            </GlassCard>
          </>
        )}

        {s.id === 'women' && (
          <Button full variant="secondary" onClick={() => openSheet('womens')}>
            Open Women's Health
          </Button>
        )}
      </div>
    </Sheet>
  )
}

/* ============================================================= Biomarker */

function BiomarkerSheet({ id, onClose, depth }: SP & { id: string }) {
  const { openSheet } = useApp()
  const L = useLookups()
  const b = L.marker(id)
  if (!b) return null

  return (
    <Sheet title={b.name} eyebrow={L.system(b.systemId)?.name} onClose={onClose} depth={depth}>
      <div className={`sh st-${b.state}`}>
        <div className="bhead">
          <div className="bhead__val num">
            {b.value}
            <em>{b.unit}</em>
          </div>
          <div className="bhead__side">
            <Chip state={b.state}>{STATE_LABEL[b.state]}</Chip>
            <span className="t-foot">{b.deltaLabel}</span>
          </div>
        </div>

        <RangeBar value={b.value} range={b.range} unit={b.unit} state={b.state} />

        <h3 className="sh__h">Your trend</h3>
        <TrendChart
          points={b.history}
          state={b.state}
          band={{ low: b.range.optLow, high: b.range.optHigh }}
        />

        <h3 className="sh__h">What it means</h3>
        <p className="t-body">{b.meaning}</p>

        {b.indiaContext && (
          <GlassCard className="sh__box sh__box--india">
            <div className="t-cap">In the Indian context</div>
            <p className="t-body">{b.indiaContext}</p>
          </GlassCard>
        )}

        <h3 className="sh__h">What influences this</h3>
        <ul className="bullets">
          {b.influences.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        {b.relatedPriorityId && (
          <Button full variant="secondary" onClick={() => openSheet('priority', b.relatedPriorityId!)}>
            This feeds your current priority
          </Button>
        )}

        {b.clinicianNote && <SafetyNote>{b.clinicianNote}</SafetyNote>}
      </div>
    </Sheet>
  )
}

/* ============================================================ Experiment */

function ExperimentSheet({ id, onClose, depth }: SP & { id: string }) {
  const L = useLookups()
  const e = L.experiment(id)
  if (!e) return null
  const doneN = e.adherence.filter((d) => d === true).length
  const elapsed = e.adherence.filter((d) => d !== null).length

  return (
    <Sheet title={e.title} eyebrow="Personal health experiment" onClose={onClose} depth={depth}>
      <div className="sh">
        <GlassCard className="sh__box">
          <div className="t-cap">The question</div>
          <p className="t-body">{e.question}</p>
        </GlassCard>

        <div className="expmeta">
          <div>
            <div className="t-cap">Started</div>
            <strong>{e.startDate}</strong>
          </div>
          <div>
            <div className="t-cap">Ends</div>
            <strong>{e.endDate}</strong>
          </div>
          <ProgressRing value={e.weekNow} total={e.weeks} size={50} state="stable" label={`W${e.weekNow}`} />
        </div>

        <h3 className="sh__h">The protocol</h3>
        <div className="proto">
          {e.protocol.map((s, i) => (
            <div key={s.title} className="proto__i">
              <span className="proto__n num">{i + 1}</span>
              <div>
                <div className="proto__t">{s.title}</div>
                <p className="proto__d">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="sh__h">Adherence</h3>
        <GlassCard className="sh__box">
          <div className="kv">
            <span>Completed</span>
            <strong className="num">
              {doneN} of {elapsed} days elapsed
            </strong>
          </div>
          <AdherenceGrid days={e.adherence} weeks={e.weeks} />
          <p className="t-foot">
            Adherence is recorded because it changes how we read the result. A marker that does not
            move after 60% adherence tells us something different from one that does not move after
            95%.
          </p>
        </GlassCard>

        <h3 className="sh__h">What we're tracking</h3>
        <GlassCard className="list">
          {e.trackedSignals.map((s, i) => (
            <ListRow
              key={s.label}
              title={s.label}
              sub={`from ${s.baseline}`}
              value={<span className="num">{s.now}</span>}
              state={s.state}
              last={i === e.trackedSignals.length - 1}
            />
          ))}
        </GlassCard>

        <SafetyNote>
          This is a structured observation of your own data over a fixed window — not a controlled
          trial. It can show what moved together. It cannot establish what caused what.
        </SafetyNote>
      </div>
    </Sheet>
  )
}

/* =============================================================== Readout */

function ReadoutSheet({ id, onClose, depth }: SP & { id: string }) {
  const L = useLookups()
  const e = L.experiment(id)
  if (!e?.readout) return null
  const r = e.readout

  return (
    <Sheet title="Readout" eyebrow={e.title} onClose={onClose} depth={depth}>
      <div className="sh">
        <div className="t-cap">The question we asked</div>
        <p className="t-body">{e.question}</p>

        <h3 className="sh__h">What we observed</h3>
        <div className="obs">
          {r.observed.map((o) => (
            <div key={o} className="obs__i">
              <span className="obs__dot" />
              <span>{o}</span>
            </div>
          ))}
        </div>

        <GlassCard className="sh__box sh__box--caveat">
          <div className="t-cap">What this does not tell us</div>
          <p className="t-body">{r.caveat}</p>
        </GlassCard>

        <h3 className="sh__h">The decision</h3>
        <p className="t-body">{r.decision}</p>

        <h3 className="sh__h">Signals at the end</h3>
        <GlassCard className="list">
          {e.trackedSignals.map((s, i) => (
            <ListRow
              key={s.label}
              title={s.label}
              sub={`from ${s.baseline}`}
              value={<span className="num">{s.now}</span>}
              state={s.state}
              last={i === e.trackedSignals.length - 1}
            />
          ))}
        </GlassCard>
      </div>
    </Sheet>
  )
}

/* =============================================================== Insight */

function InsightSheet({ id, onClose, depth }: SP & { id: string }) {
  const L = useLookups()
  const i = L.insight(id)
  if (!i) return null
  return (
    <Sheet title={i.eyebrow} eyebrow="Insight" onClose={onClose} depth={depth}>
      <div className="sh">
        <h3 className="sh__hlead">{i.statement}</h3>
        <p className="t-body">{i.detail}</p>
      </div>
    </Sheet>
  )
}

/* ======================================================== Women's Health */

function WomensSheet({ onClose, depth }: SP) {
  const { p, openSheet } = useApp()
  const L = useLookups()
  const w = p.womens
  if (!w) return null

  return (
    <Sheet title="Women's Health" eyebrow="Longitudinal view" onClose={onClose} depth={depth}>
      <div className="sh st-women">
        {/* ---- Cycle hero ------------------------------------------------ */}
        <div className="whero">
          <div className="whero__top">
            <CycleArc day={w.cycleDay} length={w.cycleLength} />
            <div className="whero__side">
              <div className="t-cap">Current phase</div>
              <div className="whero__phase">{w.phase}</div>
              <div className="whero__kv">
                <span>Last period</span>
                <strong>{w.lastPeriod}</strong>
              </div>
              <div className="whero__kv">
                <span>Next expected</span>
                <strong>{w.nextPredicted}</strong>
              </div>
              <Chip state="attention">{w.variability}</Chip>
            </div>
          </div>
          <div className="wphases">
            {CYCLE_PHASES.map((ph) => (
              <span key={ph.id} className={`wphase ${w.phase === ph.id ? 'is-now' : ''}`}>
                <i style={{ background: ph.color }} />
                {ph.name}
              </span>
            ))}
          </div>
        </div>

        <h3 className="sh__h">Your cycles</h3>
        <GlassCard className="wchart">
          <div className="wchart__plot">
            {/* Clinical reference the copy below refers to, drawn rather than described. */}
            <div className="wchart__ref" style={{ bottom: `${CYCLE_LABELS_H + (35 / CYCLE_MAX) * CYCLE_TRACK_H}px` }}>
              <span>35 days</span>
            </div>
            <div className="wcycles">
              {w.recentCycles.map((c) => (
                <div key={c.month} className={`wcyc st-${c.state}`}>
                  {/* Fixed-height track so the bar's percentage encodes cycle
                      length instead of being flex-shrunk to a uniform height. */}
                  <span className="wcyc__track">
                    <span className="wcyc__bar" style={{ height: `${(c.length / CYCLE_MAX) * 100}%` }} />
                  </span>
                  <span className="wcyc__n num">{c.length}</span>
                  <span className="t-cap">{c.month}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="t-foot">
            Six months of cycle length. A cycle consistently longer than 35 days is worth discussing
            with a gynaecologist.
          </p>
        </GlassCard>

        <h3 className="sh__h">Connections over time</h3>
        <p className="t-body">
          This is what a longitudinal record makes visible. Each of these is an observation across
          multiple measurements of your own data — not a diagnosis, and not a claim about cause.
        </p>
        <div className="conns">
          {w.insights.map((ins) => (
            <GlassCard key={ins.id} className="conn">
              <p className="conn__s">{ins.statement}</p>
              {ins.pair && <ConnectionChart pair={ins.pair} />}
              <div className="conn__markers">
                {ins.linkedMarkerIds.map((m) => {
                  const mk = L.marker(m)
                  return mk ? (
                    <button key={m} type="button" className="conn__m" onClick={() => openSheet('biomarker', m)}>
                      <StateDot state={mk.state} size={5} />
                      {mk.short}
                    </button>
                  ) : null
                })}
              </div>
              <div className="conn__caveat">{ins.caveat}</div>
            </GlassCard>
          ))}
        </div>

        <h3 className="sh__h">Symptoms you've logged</h3>
        <GlassCard className="list">
          {w.symptoms.map((s, i) => (
            <ListRow key={s.label} title={s.label} sub={s.frequency} state={s.state} last={i === w.symptoms.length - 1} />
          ))}
        </GlassCard>

        <h3 className="sh__h">Life stage</h3>
        <GlassCard className="sh__box">
          <p className="t-body">
            HUMAN follows women's health across the whole arc — cycles, PCOS patterns, fertility,
            pregnancy, postpartum, perimenopause and menopause — and connects each stage to iron,
            thyroid, metabolic, bone and cardiovascular health rather than treating it separately.
            You are in the <strong>{w.lifeStage.toLowerCase()}</strong>.
          </p>
        </GlassCard>

        <SafetyNote>
          HUMAN identifies patterns and organises information. It does not diagnose PCOS, thyroid
          disease, endometriosis or any other condition. The patterns above are worth reviewing with
          a gynaecologist or endocrinologist, and HUMAN can prepare a summary for that appointment.
        </SafetyNote>
      </div>
    </Sheet>
  )
}

/* ============================================================== Passport */

const TYPE_LABEL: Record<string, string> = {
  test: 'Test',
  result: 'Result',
  diagnosis: 'Diagnosis',
  prescription: 'Prescription',
  imaging: 'Imaging',
  symptom: 'Symptom',
  intervention: 'Intervention',
  milestone: 'Milestone',
  note: 'Record',
}

function PassportSheet({ onClose, depth }: SP) {
  const { p } = useApp()
  const years = Array.from(new Set(p.timeline.map((t) => t.year))).sort((a, b) => b - a)

  return (
    <Sheet title="Health Passport" eyebrow="Your longitudinal record" onClose={onClose} depth={depth}>
      <div className="sh">
        <p className="t-body">
          Everything HUMAN knows about your health, in order. Tests, results, imaging,
          prescriptions, symptoms, and every intervention you have tried — including the ones that
          did not work.
        </p>

        {years.map((y) => (
          <div key={y} className="pyear">
            <div className="pyear__label num">{y}</div>
            {p.timeline
              .filter((t) => t.year === y)
              .map((t) => (
                <div key={t.id} className={`tev tev--${t.type}`}>
                  <div className="tev__rail">
                    <span className="tev__dot" />
                    <span className="tev__line" />
                  </div>
                  <div className="tev__body">
                    <div className="tev__top">
                      <span className="tev__type">{TYPE_LABEL[t.type]}</span>
                      <span className="tev__date num">{t.date}</span>
                    </div>
                    <div className="tev__title">{t.title}</div>
                    <p className="tev__sum">{t.summary}</p>
                  </div>
                </div>
              ))}
          </div>
        ))}

        <GlassCard className="sh__box">
          <div className="t-cap">Roadmap</div>
          <p className="t-body">
            With your consent, the Passport is designed to be shareable with a clinician as a
            one-page summary — and to connect to ABHA, India's national health ID, so records from
            outside HUMAN flow in automatically.
          </p>
        </GlassCard>
      </div>
    </Sheet>
  )
}

/* ============================================================= Learnings */

function LearningsSheet({ onClose, depth }: SP) {
  const { p } = useApp()
  return (
    <Sheet title="What we've learned" eyebrow="Outcome intelligence" onClose={onClose} depth={depth}>
      <div className="sh">
        <p className="t-body">
          As your record grows, HUMAN can see patterns across your own history — which
          interventions you sustain, and what moves alongside them.
        </p>
        {p.learnings.map((l) => (
          <GlassCard key={l.id} className="learn">
            <p className="learn__statement">{l.statement}</p>
            <p className="learn__basis">{l.basis}</p>
            <div className="learn__caveat">
              <span className="learn__mark" aria-hidden="true" />
              <span>{l.caveat}</span>
            </div>
          </GlassCard>
        ))}
        <SafetyNote>
          Every statement here is an observation about one person's data over a small number of
          points. Observational data does not establish cause. As HUMAN grows, this layer will
          require consent, data governance, statistical validation, clinical oversight and bias
          monitoring before it can support any stronger claim.
        </SafetyNote>
      </div>
    </Sheet>
  )
}

/* =========================================================== Care Circle */

function CareCircleSheet({ onClose, depth }: SP) {
  const { p, openSheet } = useApp()
  return (
    <Sheet title="Care Circle" eyebrow="Shared care, individual privacy" onClose={onClose} depth={depth}>
      <div className="sh">
        <p className="t-body">
          Health is rarely managed alone. Invite the people who help you manage yours — and control
          exactly what each of them can see.
        </p>

        {p.careCircle.map((m) => (
          <GlassCard key={m.id} className="cmem" onClick={() => openSheet('careMember', m.id)}>
            <span className="av av--lg" style={{ background: m.accent }}>
              {m.initials}
            </span>
            <div className="cmem__main">
              <div className="cmem__name">{m.name}</div>
              <div className="t-foot">{m.relation} · {m.lastActive}</div>
              <div className="cmem__tags">
                <Chip state="optimal">{m.shares.length} shared</Chip>
                <Chip>{m.locked.length} private</Chip>
              </div>
            </div>
          </GlassCard>
        ))}

        <Button full variant="secondary">Invite someone</Button>

        <GlassCard className="sh__box sh__box--caveat">
          <div className="t-cap">Always private by default</div>
          <p className="t-body">
            Women's and reproductive health, sexual health, mental health and full medical records
            are never shared unless you explicitly unlock them for a specific person. There is no
            all-access setting.
          </p>
        </GlassCard>
      </div>
    </Sheet>
  )
}

function CareMemberSheet({ id, onClose, depth }: SP & { id: string }) {
  const L = useLookups()
  const m = L.member(id)
  if (!m) return null
  return (
    <Sheet title={m.name} eyebrow={m.relation} onClose={onClose} depth={depth}>
      <div className="sh">
        <h3 className="sh__h">{m.name.split(' ')[0]} can see</h3>
        <GlassCard className="list">
          {m.shares.map((s, i) => (
            <div key={s} className={`share ${i === m.shares.length - 1 ? 'row--last' : ''}`}>
              <span className="share__on" aria-hidden="true" />
              <span>{s}</span>
              <span className="toggle is-on" aria-hidden="true"><span /></span>
            </div>
          ))}
        </GlassCard>

        <h3 className="sh__h">Private to you</h3>
        <GlassCard className="list">
          {m.locked.map((s, i) => (
            <div key={s} className={`share share--off ${i === m.locked.length - 1 ? 'row--last' : ''}`}>
              <span className="share__lock" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 018 0v3" />
                </svg>
              </span>
              <span>{s}</span>
              <span className="toggle" aria-hidden="true"><span /></span>
            </div>
          ))}
        </GlassCard>

        <SafetyNote>
          Care Circle is a relationship layer, not a social feed. Nothing is broadcast, there is no
          activity stream, and access can be withdrawn instantly.
        </SafetyNote>
      </div>
    </Sheet>
  )
}

/* ============================================================ Membership */

function MembershipSheet({ onClose, depth }: SP) {
  const { p } = useApp()
  return (
    <Sheet title="Membership" eyebrow={`HUMAN ${p.user.membership}`} onClose={onClose} depth={depth}>
      <div className="sh">
        <GlassCard className="plan plan--live">
          <div className="plan__top">
            <div>
              <div className="t-cap">Current plan</div>
              <div className="plan__name">HUMAN Annual</div>
            </div>
            <div className="plan__price num">₹9,999<em>/year</em></div>
          </div>
          <ul className="plan__list">
            <li>Continuous Health Action Loop — priorities, plans, reviews</li>
            <li>Health Decision Engine and personal experiments</li>
            <li>Health Passport and longitudinal record</li>
            <li>Care Circle for up to 4 people</li>
            <li>Member pricing on all assessments</li>
          </ul>
        </GlassCard>

        <h3 className="sh__h">Other plans</h3>
        <GlassCard className="list">
          <ListRow title="Monthly" sub="Same membership, billed monthly" value="₹999/mo" />
          <ListRow title="Family" sub="Up to 4 members, shared Care Circle" value="₹19,999/yr" />
          <ListRow title="Corporate" sub="Employer-funded, per employee" value="₹3,000–6,000" last />
        </GlassCard>

        <GlassCard className="sh__box">
          <div className="t-cap">How HUMAN works as a business</div>
          <p className="t-body">
            The test gives us the baseline. The membership owns the relationship. The Health Action
            Loop creates ongoing value, and the longitudinal record makes each year more useful than
            the last.
          </p>
        </GlassCard>

        <p className="t-foot">
          Prices shown are planning assumptions for this prototype, not confirmed commercial terms.
        </p>
      </div>
    </Sheet>
  )
}

/* ================================================================ Retest */

function RetestSheet({ id, onClose, depth }: SP & { id: string }) {
  const { openBooking } = useApp()
  const L = useLookups()
  const x = L.priority(id)
  if (!x) return null
  const panel = panels.find((pp) => pp.id === x.retest.panelId)

  return (
    <Sheet title="Re-measure" eyebrow={x.title} onClose={onClose} depth={depth}>
      <div className="sh">
        <GlassCard className="sh__box">
          <div className="kv">
            <span>Panel</span>
            <strong>{x.retest.panelName}</strong>
          </div>
          <div className="kv">
            <span>Due</span>
            <strong>{x.retest.dueDate}</strong>
          </div>
          {panel && (
            <div className="kv">
              <span>Markers</span>
              <strong className="num">{panel.markerCount}</strong>
            </div>
          )}
        </GlassCard>

        <h3 className="sh__h">Why this timing</h3>
        <p className="t-body">{x.retest.rationale}</p>

        <h3 className="sh__h">Why not the full panel</h3>
        <p className="t-body">
          Retesting everything would cost you more and tell you less. We re-measure the markers your
          plan is actually targeting, so that a change is interpretable rather than noise.
        </p>

        {panel && (
          <>
            <h3 className="sh__h">What's included</h3>
            <GlassCard className="list">
              {panel.includes.map((g, i) => (
                <ListRow
                  key={g.group}
                  title={g.group}
                  sub={g.markers.join(' · ')}
                  last={i === panel.includes.length - 1}
                />
              ))}
            </GlassCard>
          </>
        )}

        <Button full onClick={() => { onClose(); openBooking(x.retest.panelId) }}>
          Book for {x.retest.dueDate}
        </Button>
      </div>
    </Sheet>
  )
}

/* =============================================== Small settings sheets */

function ReportsSheet({ onClose, depth }: SP) {
  const { p } = useApp()
  return (
    <Sheet title="Reports & records" eyebrow="Health Passport" onClose={onClose} depth={depth}>
      <div className="sh">
        <GlassCard className="list">
          {p.reports.map((r, i) => (
            <ListRow
              key={r.id}
              title={r.name}
              sub={`${r.date} · ${r.kind} · ${r.lab}`}
              value={r.markerCount ? <span className="num">{r.markerCount}</span> : undefined}
              last={i === p.reports.length - 1}
            />
          ))}
        </GlassCard>
        <Button full variant="secondary">Upload a report</Button>
        <p className="t-foot">
          Reports uploaded from outside HUMAN are parsed into the same biomarker timeline, so
          historical results sit alongside HUMAN's own.
        </p>
      </div>
    </Sheet>
  )
}

function DevicesSheet({ onClose, depth }: SP) {
  const { p } = useApp()
  return (
    <Sheet title="Connected devices" onClose={onClose} depth={depth}>
      <div className="sh">
        <GlassCard className="list">
          {p.user.devices.map((d, i) => (
            <ListRow
              key={d.name}
              title={d.name}
              sub={d.kind}
              value={<span className={d.connected ? 'st-optimal' : 'dim'}>{d.connected ? 'Connected' : 'Connect'}</span>}
              last={i === p.user.devices.length - 1}
            />
          ))}
        </GlassCard>
        <p className="t-foot">
          Wearable signals are supporting evidence inside an experiment. They are not diagnostic and
          are never read as lab results.
        </p>
      </div>
    </Sheet>
  )
}

function PrivacySheet({ onClose, depth }: SP) {
  return (
    <Sheet title="Privacy & data" onClose={onClose} depth={depth}>
      <div className="sh">
        <GlassCard className="list">
          <ListRow title="Who can see your data" sub="Only you and people you invite" />
          <ListRow title="Care Circle permissions" sub="Per person, per category" />
          <ListRow title="Research contribution" sub="Off — opt in any time" value={<span className="toggle" aria-hidden="true"><span /></span>} />
          <ListRow title="Export everything" sub="Full record as a portable file" />
          <ListRow title="Delete account and data" last />
        </GlassCard>
        <GlassCard className="sh__box">
          <div className="t-cap">Outcome intelligence</div>
          <p className="t-body">
            HUMAN can learn which interventions appear useful for people with profiles like yours —
            but only from members who explicitly opt in, in de-identified form, and under data
            governance with clinical oversight and bias monitoring. It is off by default.
          </p>
        </GlassCard>
        <p className="t-foot">
          Handled under India's Digital Personal Data Protection Act, 2023. Consent is granular and
          withdrawable.
        </p>
      </div>
    </Sheet>
  )
}

function HistorySheet({ onClose, depth }: SP) {
  const { p, openSheet } = useApp()
  const past = p.experiments.filter((e) => e.readout)
  return (
    <Sheet title="Intervention history" eyebrow="What you've tried" onClose={onClose} depth={depth}>
      <div className="sh">
        <p className="t-body">
          Every protocol you have run, whether or not it worked. This is the record that makes year
          four more useful than year one.
        </p>
        {past.map((e) => (
          <GlassCard key={e.id} className="hist" onClick={() => openSheet('readout', e.id)}>
            <div className="hist__top">
              <span className="hist__t">{e.title}</span>
              <span className="t-foot num">{e.weeks} weeks</span>
            </div>
            <p className="t-foot">{e.startDate} → {e.endDate}</p>
            <p className="hist__d">{e.readout!.decision}</p>
          </GlassCard>
        ))}
        {p.priorities.length > 0 && (
          <GlassCard className="sh__box">
            <div className="t-cap">Year 4</div>
            <p className="t-body">
              With enough cycles, HUMAN can tell you which kinds of intervention you personally
              sustain — and stop recommending the kinds you do not.
            </p>
          </GlassCard>
        )}
      </div>
    </Sheet>
  )
}

function GoalsSheet({ onClose, depth }: SP) {
  const { p } = useApp()
  return (
    <Sheet title="Health goals" onClose={onClose} depth={depth}>
      <div className="sh">
        <GlassCard className="list">
          {p.user.goals.map((g, i) => (
            <ListRow key={g} title={g} state="stable" last={i === p.user.goals.length - 1} />
          ))}
        </GlassCard>
        <p className="t-foot">
          Goals shape how the Decision Engine ranks findings. Two people with identical blood work
          can get different priorities depending on what they are trying to achieve.
        </p>
      </div>
    </Sheet>
  )
}

function MedicalSheet({ onClose, depth }: SP) {
  const { p } = useApp()
  const u = p.user
  return (
    <Sheet title="Medical history" onClose={onClose} depth={depth}>
      <div className="sh">
        <h3 className="sh__h">Conditions</h3>
        <GlassCard className="list">
          {u.conditions.map((c, i) => (
            <ListRow key={c} title={c} last={i === u.conditions.length - 1} />
          ))}
        </GlassCard>

        <h3 className="sh__h">Family history</h3>
        <GlassCard className="list">
          {u.familyHistory.map((f, i) => (
            <ListRow key={f.condition} title={f.condition} sub={f.relation} last={i === u.familyHistory.length - 1} />
          ))}
        </GlassCard>
        <p className="t-foot">
          Family history materially changes prioritisation. It is why HUMAN treats your metabolic and
          thyroid markers more seriously than the numbers alone would suggest.
        </p>

        <h3 className="sh__h">Supplements</h3>
        <GlassCard className="list">
          {u.supplements.map((s, i) => (
            <ListRow key={s.name} title={s.name} sub={`${s.dose} · since ${s.since}`} last={i === u.supplements.length - 1} />
          ))}
        </GlassCard>

        {u.medications.length > 0 && (
          <>
            <h3 className="sh__h">Medications</h3>
            <GlassCard className="list">
              {u.medications.map((m, i) => (
                <ListRow key={m.name} title={m.name} sub={`${m.dose} · since ${m.since}`} last={i === u.medications.length - 1} />
              ))}
            </GlassCard>
          </>
        )}
      </div>
    </Sheet>
  )
}
