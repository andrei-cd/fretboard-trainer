import { beforeEach, describe, expect, it } from 'vitest'
import {
  computeWeights,
  loadAdaptiveStats,
  recordSample,
  resetAdaptiveStats,
  resetStringStats,
  saveAdaptiveStats,
} from './adaptiveStats'
import type { AdaptiveStatsMap } from '../../types'

beforeEach(() => {
  localStorage.clear()
})

describe('recordSample', () => {
  it('seeds the average with the first sample', () => {
    const stats = recordSample({}, 'E:E', 1000)
    expect(stats['E:E']).toEqual({ avgResponseTimeMs: 1000, sampleCount: 1 })
  })

  it('applies an exponential moving average on subsequent samples', () => {
    let stats = recordSample({}, 'E:E', 1000)
    stats = recordSample(stats, 'E:E', 2000)
    // 1000 + 0.3 * (2000 - 1000) = 1300
    expect(stats['E:E']!.avgResponseTimeMs).toBeCloseTo(1300)
    expect(stats['E:E']!.sampleCount).toBe(2)
  })

  it('tracks the same note on different strings independently', () => {
    let stats = recordSample({}, 'E:F#', 500)
    stats = recordSample(stats, 'D:F#', 4000)
    expect(stats['E:F#']!.avgResponseTimeMs).toBe(500)
    expect(stats['D:F#']!.avgResponseTimeMs).toBe(4000)
  })

  it('tracks enharmonic spellings independently', () => {
    let stats = recordSample({}, 'E:F#', 500)
    stats = recordSample(stats, 'E:Gb', 4000)
    expect(stats['E:F#']!.avgResponseTimeMs).toBe(500)
    expect(stats['E:Gb']!.avgResponseTimeMs).toBe(4000)
  })

  it('does not mutate the input map', () => {
    const original: AdaptiveStatsMap = {}
    recordSample(original, 'A:C', 500)
    expect(original).toEqual({})
  })
})

describe('computeWeights', () => {
  it('gives unmeasured pairs the global mean as their base weight', () => {
    const stats: AdaptiveStatsMap = { 'E:C': { avgResponseTimeMs: 2000, sampleCount: 3 } }
    const weights = computeWeights(stats, ['E:C', 'E:D'])
    expect(weights['E:C']).toBe(2000)
    expect(weights['E:D']).toBe(2000) // no data -> defaults to global mean, not favored or starved
  })

  it('floors weights so proficient pairs are never starved to zero', () => {
    const stats: AdaptiveStatsMap = { 'E:C': { avgResponseTimeMs: 10, sampleCount: 5 } }
    const weights = computeWeights(stats, ['E:C'])
    expect(weights['E:C']).toBeGreaterThan(0)
    expect(weights['E:C']).toBe(300) // MIN_WEIGHT_MS floor
  })

  it('falls back to a default mean when there is no data at all', () => {
    const weights = computeWeights({}, ['E:C', 'E:D', 'E:E'])
    expect(weights['E:C']).toBe(weights['E:D'])
    expect(weights['E:D']).toBe(weights['E:E'])
    expect(weights['E:C']).toBeGreaterThan(0)
  })
})

describe('adaptive stats persistence', () => {
  it('round-trips through localStorage', () => {
    const stats: AdaptiveStatsMap = { 'E:F#': { avgResponseTimeMs: 1234, sampleCount: 2 } }
    saveAdaptiveStats(stats)
    expect(loadAdaptiveStats()).toEqual(stats)
  })

  it('reset clears stats back to empty', () => {
    saveAdaptiveStats({ 'E:F#': { avgResponseTimeMs: 1234, sampleCount: 2 } })
    resetAdaptiveStats()
    expect(loadAdaptiveStats()).toEqual({})
  })

  it('returns empty stats when nothing has been saved yet', () => {
    expect(loadAdaptiveStats()).toEqual({})
  })
})

describe('resetStringStats', () => {
  it('removes only entries for the given string', () => {
    const stats: AdaptiveStatsMap = {
      'E:C': { avgResponseTimeMs: 1000, sampleCount: 1 },
      'A:C': { avgResponseTimeMs: 2000, sampleCount: 1 },
      'E:D': { avgResponseTimeMs: 1500, sampleCount: 1 },
    }
    const next = resetStringStats(stats, 'E')
    expect(next).toEqual({ 'A:C': { avgResponseTimeMs: 2000, sampleCount: 1 } })
  })

  it('does not mutate the input map', () => {
    const original: AdaptiveStatsMap = { 'E:C': { avgResponseTimeMs: 1000, sampleCount: 1 } }
    resetStringStats(original, 'E')
    expect(original).toEqual({ 'E:C': { avgResponseTimeMs: 1000, sampleCount: 1 } })
  })

  it('is a no-op when the string has no data', () => {
    const stats: AdaptiveStatsMap = { 'A:C': { avgResponseTimeMs: 2000, sampleCount: 1 } }
    expect(resetStringStats(stats, 'E')).toEqual(stats)
  })
})
