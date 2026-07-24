import type { AdaptiveStatsMap, SessionConfig } from '../../types'

export const STORAGE_KEY = 'music-note:v1'

export interface PersistedSchemaV1 {
  version: 1
  adaptiveStats: AdaptiveStatsMap
  lastSessionConfig?: SessionConfig
}

export function createEmptyState(): PersistedSchemaV1 {
  return { version: 1, adaptiveStats: {} }
}
