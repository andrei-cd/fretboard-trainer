import { describe, expect, it } from 'vitest'
import { createStabilityTracker } from './stabilityBuffer'
import type { DetectedNote } from './pitchToNote'

function note(pitchClass: number): DetectedNote {
  return { pitchClass, frequencyHz: 440, centsOffset: 0 }
}

describe('createStabilityTracker', () => {
  it('does not confirm before the stable duration has elapsed', () => {
    const tracker = createStabilityTracker(150)
    expect(tracker.push(note(4), 0)).toBeNull()
    expect(tracker.push(note(4), 100)).toBeNull()
  })

  it('confirms once the reading has been stable for long enough', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(4), 0)
    tracker.push(note(4), 100)
    expect(tracker.push(note(4), 160)).toBe(4)
  })

  it('only confirms once per stable streak', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(4), 0)
    expect(tracker.push(note(4), 160)).toBe(4)
    expect(tracker.push(note(4), 200)).toBeNull()
  })

  it('resets the stability timer when the reading changes', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(4), 0)
    tracker.push(note(6), 100) // interrupted by a different pitch
    expect(tracker.push(note(6), 200)).toBeNull() // only 100ms stable on the new pitch
    expect(tracker.push(note(6), 260)).toBe(6)
  })

  it('resets the stability timer on a null (silent) reading', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(4), 0)
    tracker.push(null, 50)
    tracker.push(note(4), 60)
    expect(tracker.push(note(4), 180)).toBeNull() // stability restarted at t=60
    expect(tracker.push(note(4), 220)).toBe(4)
  })

  it('can be confirmed again after an explicit reset', () => {
    const tracker = createStabilityTracker(150)
    tracker.push(note(4), 0)
    expect(tracker.push(note(4), 160)).toBe(4)
    tracker.reset()
    tracker.push(note(4), 200)
    expect(tracker.push(note(4), 360)).toBe(4)
  })
})
