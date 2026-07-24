import { create } from 'zustand'
import type { RoundState, SessionConfig } from '../types'
import {
  DEFAULT_FRET_RANGE,
  DEFAULT_NOTE_IDS,
  STRING_NAMES,
  listReachablePairs,
  pickRandomRound,
  pickWeightedRound,
} from '../lib/music-theory'
import { useStatsStore } from './statsStore'

interface SessionStore {
  config: SessionConfig
  round: RoundState
  setConfig: (patch: Partial<SessionConfig>) => void
  nextRound: () => void
}

export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  mode: 'normal',
  selectedStrings: [...STRING_NAMES],
  selectedNotes: [...DEFAULT_NOTE_IDS],
  fretRange: DEFAULT_FRET_RANGE,
  timerSeconds: 5,
}

const EMPTY_ROUND: RoundState = { current: null, previousPitchClass: null, roundStartedAt: null }

export const useSessionStore = create<SessionStore>((set, get) => ({
  config: DEFAULT_SESSION_CONFIG,
  round: EMPTY_ROUND,

  setConfig: (patch) => set((state) => ({ config: { ...state.config, ...patch } })),

  nextRound: () => {
    const { config, round } = get()
    const { selectedStrings, selectedNotes, fretRange, mode } = config

    if (selectedStrings.length === 0 || selectedNotes.length === 0) {
      set({ round: { ...EMPTY_ROUND, previousPitchClass: round.previousPitchClass } })
      return
    }

    const pick =
      mode === 'adaptive'
        ? pickWeightedRound(
            selectedStrings,
            selectedNotes,
            fretRange,
            round.previousPitchClass,
            useStatsStore.getState().getWeights(listReachablePairs(selectedStrings, selectedNotes, fretRange)),
          )
        : pickRandomRound(selectedStrings, selectedNotes, fretRange, round.previousPitchClass)

    set({
      round: {
        current: pick,
        previousPitchClass: pick.pitchClass,
        roundStartedAt: Date.now(),
      },
    })
  },
}))
