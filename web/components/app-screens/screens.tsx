'use client'

import type { ReactNode } from 'react'
import type { ScreenId } from '@/lib/content'

/* ==========================================================================
   The app, rebuilt as DOM.

   These are not screenshots. They are the prototype's own screens rebuilt in
   markup, which is why they stay sharp at any size, cost nothing to load, and
   can morph — a picture cannot collapse its rows into three cards.

   Every label, every number and every phrase below is the prototype's. Where
   the product shows a price the website does not: pricing is out of scope for
   this site until the client supplies it.
   ========================================================================== */

function StatusBar() {
  return (
    <div className="scr__status" aria-hidden="true">
      <span className="num">9:41</span>
      <span className="scr__notch" />
      <span className="scr__sig">
        <i />
        <i />
        <i />
      </span>
    </div>
  )
}

function TabBar({ active }: { active: 'Home' | 'Health' | 'Action' | 'Profile' }) {
  const tabs = ['Home', 'Health', 'Action', 'Profile'] as const
  return (
    <div className="scr__tabbar" aria-hidden="true">
      {tabs.map((t) => (
        <span key={t} className={`scr__tab ${t === active ? 'is-on' : ''}`}>
          <span className="scr__tabdot" />
          {t}
        </span>
      ))}
    </div>
  )
}

function Screen({
  tab,
  children,
  scroll = 0,
}: {
  tab: 'Home' | 'Health' | 'Action' | 'Profile'
  children: ReactNode
  scroll?: number
}) {
  return (
    <div className="scr">
      <StatusBar />
      <div className="scr__body">
        <div className="scr__scroll" style={{ ['--scroll' as string]: `${scroll}px` }}>
          {children}
        </div>
      </div>
      <TabBar active={tab} />
    </div>
  )
}

/* ------------------------------------------------------------------ home */

function Home() {
  return (
    <Screen tab="Home">
      <p className="scr__wordmark">HUMAN</p>
      <p className="scr__intro">
        Book your blood tests, discover what your body needs, and follow a personalized plan to stay
        healthier for years to come.
      </p>

      <div className="scr__ring">
        <span className="scr__ringlabel">Health Intelligence</span>
        <span className="scr__ringnum num">81</span>
        <span className="scr__ringdelta num">+11 since baseline</span>
      </div>

      <div className="scr__row">
        <div>
          <span className="scr__k">Current stage</span>
          <span className="scr__v">ACT</span>
        </div>
        <div className="scr__right">
          <span className="scr__k">Next review</span>
          <span className="scr__v num">28 Aug</span>
        </div>
      </div>

      <div className="scr__card">
        <span className="scr__k">Your priority</span>
        <p className="scr__cardh">Metabolic Reset</p>
        <p className="scr__cardp">Focus on improving post-meal glucose stability.</p>
        <div className="scr__cardfoot">
          <span className="scr__dot" />
          Dinner Walk Protocol
          <span className="scr__right num">Week 5 of 6</span>
        </div>
      </div>

      <p className="scr__h">Today</p>
      <div className="scr__task">
        <span className="scr__check" />
        <div>
          <p className="scr__taskh">10-minute walk after dinner</p>
          <p className="scr__taskp">Supports your current metabolic-health goal.</p>
        </div>
      </div>
    </Screen>
  )
}

/* --------------------------------------------------------- health intel */

function Intel() {
  const rows: [string, number][] = [
    ['Metabolic', 22],
    ['Cardiovascular', 20],
    ['Nutritional', 14],
    ['Liver', 12],
    ['Sleep', 10],
    ['Recovery', 9],
    ['Hormonal', 7],
    ['Thyroid', 6],
  ]
  return (
    <Screen tab="Home">
      <div className="scr__sheet">
        <span className="scr__k">How this number works</span>
        <p className="scr__sheeth">Health Intelligence</p>
        <p className="scr__big num">81</p>
        <p className="scr__cardp">from 70 at baseline · June 2025</p>
        <p className="scr__cardp">
          A composite of your body systems, weighted by how much each currently influences your
          long-term risk. A HUMAN measure, not a validated clinical instrument.
        </p>
        <span className="scr__k scr__k--sp">What is contributing right now</span>
        <ul className="scr__bars">
          {rows.map(([k, v]) => (
            <li key={k}>
              <span className="scr__barlabel">{k}</span>
              <span className="scr__bartrack">
                <span className="scr__barfill" style={{ width: `${v * 4}%` }} />
              </span>
              <span className="scr__barval num">{v}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  )
}

/* --------------------------------------------------------------- booking */

function Booking() {
  const panels = [
    { name: 'HUMAN Baseline', markers: 68, tag: 'Start here' },
    { name: 'Women’s Hormonal & Iron', markers: 44 },
    { name: 'Metabolic Follow-up', markers: 22 },
    { name: 'Cardiovascular Deep Dive', markers: 31 },
  ]
  return (
    <Screen tab="Home">
      <div className="scr__sheet">
        <p className="scr__sheeth">Choose an assessment</p>
        <p className="scr__cardp">
          Each one is built to answer a question, not to maximise the marker count.
        </p>
        <ul className="scr__panels">
          {panels.map((p) => (
            <li key={p.name} className={`scr__panel ${p.tag ? 'is-on' : ''}`}>
              <div className="scr__panelhead">
                <p className="scr__cardh">{p.name}</p>
                {p.tag ? <span className="scr__tag">{p.tag}</span> : null}
              </div>
              <p className="scr__cardp num">{p.markers} markers · Results in 48 hours</p>
            </li>
          ))}
        </ul>
        <div className="scr__cta">Continue</div>
      </div>
    </Screen>
  )
}

/* ---------------------------------------------------------------- health */

function Health() {
  return (
    <Screen tab="Health">
      <p className="scr__title">Health</p>
      <p className="scr__intro">8 body systems, 21 tracked markers, 12 recorded events.</p>

      <div className="scr__card scr__card--focus">
        <div className="scr__cardfoot scr__cardfoot--top">
          <span className="scr__k">Body systems</span>
          <span className="scr__flag">Needs focus</span>
        </div>
        <p className="scr__syskey num">
          1 <span>/ 8</span>
        </p>
        <span className="scr__k scr__k--clay">Metabolic</span>
        <p className="scr__big num">
          5.9 <span>%</span>
        </p>
        <p className="scr__cardp">Glucose handling is your highest-leverage area</p>
        <Spark />
        <p className="scr__k">HbA1c · 14 months</p>
      </div>

      <div className="scr__card">
        <div className="scr__cardfoot scr__cardfoot--top">
          <p className="scr__cardh">Health Intelligence</p>
          <span className="scr__link">Method</span>
        </div>
        <p className="scr__big num">81</p>
        <p className="scr__cardp num">from 70 at baseline · June 2025</p>
      </div>
    </Screen>
  )
}

function Spark() {
  return (
    <svg className="scr__spark" viewBox="0 0 240 60" fill="none" aria-hidden="true">
      <path
        d="M4 16 L46 20 L88 19 L130 26 L172 34 L214 47"
        stroke="var(--clay)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="214" cy="47" r="3.5" fill="var(--clay)" />
    </svg>
  )
}

/* ---------------------------------------------------------------- marker */

function Marker() {
  const rows: [string, string, boolean][] = [
    ['HbA1c', '5.9 %', true],
    ['Fasting insulin', '14.2 µIU/mL', true],
    ['Triglycerides', '138 mg/dL', true],
    ['HDL cholesterol', '38 mg/dL', true],
    ['Alanine transaminase', '46 U/L', false],
    ['Uric acid', '5.8 mg/dL', false],
  ]
  return (
    <Screen tab="Health">
      <div className="scr__sheet">
        <span className="scr__k">Body system</span>
        <p className="scr__sheeth">Metabolic</p>
        <p className="scr__cardp">
          Read together, not one at a time. Four of these point the same way.
        </p>
        <ul className="scr__markers">
          {rows.map(([k, v, flag]) => (
            <li key={k} className="scr__marker">
              <span className="scr__markerk">{k}</span>
              <span className={`scr__markerv num ${flag ? 'is-flag' : ''}`}>{v}</span>
            </li>
          ))}
        </ul>
        <p className="scr__k">Compared with your July result, not a textbook range.</p>
      </div>
    </Screen>
  )
}

/* --------------------------------------------------------------- priority
   The first morph. Six marker rows collapse into three ranked jobs — the rows
   travel to the cards' positions and fade as the cards resolve. Both states
   live in one reserved box, so nothing can shift the layout as it happens. */

function Priority({ t }: { t: number }) {
  const rows = ['HbA1c', 'Fasting insulin', 'Triglycerides', 'HDL cholesterol', 'ALT', 'Uric acid']
  const jobs = [
    { n: 1, k: 'Metabolic Reset', v: 'Post-meal glucose stability' },
    { n: 2, k: 'Particle-count risk', v: 'ApoB and Lp(a), next panel' },
    { n: 3, k: 'Vitamin D and B12', v: 'Repletion, then recheck' },
  ]
  return (
    <Screen tab="Action">
      <span className="scr__k">Health Decision Engine</span>
      <p className="scr__title">Your priority</p>
      <p className="scr__intro">Ninety-six markers become three ranked jobs.</p>

      <div className="scr__morph reserve">
        <ul className="scr__morphrows" style={{ ['--t' as string]: t }}>
          {rows.map((r, i) => (
            <li key={r} style={{ ['--i' as string]: i }}>
              <span className="scr__markerk">{r}</span>
            </li>
          ))}
        </ul>
        <ul className="scr__morphjobs" style={{ ['--t' as string]: t }}>
          {jobs.map((j, i) => (
            <li key={j.k} style={{ ['--i' as string]: i }}>
              <span className="scr__rank num">{j.n}</span>
              <span>
                <span className="scr__cardh">{j.k}</span>
                <span className="scr__cardp">{j.v}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  )
}

/* ----------------------------------------------------------------- action
   The second morph. The top-ranked job becomes something to do today: the
   card contracts to a task row and the checklist resolves beneath it. */

function Action({ t }: { t: number }) {
  const tasks = [
    ['10-minute walk after dinner', 'After dinner', true],
    ['Dal or sabzi before rice', 'Lunch & dinner', true],
    ['Lights out by 11:30pm', 'Tonight', false],
  ] as const
  return (
    <Screen tab="Action">
      <p className="scr__title">Action</p>
      <p className="scr__intro">One priority at a time. 2 of 4 done today.</p>

      <div className="scr__becomes" style={{ ['--t' as string]: t }}>
        <span className="scr__rank num">1</span>
        <span>
          <span className="scr__cardh">Metabolic Reset</span>
          <span className="scr__cardp">Focus on improving post-meal glucose stability.</span>
        </span>
      </div>

      <p className="scr__h">Today</p>
      <ul className="scr__tasks" style={{ ['--t' as string]: t }}>
        {tasks.map(([k, when, done], i) => (
          <li key={k} style={{ ['--i' as string]: i }}>
            <span className={`scr__check ${done ? 'is-on' : ''}`} />
            <div>
              <p className="scr__taskh">{k}</p>
              <p className="scr__taskp">{when}</p>
            </div>
          </li>
        ))}
      </ul>
    </Screen>
  )
}

/* -------------------------------------------------------------- progress */

function Progress() {
  return (
    <Screen tab="Action">
      <div className="scr__sheet">
        <span className="scr__k">Personal health experiment</span>
        <p className="scr__sheeth">Dinner Walk Protocol</p>
        <p className="scr__cardp">
          Does a short walk after your largest meal shift your post-meal glucose stability?
        </p>

        <span className="scr__k scr__k--sp">Before and after</span>
        <div className="scr__ba">
          <div className="scr__barow">
            <span className="scr__k">July</span>
            <span className="scr__batrack">
              <span className="scr__bafill" style={{ width: '86%', background: 'var(--clay)' }} />
            </span>
            <span className="scr__markerv num">6.1</span>
          </div>
          <div className="scr__barow">
            <span className="scr__k">September</span>
            <span className="scr__batrack">
              <span className="scr__bafill" style={{ width: '62%', background: 'var(--jade)' }} />
            </span>
            <span className="scr__markerv num">5.9</span>
          </div>
        </div>
        <p className="scr__delta num">−0.2 since baseline</p>
        <div className="scr__cardfoot">
          <span className="scr__dot" />
          Retest confirmed
          <span className="scr__right num">2 Sep 2026</span>
        </div>
      </div>
    </Screen>
  )
}

/* ------------------------------------------------------------------ index */

export function AppScreen({ id, t = 0 }: { id: ScreenId; t?: number }) {
  switch (id) {
    case 'home':
      return <Home />
    case 'intel':
      return <Intel />
    case 'booking':
      return <Booking />
    case 'health':
      return <Health />
    case 'marker':
      return <Marker />
    case 'priority':
      return <Priority t={t} />
    case 'action':
      return <Action t={t} />
    case 'progress':
      return <Progress />
  }
}
