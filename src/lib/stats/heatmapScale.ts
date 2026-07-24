import type { AdaptiveStatsEntry } from '../../types'

/** Number of discrete color steps in the fast→slow heatmap ramp. */
export const HEATMAP_BUCKET_COUNT = 5

export interface HeatmapRange {
  min: number
  max: number
}

/** Range of avg response times across measured entries, or null if nothing has been recorded yet. */
export function computeRange(entries: readonly (AdaptiveStatsEntry | undefined)[]): HeatmapRange | null {
  const values = entries.filter((e): e is AdaptiveStatsEntry => e !== undefined).map((e) => e.avgResponseTimeMs)
  if (values.length === 0) return null
  return { min: Math.min(...values), max: Math.max(...values) }
}

/** Bucket index 0 (fastest) .. bucketCount-1 (slowest) for a value within range. */
export function bucketFor(value: number, range: HeatmapRange, bucketCount = HEATMAP_BUCKET_COUNT): number {
  if (range.max === range.min) return Math.floor(bucketCount / 2)
  const fraction = (value - range.min) / (range.max - range.min)
  return Math.min(bucketCount - 1, Math.max(0, Math.floor(fraction * bucketCount)))
}
