export type Mode = 'normal' | 'timer' | 'mic' | 'adaptive'

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

/** Partial: most notes won't have samples recorded yet. */
export type AdaptiveStatsMap = Partial<Record<NoteId, AdaptiveStatsEntry>>

/** Partial: unweighted notes fall back to a default weight (see computeWeights). */
export type NoteWeights = Partial<Record<NoteId, number>>
