import { describe, expect, it } from 'vitest'
import { makeStatsKey, parseStatsKey } from './statsKey'

describe('statsKey', () => {
  it('round-trips string/note pairs, including sharp spellings', () => {
    const key = makeStatsKey('D', 'F#')
    expect(key).toBe('D:F#')
    expect(parseStatsKey(key)).toEqual({ stringName: 'D', noteId: 'F#' })
  })

  it('distinguishes the high e string from a note key that also contains "e"', () => {
    const key = makeStatsKey('e', 'E')
    expect(parseStatsKey(key)).toEqual({ stringName: 'e', noteId: 'E' })
  })
})
