import { describe, expect, it } from 'vitest'
import { DEFAULT_FRET_RANGE, fretsForNote, isNoteOnString, noteAtFret } from './fretboard'
import { noteNameToPitchClass } from './pitchClass'

describe('noteAtFret', () => {
  it('matches known fretboard positions', () => {
    expect(noteAtFret('E', 5)).toBe(noteNameToPitchClass('A')) // low E, fret 5 = A
    expect(noteAtFret('e', 0)).toBe(noteNameToPitchClass('E')) // high e, open = E
    expect(noteAtFret('D', 2)).toBe(noteNameToPitchClass('E')) // D string, fret 2 = E
    expect(noteAtFret('A', 3)).toBe(noteNameToPitchClass('C')) // A string, fret 3 = C
  })

  it('wraps around the octave past fret 12', () => {
    expect(noteAtFret('E', 12)).toBe(noteAtFret('E', 0))
  })
})

describe('fretsForNote', () => {
  it('round-trips with noteAtFret', () => {
    for (let fret = 0; fret <= 12; fret++) {
      const note = noteAtFret('G', fret)
      expect(fretsForNote('G', note, DEFAULT_FRET_RANGE)).toContain(fret)
    }
  })

  it('respects range boundaries', () => {
    // Low E open string is E; the next E on that string within range is fret 12.
    const frets = fretsForNote('E', noteNameToPitchClass('E'), { min: 0, max: 12 })
    expect(frets).toEqual([0, 12])
    expect(fretsForNote('E', noteNameToPitchClass('E'), { min: 1, max: 11 })).toEqual([])
  })
})

describe('isNoteOnString', () => {
  it('is true for reachable notes', () => {
    expect(isNoteOnString('E', noteNameToPitchClass('A'))).toBe(true)
  })

  it('is false when out of range', () => {
    expect(isNoteOnString('E', noteNameToPitchClass('E'), { min: 1, max: 11 })).toBe(false)
  })
})
