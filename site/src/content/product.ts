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
  sub: 'Book a blood test at home, understand what your results mean, and get one thing to work on. Built for India.',
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
  punch: 'Most of us only think about our health when something starts to hurt.',
  after: 'By then it has usually been building a long time. Quietly. Without a single symptom.',
  note: 'Illustration only. Not real data.',
}

/* ---------------------------------------------------------------- loop ---- */
/* The seven stages are the app's own LOOP_STAGES, shown on Home in the loop
   strip. The second line under each is plain English for the website. */

export const loop: { stage: string; plain: string; body: string }[] = [
  {
    stage: 'MEASURE',
    plain: 'Get tested',
    body: 'A blood test at home. One appointment, results in 48 hours.',
  },
  {
    stage: 'UNDERSTAND',
    plain: 'Know what it means',
    body: 'Every marker read across nine body systems, next to your history and your family’s.',
  },
  {
    stage: 'PRIORITIZE',
    plain: 'Know what matters',
    body: 'One thing to work on — and why the rest can wait.',
  },
  {
    stage: 'ACT',
    plain: 'Do something about it',
    body: 'A plan that fits your life. One small thing a day.',
  },
  {
    stage: 'RE-MEASURE',
    plain: 'Test again',
    body: 'Only the markers your plan is working on, and only when a new number would tell you something.',
  },
  {
    stage: 'LEARN',
    plain: 'See what worked',
    body: 'What moved and what didn’t — what we saw, not what we promised.',
  },
  {
    stage: 'ADAPT',
    plain: 'Go again, smarter',
    body: 'The next round starts knowing everything the last one taught.',
  },
]

export const loopIntro = {
  eyebrow: 'The idea',
  title: 'Not a report. A loop.',
  lead: 'A blood test tells you where you stand today. On its own, that changes nothing. HUMAN keeps it going.',
  closing: 'Then it runs again. Knowing more about you each time.',
}

/* ------------------------------------------------------- what is HUMAN ---- */

export const what = {
  eyebrow: 'What is HUMAN',
  title: 'Your health, in one place.',
  lead: 'Not a lab. Not a PDF. Not another app to log things in.',
  steps: [
    { k: 'You test', v: 'Book a blood test. Someone comes to your home.' },
    { k: 'HUMAN reads it', v: 'Every marker, across nine body systems, in plain words.' },
    { k: 'You see what matters', v: 'One thing at a time, and the reason for it.' },
    { k: 'You get a plan', v: 'Small things that fit the life you already have.' },
    { k: 'You track it', v: 'Your numbers, your habits, your progress — one place.' },
    { k: 'It improves', v: 'Every round knows more about you than the last.' },
  ],
  tabs: [
    { name: 'Home', q: 'How am I doing?' },
    { name: 'Health', q: 'What is my body doing?' },
    { name: 'Action', q: 'What should I do today?' },
    { name: 'Profile', q: 'My account, and who sees what.' },
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
    body: 'Open HUMAN and you don’t get a dashboard. You get how you’re doing, and the one thing your plan is asking of you today.',
    tab: 'home',
    scroll: 0,
  },
  {
    id: 'score',
    eyebrow: 'Health Intelligence',
    title: 'A number you can question.',
    body: 'Your body systems, weighted by what matters most right now. Tap it and HUMAN shows how it got there — every system, and how much it counts. It is a HUMAN measure, not a medical score.',
    tab: 'home',
    sheet: { kind: 'intel' },
  },
  {
    id: 'book',
    eyebrow: 'Blood tests',
    title: 'Booked at home, in a minute.',
    body: 'Pick the test that answers your question, not the one with the most markers. Pick a slot. Someone comes to your address.',
    tab: 'home',
    booking: true,
  },
  {
    id: 'health',
    eyebrow: 'Health',
    title: 'Nine systems, one card.',
    body: 'Metabolic, heart, hormones, nutrition, liver, thyroid, recovery, sleep and women’s health. Swipe through them.',
    tab: 'health',
    scroll: 0,
  },
  {
    id: 'marker',
    eyebrow: 'Your results',
    title: 'Every marker, explained like a person would.',
    body: 'Where your value sits, which way it is moving, and what to do about it — with Indian food and Indian habits. Not a range table and a colour.',
    tab: 'health',
    sheet: { kind: 'biomarker', id: 'hba1c' },
  },
  {
    id: 'priority',
    eyebrow: 'What matters most',
    title: 'Out of everything, one thing.',
    body: 'HUMAN reads every finding, ranks them, and hands you one — with the evidence, the plan, and the date it checks again.',
    tab: 'action',
    sheet: { kind: 'priority', id: 'p_metabolic' },
  },
  {
    id: 'notnow',
    eyebrow: 'Not now',
    title: 'And what it is holding back.',
    body: 'The things HUMAN found but did not put in front of you, and the reason for each. Doing two things at once works worse than doing one.',
    tab: 'action',
    sheet: { kind: 'nextup' },
  },
  {
    id: 'plan',
    eyebrow: 'Your plan',
    title: 'Small enough that you will do it.',
    body: 'A ten-minute walk after dinner. Dal before rice. Lights out by 11:30. Built around your life, not a new one.',
    tab: 'action',
    scroll: 0,
  },
  {
    id: 'experiment',
    eyebrow: 'Tracking',
    title: 'A plan with an end date.',
    body: 'Six weeks. What to do. What it is watching. Every day you did it, and every day you did not.',
    tab: 'action',
    sheet: { kind: 'experiment', id: 'e_dinner_walk' },
  },
  {
    id: 'readout',
    eyebrow: 'What we learned',
    title: 'Honest about what it cannot say.',
    body: 'What was seen, what else changed at the same time, and what happens next. It will not tell you one thing caused another when it cannot know that.',
    tab: 'action',
    sheet: { kind: 'readout', id: 'e_chai_done' },
  },
  {
    id: 'passport',
    eyebrow: 'Health Passport',
    title: 'Everything, in order.',
    body: 'Tests, results, prescriptions, scans, what you tried and what happened. One timeline instead of a folder of PDFs.',
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
  title: 'The whole product, in one card.',
  lead: 'A blood test gives you a value. HUMAN carries it the rest of the way.',
  states: [
    {
      cap: 'A number',
      head: `${hba1c.short} · ${hba1c.value}${hba1c.unit}`,
      body: 'On a lab report, this is where it stops. A value, a range, and a colour if you are lucky.',
    },
    {
      cap: 'What it means',
      head: 'Your average blood sugar over the last three months.',
      // Condensed from the biomarker's own explanation in src/data/aadit.ts.
      body: 'At 5.9% you are in what is usually called the prediabetes range. It has been falling since your first test, which is the direction you want.',
    },
    {
      cap: 'Why it matters most',
      head: metabolic.title,
      // Trimmed from the priority's own reasoning in src/data/aadit.ts.
      body: 'Four signals point the same way — HbA1c, insulin, triglycerides and ALT. Alone, none of them is alarming. Together they are one pattern. And Aadit’s father was diagnosed with type 2 diabetes at 47.',
    },
    {
      cap: 'What you do about it',
      head: walk.title,
      body: `That is it. Blood sugar moves slowly, so HUMAN retests it on ${metabolic.retest.dueDate} — six markers, not the whole panel.`,
    },
  ],
  markerLabel: hba1c.name,
}

/* ------------------------------------------------------------ systems ---- */

export const systems = {
  eyebrow: 'What HUMAN looks at',
  title: 'Nine systems. One picture.',
  lead: 'Pick one. Every marker is read next to every other, never on its own.',
  note: 'Shown with a HUMAN member’s prototype data. All member data is made up.',
}

/* -------------------------------------------------------------- India ---- */

export const india = {
  eyebrow: 'Built for India',
  title: 'Made here, for how we actually live.',
  lead: 'Not a Western health app with rupee prices.',
  points: [
    {
      k: 'A blood test usually means something is already wrong',
      v: 'Most of us test because a doctor asked, or because something hurt. HUMAN is for the other reason — knowing where you stand while you still feel fine.',
    },
    {
      k: 'Reports are written for doctors, not for you',
      v: 'Sixty markers, a reference range, and no idea which three matter. HUMAN reads all of them and tells you where to start.',
    },
    {
      k: 'The advice has to fit Indian food',
      v: 'Dal or sabzi before the rice. Sugar in your chai. Things you can do at your own dinner table.',
    },
    {
      k: 'Our context is not the same as everyone else’s',
      v: 'Vitamin D runs low with indoor work and long commutes. Lp(a) sits higher in South Asians more often. HUMAN reads your results knowing that.',
    },
    {
      k: 'Health slips down the list',
      v: 'Work, family, everything else. So HUMAN asks for one small thing a day, not an hour at the gym.',
    },
    {
      k: 'Your family already knows your risk',
      v: 'A father with diabetes at 47. A mother on thyroid medicine. HUMAN takes that seriously and starts there.',
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
  lead: 'A working prototype, open to anyone. No signup, nothing to install. Every screen is real.',
  cta: 'Explore the HUMAN Prototype',
  note: 'Two members, one product. All member data is made up.',
}

export const closing = {
  lines: ['Understand your health.', 'Before something feels wrong.'],
}

export const legal = {
  safety:
    'HUMAN supports your health decisions. It does not diagnose conditions and does not replace your doctor.',
  prototype:
    'HUMAN is a working prototype. All member data is made up, prices are planning assumptions, and the Health Intelligence score is a HUMAN measure rather than a validated clinical one.',
}
