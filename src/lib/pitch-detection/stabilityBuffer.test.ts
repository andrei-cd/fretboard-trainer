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
