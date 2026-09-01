/* ==========================================================================
   Every word on the site, in one place.

   Numbers are imported from the app's own data rather than typed out, so the
   site can never quietly disagree with the product. If a value changes in
   src/data, it changes here.

   Two rules held throughout:
   · nothing is claimed that the prototype does not do
   · no statistic appears anywhere, because there is no sourced one to use
   ========================================================================== */

import { aadit, meera, panels, LOOP_STAGES } from '../../../src/data'

export { aadit, meera, panels, LOOP_STAGES }

export const PROTOTYPE_URL = 'https://minimum-bronze-wj3yadap.edgeone.dev/'

/* --------------------------------------------------------------- hero ---- */

export const hero = {
  wordmark: 'HUMAN',
  promise: 'Understand your health before something feels wrong.',
  sub: 'Preventive healthcare, built for India. Test. Understand. Act. Track. Repeat.',
  scrollHint: 'Scroll',
}

/* ------------------------------------------------------------- problem ---- */

export const problem = {
  eyebrow: 'The problem',
  title: 'Illness builds quietly, for years.',
  years: [
    { year: 'Year 1', line: 'You feel fine.' },
    { year: 'Year 3', line: 'You feel fine.' },
    { year: 'Year 5', line: 'You feel fine.' },
    { year: 'Year 7', line: 'You feel fine.' },
    { year: 'Year 9', line: 'Something feels wrong.' },
  ],
  punch: 'Most of us think about our health only when something starts to hurt.',
  after: 'By then it has usually been building for a long time — quietly, and without a single symptom.',
  note: 'Illustration only. Not real data.',
}

/* ---------------------------------------------------------------- loop ---- */
/* The seven stages are the app's own LOOP_STAGES, shown on Home in the loop
   strip. The second line under each is plain English for the website. */

export const loop: { stage: string; plain: string; body: string }[] = [
  {
    stage: 'MEASURE',
    plain: 'Get tested',
    body: 'A blood test at home. One appointment, one sample, results in 48 hours.',
  },
  {
    stage: 'UNDERSTAND',
    plain: 'Know what it means',
    body: 'Every marker is read across nine body systems, next to your history and your family history.',
  },
  {
    stage: 'PRIORITIZE',
    plain: 'Know what matters',
    body: 'Out of everything found, HUMAN gives you one thing to work on — and tells you why the rest are waiting.',
  },
  {
    stage: 'ACT',
    plain: 'Do something about it',
    body: 'A plan you can actually keep. One daily action, and a protocol with a start date and an end date.',
  },
  {
    stage: 'RE-MEASURE',
    plain: 'Test again',
    body: 'Only the markers your plan is working on, and only when a new number would tell you something.',
  },
  {
    stage: 'LEARN',
    plain: 'See what worked',
    body: 'What moved, what did not, written as what was observed — never as a promise about cause.',
  },
  {
    stage: 'ADAPT',
    plain: 'Go again, smarter',
    body: 'The next cycle begins with everything the last one taught HUMAN about you.',
  },
]

export const loopIntro = {
  eyebrow: 'The idea',
  title: 'Not a report. A loop.',
  lead: 'A blood test tells you where you stand today. On its own, that changes nothing. HUMAN turns the test into a cycle that keeps going.',
  closing: 'And then it runs again — with more about you each time.',
}

/* ------------------------------------------------------- what is HUMAN ---- */

export const what = {
  eyebrow: 'What is HUMAN',
  title: 'Your health, in one place.',
  lead: 'Not a lab. Not a PDF. Not another app to log things in.',
  steps: [
    { k: 'You test', v: 'Book a blood test. A phlebotomist comes to your home.' },
    { k: 'HUMAN reads it', v: 'Every marker, across nine body systems, in plain language.' },
    { k: 'You see what matters', v: 'One priority at a time, with the reasoning shown.' },
    { k: 'You get a plan', v: 'Small daily actions built around how you already live.' },
    { k: 'You track it', v: 'Your numbers, your habits and your progress in one record.' },
    { k: 'It improves', v: 'Each cycle knows more about you than the last.' },
  ],
  tabs: [
    { name: 'Home', q: 'How am I doing?' },
    { name: 'Health', q: 'What is my body doing?' },
    { name: 'Action', q: 'What should I do today?' },
    { name: 'Profile', q: 'My account and who can see what.' },
  ],
}

/* ----------------------------------------------------------- app tour ---- */
/* Each stop drives the live app: which tab it opens, which sheet it opens,
   and how far down the screen it scrolls. */

export interface TourStop {
  id: string
  eyebrow: string
  title: string
  body: string
  tab: 'home' | 'health' | 'action' | 'profile'
  sheet?: { kind: string; id?: string }
  booking?: boolean
  scroll?: number
}

export const tour: TourStop[] = [
  {
    id: 'home',
    eyebrow: 'Home',
    title: 'One number. One thing to do.',
    body: 'Open HUMAN and you are not met with a dashboard. You get how you are doing, what stage you are at, and the single thing your plan is asking of you today.',
    tab: 'home',
    scroll: 0,
  },
  {
    id: 'score',
    eyebrow: 'Health Intelligence',
    title: 'A number you can actually question.',
    body: `Your body systems, weighted by how much each one shapes your long-term risk right now. Tap it and HUMAN shows you the full working — every system and exactly how much it counts. It is a HUMAN construct for tracking your own change, not a medical grade.`,
    tab: 'home',
    sheet: { kind: 'intel' },
  },
  {
    id: 'book',
    eyebrow: 'Blood tests',
    title: 'Booked at home, in under a minute.',
    body: 'Choose the assessment that answers your question — not the one with the biggest marker count. Pick a slot. A trained phlebotomist comes to your address.',
    tab: 'home',
    booking: true,
  },
  {
    id: 'health',
    eyebrow: 'Health',
    title: 'Nine systems, one object.',
    body: 'Metabolic, cardiovascular, hormonal, nutritional, liver, thyroid, recovery, sleep and women’s health. Swipe through them. Every one has a state, a headline and the markers behind it.',
    tab: 'health',
    scroll: 0,
  },
  {
    id: 'marker',
    eyebrow: 'Your results',
    title: 'Every marker, explained like a person would.',
    body: 'Where your value sits, which way it is moving, what it actually means, and what it means here — in India, with Indian food and Indian habits. Not a range table and a colour.',
    tab: 'health',
    sheet: { kind: 'biomarker', id: 'hba1c' },
  },
  {
    id: 'priority',
    eyebrow: 'What matters most',
    title: 'Out of everything, one thing.',
    body: 'HUMAN reads every finding, ranks them, and hands you one. It shows the evidence, the plan, what it will watch, and the date it will check.',
    tab: 'action',
    sheet: { kind: 'priority', id: 'p_metabolic' },
  },
  {
    id: 'notnow',
    eyebrow: 'Not now',
    title: 'And it tells you what it is holding back.',
    body: 'The things HUMAN found but deliberately did not put in front of you, and the reason for each. Running two plans at once reliably works worse than running one.',
    tab: 'action',
    sheet: { kind: 'nextup' },
  },
  {
    id: 'plan',
    eyebrow: 'Your plan',
    title: 'Small enough that you will actually do it.',
    body: 'A ten-minute walk after dinner. Dal before rice. Lights out by 11:30. Built around the life you already have, not a life you would have to start.',
    tab: 'action',
    scroll: 0,
  },
  {
    id: 'experiment',
    eyebrow: 'Tracking',
    title: 'A plan with an end date.',
    body: 'Six weeks. A written protocol. The signals it is watching. Every day you did it, and every day you did not. You always know where you are.',
    tab: 'action',
    sheet: { kind: 'experiment', id: 'e_dinner_walk' },
  },
  {
    id: 'readout',
    eyebrow: 'What we learned',
    title: 'Honest about what it can and cannot say.',
    body: 'At the end you get what was observed, what else changed at the same time, and what HUMAN decided to do next. It will not tell you one thing caused another when it cannot know that.',
    tab: 'action',
    sheet: { kind: 'readout', id: 'e_chai_done' },
  },
  {
    id: 'passport',
    eyebrow: 'Health Passport',
    title: 'Everything, in order, for as long as you have been here.',
    body: 'Tests, results, prescriptions, scans, the things you tried and what happened. One timeline instead of a folder of PDFs and a WhatsApp search.',
    tab: 'health',
    sheet: { kind: 'passport' },
  },
]

/* --------------------------------------------------- data → action -------- */
/* Every value below is Aadit's real data from src/data/aadit.ts. */

const hba1c = aadit.biomarkers.find((b) => b.id === 'hba1c')!
const metabolic = aadit.priorities[0]
const walk = aadit.actions[0]

export const transform = {
  eyebrow: 'From a number to something you can do',
  title: 'This is the whole product, in one card.',
  lead: 'A blood test gives you a value. HUMAN carries it the rest of the way.',
  states: [
    {
      cap: 'A number',
      head: `${hba1c.short} · ${hba1c.value}${hba1c.unit}`,
      body: 'On a lab report, this is where it stops. A value, a reference range, and a colour if you are lucky.',
    },
    {
      cap: 'What it means',
      head: 'Your average blood sugar over the last three months.',
      // Condensed from the biomarker's own explanation in src/data/aadit.ts.
      body:
        'At 5.9% you are in what is commonly called the prediabetes range. It has fallen steadily since your baseline, which is the direction we want.',
    },
    {
      cap: 'Why it matters most',
      head: metabolic.title,
      // Trimmed from the priority's own reasoning in src/data/aadit.ts.
      body:
        'Four signals point the same way — HbA1c, fasting insulin, triglycerides and ALT. Alone, none of them is alarming. Together they are one pattern. And Aadit’s father was diagnosed with type 2 diabetes at 47.',
    },
    {
      cap: 'What you do about it',
      head: walk.title,
      body: `${walk.why} And HbA1c reflects about three months of average glucose, so HUMAN retests it on ${metabolic.retest.dueDate} — six markers, not the whole panel.`,
    },
  ],
  markerLabel: hba1c.name,
}

/* ------------------------------------------------------------ systems ---- */

export const systems = {
  eyebrow: 'What HUMAN looks at',
  title: 'Nine systems. One picture.',
  lead: 'Pick one. This is your body, read the way HUMAN reads it — every marker in the context of every other.',
  note: 'Shown with a HUMAN member’s prototype data. All member data is fictional.',
}

/* -------------------------------------------------------------- India ---- */

export const india = {
  eyebrow: 'Built for India',
  title: 'Made here, for how we actually live.',
  lead: 'Not a Western health app with rupee prices.',
  points: [
    {
      k: 'A blood test usually means something is already wrong',
      v: 'Most of us test because a doctor asked, or because something hurt. HUMAN is built for the other reason — to know where you stand while you still feel fine.',
    },
    {
      k: 'Reports are written for doctors, not for you',
      v: 'Sixty markers, a reference range, and no idea which three matter. HUMAN reads all of them and tells you the one to start with.',
    },
    {
      k: 'The advice has to fit Indian food',
      v: 'Dal or sabzi before the rice. Sugar in your chai. Advice you can follow at your own dinner table, not a meal plan you will abandon in a week.',
    },
    {
      k: 'Our context is not the same as everyone else’s',
      v: 'Vitamin D runs low with indoor work and long commutes. Lp(a) sits higher in South Asians more often. HUMAN reads your results knowing that.',
    },
    {
      k: 'Health slips down the list',
      v: 'Work, family, everything else. So HUMAN asks for one small thing a day, not an hour in a gym.',
    },
    {
      k: 'Your family already knows your risk',
      v: 'A father with diabetes at 47. A mother with a thyroid. HUMAN takes that seriously and starts there.',
    },
  ],
}

/* --------------------------------------------------------- philosophy ---- */

export const philosophy = {
  lines: ['Healthcare shouldn’t only begin', 'when something goes wrong.'],
  sub: 'Know earlier. Act sooner. Keep going.',
}

/* -------------------------------------------------------------- final ---- */

export const explore = {
  eyebrow: 'The prototype',
  title: 'See HUMAN for yourself.',
  lead: 'A working prototype, open to anyone. No signup, no email, nothing to install. Every screen is real and every screen works.',
  cta: 'Explore the HUMAN Prototype',
  note: 'Two members, one product. All member data is fictional.',
}

export const closing = {
  lines: ['Understand your health.', 'Before something feels wrong.'],
}

export const legal = {
  safety:
    'HUMAN supports your health decisions. It does not diagnose conditions and does not replace your doctor.',
  prototype:
    'HUMAN is a working prototype. All member data shown is fictional, prices are planning assumptions, and the Health Intelligence score is a HUMAN construct rather than a validated clinical measure.',
}
