import { create } from 'zustand'
import type { AdaptiveStatsMap, PitchClass } from '../types'
import {
  computeWeights,
  loadAdaptiveStats,
  recordSample as recordSamplePure,
  resetAdaptiveStats,
  saveAdaptiveStats,
} from '../lib/storage/adaptiveStats'

interface StatsStore {
  stats: AdaptiveStatsMap
  recordSample: (pitchClass: PitchClass, responseTimeMs: number) => void
  resetStats: () => void
  getWeights: (pitchClasses: readonly PitchClass[]) => Record<PitchClass, number>
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: loadAdaptiveStats(),

  recordSample: (pitchClass, responseTimeMs) => {
    const next = recordSamplePure(get().stats, pitchClass, responseTimeMs)
    saveAdaptiveStats(next)
    set({ stats: next })
  },

  resetStats: () => {
    resetAdaptiveStats()
    set({ stats: {} })
  },

  getWeights: (pitchClasses) => computeWeights(get().stats, pitchClasses),
}))
