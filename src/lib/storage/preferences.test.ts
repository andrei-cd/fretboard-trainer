import { beforeEach, describe, expect, it } from 'vitest'
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
