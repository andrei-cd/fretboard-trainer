import type { NoteId, PitchClass } from '../../types'

export const NOTE_NAMES_SHARP: readonly string[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
]

export const NOTE_NAMES_FLAT: readonly string[] = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
]

/** All 12 pitch classes, 0-11. */
export const ALL_PITCH_CLASSES: readonly PitchClass[] = Array.from({ length: 12 }, (_, i) => i)

/** Every selectable note spelling, ordered by pitch class (sharp before flat for accidentals). */
export const ALL_NOTE_IDS: readonly NoteId[] = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
]

export const NATURAL_NOTE_IDS: readonly NoteId[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

/** Sharp/flat spelling pairs for each of the 5 accidental pitch classes. */
export const ACCIDENTAL_NOTE_ID_PAIRS: readonly [NoteId, NoteId][] = [
  ['C#', 'Db'],
  ['D#', 'Eb'],
  ['F#', 'Gb'],
  ['G#', 'Ab'],
  ['A#', 'Bb'],
]

/** Default selection: naturals + sharp spellings only, matching the pre-enharmonic-split defaults. */
export const DEFAULT_NOTE_IDS: readonly NoteId[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
]

export function pitchClassToLabel(pc: PitchClass, spelling: 'sharp' | 'flat' = 'sharp'): string {
  const names = spelling === 'flat' ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP
  const normalized = ((pc % 12) + 12) % 12
  return names[normalized]
}

/** Parses a note name like "F#", "Gb", "C" into a pitch class 0-11. Throws on invalid input. */
export function noteNameToPitchClass(name: string): PitchClass {
  const trimmed = name.trim()
  const sharpIndex = NOTE_NAMES_SHARP.findIndex((n) => n === trimmed)
  if (sharpIndex !== -1) return sharpIndex
  const flatIndex = NOTE_NAMES_FLAT.findIndex((n) => n === trimmed)
  if (flatIndex !== -1) return flatIndex
  throw new Error(`Invalid note name: "${name}"`)
}

/** A NoteId's underlying pitch class — e.g. both "F#" and "Gb" resolve to 6. */
export function noteIdToPitchClass(noteId: NoteId): PitchClass {
  return noteNameToPitchClass(noteId)
}

const NOTE_IDS_BY_PITCH_CLASS: readonly NoteId[][] = ALL_PITCH_CLASSES.map((pc) =>
  ALL_NOTE_IDS.filter((id) => noteIdToPitchClass(id) === pc),
)

/** All NoteId spellings for a pitch class — one for naturals, two (sharp + flat) for accidentals. */
export function noteIdsForPitchClass(pc: PitchClass): readonly NoteId[] {
  return NOTE_IDS_BY_PITCH_CLASS[((pc % 12) + 12) % 12]
}

/** Scientific pitch notation, e.g. midiNoteToLabel(66) -> "F#3" (MIDI 60 = C4). */
export function midiNoteToLabel(midiNote: number, spelling: 'sharp' | 'flat' = 'sharp'): string {
  const pitchClass = ((midiNote % 12) + 12) % 12
  const octave = Math.floor(midiNote / 12) - 1
  return `${pitchClassToLabel(pitchClass, spelling)}${octave}`
}
