import type { FretRange, NoteId, NoteWeights, PitchClass, RoundPick, StringName } from '../../types'
import { isNoteOnString } from './fretboard'
import { noteIdToPitchClass } from './pitchClass'

function pickRandomFrom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function pickWeightedFrom(items: readonly NoteId[], weights: NoteWeights): NoteId {
  const total = items.reduce((sum, item) => sum + (weights[item] ?? 1), 0)
  let roll = Math.random() * total
  for (const item of items) {
    roll -= weights[item] ?? 1
    if (roll <= 0) return item
  }
  return items[items.length - 1]
}

/** Note ids from `noteIds` that are actually playable on at least one of `strings` within `range`. */
function reachableNoteIds(strings: StringName[], noteIds: NoteId[], range: FretRange): NoteId[] {
  return noteIds.filter((id) => strings.some((s) => isNoteOnString(s, noteIdToPitchClass(id), range)))
}

/** Strings (among `strings`) on which `noteId` is playable within `range`. */
function stringsForNoteId(strings: StringName[], noteId: NoteId, range: FretRange): StringName[] {
  const pitchClass = noteIdToPitchClass(noteId)
  return strings.filter((s) => isNoteOnString(s, pitchClass, range))
}

/**
 * Excludes candidates that sound like the previous round (same pitch class), even across
 * enharmonic spellings — e.g. after F#, Gb is also blocked. Falls back to the full candidate
 * set if that would eliminate every option (only one sound is reachable at all).
 */
function excludingPreviousPitch(candidates: NoteId[], previousPitchClass: PitchClass | null): NoteId[] {
  if (candidates.length <= 1 || previousPitchClass === null) return candidates
  const filtered = candidates.filter((id) => noteIdToPitchClass(id) !== previousPitchClass)
  return filtered.length > 0 ? filtered : candidates
}

function assertReachable(reachable: NoteId[]): void {
  if (reachable.length === 0) {
    throw new Error('No eligible notes are reachable on the selected strings within the fret range')
  }
}

function buildPick(strings: StringName[], noteId: NoteId, range: FretRange): RoundPick {
  const pitchClass = noteIdToPitchClass(noteId)
  const stringName = pickRandomFrom(stringsForNoteId(strings, noteId, range))
  return { stringName, noteId, pitchClass }
}

/** Uniform-random pick of a (string, note) round, never repeating the previous note's sound back-to-back. */
export function pickRandomRound(
  strings: StringName[],
  noteIds: NoteId[],
  range: FretRange,
  previousPitchClass: PitchClass | null,
): RoundPick {
  const reachable = reachableNoteIds(strings, noteIds, range)
  assertReachable(reachable)
  const candidates = excludingPreviousPitch(reachable, previousPitchClass)
  return buildPick(strings, pickRandomFrom(candidates), range)
}

/** Weighted pick of a (string, note) round; higher weight = more likely to be picked. */
export function pickWeightedRound(
  strings: StringName[],
  noteIds: NoteId[],
  range: FretRange,
  previousPitchClass: PitchClass | null,
  weights: NoteWeights,
): RoundPick {
  const reachable = reachableNoteIds(strings, noteIds, range)
  assertReachable(reachable)
  const candidates = excludingPreviousPitch(reachable, previousPitchClass)
  return buildPick(strings, pickWeightedFrom(candidates, weights), range)
}
