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
