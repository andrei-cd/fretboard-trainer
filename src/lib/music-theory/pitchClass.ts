import type { PitchClass } from '../../types'

export const NOTE_NAMES_SHARP: readonly string[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
]

export const NOTE_NAMES_FLAT: readonly string[] = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
]

/** All 12 pitch classes, 0-11. */
export const ALL_PITCH_CLASSES: readonly PitchClass[] = Array.from({ length: 12 }, (_, i) => i)

export function pitchClassToLabel(pc: PitchClass, spelling: 'sharp' | 'flat' = 'sharp'): string {
  const names = spelling === 'flat' ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP
  const normalized = ((pc % 12) + 12) % 12
  return names[normalized]
}

/** Combined enharmonic label, e.g. "C#/Db". Naturals (no accidental) return just the single name. */
export function pitchClassToEnharmonicLabel(pc: PitchClass): string {
  const sharp = pitchClassToLabel(pc, 'sharp')
  const flat = pitchClassToLabel(pc, 'flat')
  return sharp === flat ? sharp : `${sharp}/${flat}`
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
