import { describe, expect, it } from 'vitest'
import {
  DEFAULT_FRET_RANGE,
  formatStringName,
  fretsForNote,
  isNoteOnString,
  midiNoteAtFret,
  midiNotesForNote,
  noteAtFret,
} from './fretboard'
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

describe('midiNoteAtFret', () => {
  it('matches known MIDI note numbers', () => {
    expect(midiNoteAtFret('E', 0)).toBe(40) // low E2
    expect(midiNoteAtFret('A', 0)).toBe(45) // A2
    expect(midiNoteAtFret('e', 0)).toBe(64) // high E4
    expect(midiNoteAtFret('E', 5)).toBe(45) // low E string, fret 5 = A2, same octave as open A string
  })
})

describe('midiNotesForNote', () => {
  it('returns distinct octaves for a note that recurs on the same string', () => {
    // Low E string: open (fret 0) and fret 12 are both E, an octave apart.
    const midiNotes = midiNotesForNote('E', noteNameToPitchClass('E'), DEFAULT_FRET_RANGE)
    expect(midiNotes).toEqual([40, 52])
  })

  it('distinguishes the same pitch class on different strings by octave', () => {
    // The G on the low E string (fret 3, G2) is a different octave than the open G string (G3).
    const onLowE = midiNotesForNote('E', noteNameToPitchClass('G'), DEFAULT_FRET_RANGE)
    const onG = midiNotesForNote('G', noteNameToPitchClass('G'), DEFAULT_FRET_RANGE)
    expect(onLowE).toEqual([43])
    expect(onG).toEqual([55, 67]) // open G3, and fret 12 = G4
    expect(onLowE[0]).not.toBe(onG[0])
  })
})

describe('formatStringName', () => {
  it('renders the high e string distinctly from the low E string', () => {
    expect(formatStringName('e')).toBe('high e')
    expect(formatStringName('E')).toBe('E')
  })
})
