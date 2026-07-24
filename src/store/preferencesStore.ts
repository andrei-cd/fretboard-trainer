import { create } from 'zustand'
import type { MicSensitivity } from '../types'
import {
  loadFeedbackMessagesEnabled,
  loadMergeAccidentalSpellingsEnabled,
  loadMicSensitivity,
  loadSoundEnabled,
  saveFeedbackMessagesEnabled,
  saveMergeAccidentalSpellingsEnabled,
  saveMicSensitivity,
  saveSoundEnabled,
} from '../lib/storage/preferences'

interface PreferencesStore {
  soundEnabled: boolean
  feedbackMessagesEnabled: boolean
  micSensitivity: MicSensitivity
  mergeAccidentalSpellingsEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  setFeedbackMessagesEnabled: (enabled: boolean) => void
  setMicSensitivity: (sensitivity: MicSensitivity) => void
  setMergeAccidentalSpellingsEnabled: (enabled: boolean) => void
}

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  soundEnabled: loadSoundEnabled(),
  feedbackMessagesEnabled: loadFeedbackMessagesEnabled(),
  micSensitivity: loadMicSensitivity(),
  mergeAccidentalSpellingsEnabled: loadMergeAccidentalSpellingsEnabled(),

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
}))
