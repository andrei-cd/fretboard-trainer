import { create } from 'zustand'
import type { MicSensitivity } from '../types'
import {
  loadFeedbackMessagesEnabled,
  loadMergeAccidentalSpellingsEnabled,
  loadMetronomeBeatsPerNote,
  loadMetronomeBpm,
  loadMetronomeEnabled,
  loadMetronomeLockToTimer,
  loadMicSensitivity,
  loadSoundEnabled,
  loadThemeOverride,
  saveFeedbackMessagesEnabled,
  saveMergeAccidentalSpellingsEnabled,
  saveMetronomeBeatsPerNote,
  saveMetronomeBpm,
  saveMetronomeEnabled,
  saveMetronomeLockToTimer,
  saveMicSensitivity,
  saveSoundEnabled,
  saveThemeOverride,
} from '../lib/storage/preferences'

interface PreferencesStore {
  soundEnabled: boolean
  feedbackMessagesEnabled: boolean
  micSensitivity: MicSensitivity
  mergeAccidentalSpellingsEnabled: boolean
  metronomeEnabled: boolean
  metronomeBpm: number
  /** Timer mode only: derive BPM from the countdown length instead of `metronomeBpm`. */
  metronomeLockToTimer: boolean
  metronomeBeatsPerNote: number
  /** null until the user manually toggles the theme; from then on this explicit choice wins over the system preference. */
  themeOverride: 'light' | 'dark' | null
  setSoundEnabled: (enabled: boolean) => void
  setFeedbackMessagesEnabled: (enabled: boolean) => void
  setMicSensitivity: (sensitivity: MicSensitivity) => void
  setMergeAccidentalSpellingsEnabled: (enabled: boolean) => void
  setMetronomeEnabled: (enabled: boolean) => void
  setMetronomeBpm: (bpm: number) => void
  setMetronomeLockToTimer: (enabled: boolean) => void
  setMetronomeBeatsPerNote: (beats: number) => void
  setThemeOverride: (theme: 'light' | 'dark') => void
}

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  soundEnabled: loadSoundEnabled(),
  feedbackMessagesEnabled: loadFeedbackMessagesEnabled(),
  micSensitivity: loadMicSensitivity(),
  mergeAccidentalSpellingsEnabled: loadMergeAccidentalSpellingsEnabled(),
  metronomeEnabled: loadMetronomeEnabled(),
  metronomeBpm: loadMetronomeBpm(),
  metronomeLockToTimer: loadMetronomeLockToTimer(),
  metronomeBeatsPerNote: loadMetronomeBeatsPerNote(),
  themeOverride: loadThemeOverride(),

  setSoundEnabled: (enabled) => {
    saveSoundEnabled(enabled)
    set({ soundEnabled: enabled })
  },

  setFeedbackMessagesEnabled: (enabled) => {
    saveFeedbackMessagesEnabled(enabled)
    set({ feedbackMessagesEnabled: enabled })
  },

  setMicSensitivity: (sensitivity) => {
    saveMicSensitivity(sensitivity)
    set({ micSensitivity: sensitivity })
  },

  setMergeAccidentalSpellingsEnabled: (enabled) => {
    saveMergeAccidentalSpellingsEnabled(enabled)
    set({ mergeAccidentalSpellingsEnabled: enabled })
  },

  setMetronomeEnabled: (enabled) => {
    saveMetronomeEnabled(enabled)
    set({ metronomeEnabled: enabled })
  },

  setMetronomeBpm: (bpm) => {
    saveMetronomeBpm(bpm)
    set({ metronomeBpm: bpm })
  },

  setMetronomeLockToTimer: (enabled) => {
    saveMetronomeLockToTimer(enabled)
    set({ metronomeLockToTimer: enabled })
  },

  setMetronomeBeatsPerNote: (beats) => {
    saveMetronomeBeatsPerNote(beats)
    set({ metronomeBeatsPerNote: beats })
  },

  setThemeOverride: (theme) => {
    saveThemeOverride(theme)
    set({ themeOverride: theme })
  },
}))
