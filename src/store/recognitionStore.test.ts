import { beforeEach, describe, expect, it } from 'vitest'
import { useRecognitionStore } from './recognitionStore'
import { noteAtFret, noteIdToPitchClass } from '../lib/music-theory'

const DEFAULT_CONFIG = {
  leftHand: false,
  fretCount: 12,
  labelMode: 'frets-strings' as const,
  noteNameFormat: 'both' as const,
  showFretMarkers: true,
  selectedStrings: ['E', 'A', 'D', 'G', 'B', 'e'] as const,
  noteFilterEnabled: false,
  selectedNotes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const,
}

beforeEach(() => {
  localStorage.clear()
  useRecognitionStore.setState({
    config: { ...DEFAULT_CONFIG, selectedStrings: [...DEFAULT_CONFIG.selectedStrings], selectedNotes: [...DEFAULT_CONFIG.selectedNotes] },
    round: { current: null, previousPitchClass: null, roundStartedAt: null },
  })
})

describe('recognitionStore', () => {
  it('starts a round reachable within the selected strings and fret count', () => {
    useRecognitionStore.getState().nextRound()
    const { current } = useRecognitionStore.getState().round
    expect(current).not.toBeNull()
    expect(current!.fret).toBeGreaterThanOrEqual(0)
    expect(current!.fret).toBeLessThanOrEqual(12)
    expect(noteAtFret(current!.stringName, current!.fret)).toBe(current!.pitchClass)
  })

  it('never repeats the previous position\'s sound across successive rounds', () => {
    let previous: number | null = null
    for (let i = 0; i < 100; i++) {
      useRecognitionStore.getState().nextRound()
      const { current } = useRecognitionStore.getState().round
      if (previous !== null) expect(current!.pitchClass).not.toBe(previous)
      previous = current!.pitchClass
    }
  })

  it('clears the round when no strings are selected', () => {
    useRecognitionStore.getState().setConfig({ selectedStrings: [] })
    useRecognitionStore.getState().nextRound()
    expect(useRecognitionStore.getState().round.current).toBeNull()
  })

  it('clears the round when the note filter is enabled with no notes selected', () => {
    useRecognitionStore.getState().setConfig({ noteFilterEnabled: true, selectedNotes: [] })
    useRecognitionStore.getState().nextRound()
    expect(useRecognitionStore.getState().round.current).toBeNull()
  })

  it('respects the note filter when enabled', () => {
    useRecognitionStore.getState().setConfig({ noteFilterEnabled: true, selectedNotes: ['C', 'G'] })
    const eligible = [noteIdToPitchClass('C'), noteIdToPitchClass('G')]
    for (let i = 0; i < 100; i++) {
      useRecognitionStore.getState().nextRound()
      const { current } = useRecognitionStore.getState().round
      expect(eligible).toContain(current!.pitchClass)
    }
  })

  it('ignores the note filter when disabled, even with a restrictive selection', () => {
    useRecognitionStore.getState().setConfig({ noteFilterEnabled: false, selectedNotes: ['C'] })
    const seen = new Set<number>()
    for (let i = 0; i < 200; i++) {
      useRecognitionStore.getState().nextRound()
      seen.add(useRecognitionStore.getState().round.current!.pitchClass)
    }
    expect(seen.size).toBeGreaterThan(1)
  })

  it('persists each config field to localStorage as it changes', () => {
    useRecognitionStore.getState().setConfig({ leftHand: true, fretCount: 15 })
    const raw = JSON.parse(localStorage.getItem('music-note:v1')!)
    expect(raw.recognitionLeftHand).toBe(true)
    expect(raw.recognitionFretCount).toBe(15)
  })
})
