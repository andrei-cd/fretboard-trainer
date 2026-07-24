import { describe, expect, it } from 'vitest'
import { listReachablePairs, pickRandomRound, pickWeightedRound } from './random'
import { isNoteOnString } from './fretboard'
import { makeStatsKey } from './statsKey'
import { ALL_NOTE_IDS, noteIdToPitchClass } from './pitchClass'
import type { NoteId, PairWeights, StringName } from '../../types'

const ALL_STRINGS: StringName[] = ['E', 'A', 'D', 'G', 'B', 'e']
const RANGE = { min: 0, max: 12 }

describe('pickRandomRound', () => {
  it('never picks a note that sounds like the previous one', () => {
    let previousPitchClass: number | null = null
    for (let i = 0; i < 500; i++) {
      const pick = pickRandomRound(ALL_STRINGS, ALL_NOTE_IDS as NoteId[], RANGE, previousPitchClass)
      if (previousPitchClass !== null) expect(pick.pitchClass).not.toBe(previousPitchClass)
      previousPitchClass = pick.pitchClass
    }
  })

  it('always picks a note reachable on the returned string', () => {
    for (let i = 0; i < 200; i++) {
      const pick = pickRandomRound(ALL_STRINGS, ALL_NOTE_IDS as NoteId[], RANGE, null)
      expect(isNoteOnString(pick.stringName, pick.pitchClass, RANGE)).toBe(true)
    }
  })

  it('only picks among selected strings and notes', () => {
    const strings: StringName[] = ['E', 'A']
    const notes: NoteId[] = ['C', 'E', 'G']
    for (let i = 0; i < 200; i++) {
      const pick = pickRandomRound(strings, notes, RANGE, null)
      expect(strings).toContain(pick.stringName)
      expect(notes).toContain(pick.noteId)
    }
  })

  it('blocks an enharmonic repeat (F# then Gb) just like a literal repeat', () => {
    const strings: StringName[] = ['E']
    const notes: NoteId[] = ['F#', 'Gb', 'A']
    const previousPitchClass = noteIdToPitchClass('F#')
    for (let i = 0; i < 200; i++) {
      const pick = pickRandomRound(strings, notes, RANGE, previousPitchClass)
      expect(pick.noteId).toBe('A')
    }
  })

  it('allows a repeat when only one sound is reachable', () => {
    const strings: StringName[] = ['E']
    const notes: NoteId[] = ['F#', 'Gb'] // both pitch class 6, no alternative sound available
    const first = pickRandomRound(strings, notes, RANGE, null)
    const second = pickRandomRound(strings, notes, RANGE, first.pitchClass)
    expect(second.pitchClass).toBe(first.pitchClass)
  })

  it('throws when no selected note is reachable on any selected string', () => {
    expect(() => pickRandomRound(['E'], ['C#'], { min: 0, max: 0 }, null)).toThrow()
  })
})

describe('listReachablePairs', () => {
  it('enumerates every playable (string, note) combination', () => {
    const pairs = listReachablePairs(['E', 'A'], ['C', 'G'], RANGE)
    // C: fret 8 on E, fret 3 on A. G: fret 3 on E, open on A.
    expect(pairs).toHaveLength(4)
    expect(pairs.every((p) => isNoteOnString(p.stringName, p.pitchClass, RANGE))).toBe(true)
  })

  it('omits combinations that are not reachable', () => {
    const pairs = listReachablePairs(['E'], ['C#'], { min: 0, max: 0 }) // only the open note is in range
    expect(pairs).toHaveLength(0)
  })
})

describe('pickWeightedRound', () => {
  it('trends toward higher-weighted notes over many trials', () => {
    // Note: the no-repeat-by-sound rule caps how dominant any single note can be
    // (it can appear at most every other round), so we assert a directional skew rather
    // than a raw ratio matching the input weight ratio. Single string keeps one pair per note.
    const strings: StringName[] = ['E']
    const notes: NoteId[] = ['C', 'E', 'G']
    const weights: PairWeights = { [makeStatsKey('E', 'C')]: 100, [makeStatsKey('E', 'E')]: 1, [makeStatsKey('E', 'G')]: 1 }
    const counts: Record<string, number> = { C: 0, E: 0, G: 0 }
    let previousPitchClass: number | null = null
    for (let i = 0; i < 3000; i++) {
      const pick = pickWeightedRound(strings, notes, RANGE, previousPitchClass, weights)
      counts[pick.noteId]++
      previousPitchClass = pick.pitchClass
    }
    expect(counts.C).toBeGreaterThan(counts.E * 1.5)
    expect(counts.C).toBeGreaterThan(counts.G * 1.5)
  })

  it('weights F# and Gb independently even though they share a pitch class', () => {
    const strings: StringName[] = ['E']
    const notes: NoteId[] = ['F#', 'Gb', 'A']
    const weights: PairWeights = { [makeStatsKey('E', 'F#')]: 100, [makeStatsKey('E', 'Gb')]: 1, [makeStatsKey('E', 'A')]: 1 }
    const counts: Record<string, number> = { 'F#': 0, Gb: 0, A: 0 }
    let previousPitchClass: number | null = null
    for (let i = 0; i < 3000; i++) {
      const pick = pickWeightedRound(strings, notes, RANGE, previousPitchClass, weights)
      counts[pick.noteId]++
      previousPitchClass = pick.pitchClass
    }
    expect(counts['F#']).toBeGreaterThan(counts.Gb * 5)
  })

  it('weights the same note differently depending on which string it is on', () => {
    // G is slow specifically on the D string, but fast everywhere else.
    const strings: StringName[] = ['E', 'D']
    const notes: NoteId[] = ['G', 'C']
    const weights: PairWeights = {
      [makeStatsKey('D', 'G')]: 100,
      [makeStatsKey('E', 'G')]: 1,
      [makeStatsKey('E', 'C')]: 1,
      [makeStatsKey('D', 'C')]: 1,
    }
    const counts: Record<string, number> = { 'D:G': 0, 'E:G': 0, 'E:C': 0, 'D:C': 0 }
    let previousPitchClass: number | null = null
    for (let i = 0; i < 4000; i++) {
      const pick = pickWeightedRound(strings, notes, RANGE, previousPitchClass, weights)
      counts[makeStatsKey(pick.stringName, pick.noteId)]++
      previousPitchClass = pick.pitchClass
    }
    // The D-string G should dominate; the E-string G (same note, unweighted) should not.
    expect(counts['D:G']).toBeGreaterThan(counts['E:G'] * 5)
  })

  it('still respects the no-repeat-by-sound rule', () => {
    const notes: NoteId[] = ['C', 'E']
    const weights: PairWeights = {}
    let previousPitchClass: number | null = null
    for (let i = 0; i < 200; i++) {
      const pick = pickWeightedRound(ALL_STRINGS, notes, RANGE, previousPitchClass, weights)
      if (previousPitchClass !== null) expect(pick.pitchClass).not.toBe(previousPitchClass)
      previousPitchClass = pick.pitchClass
    }
  })
})
