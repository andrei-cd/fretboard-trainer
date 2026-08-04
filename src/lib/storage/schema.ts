import type {
  AdaptiveStatsMap,
  AppMode,
  FretboardLabelMode,
  MicSensitivity,
  NoteId,
  NoteNameFormat,
  SessionConfig,
  StringName,
} from '../../types'

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
  /** Undefined on data saved before this preference existed — treat as enabled (default true). */
  mergeAccidentalSpellingsEnabled?: boolean
  /** Undefined on data saved before this preference existed — treat as disabled (default false). */
  metronomeEnabled?: boolean
  /** Undefined on data saved before this preference existed — treat as 100. */
  metronomeBpm?: number
  /** Undefined on data saved before this preference existed — treat as disabled (default false). */
  metronomeLockToTimer?: boolean
  /** Undefined on data saved before this preference existed — treat as 4. */
  metronomeBeatsPerNote?: number
  /** Undefined until the user manually toggles the theme — resolve from prefers-color-scheme at
      runtime instead. Once set, this explicit choice wins on all future visits. */
  themeOverride?: 'light' | 'dark'
  lastSessionConfig?: SessionConfig
  /** Undefined on data saved before this preference existed — treat as 'recall'. */
  appMode?: AppMode
  /** Undefined on data saved before this preference existed — treat as false. */
  recognitionLeftHand?: boolean
  /** Undefined on data saved before this preference existed — treat as 12. */
  recognitionFretCount?: number
  /** Undefined on data saved before this preference existed — treat as 'frets-strings'. */
  recognitionLabelMode?: FretboardLabelMode
  /** Undefined on data saved before this preference existed — treat as 'both'. */
  recognitionNoteNameFormat?: NoteNameFormat
  /** Undefined on data saved before this preference existed — treat as enabled (default true). */
  recognitionShowFretMarkers?: boolean
  /** Undefined on data saved before this preference existed — treat as all strings selected. */
  recognitionSelectedStrings?: StringName[]
  /** Undefined on data saved before this preference existed — treat as disabled (default false). */
  recognitionNoteFilterEnabled?: boolean
  /** Undefined on data saved before this preference existed — treat as the default note set. */
  recognitionSelectedNotes?: NoteId[]
  /** Undefined on data saved before this preference existed — treat as enabled (default true). */
  recognitionSoundEnabled?: boolean
  /** Undefined on data saved before this preference existed — treat as enabled (default true). */
  recognitionFeedbackMessagesEnabled?: boolean
}

export function createEmptyState(): PersistedSchemaV1 {
  return { version: 1, adaptiveStats: {} }
}
