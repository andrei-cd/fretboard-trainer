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

  it('never repeats the previous note across successive rounds', () => {
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
    // Three eligible notes so the no-repeat rule doesn't force a strict 50/50 alternation.
    useStatsStore.setState({
      stats: {
        0: { avgResponseTimeMs: 5000, sampleCount: 10 },
        1: { avgResponseTimeMs: 300, sampleCount: 10 },
      },
    })
    useSessionStore.getState().setConfig({ mode: 'adaptive', selectedNotes: [0, 1, 2] })
    const counts = { 0: 0, 1: 0, 2: 0 } as Record<number, number>
    for (let i = 0; i < 600; i++) {
      useSessionStore.getState().nextRound()
      counts[useSessionStore.getState().round.current!.pitchClass]++
    }
    expect(counts[0]).toBeGreaterThan(counts[1])
    expect(counts[0]).toBeGreaterThan(counts[2])
  })
})
