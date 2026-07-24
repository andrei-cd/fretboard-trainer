import type { MicSensitivity } from '../../types'
import { loadState, saveState } from './index'

export function loadSoundEnabled(): boolean {
  return loadState().soundEnabled ?? true
}

export function saveSoundEnabled(enabled: boolean): void {
  saveState({ ...loadState(), soundEnabled: enabled })
}

export function loadFeedbackMessagesEnabled(): boolean {
  return loadState().feedbackMessagesEnabled ?? true
}

export function saveFeedbackMessagesEnabled(enabled: boolean): void {
  saveState({ ...loadState(), feedbackMessagesEnabled: enabled })
}

export function loadMicSensitivity(): MicSensitivity {
  return loadState().micSensitivity ?? 'medium'
}

export function saveMicSensitivity(sensitivity: MicSensitivity): void {
  saveState({ ...loadState(), micSensitivity: sensitivity })
}
