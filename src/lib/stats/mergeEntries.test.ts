import { describe, expect, it } from 'vitest'
import { mergeEntries } from './mergeEntries'

describe('mergeEntries', () => {
  it('returns null when nothing is present', () => {
    expect(mergeEntries([undefined, undefined])).toBeNull()
  })

  it('passes through a single entry unchanged', () => {
    expect(mergeEntries([{ avgResponseTimeMs: 1200, sampleCount: 4 }, undefined])).toEqual({
      avgResponseTimeMs: 1200,
      sampleCount: 4,
    })
  })

  it('combines multiple entries as a sample-count-weighted average', () => {
    // F#: 1000ms over 10 samples, Gb: 4000ms over 1 sample (much less confident).
    const merged = mergeEntries([
      { avgResponseTimeMs: 1000, sampleCount: 10 },
      { avgResponseTimeMs: 4000, sampleCount: 1 },
    ])
    // (1000*10 + 4000*1) / 11 = 1272.7...
    expect(merged!.avgResponseTimeMs).toBeCloseTo(1272.73, 1)
    expect(merged!.sampleCount).toBe(11)
  })
})
