import type { AdaptiveStatsEntry } from '../../types'

/**
 * Combines multiple stats entries — e.g. the F# and Gb spellings of the same physical
 * fret — into one weighted-average entry, so a fretboard-position view reflects total
 * practice at that spot regardless of which name it was asked under. Returns null if
 * none of the entries have data.
 */
export function mergeEntries(entries: readonly (AdaptiveStatsEntry | undefined)[]): AdaptiveStatsEntry | null {
  const present = entries.filter((e): e is AdaptiveStatsEntry => e !== undefined)
  if (present.length === 0) return null

  const sampleCount = present.reduce((sum, e) => sum + e.sampleCount, 0)
  const avgResponseTimeMs = present.reduce((sum, e) => sum + e.avgResponseTimeMs * e.sampleCount, 0) / sampleCount
  return { avgResponseTimeMs, sampleCount }
}
