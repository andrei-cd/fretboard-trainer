import type { PitchClass } from '../../types'
import type { DetectedNote } from './pitchToNote'

export interface StabilityTracker {
  /**
   * Feed the latest reading. Returns the confirmed pitch class the moment it has been
   * read continuously for `stableMs`, and `null` otherwise (including on repeated calls
   * after the confirmation has already fired once for the current streak).
   */
  push(reading: DetectedNote | null, nowMs: number): PitchClass | null
  reset(): void
}

/** Debounces a noisy pitch-class stream: a reading only "counts" once it's held steady. */
export function createStabilityTracker(stableMs = 150): StabilityTracker {
  let currentPitchClass: PitchClass | null = null
  let stableSinceMs: number | null = null
  let confirmed = false

  function reset() {
    currentPitchClass = null
    stableSinceMs = null
    confirmed = false
  }

  return {
    push(reading, nowMs) {
      const pc = reading?.pitchClass ?? null

      if (pc !== currentPitchClass) {
        currentPitchClass = pc
        stableSinceMs = pc === null ? null : nowMs
        confirmed = false
        return null
      }

      if (pc === null || stableSinceMs === null || confirmed) return null

      if (nowMs - stableSinceMs >= stableMs) {
        confirmed = true
        return pc
      }

      return null
    },
    reset,
  }
}
