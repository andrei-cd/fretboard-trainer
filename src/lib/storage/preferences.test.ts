import { beforeEach, describe, expect, it } from 'vitest'
import {
  loadAppMode,
  loadFeedbackMessagesEnabled,
  loadMergeAccidentalSpellingsEnabled,
  loadMetronomeBeatsPerNote,
  loadMetronomeBpm,
  loadMetronomeEnabled,
  loadMetronomeLockToTimer,
  loadMicSensitivity,
  loadRecognitionFeedbackMessagesEnabled,
  loadRecognitionFretCount,
  loadRecognitionLabelMode,
  loadRecognitionLeftHand,
  loadRecognitionNoteFilterEnabled,
  loadRecognitionNoteNameFormat,
  loadRecognitionSelectedNotes,
  loadRecognitionSelectedStrings,
  loadRecognitionShowFretMarkers,
  loadRecognitionSoundEnabled,
  loadSoundEnabled,
  loadThemeOverride,
  saveAppMode,
  saveFeedbackMessagesEnabled,
  saveMergeAccidentalSpellingsEnabled,
  saveMetronomeBeatsPerNote,
  saveMetronomeBpm,
  saveMetronomeEnabled,
  saveMetronomeLockToTimer,
  saveMicSensitivity,
  saveRecognitionFeedbackMessagesEnabled,
  saveRecognitionFretCount,
  saveRecognitionLabelMode,
  saveRecognitionLeftHand,
  saveRecognitionNoteFilterEnabled,
  saveRecognitionNoteNameFormat,
  saveRecognitionSelectedNotes,
  saveRecognitionSelectedStrings,
  saveRecognitionShowFretMarkers,
  saveRecognitionSoundEnabled,
  saveSoundEnabled,
  saveThemeOverride,
} from './preferences'

beforeEach(() => {
  localStorage.clear()
})

describe('sound preference persistence', () => {
  it('defaults to enabled when nothing has been saved yet', () => {
    expect(loadSoundEnabled()).toBe(true)
  })

  it('round-trips a saved value through localStorage', () => {
    saveSoundEnabled(false)
    expect(loadSoundEnabled()).toBe(false)
    saveSoundEnabled(true)
    expect(loadSoundEnabled()).toBe(true)
  })

  it('does not clobber adaptive stats when saving the sound preference', () => {
    localStorage.setItem(
      'music-note:v1',
      JSON.stringify({ version: 1, adaptiveStats: { 'E:C': { avgResponseTimeMs: 1000, sampleCount: 1 } } }),
    )
    saveSoundEnabled(false)
    const raw = JSON.parse(localStorage.getItem('music-note:v1')!)
    expect(raw.adaptiveStats['E:C']).toEqual({ avgResponseTimeMs: 1000, sampleCount: 1 })
    expect(raw.soundEnabled).toBe(false)
  })
})

describe('feedback messages preference persistence', () => {
  it('defaults to enabled when nothing has been saved yet', () => {
    expect(loadFeedbackMessagesEnabled()).toBe(true)
  })

  it('round-trips a saved value through localStorage', () => {
    saveFeedbackMessagesEnabled(false)
    expect(loadFeedbackMessagesEnabled()).toBe(false)
    saveFeedbackMessagesEnabled(true)
    expect(loadFeedbackMessagesEnabled()).toBe(true)
  })

  it('is independent of the sound preference', () => {
    saveSoundEnabled(false)
    saveFeedbackMessagesEnabled(true)
    expect(loadSoundEnabled()).toBe(false)
    expect(loadFeedbackMessagesEnabled()).toBe(true)
  })
})

describe('mic sensitivity preference persistence', () => {
  it('defaults to medium when nothing has been saved yet', () => {
    expect(loadMicSensitivity()).toBe('medium')
  })

  it('round-trips a saved value through localStorage', () => {
    saveMicSensitivity('low')
    expect(loadMicSensitivity()).toBe('low')
    saveMicSensitivity('high')
    expect(loadMicSensitivity()).toBe('high')
  })

  it('does not clobber adaptive stats when saving the sensitivity preference', () => {
    localStorage.setItem(
      'music-note:v1',
      JSON.stringify({ version: 1, adaptiveStats: { 'E:C': { avgResponseTimeMs: 1000, sampleCount: 1 } } }),
    )
    saveMicSensitivity('low')
    const raw = JSON.parse(localStorage.getItem('music-note:v1')!)
    expect(raw.adaptiveStats['E:C']).toEqual({ avgResponseTimeMs: 1000, sampleCount: 1 })
    expect(raw.micSensitivity).toBe('low')
  })
})

describe('merge accidental spellings preference persistence', () => {
  it('defaults to enabled when nothing has been saved yet', () => {
    expect(loadMergeAccidentalSpellingsEnabled()).toBe(true)
  })

  it('round-trips a saved value through localStorage', () => {
    saveMergeAccidentalSpellingsEnabled(false)
    expect(loadMergeAccidentalSpellingsEnabled()).toBe(false)
    saveMergeAccidentalSpellingsEnabled(true)
    expect(loadMergeAccidentalSpellingsEnabled()).toBe(true)
  })
})

describe('metronome preference persistence', () => {
  it('defaults to disabled, 100 bpm, unlocked, 4 beats per note', () => {
    expect(loadMetronomeEnabled()).toBe(false)
    expect(loadMetronomeBpm()).toBe(100)
    expect(loadMetronomeLockToTimer()).toBe(false)
    expect(loadMetronomeBeatsPerNote()).toBe(4)
  })

  it('round-trips saved values through localStorage', () => {
    saveMetronomeEnabled(true)
    saveMetronomeBpm(120)
    saveMetronomeLockToTimer(true)
    saveMetronomeBeatsPerNote(8)
    expect(loadMetronomeEnabled()).toBe(true)
    expect(loadMetronomeBpm()).toBe(120)
    expect(loadMetronomeLockToTimer()).toBe(true)
    expect(loadMetronomeBeatsPerNote()).toBe(8)
  })

  it('does not clobber adaptive stats when saving metronome preferences', () => {
    localStorage.setItem(
      'music-note:v1',
      JSON.stringify({ version: 1, adaptiveStats: { 'E:C': { avgResponseTimeMs: 1000, sampleCount: 1 } } }),
    )
    saveMetronomeEnabled(true)
    const raw = JSON.parse(localStorage.getItem('music-note:v1')!)
    expect(raw.adaptiveStats['E:C']).toEqual({ avgResponseTimeMs: 1000, sampleCount: 1 })
    expect(raw.metronomeEnabled).toBe(true)
  })
})

describe('theme override preference persistence', () => {
  it('defaults to null when nothing has been saved yet, unlike other prefs with a concrete default', () => {
    expect(loadThemeOverride()).toBeNull()
  })

  it('round-trips a saved value through localStorage', () => {
    saveThemeOverride('dark')
    expect(loadThemeOverride()).toBe('dark')
    saveThemeOverride('light')
    expect(loadThemeOverride()).toBe('light')
  })

  it('does not clobber adaptive stats when saving the theme preference', () => {
    localStorage.setItem(
      'music-note:v1',
      JSON.stringify({ version: 1, adaptiveStats: { 'E:C': { avgResponseTimeMs: 1000, sampleCount: 1 } } }),
    )
    saveThemeOverride('dark')
    const raw = JSON.parse(localStorage.getItem('music-note:v1')!)
    expect(raw.adaptiveStats['E:C']).toEqual({ avgResponseTimeMs: 1000, sampleCount: 1 })
    expect(raw.themeOverride).toBe('dark')
  })
})

describe('app mode preference persistence', () => {
  it('defaults to recall when nothing has been saved yet', () => {
    expect(loadAppMode()).toBe('recall')
  })

  it('round-trips a saved value through localStorage', () => {
    saveAppMode('recognition')
    expect(loadAppMode()).toBe('recognition')
    saveAppMode('recall')
    expect(loadAppMode()).toBe('recall')
  })
})

describe('recognition preference persistence', () => {
  it('defaults every field when nothing has been saved yet', () => {
    expect(loadRecognitionLeftHand()).toBe(false)
    expect(loadRecognitionFretCount()).toBe(12)
    expect(loadRecognitionLabelMode()).toBe('frets-strings')
    expect(loadRecognitionNoteNameFormat()).toBe('both')
    expect(loadRecognitionShowFretMarkers()).toBe(true)
    expect(loadRecognitionSelectedStrings()).toEqual(['E', 'A', 'D', 'G', 'B', 'e'])
    expect(loadRecognitionNoteFilterEnabled()).toBe(false)
    expect(loadRecognitionSelectedNotes().length).toBeGreaterThan(0)
    expect(loadRecognitionSoundEnabled()).toBe(true)
    expect(loadRecognitionFeedbackMessagesEnabled()).toBe(true)
  })

  it('round-trips saved values through localStorage', () => {
    saveRecognitionLeftHand(true)
    saveRecognitionFretCount(15)
    saveRecognitionLabelMode('strings-only')
    saveRecognitionNoteNameFormat('flats')
    saveRecognitionShowFretMarkers(false)
    saveRecognitionSelectedStrings(['E', 'A'])
    saveRecognitionNoteFilterEnabled(true)
    saveRecognitionSelectedNotes(['C', 'G'])
    saveRecognitionSoundEnabled(false)
    saveRecognitionFeedbackMessagesEnabled(false)

    expect(loadRecognitionLeftHand()).toBe(true)
    expect(loadRecognitionFretCount()).toBe(15)
    expect(loadRecognitionLabelMode()).toBe('strings-only')
    expect(loadRecognitionNoteNameFormat()).toBe('flats')
    expect(loadRecognitionShowFretMarkers()).toBe(false)
    expect(loadRecognitionSelectedStrings()).toEqual(['E', 'A'])
    expect(loadRecognitionNoteFilterEnabled()).toBe(true)
    expect(loadRecognitionSelectedNotes()).toEqual(['C', 'G'])
    expect(loadRecognitionSoundEnabled()).toBe(false)
    expect(loadRecognitionFeedbackMessagesEnabled()).toBe(false)
  })

  it('does not clobber adaptive stats or Recall preferences when saving Recognition preferences', () => {
    localStorage.setItem(
      'music-note:v1',
      JSON.stringify({ version: 1, adaptiveStats: { 'E:C': { avgResponseTimeMs: 1000, sampleCount: 1 } } }),
    )
    saveSoundEnabled(false)
    saveRecognitionSoundEnabled(true)
    const raw = JSON.parse(localStorage.getItem('music-note:v1')!)
    expect(raw.adaptiveStats['E:C']).toEqual({ avgResponseTimeMs: 1000, sampleCount: 1 })
    expect(raw.soundEnabled).toBe(false)
    expect(raw.recognitionSoundEnabled).toBe(true)
  })
})
