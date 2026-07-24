import type { FretRange, PitchClass, StringName } from '../../types'

export const STRING_NAMES: readonly StringName[] = ['E', 'A', 'D', 'G', 'B', 'e']

/** Open-string pitch class for each string in standard tuning (low E to high e). */
export const STANDARD_TUNING: Record<StringName, PitchClass> = {
  E: 4, // E2
  A: 9, // A2
  D: 2, // D3
  G: 7, // G3
  B: 11, // B3
  e: 4, // E4
}

export const DEFAULT_FRET_RANGE: FretRange = { min: 0, max: 12 }

export function noteAtFret(stringName: StringName, fret: number): PitchClass {
  return (STANDARD_TUNING[stringName] + fret) % 12
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

export function isNoteOnString(
  stringName: StringName,
  targetPitchClass: PitchClass,
  range: FretRange = DEFAULT_FRET_RANGE,
): boolean {
  return fretsForNote(stringName, targetPitchClass, range).length > 0
}
