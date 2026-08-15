export * from './types'
export { aadit } from './aadit'
export { meera } from './meera'
export { panels, panelById } from './panels'

import { aadit } from './aadit'
import { meera } from './meera'
import type { Profile } from './types'

export type PersonaId = 'aadit' | 'meera'

export const profiles: Record<PersonaId, Profile> = { aadit, meera }
