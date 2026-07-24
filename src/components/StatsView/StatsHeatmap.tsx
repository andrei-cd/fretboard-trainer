import { useState } from 'react'
import { ALL_NOTE_IDS, formatStringName, makeStatsKey, STRING_NAMES } from '../../lib/music-theory'
import { bucketFor, computeRange } from '../../lib/stats/heatmapScale'
import { useStatsStore } from '../../store/statsStore'
import type { NoteId, StringName } from '../../types'
import styles from './StatsView.module.css'

interface HoverInfo {
  stringName: StringName
  noteId: NoteId
}

function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`
}

function sameCell(a: HoverInfo | null, b: HoverInfo): boolean {
  return a !== null && a.stringName === b.stringName && a.noteId === b.noteId
}

export function StatsHeatmap() {
  const stats = useStatsStore((s) => s.stats)
  const [hovered, setHovered] = useState<HoverInfo | null>(null)

  const range = computeRange(
    STRING_NAMES.flatMap((stringName) => ALL_NOTE_IDS.map((noteId) => stats[makeStatsKey(stringName, noteId)])),
  )

  const hoveredEntry = hovered ? stats[makeStatsKey(hovered.stringName, hovered.noteId)] : null

  return (
    <div>
      <div className={styles.heatmapScroll}>
        <table className={styles.heatmapGrid}>
          <thead>
            <tr>
              <th className={styles.cornerCell}></th>
              {ALL_NOTE_IDS.map((noteId) => (
                <th key={noteId} scope="col" className={styles.colHeader}>
                  {noteId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STRING_NAMES.map((stringName) => (
              <tr key={stringName}>
                <th scope="row" className={styles.rowHeader}>
                  {formatStringName(stringName)}
                </th>
                {ALL_NOTE_IDS.map((noteId) => {
                  const entry = stats[makeStatsKey(stringName, noteId)]
                  const bucket = entry && range ? bucketFor(entry.avgResponseTimeMs, range) : null
                  const cellInfo: HoverInfo = { stringName, noteId }
                  const label = entry
                    ? `${noteId} on ${formatStringName(stringName)} string: ${formatSeconds(entry.avgResponseTimeMs)} average, ${entry.sampleCount} sample${entry.sampleCount === 1 ? '' : 's'}`
                    : `${noteId} on ${formatStringName(stringName)} string: no data yet`
                  return (
                    <td key={noteId} className={styles.cellWrap}>
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
            ? `${hovered.noteId} on ${formatStringName(hovered.stringName)} string — ${formatSeconds(hoveredEntry.avgResponseTimeMs)} avg (${hoveredEntry.sampleCount} sample${hoveredEntry.sampleCount === 1 ? '' : 's'})`
            : `${hovered.noteId} on ${formatStringName(hovered.stringName)} string — no data yet`
          : 'Hover or focus a cell to see exact numbers.'}
      </p>
    </div>
  )
}
