import type { PitchClass } from '../../types'

export interface DetectedNote {
  pitchClass: PitchClass
  frequencyHz: number
  /** Deviation from the nearest equal-tempered pitch, in cents (-50 to +50). */
  centsOffset: number
}

const A4_MIDI_NUMBER = 69

/** Converts a frequency in Hz to the nearest pitch class, using A4 = a4Hz (default 440) as reference. */
export function frequencyToNote(frequencyHz: number, a4Hz = 440): DetectedNote {
  const midiFloat = A4_MIDI_NUMBER + 12 * Math.log2(frequencyHz / a4Hz)
  const midiRounded = Math.round(midiFloat)
  const centsOffset = (midiFloat - midiRounded) * 100
  const pitchClass = ((midiRounded % 12) + 12) % 12
  return { pitchClass, frequencyHz, centsOffset }
}
