import { describe, expect, it } from 'vitest'
import { noteNameToPitchClass, pitchClassToEnharmonicLabel, pitchClassToLabel } from './pitchClass'

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

describe('pitchClassToEnharmonicLabel', () => {
  it('combines sharp and flat spellings for accidentals', () => {
    expect(pitchClassToEnharmonicLabel(1)).toBe('C#/Db')
  })

  it('returns a single name for naturals', () => {
    expect(pitchClassToEnharmonicLabel(0)).toBe('C')
  })
})
