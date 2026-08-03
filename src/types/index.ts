export type Mode = 'normal' | 'timer' | 'mic' | 'adaptive'

/**
 * How readily the mic picks up a note, 5 discrete steps low to high. Lower favors fewer false
 * positives from background noise (requires a louder, cleaner signal); higher favors picking up
 * quiet/soft playing at the cost of being more prone to false positives.
 */
export type MicSensitivity = 'very-low' | 'low' | 'medium' | 'high' | 'very-high'

/** 0-11, 0 = C, following standard pitch-class numbering (C, C#, D, ... B). */
export type PitchClass = number

/**
 * An exact note spelling, distinct from its underlying pitch class — e.g. "F#" and "Gb"
 * are different NoteIds that both resolve to pitch class 6. Selectable and displayed
 * independently so enharmonic spellings can be practiced separately.
 */
export type NoteId =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B'

/** Guitar strings in standard tuning, low to high. */
export type StringName = 'E' | 'A' | 'D' | 'G' | 'B' | 'e'

export interface FretRange {
  min: number
  max: number
}

export interface SessionConfig {
  mode: Mode
  selectedStrings: StringName[]
  selectedNotes: NoteId[]
  fretRange: FretRange
  timerSeconds: number
}

export interface RoundPick {
  stringName: StringName
  noteId: NoteId
  pitchClass: PitchClass
}

export interface RoundState {
  current: RoundPick | null
  /** Underlying sound of the previous round, used to block an immediate repeat even across enharmonic spellings. */
  previousPitchClass: PitchClass | null
  roundStartedAt: number | null
}

export interface AdaptiveStatsEntry {
  avgResponseTimeMs: number
  sampleCount: number
}

/** Compound key identifying one (string, note) practice pair, e.g. "D:F#". */
export type StatsKey = `${StringName}:${NoteId}`

/** Partial: most (string, note) pairs won't have samples recorded yet. */
export type AdaptiveStatsMap = Partial<Record<StatsKey, AdaptiveStatsEntry>>

/** Partial: unweighted pairs fall back to a default weight (see computeWeights). */
export type PairWeights = Partial<Record<StatsKey, number>>
