import { describe, expect, it } from 'vitest'
import { frequencyToNote } from './pitchToNote'
import { noteNameToPitchClass } from '../music-theory/pitchClass'

describe('frequencyToNote', () => {
  it('maps 440Hz to A with ~0 cents offset', () => {
    const note = frequencyToNote(440)
    expect(note.pitchClass).toBe(noteNameToPitchClass('A'))
    expect(note.centsOffset).toBeCloseTo(0, 0)
  })

  it('maps 82.41Hz to low E (E2)', () => {
    const note = frequencyToNote(82.41)
    expect(note.pitchClass).toBe(noteNameToPitchClass('E'))
  })

  it('maps 261.63Hz to C (middle C)', () => {
    const note = frequencyToNote(261.63)
    expect(note.pitchClass).toBe(noteNameToPitchClass('C'))
  })

  it('reports a positive cents offset for a sharp reading', () => {
    const note = frequencyToNote(440 * Math.pow(2, 20 / 1200)) // 20 cents sharp of A
    expect(note.pitchClass).toBe(noteNameToPitchClass('A'))
    expect(note.centsOffset).toBeGreaterThan(0)
  })

  it('reports a negative cents offset for a flat reading', () => {
    const note = frequencyToNote(440 * Math.pow(2, -20 / 1200)) // 20 cents flat of A
    expect(note.pitchClass).toBe(noteNameToPitchClass('A'))
    expect(note.centsOffset).toBeLessThan(0)
  })
})
