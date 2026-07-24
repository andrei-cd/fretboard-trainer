import type { DetectedNote } from './pitchToNote'

export interface StabilityTracker {
  /**
   * Feed the latest reading. Returns the confirmed MIDI note number the moment it has been
   * read continuously for `stableMs`, and `null` otherwise (including on repeated calls
   * after the confirmation has already fired once for the current streak).
   */
  push(reading: DetectedNote | null, nowMs: number): number | null
  reset(): void
}

/** Debounces a noisy pitch stream: a reading only "counts" once it's held steady (same octave included). */
export function createStabilityTracker(stableMs = 150): StabilityTracker {
  let currentMidiNote: number | null = null
  let stableSinceMs: number | null = null
  let confirmed = false

  function reset() {
    currentMidiNote = null
    stableSinceMs = null
    confirmed = false
  }

  return {
    push(reading, nowMs) {
      const midiNote = reading?.midiNote ?? null

      if (midiNote !== currentMidiNote) {
        currentMidiNote = midiNote
        stableSinceMs = midiNote === null ? null : nowMs
        confirmed = false
        return null
      }

      if (midiNote === null || stableSinceMs === null || confirmed) return null

      if (nowMs - stableSinceMs >= stableMs) {
        confirmed = true
        return midiNote
      }

      return null
    },
    reset,
  }
}
