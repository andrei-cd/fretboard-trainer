import type { AdaptiveStatsMap, PairWeights, StatsKey } from '../../types'
import { loadState, saveState } from './index'

/** How much weight a new sample carries in the rolling average (0-1, higher = more reactive). */
const EMA_ALPHA = 0.3
/** Floor so a very fast/proficient pair is never fully starved of appearances. */
const MIN_WEIGHT_MS = 300
/** Default response time assumed for pairs with no recorded samples yet, when no other data exists either. */
const DEFAULT_MEAN_MS = 1500

export function loadAdaptiveStats(): AdaptiveStatsMap {
  return loadState().adaptiveStats
}

export function saveAdaptiveStats(stats: AdaptiveStatsMap): void {
  saveState({ ...loadState(), adaptiveStats: stats })
}

export function resetAdaptiveStats(): void {
  saveAdaptiveStats({})
}

/** Pure rolling-average update — returns a new stats map, does not mutate or persist. */
export function recordSample(stats: AdaptiveStatsMap, key: StatsKey, responseTimeMs: number): AdaptiveStatsMap {
  const existing = stats[key]
  const avgResponseTimeMs = existing
    ? existing.avgResponseTimeMs + EMA_ALPHA * (responseTimeMs - existing.avgResponseTimeMs)
    : responseTimeMs
  const sampleCount = (existing?.sampleCount ?? 0) + 1
  return { ...stats, [key]: { avgResponseTimeMs, sampleCount } }
}

/**
 * Derives per (string, note) pair weights for the adaptive picker: slower pairs get higher
 * weight. Unmeasured pairs default to the global mean (neither favored nor starved), and every
 * pair keeps at least MIN_WEIGHT_MS so proficient spots still appear occasionally.
 */
export function computeWeights(stats: AdaptiveStatsMap, keys: readonly StatsKey[]): PairWeights {
  const measured = Object.values(stats)
  const globalMean =
    measured.length > 0
      ? measured.reduce((sum, entry) => sum + (entry?.avgResponseTimeMs ?? 0), 0) / measured.length
      : DEFAULT_MEAN_MS

  const weights: PairWeights = {}
  for (const key of keys) {
    const base = stats[key]?.avgResponseTimeMs ?? globalMean
    weights[key] = Math.max(base, MIN_WEIGHT_MS)
  }
  return weights
}
