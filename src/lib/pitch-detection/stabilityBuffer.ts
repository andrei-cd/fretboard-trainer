import type { DetectedNote } from './pitchToNote'

export interface StabilityTracker {
  /**
   * Feed the latest reading. Returns the confirmed MIDI note number the moment it has been
   * read continuously for `stableMs`, and `null` otherwise (including on repeated calls
   * after the confirmation has already fired once for the current streak).
   */
  push(reading: DetectedNote | null, nowMs: number): number | null
  reset(): void
  /**
   * Like `reset`, but additionally ignores `midiNote` (if not null) until a reading that
   * differs from it — silence or a different pitch — comes in. Use this when starting a new
   * round right after a note was played: a guitar string keeps ringing for a while, and
   * without this the leftover sustain from the note you just got right gets mistaken for a
   * fresh (incorrect) attempt at the new note.
   */
  ignoreUntilChanged(midiNote: number | null): void
}

/** Debounces a noisy pitch stream: a reading only "counts" once it's held steady (same octave included). */
export function createStabilityTracker(stableMs = 150): StabilityTracker {
  let currentMidiNote: number | null = null
  let stableSinceMs: number | null = null
  let confirmed = false
  let blockedMidiNote: number | null = null
  let blockedSilenceSinceMs: number | null = null

  function reset() {
    currentMidiNote = null
    stableSinceMs = null
    confirmed = false
    blockedMidiNote = null
    blockedSilenceSinceMs = null
  }

  return {
    push(reading, nowMs) {
      const midiNote = reading?.midiNote ?? null

      if (blockedMidiNote !== null) {
        if (midiNote === blockedMidiNote) {
          // Still (or again) reading the ringing note — cancel any silence countdown so a
          // single glitchy dropout doesn't get treated as the string having gone quiet.
          blockedSilenceSinceMs = null
          return null
        }
        if (midiNote !== null) {
          // A genuinely different pitch was struck over the ringing note — trust it immediately.
          blockedMidiNote = null
          blockedSilenceSinceMs = null
        } else {
          // A momentary null reading can be a detector glitch (clarity dip mid-decay) rather
          // than the string actually going quiet, so require it to hold for a beat before
          // unblocking — otherwise a single blip lets the same ringing note "reconfirm" as an
          // answer to the new round the instant it's picked back up.
          if (blockedSilenceSinceMs === null) blockedSilenceSinceMs = nowMs
          if (nowMs - blockedSilenceSinceMs < stableMs) return null
          blockedMidiNote = null
          blockedSilenceSinceMs = null
        }
      }

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
    ignoreUntilChanged(midiNote) {
      reset()
      blockedMidiNote = midiNote
    },
  }
}
