import { create } from 'zustand'
import type { AdaptiveStatsMap, NoteId, NoteWeights } from '../types'
import {
  computeWeights,
  loadAdaptiveStats,
  recordSample as recordSamplePure,
  resetAdaptiveStats,
  saveAdaptiveStats,
} from '../lib/storage/adaptiveStats'

interface StatsStore {
  stats: AdaptiveStatsMap
  recordSample: (noteId: NoteId, responseTimeMs: number) => void
  resetStats: () => void
  getWeights: (noteIds: readonly NoteId[]) => NoteWeights
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: loadAdaptiveStats(),

  recordSample: (noteId, responseTimeMs) => {
    const next = recordSamplePure(get().stats, noteId, responseTimeMs)
    saveAdaptiveStats(next)
    set({ stats: next })
  },

  resetStats: () => {
    resetAdaptiveStats()
    set({ stats: {} })
  },

  getWeights: (noteIds) => computeWeights(get().stats, noteIds),
}))
