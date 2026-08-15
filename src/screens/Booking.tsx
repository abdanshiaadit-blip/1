import { useEffect, useState } from 'react'
import { useApp } from '../state/app'
import { panels } from '../data/panels'
import { GlassCard, Chip, Button, SafetyNote, Divider } from '../components/primitives'

type Step = 'discover' | 'panel' | 'slot' | 'confirm' | 'booked'

const SLOTS = ['6:30 – 7:30 am', '7:30 – 8:30 am', '8:30 – 9:30 am', '5:30 – 6:30 pm']
const DAYS = [
  { d: 'Mon', n: '1', m: 'Sep' },
  { d: 'Tue', n: '2', m: 'Sep' },
  { d: 'Wed', n: '3', m: 'Sep' },
  { d: 'Thu', n: '4', m: 'Sep' },
  { d: 'Fri', n: '5', m: 'Sep' },
]

const AFTER = [
  {
    stage: 'Collection',
    when: 'On the day',
    copy: 'A trained phlebotomist comes to your address. Fasting sample, barcoded at your door, cold-chain to the lab.',
  },
  {
    stage: 'Results',
    when: '+48 hours',
    copy: 'Results land inside HUMAN, not as a PDF in your inbox. Each marker joins the trend it belongs to.',
  },
  {
    stage: 'Interpretation',
    when: 'Same day',
    copy: 'HUMAN reads every marker across every body system, next to your history, your family history and your goals.',
  },
  {
    stage: 'Prioritization',
    when: 'Same day',
    copy: 'The Decision Engine ranks every finding and surfaces one priority — with the reasoning behind why the others are waiting.',
  },
  {
    stage: 'Action',
    when: 'Next day',
    copy: 'You get a plan: one daily action and a structured experiment with a defined end date and tracked signals.',
  },
  {
    stage: 'Re-measure',
    when: 'When it means something',
    copy: 'We retest only the markers your plan targets, at the interval where a new value carries real information.',
  },
  {
    stage: 'Learn',
    when: 'At review',
    copy: 'We compare what changed against what you did — reported as an observation, never as proof of cause.',
  },
]

export default function Booking() {
  const { closeBooking, bookingPanel, p } = useApp()
  const [step, setStep] = useState<Step>(bookingPanel ? 'panel' : 'discover')
  const [panelId, setPanelId] = useState(bookingPanel ?? panels[0].id)
  const [day, setDay] = useState(1)
  const [slot, setSlot] = useState(0)
  const [mode, setMode] = useState<'home' | 'lab'>('home')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(r)
  }, [])

  const panel = panels.find((x) => x.id === panelId)!
  const close = () => {
    setMounted(false)
    window.setTimeout(closeBooking, 280)
  }

  const back = () => {
    if (step === 'panel') setStep('discover')
    else if (step === 'slot') setStep('panel')
    else if (step === 'confirm') setStep('slot')
    else close()
  }

  const STEP_N: Record<Step, number> = { discover: 1, panel: 2, slot: 3, confirm: 4, booked: 4 }

  return (
    <div className={`modal ${mounted ? 'is-in' : ''}`}>
      <header className="modal__head">
        <button type="button" className="modal__back" onClick={back} aria-label="Back">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="modal__prog">
          {[1, 2, 3, 4].map((n) => (
            <span key={n} className={`modal__pd ${STEP_N[step] >= n ? 'is-on' : ''}`} />
          ))}
        </div>
        <button type="button" className="modal__close" onClick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="scroll modal__body">
        {/* ------------------------------------------------------ DISCOVER */}
        {step === 'discover' && (
          <div className="mstep">
            <h1 className="t-display">Choose an assessment</h1>
            <p className="t-body">
              Each one is built to answer a question, not to maximise the marker count.
            </p>
            <div className="plist">
              {panels.map((x) => (
                <GlassCard
                  key={x.id}
                  className={`pnl ${x.recommended ? 'pnl--rec' : ''}`}
                  onClick={() => {
                    setPanelId(x.id)
                    setStep('panel')
                  }}
                >
                  <div className="pnl__top">
                    <div>
                      {x.tag && <Chip state={x.recommended ? 'optimal' : undefined}>{x.tag}</Chip>}
                      <div className="pnl__name">{x.name}</div>
                    </div>
                    <div className="pnl__price num">₹{x.price.toLocaleString('en-IN')}</div>
                  </div>
                  <p className="pnl__for">{x.forWhom}</p>
                  <div className="pnl__meta">
                    <span className="num">{x.markerCount} markers</span>
                    <span>·</span>
                    <span>{x.turnaround}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
            <p className="t-foot">
              Prices are planning assumptions for this prototype and include home collection across{' '}
              {p.user.city}.
            </p>
          </div>
        )}

        {/* --------------------------------------------------------- PANEL */}
        {step === 'panel' && (
          <div className="mstep">
            {panel.tag && <Chip state={panel.recommended ? 'optimal' : undefined}>{panel.tag}</Chip>}
            <h1 className="t-display">{panel.name}</h1>
            <p className="t-body">{panel.forWhom}</p>

            <div className="pstat">
              <div>
                <div className="pstat__n num">{panel.markerCount}</div>
                <div className="t-cap">Markers</div>
              </div>
              <div>
                <div className="pstat__n num">48h</div>
                <div className="t-cap">Results</div>
              </div>
              <div>
                <div className="pstat__n num">₹{panel.price.toLocaleString('en-IN')}</div>
                <div className="t-cap">All in</div>
              </div>
            </div>

            <h2 className="sh__h">What's measured</h2>
            {panel.includes.map((g) => (
              <GlassCard key={g.group} className="grp">
                <div className="grp__name">{g.group}</div>
                <div className="grp__markers">
                  {g.markers.map((m) => (
                    <span key={m} className="grp__m">{m}</span>
                  ))}
                </div>
              </GlassCard>
            ))}

            <SafetyNote>
              A blood assessment describes what is happening now. It does not diagnose disease, and
              abnormal results should be reviewed with a clinician.
            </SafetyNote>

            <Button full onClick={() => setStep('slot')}>Choose a time</Button>
          </div>
        )}

        {/* ---------------------------------------------------------- SLOT */}
        {step === 'slot' && (
          <div className="mstep">
            <h1 className="t-display">When and where</h1>

            <h2 className="sh__h">Collection</h2>
            <div className="modes">
              <button type="button" className={`mode ${mode === 'home' ? 'is-on' : ''}`} onClick={() => setMode('home')}>
                <span className="mode__t">Home collection</span>
                <span className="mode__s">A phlebotomist comes to you · free</span>
              </button>
              <button type="button" className={`mode ${mode === 'lab' ? 'is-on' : ''}`} onClick={() => setMode('lab')}>
                <span className="mode__t">Visit a lab</span>
                <span className="mode__s">4 partner labs near {p.user.city}</span>
              </button>
            </div>

            <h2 className="sh__h">Date</h2>
            <div className="days">
              {DAYS.map((d, i) => (
                <button key={d.n} type="button" className={`day ${day === i ? 'is-on' : ''}`} onClick={() => setDay(i)}>
                  <span className="day__d">{d.d}</span>
                  <span className="day__n num">{d.n}</span>
                  <span className="day__m">{d.m}</span>
                </button>
              ))}
            </div>

            <h2 className="sh__h">Time</h2>
            <div className="slots">
              {SLOTS.map((s, i) => (
                <button key={s} type="button" className={`slot ${slot === i ? 'is-on' : ''}`} onClick={() => setSlot(i)}>
                  {s}
                </button>
              ))}
            </div>

            <GlassCard className="sh__box">
              <div className="t-cap">Fasting</div>
              <p className="t-body">
                This panel needs a 10–12 hour fast. Water and black chai without sugar are fine.
                We'll remind you the evening before.
              </p>
            </GlassCard>

            <Button full onClick={() => setStep('confirm')}>Review booking</Button>
          </div>
        )}

        {/* ------------------------------------------------------- CONFIRM */}
        {step === 'confirm' && (
          <div className="mstep">
            <h1 className="t-display">Confirm</h1>

            <GlassCard className="sh__box">
              <div className="kv"><span>Assessment</span><strong>{panel.name}</strong></div>
              <div className="kv"><span>Markers</span><strong className="num">{panel.markerCount}</strong></div>
              <div className="kv"><span>Collection</span><strong>{mode === 'home' ? 'At home' : 'Partner lab'}</strong></div>
              <div className="kv">
                <span>When</span>
                <strong>{DAYS[day].d} {DAYS[day].n} {DAYS[day].m} · {SLOTS[slot]}</strong>
              </div>
              <div className="kv"><span>Lab</span><strong>{p.reports[0].lab}</strong></div>
              <Divider />
              <div className="kv kv--total">
                <span>Total</span>
                <strong className="num">₹{panel.price.toLocaleString('en-IN')}</strong>
              </div>
              <div className="kv"><span>Member price applied</span><strong className="st-optimal">Included</strong></div>
            </GlassCard>

            <Button full onClick={() => setStep('booked')}>Confirm booking</Button>
            <p className="t-foot">
              Payment is simulated in this prototype. No card is charged.
            </p>
          </div>
        )}

        {/* -------------------------------------------------------- BOOKED */}
        {step === 'booked' && (
          <div className="mstep">
            <div className="tick" aria-hidden="true">
              <svg viewBox="0 0 52 52" width="52" height="52">
                <circle cx="26" cy="26" r="24" fill="none" stroke="var(--state-optimal)" strokeWidth="2" className="tick__c" />
                <path d="M15 27l8 8 15-16" fill="none" stroke="var(--state-optimal)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="tick__p" />
              </svg>
            </div>

            <h1 className="t-display">You're booked</h1>
            <p className="t-body">
              {DAYS[day].d} {DAYS[day].n} {DAYS[day].m}, {SLOTS[slot]} — {mode === 'home' ? `at your address in ${p.user.city}` : 'at your chosen lab'}.
            </p>

            <h2 className="sh__h">What happens next</h2>
            <p className="t-body">
              This is the part most testing companies stop at. For HUMAN it is where the product
              starts.
            </p>

            <div className="after">
              {AFTER.map((a, i) => (
                <div key={a.stage} className="after__i" style={{ animationDelay: `${140 + i * 90}ms` }}>
                  <div className="after__rail">
                    <span className="after__dot" />
                    {i < AFTER.length - 1 && <span className="after__line" />}
                  </div>
                  <div className="after__body">
                    <div className="after__top">
                      <span className="after__stage">{a.stage}</span>
                      <span className="after__when">{a.when}</span>
                    </div>
                    <p className="after__copy">{a.copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <GlassCard className="sh__box">
              <div className="t-cap">And then it runs again</div>
              <p className="t-body">
                Each cycle starts with more context than the last — your history, what you have
                already tried, and what actually held. That is why HUMAN gets more useful the longer
                you use it.
              </p>
            </GlassCard>

            <Button full onClick={close}>Done</Button>
          </div>
        )}
      </div>
    </div>
  )
}
