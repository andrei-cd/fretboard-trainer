export type Mode = 'normal' | 'timer' | 'mic' | 'adaptive'

/** 0-11, 0 = C, following standard pitch-class numbering (C, C#, D, ... B). */
export type PitchClass = number

/** Guitar strings in standard tuning, low to high. */
export type StringName = 'E' | 'A' | 'D' | 'G' | 'B' | 'e'

export interface FretRange {
  min: number
  max: number
}

export interface SessionConfig {
  mode: Mode
  selectedStrings: StringName[]
  selectedNotes: PitchClass[]
  fretRange: FretRange
  timerSeconds: number
}

export interface RoundPick {
  stringName: StringName
  pitchClass: PitchClass
}

export interface RoundState {
  current: RoundPick | null
  previousPitchClass: PitchClass | null
  roundStartedAt: number | null
}

export interface AdaptiveStatsEntry {
  avgResponseTimeMs: number
  sampleCount: number
}

export type AdaptiveStatsMap = Record<PitchClass, AdaptiveStatsEntry>
