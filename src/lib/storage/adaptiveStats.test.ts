import { beforeEach, describe, expect, it } from 'vitest'
import {
  computeWeights,
  loadAdaptiveStats,
  recordSample,
  resetAdaptiveStats,
  saveAdaptiveStats,
} from './adaptiveStats'
import type { AdaptiveStatsMap } from '../../types'

beforeEach(() => {
  localStorage.clear()
})

describe('recordSample', () => {
  it('seeds the average with the first sample', () => {
    const stats = recordSample({}, 'E', 1000)
    expect(stats.E).toEqual({ avgResponseTimeMs: 1000, sampleCount: 1 })
  })

  it('applies an exponential moving average on subsequent samples', () => {
    let stats = recordSample({}, 'E', 1000)
    stats = recordSample(stats, 'E', 2000)
    // 1000 + 0.3 * (2000 - 1000) = 1300
    expect(stats.E!.avgResponseTimeMs).toBeCloseTo(1300)
    expect(stats.E!.sampleCount).toBe(2)
  })

  it('tracks enharmonic spellings independently', () => {
    let stats = recordSample({}, 'F#', 500)
    stats = recordSample(stats, 'Gb', 4000)
    expect(stats['F#']!.avgResponseTimeMs).toBe(500)
    expect(stats.Gb!.avgResponseTimeMs).toBe(4000)
  })

  it('does not mutate the input map', () => {
    const original: AdaptiveStatsMap = {}
    recordSample(original, 'C', 500)
    expect(original).toEqual({})
  })
})

describe('computeWeights', () => {
  it('gives unmeasured notes the global mean as their base weight', () => {
    const stats: AdaptiveStatsMap = { C: { avgResponseTimeMs: 2000, sampleCount: 3 } }
    const weights = computeWeights(stats, ['C', 'D'])
    expect(weights.C).toBe(2000)
    expect(weights.D).toBe(2000) // no data -> defaults to global mean, not favored or starved
  })

  it('floors weights so proficient notes are never starved to zero', () => {
    const stats: AdaptiveStatsMap = { C: { avgResponseTimeMs: 10, sampleCount: 5 } }
    const weights = computeWeights(stats, ['C'])
    expect(weights.C).toBeGreaterThan(0)
    expect(weights.C).toBe(300) // MIN_WEIGHT_MS floor
  })

  it('falls back to a default mean when there is no data at all', () => {
    const weights = computeWeights({}, ['C', 'D', 'E'])
    expect(weights.C).toBe(weights.D)
    expect(weights.D).toBe(weights.E)
    expect(weights.C).toBeGreaterThan(0)
  })
})

describe('adaptive stats persistence', () => {
  it('round-trips through localStorage', () => {
    const stats: AdaptiveStatsMap = { 'F#': { avgResponseTimeMs: 1234, sampleCount: 2 } }
    saveAdaptiveStats(stats)
    expect(loadAdaptiveStats()).toEqual(stats)
  })

  it('reset clears stats back to empty', () => {
    saveAdaptiveStats({ 'F#': { avgResponseTimeMs: 1234, sampleCount: 2 } })
    resetAdaptiveStats()
    expect(loadAdaptiveStats()).toEqual({})
  })

  it('returns empty stats when nothing has been saved yet', () => {
    expect(loadAdaptiveStats()).toEqual({})
  })
})
