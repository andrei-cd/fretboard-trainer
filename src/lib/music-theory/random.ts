import type { FretRange, PitchClass, RoundPick, StringName } from '../../types'
import { isNoteOnString } from './fretboard'

function pickRandomFrom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function pickWeightedFrom(items: readonly PitchClass[], weights: Record<PitchClass, number>): PitchClass {
  const total = items.reduce((sum, item) => sum + (weights[item] ?? 1), 0)
  let roll = Math.random() * total
  for (const item of items) {
    roll -= weights[item] ?? 1
    if (roll <= 0) return item
  }
  return items[items.length - 1]
}

/** Notes from `notes` that are actually playable on at least one of `strings` within `range`. */
function reachableNotes(strings: StringName[], notes: PitchClass[], range: FretRange): PitchClass[] {
  return notes.filter((note) => strings.some((s) => isNoteOnString(s, note, range)))
}

/** Strings (among `strings`) on which `note` is playable within `range`. */
function stringsForNote(strings: StringName[], note: PitchClass, range: FretRange): StringName[] {
  return strings.filter((s) => isNoteOnString(s, note, range))
}

function excludingPrevious(candidates: PitchClass[], previous: PitchClass | null): PitchClass[] {
  if (candidates.length <= 1 || previous === null) return candidates
  const filtered = candidates.filter((c) => c !== previous)
  return filtered.length > 0 ? filtered : candidates
}

function assertReachable(reachable: PitchClass[]): void {
  if (reachable.length === 0) {
    throw new Error('No eligible notes are reachable on the selected strings within the fret range')
  }
}

/** Uniform-random pick of a (string, note) round, never repeating the previous note name back-to-back. */
export function pickRandomRound(
  strings: StringName[],
  notes: PitchClass[],
  range: FretRange,
  previous: PitchClass | null,
): RoundPick {
  const reachable = reachableNotes(strings, notes, range)
  assertReachable(reachable)
  const candidates = excludingPrevious(reachable, previous)
  const pitchClass = pickRandomFrom(candidates)
  const stringName = pickRandomFrom(stringsForNote(strings, pitchClass, range))
  return { stringName, pitchClass }
}

/** Weighted pick of a (string, note) round; higher weight = more likely to be picked. */
export function pickWeightedRound(
  strings: StringName[],
  notes: PitchClass[],
  range: FretRange,
  previous: PitchClass | null,
  weights: Record<PitchClass, number>,
): RoundPick {
  const reachable = reachableNotes(strings, notes, range)
  assertReachable(reachable)
  const candidates = excludingPrevious(reachable, previous)
  const pitchClass = pickWeightedFrom(candidates, weights)
  const stringName = pickRandomFrom(stringsForNote(strings, pitchClass, range))
  return { stringName, pitchClass }
}
