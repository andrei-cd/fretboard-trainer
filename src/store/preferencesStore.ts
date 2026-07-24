import { create } from 'zustand'
import type { MicSensitivity } from '../types'
import {
  loadFeedbackMessagesEnabled,
  loadMicSensitivity,
  loadSoundEnabled,
  saveFeedbackMessagesEnabled,
  saveMicSensitivity,
  saveSoundEnabled,
} from '../lib/storage/preferences'

interface PreferencesStore {
  soundEnabled: boolean
  feedbackMessagesEnabled: boolean
  micSensitivity: MicSensitivity
  setSoundEnabled: (enabled: boolean) => void
  setFeedbackMessagesEnabled: (enabled: boolean) => void
  setMicSensitivity: (sensitivity: MicSensitivity) => void
}

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  soundEnabled: loadSoundEnabled(),
  feedbackMessagesEnabled: loadFeedbackMessagesEnabled(),
  micSensitivity: loadMicSensitivity(),

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
}))
