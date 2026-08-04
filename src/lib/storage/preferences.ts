import type {
  AppMode,
  FretboardLabelMode,
  MicSensitivity,
  NoteId,
  NoteNameFormat,
  StringName,
} from '../../types'
import { DEFAULT_NOTE_IDS, STRING_NAMES } from '../music-theory'
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

export function loadThemeOverride(): 'light' | 'dark' | null {
  return loadState().themeOverride ?? null
}

export function saveThemeOverride(theme: 'light' | 'dark'): void {
  saveState({ ...loadState(), themeOverride: theme })
}

export function loadAppMode(): AppMode {
  return loadState().appMode ?? 'recall'
}

export function saveAppMode(mode: AppMode): void {
  saveState({ ...loadState(), appMode: mode })
}

export function loadRecognitionLeftHand(): boolean {
  return loadState().recognitionLeftHand ?? false
}

export function saveRecognitionLeftHand(enabled: boolean): void {
  saveState({ ...loadState(), recognitionLeftHand: enabled })
}

export function loadRecognitionFretCount(): number {
  return loadState().recognitionFretCount ?? 12
}

export function saveRecognitionFretCount(fretCount: number): void {
  saveState({ ...loadState(), recognitionFretCount: fretCount })
}

export function loadRecognitionLabelMode(): FretboardLabelMode {
  return loadState().recognitionLabelMode ?? 'frets-strings'
}

export function saveRecognitionLabelMode(mode: FretboardLabelMode): void {
  saveState({ ...loadState(), recognitionLabelMode: mode })
}

export function loadRecognitionNoteNameFormat(): NoteNameFormat {
  return loadState().recognitionNoteNameFormat ?? 'both'
}

export function saveRecognitionNoteNameFormat(format: NoteNameFormat): void {
  saveState({ ...loadState(), recognitionNoteNameFormat: format })
}

export function loadRecognitionShowFretMarkers(): boolean {
  return loadState().recognitionShowFretMarkers ?? true
}

export function saveRecognitionShowFretMarkers(enabled: boolean): void {
  saveState({ ...loadState(), recognitionShowFretMarkers: enabled })
}

export function loadRecognitionSelectedStrings(): StringName[] {
  return loadState().recognitionSelectedStrings ?? [...STRING_NAMES]
}

export function saveRecognitionSelectedStrings(strings: StringName[]): void {
  saveState({ ...loadState(), recognitionSelectedStrings: strings })
}

export function loadRecognitionNoteFilterEnabled(): boolean {
  return loadState().recognitionNoteFilterEnabled ?? false
}

export function saveRecognitionNoteFilterEnabled(enabled: boolean): void {
  saveState({ ...loadState(), recognitionNoteFilterEnabled: enabled })
}

export function loadRecognitionSelectedNotes(): NoteId[] {
  return loadState().recognitionSelectedNotes ?? [...DEFAULT_NOTE_IDS]
}

export function saveRecognitionSelectedNotes(notes: NoteId[]): void {
  saveState({ ...loadState(), recognitionSelectedNotes: notes })
}

export function loadRecognitionSoundEnabled(): boolean {
  return loadState().recognitionSoundEnabled ?? true
}

export function saveRecognitionSoundEnabled(enabled: boolean): void {
  saveState({ ...loadState(), recognitionSoundEnabled: enabled })
}

export function loadRecognitionFeedbackMessagesEnabled(): boolean {
  return loadState().recognitionFeedbackMessagesEnabled ?? true
}

export function saveRecognitionFeedbackMessagesEnabled(enabled: boolean): void {
  saveState({ ...loadState(), recognitionFeedbackMessagesEnabled: enabled })
}
