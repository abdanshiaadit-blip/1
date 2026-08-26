/* ==========================================================================
   HUMAN — Domain model
   Every entity links backward to evidence and forward to an action.
   Nothing here is an orphan; that is what makes HUMAN one system.
   ========================================================================== */

export type HealthState = 'optimal' | 'stable' | 'monitor' | 'attention' | 'clinical'

export type LoopStage =
  | 'MEASURE'
  | 'UNDERSTAND'
  | 'PRIORITIZE'
  | 'ACT'
  | 'RE-MEASURE'
  | 'LEARN'
  | 'ADAPT'

export const LOOP_STAGES: LoopStage[] = [
  'MEASURE',
  'UNDERSTAND',
  'PRIORITIZE',
  'ACT',
  'RE-MEASURE',
  'LEARN',
  'ADAPT',
]

export type SystemId =
  | 'metabolic'
  | 'cardiovascular'
  | 'hormonal'
  | 'nutritional'
  | 'liver'
  | 'thyroid'
  | 'women'
  | 'recovery'
  | 'sleep'

export interface User {
  id: string
  name: string
  firstName: string
  sex: 'male' | 'female'
  age: number
  city: string
  memberSince: string
  membership: 'Annual' | 'Monthly' | 'Family'
  goals: string[]
  conditions: string[]
  medications: { name: string; dose: string; since: string }[]
  supplements: { name: string; dose: string; since: string }[]
  familyHistory: { relation: string; condition: string }[]
  devices: { name: string; kind: string; connected: boolean }[]
}

export interface Point {
  date: string
  value: number
  label?: string
}

export interface HealthIntel {
  score: number
  delta: number
  baselineScore: number
  history: { date: string; score: number; event?: string }[]
  contributions: { systemId: SystemId; weight: number; state: HealthState }[]
  methodNote: string
}

export interface LoopState {
  stage: LoopStage
  stageSince: string
  nextReviewDate: string
  nextReviewIn: number
  cycleNumber: number
}

export interface BodySystem {
  id: SystemId
  name: string
  state: HealthState
  score: number
  headline: string
  summary: string
  markerIds: string[]
  metric: { label: string; value: string; unit?: string }
  series: number[]
  seriesLabel: string
}

export interface Biomarker {
  id: string
  name: string
  short: string
  systemId: SystemId
  value: number
  unit: string
  state: HealthState
  range: { low: number; high: number; optLow: number; optHigh: number; floor: number; ceil: number }
  direction: 'up' | 'down' | 'flat'
  deltaLabel: string
  history: Point[]
  meaning: string
  indiaContext?: string
  influences: string[]
  relatedPriorityId?: string
  clinicianNote?: string
}

export interface Priority {
  id: string
  rank: number
  title: string
  systemId: SystemId
  state: HealthState
  whyShort: string
  whyDetail: string
  evidenceMarkerIds: string[]
  actionIds: string[]
  trackedSignals: { label: string; value: string; state: HealthState }[]
  reviewDate: string
  retest: { panelId: string; panelName: string; dueDate: string; rationale: string }
  clinicianNote?: string
  /** Why the Decision Engine is deliberately holding this back. Rank > 1 only. */
  suppressedReason?: string
}

export interface Experiment {
  id: string
  title: string
  question: string
  priorityId: string
  protocol: { title: string; detail: string }[]
  weeks: number
  weekNow: number
  startDate: string
  endDate: string
  trackedSignals: { label: string; baseline: string; now: string; state: HealthState }[]
  /** 42 days of adherence, oldest first. null = not yet reached. */
  adherence: (boolean | null)[]
  readout?: {
    observed: string[]
    caveat: string
    decision: string
  }
}

export interface DailyAction {
  id: string
  title: string
  why: string
  priorityId: string
  target: string
  streak: number
  doneToday: boolean
  progress: { done: number; total: number }
  time: string
}

export type TimelineType =
  | 'test'
  | 'result'
  | 'diagnosis'
  | 'prescription'
  | 'imaging'
  | 'symptom'
  | 'intervention'
  | 'milestone'
  | 'note'

export interface TimelineEvent {
  id: string
  date: string
  year: number
  type: TimelineType
  title: string
  summary: string
  systemId?: SystemId
}

export interface Learning {
  id: string
  statement: string
  basis: string
  caveat: string
}

export interface CycleEntry {
  day: number
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal'
  flow?: 'light' | 'medium' | 'heavy'
  symptoms: string[]
}

export interface CycleInsight {
  id: string
  statement: string
  linkedMarkerIds: string[]
  caveat: string
  /** Two series that moved together, drawn as a connection chart.
   *  Each is normalised to its own range — the shapes are comparable,
   *  the absolute values are not. */
  pair?: {
    axis: string[]
    a: { label: string; values: number[]; unit: string }
    b: { label: string; values: number[]; unit: string }
  }
}

export interface WomensHealth {
  cycleDay: number
  cycleLength: number
  avgLength: number
  variability: string
  phase: CycleEntry['phase']
  lastPeriod: string
  nextPredicted: string
  recentCycles: { month: string; length: number; state: HealthState }[]
  symptoms: { label: string; frequency: string; state: HealthState }[]
  insights: CycleInsight[]
  lifeStage: string
  connectedMarkerIds: string[]
}

export interface CareMember {
  id: string
  name: string
  relation: string
  initials: string
  accent: string
  shares: string[]
  locked: string[]
  lastActive: string
}

export interface Panel {
  id: string
  name: string
  markerCount: number
  price: number
  turnaround: string
  forWhom: string
  includes: { group: string; markers: string[] }[]
  recommended?: boolean
  tag?: string
}

export interface Insight {
  id: string
  eyebrow: string
  statement: string
  detail: string
  systemId: SystemId
}

export interface Report {
  id: string
  name: string
  date: string
  kind: string
  lab: string
  markerCount?: number
}

export interface Profile {
  user: User
  intel: HealthIntel
  bioAge: BioAge
  coach: Coach
  loop: LoopState
  systems: BodySystem[]
  biomarkers: Biomarker[]
  priorities: Priority[]
  experiments: Experiment[]
  actions: DailyAction[]
  timeline: TimelineEvent[]
  learnings: Learning[]
  womens?: WomensHealth
  careCircle: CareMember[]
  insights: Insight[]
  reports: Report[]
}

/* ==========================================================================
   Biological Age — the primary outcome
   An ESTIMATE derived from the signals HUMAN already holds. It is not a
   measurement, and every surface that renders it says so.
   ========================================================================== */

export type AgeTrend = 'improving' | 'holding' | 'drifting'

/** A contributor to a system's estimate. Positive contributors and
 *  opportunities are the same shape so a system can be read at a glance. */
export interface AgeDriver {
  kind: 'positive' | 'opportunity'
  label: string
  detail: string
}

export interface SystemAge {
  systemId: SystemId
  /** Estimated age for this system, in years. One decimal. */
  estimate: number
  /** estimate − chronological. Negative = younger than chronological. */
  delta: number
  trend: AgeTrend
  /** Movement since the previous assessment, in years. Negative = younger. */
  since: number
  /** One line. Never a diagnosis. */
  interpretation: string
  /** Plain-language answer to "why this estimate?" */
  why: string
  /** Biomarkers HUMAN actually used. Only the relevant ones. */
  signalIds: string[]
  /** Non-blood signals — wearable, logged, lifestyle. */
  lifestyleSignals: { label: string; value: string; state: HealthState }[]
  drivers: AgeDriver[]
}

export interface BioAge {
  chronological: number
  /** Estimated biological age, one decimal. */
  estimate: number
  /** estimate − chronological. Negative = younger. */
  delta: number
  /** Estimate at the previous assessment. */
  previous: number
  previousDate: string
  /** Estimate at the Day-0 baseline, with the chronological age at the time. */
  baseline: { date: string; estimate: number; chronological: number }
  trend: AgeTrend
  /** One line under the number. Reads in about two seconds. */
  headline: string
  /** Two sentences at most, shown at the top of the detail view. */
  summary: string
  /** What the estimate is and is not. Rendered inside a SafetyNote. */
  methodNote: string
  /** What the estimate was built from — count, not a formula. */
  basis: string
  history: { date: string; estimate: number; chronological: number; event?: string }[]
  systems: SystemAge[]
}

/* ==========================================================================
   HUMAN AI Coach
   Deterministic prototype answers written against this member's own record.
   Every answer is composed of the same five moves: short answer, why, what
   matters, what to do, when to reassess.
   ========================================================================== */

export type CoachRefKind =
  | 'biomarker'
  | 'system'
  | 'systemage'
  | 'priority'
  | 'experiment'
  | 'readout'
  | 'bioage'
  | 'womens'
  | 'retest'
  | 'passport'

export interface CoachRef {
  kind: CoachRefKind
  id?: string
  label: string
}

export interface CoachBlock {
  label: string
  body: string
}

export interface CoachAnswer {
  /** The one-line answer. Everything else expands on it. */
  short: string
  blocks: CoachBlock[]
  /** Deep links into the record the answer was drawn from. */
  refs: CoachRef[]
  /** Shown as a SafetyNote when the answer touches clinical territory. */
  safety?: string
}

export interface CoachPrompt {
  id: string
  question: string
  /** Short form for the suggestion chips. */
  chip: string
  answer: CoachAnswer
}

export interface Coach {
  /** "Your metabolic health is currently your biggest opportunity." */
  headline: string
  /** The compact contextual line on the Home and Profile entry points.
   *  Deliberately shorter than the headline — those cards stay two lines. */
  cta: string
  contextLine: string
  /** What HUMAN actually holds for this member — the basis of every answer. */
  context: { label: string; value: string }[]
  /** The opening turn. Always present, never part of the asked log. */
  opener: CoachAnswer
  prompts: CoachPrompt[]
}
