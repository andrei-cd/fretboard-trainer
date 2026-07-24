import { describe, expect, it } from 'vitest'
import { createStabilityTracker } from './stabilityBuffer'
import type { DetectedNote } from './pitchToNote'

function note(midiNote: number): DetectedNote {
  return { pitchClass: ((midiNote % 12) + 12) % 12, midiNote, frequencyHz: 440, centsOffset: 0 }
}

describe('createStabilityTracker', () => {
  it('does not confirm before the stable duration has elapsed', () => {
    const tracker = createStabilityTracker(150)
    expect(tracker.push(note(40), 0)).toBeNull()
    expect(tracker.push(note(40), 100)).toBeNull()
  })

  it('confirms once the reading has been stable for long enough', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(40), 0)
    tracker.push(note(40), 100)
    expect(tracker.push(note(40), 160)).toBe(40)
  })

  it('only confirms once per stable streak', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(40), 0)
    expect(tracker.push(note(40), 160)).toBe(40)
    expect(tracker.push(note(40), 200)).toBeNull()
  })

  it('resets the stability timer when the reading changes', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(40), 0)
    tracker.push(note(42), 100) // interrupted by a different pitch
    expect(tracker.push(note(42), 200)).toBeNull() // only 100ms stable on the new pitch
    expect(tracker.push(note(42), 260)).toBe(42)
  })

  it('treats a different octave of the same pitch class as a different reading', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(40), 0) // E2
    tracker.push(note(52), 100) // E3 — same pitch class, different octave
    expect(tracker.push(note(52), 200)).toBeNull() // stability restarted at t=100
    expect(tracker.push(note(52), 260)).toBe(52)
  })

  it('resets the stability timer on a null (silent) reading', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(40), 0)
    tracker.push(null, 50)
    tracker.push(note(40), 60)
    expect(tracker.push(note(40), 180)).toBeNull() // stability restarted at t=60
    expect(tracker.push(note(40), 220)).toBe(40)
  })

  it('can be confirmed again after an explicit reset', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(40), 0)
    expect(tracker.push(note(40), 160)).toBe(40)
    tracker.reset()
    tracker.push(note(40), 200)
    expect(tracker.push(note(40), 360)).toBe(40)
  })
})

describe('ignoreUntilChanged', () => {
  it('ignores a ringing note carried over from the previous round instead of confirming it again', () => {
    const tracker = createStabilityTracker(150)
    // The player just correctly played note 40; the round advances and the string is still ringing.
    tracker.ignoreUntilChanged(40)
    expect(tracker.push(note(40), 0)).toBeNull()
    expect(tracker.push(note(40), 200)).toBeNull()
    expect(tracker.push(note(40), 1000)).toBeNull() // never confirms, no matter how long it rings
  })

  it('resumes normal detection once the ringing note goes silent', () => {
    const tracker = createStabilityTracker(150)
    tracker.ignoreUntilChanged(40)
    tracker.push(note(40), 0)
    tracker.push(null, 100) // string muted / stopped ringing
    tracker.push(note(41), 150) // a genuinely new note played
    expect(tracker.push(note(41), 250)).toBeNull() // only 100ms stable so far
    expect(tracker.push(note(41), 310)).toBe(41)
  })

  it('resumes normal detection immediately if a different note is played over the ringing one', () => {
    const tracker = createStabilityTracker(150)
    tracker.ignoreUntilChanged(40)
    tracker.push(note(40), 0)
    tracker.push(note(43), 50) // played straight over the ringing note
    expect(tracker.push(note(43), 150)).toBeNull()
    expect(tracker.push(note(43), 210)).toBe(43)
  })

  it('does not block anything when there is nothing to ignore', () => {
    const tracker = createStabilityTracker(150)
    tracker.ignoreUntilChanged(null)
    tracker.push(note(40), 0)
    expect(tracker.push(note(40), 160)).toBe(40)
  })

  it('still allows the same note to be confirmed later, once the string has genuinely gone quiet', () => {
    const tracker = createStabilityTracker(150)
    tracker.ignoreUntilChanged(40)
    tracker.push(note(40), 0) // leftover ring, ignored
    tracker.push(null, 100) // string muted / stopped ringing
    tracker.push(null, 300) // silence held for 200ms — a genuine mute, not a glitch
    tracker.push(note(40), 320) // note 40 struck again as the genuine new target
    expect(tracker.push(note(40), 400)).toBeNull() // only 80ms stable since t=320
    expect(tracker.push(note(40), 480)).toBe(40) // 160ms stable since t=320
  })

  it('does not unblock on a momentary clarity dip, so decaying sustain cannot re-confirm the blocked note on its own', () => {
    // Pitch detection often drops out for a single frame mid-decay even though the string
    // never actually went quiet. That blip must not be mistaken for a genuine mute-then-replay.
    const tracker = createStabilityTracker(150)
    tracker.ignoreUntilChanged(40)
    tracker.push(note(40), 0)
    tracker.push(null, 50) // brief detector glitch, not a real mute
    tracker.push(note(40), 60) // the same string is still just ringing, not re-attacked
    expect(tracker.push(note(40), 260)).toBeNull()
    expect(tracker.push(note(40), 1000)).toBeNull() // never confirms while it keeps reappearing
  })
})
