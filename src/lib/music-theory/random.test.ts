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

  it('by default, treats both spellings of a selected accidental as one pool slot', () => {
    // Without merging, F#/Gb would occupy 2 of 3 note ids and get picked ~2x as often as A.
    // previousPitchClass is held at null throughout so the no-repeat rule (which forces
    // alternation when there are only 2 distinct pitch classes) doesn't mask the effect.
    const strings: StringName[] = ['E']
    const notes: NoteId[] = ['F#', 'Gb', 'A']
    const counts: Record<string, number> = { 'F#': 0, Gb: 0, A: 0 }
    for (let i = 0; i < 3000; i++) {
      const pick = pickRandomRound(strings, notes, RANGE, null)
      counts[pick.noteId]++
    }
    const accidentalCount = counts['F#'] + counts.Gb
    // Roughly 1:1 between the merged accidental slot and the natural note, not ~2:1.
    expect(accidentalCount).toBeLessThan(counts.A * 1.5)
    expect(accidentalCount).toBeGreaterThan(counts.A * 0.67)
    // Both spellings still get picked when the merged slot wins.
    expect(counts['F#']).toBeGreaterThan(0)
    expect(counts.Gb).toBeGreaterThan(0)
  })

  it('keeps both spellings as separate slots when merging is disabled', () => {
    const strings: StringName[] = ['E']
    const notes: NoteId[] = ['F#', 'Gb', 'A']
    const counts: Record<string, number> = { 'F#': 0, Gb: 0, A: 0 }
    for (let i = 0; i < 3000; i++) {
      const pick = pickRandomRound(strings, notes, RANGE, null, false)
      counts[pick.noteId]++
    }
    const accidentalCount = counts['F#'] + counts.Gb
    expect(accidentalCount).toBeGreaterThan(counts.A * 1.5)
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

  it('weights F# and Gb independently when merging is disabled, even though they share a pitch class', () => {
    const strings: StringName[] = ['E']
    const notes: NoteId[] = ['F#', 'Gb', 'A']
    const weights: PairWeights = { [makeStatsKey('E', 'F#')]: 100, [makeStatsKey('E', 'Gb')]: 1, [makeStatsKey('E', 'A')]: 1 }
    const counts: Record<string, number> = { 'F#': 0, Gb: 0, A: 0 }
    for (let i = 0; i < 3000; i++) {
      const pick = pickWeightedRound(strings, notes, RANGE, null, weights, false)
      counts[pick.noteId]++
    }
    expect(counts['F#']).toBeGreaterThan(counts.Gb * 5)
  })

  it('by default, merges accidental spellings into one slot weighted by their average', () => {
    const strings: StringName[] = ['E']
    const notes: NoteId[] = ['F#', 'Gb', 'A']
    const weights: PairWeights = { [makeStatsKey('E', 'F#')]: 100, [makeStatsKey('E', 'Gb')]: 1, [makeStatsKey('E', 'A')]: 1 }
    const counts: Record<string, number> = { 'F#': 0, Gb: 0, A: 0 }
    for (let i = 0; i < 3000; i++) {
      const pick = pickWeightedRound(strings, notes, RANGE, null, weights)
      counts[pick.noteId]++
    }
    // Merged slot weight (100+1)/2 = 50.5 still dwarfs A's weight of 1, so it dominates...
    expect(counts['F#'] + counts.Gb).toBeGreaterThan(counts.A * 10)
    // ...but within that slot F# and Gb are no longer 100:1 — the exact spelling shown is
    // a coin flip once the slot is chosen, unlike the disabled case above.
    expect(counts['F#']).toBeLessThan(counts.Gb * 3)
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
