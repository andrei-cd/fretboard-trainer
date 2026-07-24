import type { AdaptiveStatsMap, MicSensitivity, SessionConfig } from '../../types'

export const STORAGE_KEY = 'music-note:v1'

export interface PersistedSchemaV1 {
  version: 1
  adaptiveStats: AdaptiveStatsMap
  /** Undefined on data saved before this preference existed — treat as enabled (default true). */
  soundEnabled?: boolean
  /** Undefined on data saved before this preference existed — treat as enabled (default true). */
  feedbackMessagesEnabled?: boolean
  /** Undefined on data saved before this preference existed — treat as 'medium'. */
  micSensitivity?: MicSensitivity
  lastSessionConfig?: SessionConfig
}

export function createEmptyState(): PersistedSchemaV1 {
  return { version: 1, adaptiveStats: {} }
}
