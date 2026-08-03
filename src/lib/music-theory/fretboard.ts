import type { FretRange, PitchClass, StringName } from '../../types'

export const STRING_NAMES: readonly StringName[] = ['E', 'A', 'D', 'G', 'B', 'e']

/** Human-readable label for each string, disambiguating low E from high e. */
export const STRING_LABELS: Record<StringName, string> = {
  E: 'E (low)',
  A: 'A',
  D: 'D',
  G: 'G',
  B: 'B',
  e: 'e (high)',
}

/** Open-string pitch class for each string in standard tuning (low E to high e). */
export const STANDARD_TUNING: Record<StringName, PitchClass> = {
  E: 4, // E2
  A: 9, // A2
  D: 2, // D3
  G: 7, // G3
  B: 11, // B3
  e: 4, // E4
}

/** Open-string MIDI note number for each string in standard tuning (low E2=40 to high e E4=64). */
export const STANDARD_TUNING_MIDI: Record<StringName, number> = {
  E: 40, // E2
  A: 45, // A2
  D: 50, // D3
  G: 55, // G3
  B: 59, // B3
  e: 64, // E4
}

export const DEFAULT_FRET_RANGE: FretRange = { min: 0, max: 12 }

export function noteAtFret(stringName: StringName, fret: number): PitchClass {
  return (STANDARD_TUNING[stringName] + fret) % 12
}

/** Full MIDI note number (with octave) at a given fret on a string. */
export function midiNoteAtFret(stringName: StringName, fret: number): number {
  return STANDARD_TUNING_MIDI[stringName] + fret
}

/** All valid fret positions for a target pitch class on a string, within the given range. */
export function fretsForNote(
  stringName: StringName,
  targetPitchClass: PitchClass,
  range: FretRange = DEFAULT_FRET_RANGE,
): number[] {
  const frets: number[] = []
  for (let fret = range.min; fret <= range.max; fret++) {
    if (noteAtFret(stringName, fret) === targetPitchClass) frets.push(fret)
  }
  return frets
}

/** Exact MIDI note numbers (with octave) at which a target pitch class occurs on a string, within range. */
export function midiNotesForNote(
  stringName: StringName,
  targetPitchClass: PitchClass,
  range: FretRange = DEFAULT_FRET_RANGE,
): number[] {
  return fretsForNote(stringName, targetPitchClass, range).map((fret) => midiNoteAtFret(stringName, fret))
}

export function isNoteOnString(
  stringName: StringName,
  targetPitchClass: PitchClass,
  range: FretRange = DEFAULT_FRET_RANGE,
): boolean {
  return fretsForNote(stringName, targetPitchClass, range).length > 0
}

/** Human-readable string label, e.g. "high e" for the high e string. */
export function formatStringName(stringName: StringName): string {
  return stringName === 'e' ? 'high e' : stringName
}
