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

export function loadMergeAccidentalSpellingsEnabled(): boolean {
  return loadState().mergeAccidentalSpellingsEnabled ?? true
}

export function saveMergeAccidentalSpellingsEnabled(enabled: boolean): void {
  saveState({ ...loadState(), mergeAccidentalSpellingsEnabled: enabled })
}

export function loadMetronomeEnabled(): boolean {
  return loadState().metronomeEnabled ?? false
}

export function saveMetronomeEnabled(enabled: boolean): void {
  saveState({ ...loadState(), metronomeEnabled: enabled })
}

export function loadMetronomeBpm(): number {
  return loadState().metronomeBpm ?? 100
}

export function saveMetronomeBpm(bpm: number): void {
  saveState({ ...loadState(), metronomeBpm: bpm })
}

export function loadMetronomeLockToTimer(): boolean {
  return loadState().metronomeLockToTimer ?? false
}

export function saveMetronomeLockToTimer(enabled: boolean): void {
  saveState({ ...loadState(), metronomeLockToTimer: enabled })
}

export function loadMetronomeBeatsPerNote(): number {
  return loadState().metronomeBeatsPerNote ?? 4
}

export function saveMetronomeBeatsPerNote(beats: number): void {
  saveState({ ...loadState(), metronomeBeatsPerNote: beats })
}
