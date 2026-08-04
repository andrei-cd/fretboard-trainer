import { create } from 'zustand'
import type { RecognitionConfig, RecognitionRoundState } from '../types'
import { noteIdToPitchClass, pickRecognitionRound } from '../lib/music-theory'
import {
  loadRecognitionFretCount,
  loadRecognitionLabelMode,
  loadRecognitionLeftHand,
  loadRecognitionNoteFilterEnabled,
  loadRecognitionNoteNameFormat,
  loadRecognitionSelectedNotes,
  loadRecognitionSelectedStrings,
  loadRecognitionShowFretMarkers,
  saveRecognitionFretCount,
  saveRecognitionLabelMode,
  saveRecognitionLeftHand,
  saveRecognitionNoteFilterEnabled,
  saveRecognitionNoteNameFormat,
  saveRecognitionSelectedNotes,
  saveRecognitionSelectedStrings,
  saveRecognitionShowFretMarkers,
} from '../lib/storage/preferences'

interface RecognitionStore {
  config: RecognitionConfig
  round: RecognitionRoundState
  setConfig: (patch: Partial<RecognitionConfig>) => void
  nextRound: () => void
}

const DEFAULT_RECOGNITION_CONFIG: RecognitionConfig = {
  leftHand: loadRecognitionLeftHand(),
  fretCount: loadRecognitionFretCount(),
  labelMode: loadRecognitionLabelMode(),
  noteNameFormat: loadRecognitionNoteNameFormat(),
  showFretMarkers: loadRecognitionShowFretMarkers(),
  selectedStrings: loadRecognitionSelectedStrings(),
  noteFilterEnabled: loadRecognitionNoteFilterEnabled(),
  selectedNotes: loadRecognitionSelectedNotes(),
}

const EMPTY_ROUND: RecognitionRoundState = { current: null, previousPitchClass: null, roundStartedAt: null }

export const useRecognitionStore = create<RecognitionStore>((set, get) => ({
  config: DEFAULT_RECOGNITION_CONFIG,
  round: EMPTY_ROUND,

  setConfig: (patch) => {
    if (patch.leftHand !== undefined) saveRecognitionLeftHand(patch.leftHand)
    if (patch.fretCount !== undefined) saveRecognitionFretCount(patch.fretCount)
    if (patch.labelMode !== undefined) saveRecognitionLabelMode(patch.labelMode)
    if (patch.noteNameFormat !== undefined) saveRecognitionNoteNameFormat(patch.noteNameFormat)
    if (patch.showFretMarkers !== undefined) saveRecognitionShowFretMarkers(patch.showFretMarkers)
    if (patch.selectedStrings !== undefined) saveRecognitionSelectedStrings(patch.selectedStrings)
    if (patch.noteFilterEnabled !== undefined) saveRecognitionNoteFilterEnabled(patch.noteFilterEnabled)
    if (patch.selectedNotes !== undefined) saveRecognitionSelectedNotes(patch.selectedNotes)
    set((state) => ({ config: { ...state.config, ...patch } }))
  },

  nextRound: () => {
    const { config, round } = get()
    const { selectedStrings, fretCount, noteFilterEnabled, selectedNotes } = config

    if (selectedStrings.length === 0 || (noteFilterEnabled && selectedNotes.length === 0)) {
      set({ round: { ...EMPTY_ROUND, previousPitchClass: round.previousPitchClass } })
      return
    }

    const eligiblePitchClasses = noteFilterEnabled
      ? [...new Set(selectedNotes.map(noteIdToPitchClass))]
      : null

    const pick = pickRecognitionRound(
      selectedStrings,
      { min: 0, max: fretCount },
      eligiblePitchClasses,
      round.previousPitchClass,
    )

    set({
      round: {
        current: pick,
        previousPitchClass: pick.pitchClass,
        roundStartedAt: Date.now(),
      },
    })
  },
}))
