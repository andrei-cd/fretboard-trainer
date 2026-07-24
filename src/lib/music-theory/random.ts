import type { FretRange, NoteId, PairWeights, PitchClass, RoundPick, StringName } from '../../types'
import { isNoteOnString } from './fretboard'
import { noteIdToPitchClass } from './pitchClass'
import { makeStatsKey } from './statsKey'

function pickRandomFrom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
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
function excludingPreviousPitch<T extends { pitchClass: PitchClass }>(
  candidates: T[],
  previousPitchClass: PitchClass | null,
): T[] {
  if (candidates.length <= 1 || previousPitchClass === null) return candidates
  const filtered = candidates.filter((c) => c.pitchClass !== previousPitchClass)
  return filtered.length > 0 ? filtered : candidates
}

function assertReachable(reachable: readonly unknown[]): void {
  if (reachable.length === 0) {
    throw new Error('No eligible notes are reachable on the selected strings within the fret range')
  }
}

/**
 * Groups candidates that share a key into one pool slot instead of one each. Selecting both
 * spellings of an accidental (e.g. C# and Db) would otherwise give that pitch roughly twice
 * the pick chance of a natural note, since it occupies two separate NoteIds for one sound.
 * When `enabled` is false, every candidate keeps its own slot (pre-merge behavior).
 */
function groupByKey<T, K>(candidates: readonly T[], key: (item: T) => K, enabled: boolean): T[][] {
  if (!enabled) return candidates.map((item) => [item])
  const groups = new Map<K, T[]>()
  for (const item of candidates) {
    const group = groups.get(key(item))
    if (group) group.push(item)
    else groups.set(key(item), [item])
  }
  return [...groups.values()]
}

/** Uniform-random pick of a (string, note) round, never repeating the previous note's sound back-to-back. */
export function pickRandomRound(
  strings: StringName[],
  noteIds: NoteId[],
  range: FretRange,
  previousPitchClass: PitchClass | null,
  mergeAccidentalSpellings = true,
): RoundPick {
  const reachable = reachableNoteIds(strings, noteIds, range)
  assertReachable(reachable)
  const candidates = excludingPreviousPitch(
    reachable.map((noteId) => ({ noteId, pitchClass: noteIdToPitchClass(noteId) })),
    previousPitchClass,
  )
  const groups = groupByKey(candidates, (item) => item.pitchClass, mergeAccidentalSpellings)
  const { noteId, pitchClass } = pickRandomFrom(pickRandomFrom(groups))
  const stringName = pickRandomFrom(stringsForNoteId(strings, noteId, range))
  return { stringName, noteId, pitchClass }
}

/** Every (string, note) pair actually playable, given the current selection and fret range. */
export function listReachablePairs(strings: StringName[], noteIds: NoteId[], range: FretRange): RoundPick[] {
  const pairs: RoundPick[] = []
  for (const noteId of noteIds) {
    const pitchClass = noteIdToPitchClass(noteId)
    for (const stringName of strings) {
      if (isNoteOnString(stringName, pitchClass, range)) {
        pairs.push({ stringName, noteId, pitchClass })
      }
    }
  }
  return pairs
}

function weightOfPair(pair: RoundPick, weights: PairWeights): number {
  return weights[makeStatsKey(pair.stringName, pair.noteId)] ?? 1
}

/** A group's weight is the average of its members' weights, so merging two accidental
 * spellings into one slot doesn't double-count their combined pick chance. */
function weightOfGroup(group: readonly RoundPick[], weights: PairWeights): number {
  const total = group.reduce((sum, pair) => sum + weightOfPair(pair, weights), 0)
  return total / group.length
}

function pickWeightedGroupFrom(groups: readonly RoundPick[][], weights: PairWeights): RoundPick[] {
  const total = groups.reduce((sum, group) => sum + weightOfGroup(group, weights), 0)
  let roll = Math.random() * total
  for (const group of groups) {
    roll -= weightOfGroup(group, weights)
    if (roll <= 0) return group
  }
  return groups[groups.length - 1]
}

/**
 * Weighted pick of a (string, note) round, weighted per exact (string, note) pair so
 * practice can target a specific weak spot (e.g. "G on the D string") rather than just
 * a weak note in general. Higher weight = more likely to be picked.
 */
export function pickWeightedRound(
  strings: StringName[],
  noteIds: NoteId[],
  range: FretRange,
  previousPitchClass: PitchClass | null,
  weights: PairWeights,
  mergeAccidentalSpellings = true,
): RoundPick {
  const pairs = listReachablePairs(strings, noteIds, range)
  assertReachable(pairs)
  const candidates = excludingPreviousPitch(pairs, previousPitchClass)
  const groups = groupByKey(candidates, (pair) => `${pair.stringName}:${pair.pitchClass}`, mergeAccidentalSpellings)
  return pickRandomFrom(pickWeightedGroupFrom(groups, weights))
}
