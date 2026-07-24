import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_SESSION_CONFIG, useSessionStore } from './sessionStore'
import { useStatsStore } from './statsStore'
import { isNoteOnString } from '../lib/music-theory'

beforeEach(() => {
  localStorage.clear()
  useSessionStore.setState({
    config: DEFAULT_SESSION_CONFIG,
    round: { current: null, previousPitchClass: null, roundStartedAt: null },
  })
  useStatsStore.setState({ stats: {} })
})

describe('sessionStore', () => {
  it('starts a round reachable on the selected strings/notes', () => {
    useSessionStore.getState().nextRound()
    const { current } = useSessionStore.getState().round
    expect(current).not.toBeNull()
    expect(isNoteOnString(current!.stringName, current!.pitchClass, DEFAULT_SESSION_CONFIG.fretRange)).toBe(true)
  })

  it('never repeats the previous note (by sound) across successive rounds', () => {
    let previous: number | null = null
    for (let i = 0; i < 100; i++) {
      useSessionStore.getState().nextRound()
      const { current } = useSessionStore.getState().round
      if (previous !== null) expect(current!.pitchClass).not.toBe(previous)
      previous = current!.pitchClass
    }
  })

  it('clears the round when no strings are selected', () => {
    useSessionStore.getState().setConfig({ selectedStrings: [] })
    useSessionStore.getState().nextRound()
    expect(useSessionStore.getState().round.current).toBeNull()
  })

  it('uses weighted selection in adaptive mode', () => {
    // Three eligible notes on a single string so the no-repeat rule doesn't force a strict 50/50 alternation.
    useStatsStore.setState({
      stats: {
        'E:C': { avgResponseTimeMs: 5000, sampleCount: 10 },
        'E:C#': { avgResponseTimeMs: 300, sampleCount: 10 },
      },
    })
    useSessionStore.getState().setConfig({ mode: 'adaptive', selectedStrings: ['E'], selectedNotes: ['C', 'C#', 'D'] })
    const counts = { C: 0, 'C#': 0, D: 0 } as Record<string, number>
    for (let i = 0; i < 600; i++) {
      useSessionStore.getState().nextRound()
      counts[useSessionStore.getState().round.current!.noteId]++
    }
    expect(counts.C).toBeGreaterThan(counts['C#'])
    expect(counts.C).toBeGreaterThan(counts.D)
  })

  it('weights the same note differently on different strings in adaptive mode', () => {
    // G is recorded as slow on the D string but fast on the E string.
    useStatsStore.setState({
      stats: {
        'D:G': { avgResponseTimeMs: 6000, sampleCount: 10 },
        'E:G': { avgResponseTimeMs: 500, sampleCount: 10 },
      },
    })
    useSessionStore.getState().setConfig({ mode: 'adaptive', selectedStrings: ['E', 'D'], selectedNotes: ['G', 'C'] })
    const counts = { 'D:G': 0, 'E:G': 0 } as Record<string, number>
    for (let i = 0; i < 600; i++) {
      useSessionStore.getState().nextRound()
      const { current } = useSessionStore.getState().round
      const key = `${current!.stringName}:${current!.noteId}`
      if (key in counts) counts[key]++
    }
    expect(counts['D:G']).toBeGreaterThan(counts['E:G'])
  })

  it('tracks F# and Gb as independently selectable notes that still block each other back-to-back', () => {
    useSessionStore.getState().setConfig({ selectedStrings: ['E'], selectedNotes: ['F#', 'Gb', 'A'] })
    let previousPitchClass: number | null = null
    for (let i = 0; i < 100; i++) {
      useSessionStore.getState().nextRound()
      const { current } = useSessionStore.getState().round
      if (previousPitchClass !== null) expect(current!.pitchClass).not.toBe(previousPitchClass)
      previousPitchClass = current!.pitchClass
    }
  })
})
