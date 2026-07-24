import { useState } from 'react'
import { formatStringName, makeStatsKey, noteAtFret, noteIdsForPitchClass, STRING_NAMES } from '../../lib/music-theory'
import { bucketFor, computeRange } from '../../lib/stats/heatmapScale'
import { mergeEntries } from '../../lib/stats/mergeEntries'
import { useSessionStore } from '../../store/sessionStore'
import { useStatsStore } from '../../store/statsStore'
import type { AdaptiveStatsEntry, StringName } from '../../types'
import styles from './StatsView.module.css'

/** High e string on top, down to low E — matches how a fretboard diagram is usually drawn. */
const ROWS: readonly StringName[] = [...STRING_NAMES].reverse()

interface HoverInfo {
  stringName: StringName
  fret: number
}

function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`
}

function formatFret(fret: number): string {
  return fret === 0 ? 'open' : `fret ${fret}`
}

function sameCell(a: HoverInfo | null, b: HoverInfo): boolean {
  return a !== null && a.stringName === b.stringName && a.fret === b.fret
}

export function FretboardHeatmap() {
  const stats = useStatsStore((s) => s.stats)
  const fretRange = useSessionStore((s) => s.config.fretRange)
  const [hovered, setHovered] = useState<HoverInfo | null>(null)

  const frets = Array.from({ length: fretRange.max - fretRange.min + 1 }, (_, i) => fretRange.min + i)

  function mergedEntryAt(stringName: StringName, fret: number): AdaptiveStatsEntry | null {
    const pitchClass = noteAtFret(stringName, fret)
    const noteIds = noteIdsForPitchClass(pitchClass)
    return mergeEntries(noteIds.map((id) => stats[makeStatsKey(stringName, id)]))
  }

  const range = computeRange(
    ROWS.flatMap((stringName) => frets.map((fret) => mergedEntryAt(stringName, fret) ?? undefined)),
  )

  const hoveredEntry = hovered ? mergedEntryAt(hovered.stringName, hovered.fret) : null
  const hoveredNoteLabel = hovered
    ? noteIdsForPitchClass(noteAtFret(hovered.stringName, hovered.fret)).join('/')
    : null

  return (
    <div>
      <div className={styles.heatmapScroll}>
        <table className={styles.heatmapGrid}>
          <thead>
            <tr>
              <th className={styles.cornerCell}></th>
              {frets.map((fret) => (
                <th key={fret} scope="col" className={styles.colHeader}>
                  {fret}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((stringName) => (
              <tr key={stringName}>
                <th scope="row" className={styles.rowHeader}>
                  {formatStringName(stringName)}
                </th>
                {frets.map((fret) => {
                  const entry = mergedEntryAt(stringName, fret)
                  const bucket = entry && range ? bucketFor(entry.avgResponseTimeMs, range) : null
                  const cellInfo: HoverInfo = { stringName, fret }
                  const noteLabel = noteIdsForPitchClass(noteAtFret(stringName, fret)).join('/')
                  const label = entry
                    ? `${formatFret(fret)} (${noteLabel}) on ${formatStringName(stringName)} string: ${formatSeconds(entry.avgResponseTimeMs)} average, ${entry.sampleCount} sample${entry.sampleCount === 1 ? '' : 's'}`
                    : `${formatFret(fret)} (${noteLabel}) on ${formatStringName(stringName)} string: no data yet`
                  return (
                    <td key={fret} className={styles.cellWrap}>
                      <button
                        type="button"
                        className={styles.cell}
                        data-bucket={bucket ?? 'none'}
                        title={label}
                        aria-label={label}
                        onMouseEnter={() => setHovered(cellInfo)}
                        onMouseLeave={() => setHovered((h) => (sameCell(h, cellInfo) ? null : h))}
                        onFocus={() => setHovered(cellInfo)}
                        onBlur={() => setHovered((h) => (sameCell(h, cellInfo) ? null : h))}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.readout} aria-live="polite">
        {hovered
          ? hoveredEntry
            ? `${formatFret(hovered.fret)} (${hoveredNoteLabel}) on ${formatStringName(hovered.stringName)} string — ${formatSeconds(hoveredEntry.avgResponseTimeMs)} avg (${hoveredEntry.sampleCount} sample${hoveredEntry.sampleCount === 1 ? '' : 's'})`
            : `${formatFret(hovered.fret)} (${hoveredNoteLabel}) on ${formatStringName(hovered.stringName)} string — no data yet`
          : 'Hover or focus a cell to see exact numbers.'}
      </p>
    </div>
  )
}
