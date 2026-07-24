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
    const stats = recordSample({}, 4, 1000)
    expect(stats[4]).toEqual({ avgResponseTimeMs: 1000, sampleCount: 1 })
  })

  it('applies an exponential moving average on subsequent samples', () => {
    let stats = recordSample({}, 4, 1000)
    stats = recordSample(stats, 4, 2000)
    // 1000 + 0.3 * (2000 - 1000) = 1300
    expect(stats[4].avgResponseTimeMs).toBeCloseTo(1300)
    expect(stats[4].sampleCount).toBe(2)
  })

  it('does not mutate the input map', () => {
    const original: AdaptiveStatsMap = {}
    recordSample(original, 0, 500)
    expect(original).toEqual({})
  })
})

describe('computeWeights', () => {
  it('gives unmeasured notes the global mean as their base weight', () => {
    const stats: AdaptiveStatsMap = { 0: { avgResponseTimeMs: 2000, sampleCount: 3 } }
    const weights = computeWeights(stats, [0, 1])
    expect(weights[0]).toBe(2000)
    expect(weights[1]).toBe(2000) // no data -> defaults to global mean, not favored or starved
  })

  it('floors weights so proficient notes are never starved to zero', () => {
    const stats: AdaptiveStatsMap = { 0: { avgResponseTimeMs: 10, sampleCount: 5 } }
    const weights = computeWeights(stats, [0])
    expect(weights[0]).toBeGreaterThan(0)
    expect(weights[0]).toBe(300) // MIN_WEIGHT_MS floor
  })

  it('falls back to a default mean when there is no data at all', () => {
    const weights = computeWeights({}, [0, 1, 2])
    expect(weights[0]).toBe(weights[1])
    expect(weights[1]).toBe(weights[2])
    expect(weights[0]).toBeGreaterThan(0)
  })
})

describe('adaptive stats persistence', () => {
  it('round-trips through localStorage', () => {
    const stats: AdaptiveStatsMap = { 6: { avgResponseTimeMs: 1234, sampleCount: 2 } }
    saveAdaptiveStats(stats)
    expect(loadAdaptiveStats()).toEqual(stats)
  })

  it('reset clears stats back to empty', () => {
    saveAdaptiveStats({ 6: { avgResponseTimeMs: 1234, sampleCount: 2 } })
    resetAdaptiveStats()
    expect(loadAdaptiveStats()).toEqual({})
  })

  it('returns empty stats when nothing has been saved yet', () => {
    expect(loadAdaptiveStats()).toEqual({})
  })
})
