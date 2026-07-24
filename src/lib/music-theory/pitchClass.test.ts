import { describe, expect, it } from 'vitest'
import {
  ACCIDENTAL_NOTE_ID_PAIRS,
  ALL_NOTE_IDS,
  DEFAULT_NOTE_IDS,
  NATURAL_NOTE_IDS,
  noteIdsForPitchClass,
  noteIdToPitchClass,
  noteNameToPitchClass,
  pitchClassToLabel,
} from './pitchClass'

describe('pitchClassToLabel', () => {
  it('returns sharp spelling by default', () => {
    expect(pitchClassToLabel(1)).toBe('C#')
  })

  it('returns flat spelling when requested', () => {
    expect(pitchClassToLabel(1, 'flat')).toBe('Db')
  })

  it('normalizes out-of-range pitch classes', () => {
    expect(pitchClassToLabel(13)).toBe('C#')
    expect(pitchClassToLabel(-1)).toBe('B')
  })
})

describe('noteNameToPitchClass', () => {
  it('round-trips sharp names', () => {
    expect(noteNameToPitchClass('F#')).toBe(6)
    expect(pitchClassToLabel(noteNameToPitchClass('F#'))).toBe('F#')
  })

  it('parses flat names', () => {
    expect(noteNameToPitchClass('Gb')).toBe(6)
  })

  it('throws on invalid input', () => {
    expect(() => noteNameToPitchClass('H')).toThrow()
  })
})

describe('noteIdToPitchClass', () => {
  it('maps enharmonic spellings to the same pitch class', () => {
    expect(noteIdToPitchClass('F#')).toBe(noteIdToPitchClass('Gb'))
  })

  it('treats naturals as distinct pitch classes', () => {
    expect(noteIdToPitchClass('C')).not.toBe(noteIdToPitchClass('D'))
  })
})

describe('note id groupings', () => {
  it('has 17 total note ids: 7 naturals + 5 sharp/flat pairs', () => {
    expect(ALL_NOTE_IDS.length).toBe(17)
    expect(NATURAL_NOTE_IDS.length).toBe(7)
    expect(ACCIDENTAL_NOTE_ID_PAIRS.length).toBe(5)
  })

  it('every accidental pair shares a pitch class', () => {
    for (const [sharp, flat] of ACCIDENTAL_NOTE_ID_PAIRS) {
      expect(noteIdToPitchClass(sharp)).toBe(noteIdToPitchClass(flat))
    }
  })

  it('defaults to naturals + sharps only, excluding flat spellings', () => {
    expect(DEFAULT_NOTE_IDS.length).toBe(12)
    expect(DEFAULT_NOTE_IDS).not.toContain('Db')
    expect(DEFAULT_NOTE_IDS).not.toContain('Gb')
  })
})

describe('noteIdsForPitchClass', () => {
  it('returns a single note id for naturals', () => {
    expect(noteIdsForPitchClass(noteNameToPitchClass('C'))).toEqual(['C'])
  })

  it('returns both spellings for accidentals', () => {
    expect(noteIdsForPitchClass(noteNameToPitchClass('F#'))).toEqual(['F#', 'Gb'])
  })

  it('normalizes out-of-range pitch classes', () => {
    expect(noteIdsForPitchClass(13)).toEqual(['C#', 'Db'])
  })
})
