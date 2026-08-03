import { create } from 'zustand'
import type { AdaptiveStatsMap, NoteId, PairWeights, RoundPick, StringName } from '../types'
import { makeStatsKey } from '../lib/music-theory'
import {
  computeWeights,
  loadAdaptiveStats,
  recordSample as recordSamplePure,
  resetAdaptiveStats,
  resetStringStats as resetStringStatsPure,
  saveAdaptiveStats,
} from '../lib/storage/adaptiveStats'

interface StatsStore {
  stats: AdaptiveStatsMap
  recordSample: (stringName: StringName, noteId: NoteId, responseTimeMs: number) => void
  resetStats: () => void
  resetStringStats: (stringName: StringName) => void
  getWeights: (pairs: readonly RoundPick[]) => PairWeights
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: loadAdaptiveStats(),

  recordSample: (stringName, noteId, responseTimeMs) => {
    const key = makeStatsKey(stringName, noteId)
    const next = recordSamplePure(get().stats, key, responseTimeMs)
    saveAdaptiveStats(next)
    set({ stats: next })
  },

  resetStats: () => {
    resetAdaptiveStats()
    set({ stats: {} })
  },

  resetStringStats: (stringName) => {
    const next = resetStringStatsPure(get().stats, stringName)
    saveAdaptiveStats(next)
    set({ stats: next })
  },

  getWeights: (pairs) => computeWeights(get().stats, pairs.map((p) => makeStatsKey(p.stringName, p.noteId))),
}))
