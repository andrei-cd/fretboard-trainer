import type { PitchClass } from '../../types'

export interface DetectedNote {
  pitchClass: PitchClass
  /** Full MIDI note number (with octave), e.g. 40 for E2. */
  midiNote: number
  frequencyHz: number
  /** Deviation from the nearest equal-tempered pitch, in cents (-50 to +50). */
  centsOffset: number
}

const A4_MIDI_NUMBER = 69

/** Converts a frequency in Hz to the nearest note (pitch class + octave), using A4 = a4Hz (default 440) as reference. */
export function frequencyToNote(frequencyHz: number, a4Hz = 440): DetectedNote {
  const midiFloat = A4_MIDI_NUMBER + 12 * Math.log2(frequencyHz / a4Hz)
  const midiNote = Math.round(midiFloat)
  const centsOffset = (midiFloat - midiNote) * 100
  const pitchClass = ((midiNote % 12) + 12) % 12
  return { pitchClass, midiNote, frequencyHz, centsOffset }
}
