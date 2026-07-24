import { describe, expect, it } from 'vitest'
import { pickRandomRound, pickWeightedRound } from './random'
import { isNoteOnString } from './fretboard'
import { ALL_NOTE_IDS, noteIdToPitchClass } from './pitchClass'
import type { NoteId, NoteWeights, StringName } from '../../types'

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

describe('pickWeightedRound', () => {
  it('trends toward higher-weighted notes over many trials', () => {
    // Note: the no-repeat-by-sound rule caps how dominant any single note can be
    // (it can appear at most every other round), so we assert a directional skew rather
    // than a raw ratio matching the input weight ratio.
    const notes: NoteId[] = ['C', 'E', 'G']
    const weights: NoteWeights = { C: 100, E: 1, G: 1 }
    const counts: Record<string, number> = { C: 0, E: 0, G: 0 }
    let previousPitchClass: number | null = null
    for (let i = 0; i < 3000; i++) {
      const pick = pickWeightedRound(ALL_STRINGS, notes, RANGE, previousPitchClass, weights)
      counts[pick.noteId]++
      previousPitchClass = pick.pitchClass
    }
    expect(counts.C).toBeGreaterThan(counts.E * 1.5)
    expect(counts.C).toBeGreaterThan(counts.G * 1.5)
  })

  it('weights F# and Gb independently even though they share a pitch class', () => {
    const notes: NoteId[] = ['F#', 'Gb', 'A']
    const weights: NoteWeights = { 'F#': 100, Gb: 1, A: 1 }
    const counts: Record<string, number> = { 'F#': 0, Gb: 0, A: 0 }
    let previousPitchClass: number | null = null
    for (let i = 0; i < 3000; i++) {
      const pick = pickWeightedRound(ALL_STRINGS, notes, RANGE, previousPitchClass, weights)
      counts[pick.noteId]++
      previousPitchClass = pick.pitchClass
    }
    expect(counts['F#']).toBeGreaterThan(counts.Gb * 5)
  })

  it('still respects the no-repeat-by-sound rule', () => {
    const notes: NoteId[] = ['C', 'E']
    const weights: NoteWeights = { C: 100, E: 1 }
    let previousPitchClass: number | null = null
    for (let i = 0; i < 200; i++) {
      const pick = pickWeightedRound(ALL_STRINGS, notes, RANGE, previousPitchClass, weights)
      if (previousPitchClass !== null) expect(pick.pitchClass).not.toBe(previousPitchClass)
      previousPitchClass = pick.pitchClass
    }
  })
})
