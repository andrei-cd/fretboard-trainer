import { describe, expect, it } from 'vitest'
import { playErrorSound, playSuccessSound } from './feedbackSounds'

describe('feedback sounds', () => {
  it('never throws, even when Web Audio is unavailable (e.g. in this test environment)', () => {
    expect(() => playSuccessSound()).not.toThrow()
    expect(() => playErrorSound()).not.toThrow()
  })
})
