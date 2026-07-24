import { describe, expect, it } from 'vitest'
import { pickRandomRound, pickWeightedRound } from './random'
import { isNoteOnString } from './fretboard'
import type { PitchClass, StringName } from '../../types'

const ALL_STRINGS: StringName[] = ['E', 'A', 'D', 'G', 'B', 'e']
const ALL_NOTES: PitchClass[] = Array.from({ length: 12 }, (_, i) => i)
const RANGE = { min: 0, max: 12 }

describe('pickRandomRound', () => {
  it('never picks the same note twice in a row', () => {
    let previous: PitchClass | null = null
    for (let i = 0; i < 500; i++) {
      const pick = pickRandomRound(ALL_STRINGS, ALL_NOTES, RANGE, previous)
      if (previous !== null) expect(pick.pitchClass).not.toBe(previous)
      previous = pick.pitchClass
    }
  })

  it('always picks a note reachable on the returned string', () => {
    for (let i = 0; i < 200; i++) {
      const pick = pickRandomRound(ALL_STRINGS, ALL_NOTES, RANGE, null)
      expect(isNoteOnString(pick.stringName, pick.pitchClass, RANGE)).toBe(true)
    }
  })

  it('only picks among selected strings and notes', () => {
    const strings: StringName[] = ['E', 'A']
    const notes: PitchClass[] = [0, 4, 7] // C, E, G
    for (let i = 0; i < 200; i++) {
      const pick = pickRandomRound(strings, notes, RANGE, null)
      expect(strings).toContain(pick.stringName)
      expect(notes).toContain(pick.pitchClass)
    }
  })

  it('allows a repeat when only one note is reachable', () => {
    const strings: StringName[] = ['E']
    const notes: PitchClass[] = [4] // only E is reachable at fret 0/12 on the low E string
    const first = pickRandomRound(strings, notes, RANGE, null)
    const second = pickRandomRound(strings, notes, RANGE, first.pitchClass)
    expect(second.pitchClass).toBe(4)
  })

  it('throws when no selected note is reachable on any selected string', () => {
    expect(() => pickRandomRound(['E'], [1], { min: 0, max: 0 }, null)).toThrow()
  })
})

describe('pickWeightedRound', () => {
  it('trends toward higher-weighted notes over many trials', () => {
    // Note: the no-successive-duplicate rule caps how dominant any single note can be
    // (it can appear at most every other round), so we assert a directional skew rather
    // than a raw ratio matching the input weight ratio.
    const notes: PitchClass[] = [0, 4, 7] // C, E, G
    const weights: Record<PitchClass, number> = { 0: 100, 4: 1, 7: 1 }
    const counts: Record<PitchClass, number> = { 0: 0, 4: 0, 7: 0 }
    let previous: PitchClass | null = null
    for (let i = 0; i < 3000; i++) {
      const pick = pickWeightedRound(ALL_STRINGS, notes, RANGE, previous, weights)
      counts[pick.pitchClass]++
      previous = pick.pitchClass
    }
    expect(counts[0]).toBeGreaterThan(counts[4] * 1.5)
    expect(counts[0]).toBeGreaterThan(counts[7] * 1.5)
  })

  it('still respects the no-repeat rule', () => {
    const notes: PitchClass[] = [0, 4]
    const weights: Record<PitchClass, number> = { 0: 100, 4: 1 }
    let previous: PitchClass | null = null
    for (let i = 0; i < 200; i++) {
      const pick = pickWeightedRound(ALL_STRINGS, notes, RANGE, previous, weights)
      if (previous !== null) expect(pick.pitchClass).not.toBe(previous)
      previous = pick.pitchClass
    }
  })
})
