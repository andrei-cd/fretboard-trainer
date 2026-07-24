import type { NoteId, StatsKey, StringName } from '../../types'

export function makeStatsKey(stringName: StringName, noteId: NoteId): StatsKey {
  return `${stringName}:${noteId}`
}

export function parseStatsKey(key: StatsKey): { stringName: StringName; noteId: NoteId } {
  const separatorIndex = key.indexOf(':')
  return {
    stringName: key.slice(0, separatorIndex) as StringName,
    noteId: key.slice(separatorIndex + 1) as NoteId,
  }
}
