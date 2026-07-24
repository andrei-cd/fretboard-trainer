import { describe, expect, it } from 'vitest'
import { bucketFor, computeRange } from './heatmapScale'
import type { AdaptiveStatsEntry } from '../../types'

function entry(avgResponseTimeMs: number): AdaptiveStatsEntry {
  return { avgResponseTimeMs, sampleCount: 1 }
}

describe('computeRange', () => {
  it('returns null when there are no measured entries', () => {
    expect(computeRange([undefined, undefined])).toBeNull()
  })

  it('returns the min/max across measured entries, ignoring gaps', () => {
    expect(computeRange([entry(500), undefined, entry(3000), entry(1000)])).toEqual({ min: 500, max: 3000 })
  })
})

describe('bucketFor', () => {
  const range = { min: 0, max: 1000 }

  it('maps the minimum to bucket 0 and the maximum to the last bucket', () => {
    expect(bucketFor(0, range)).toBe(0)
    expect(bucketFor(1000, range)).toBe(4)
  })

  it('maps values in between proportionally', () => {
    expect(bucketFor(100, range)).toBe(0) // 10% -> bucket 0 of 5
    expect(bucketFor(500, range)).toBe(2) // 50% -> middle bucket
    expect(bucketFor(999, range)).toBe(4)
  })

  it('falls back to the middle bucket when every value is identical', () => {
    expect(bucketFor(500, { min: 500, max: 500 })).toBe(2)
  })
})
