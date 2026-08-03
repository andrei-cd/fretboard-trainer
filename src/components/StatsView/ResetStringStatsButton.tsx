import { useState } from 'react'
import { useStatsStore } from '../../store/statsStore'
import { STRING_LABELS, STRING_NAMES, parseStatsKey } from '../../lib/music-theory'
import type { StatsKey, StringName } from '../../types'
import styles from './StatsView.module.css'

export function ResetStringStatsButton() {
  const stats = useStatsStore((s) => s.stats)
  const resetStringStats = useStatsStore((s) => s.resetStringStats)
  const [confirming, setConfirming] = useState(false)
  const [selectedString, setSelectedString] = useState<StringName | null>(null)

  const stringsWithData = STRING_NAMES.filter((name) =>
    Object.keys(stats).some((key) => parseStatsKey(key as StatsKey).stringName === name),
  )

  if (stringsWithData.length === 0) return null

  const activeString = selectedString && stringsWithData.includes(selectedString) ? selectedString : stringsWithData[0]

  if (confirming) {
    return (
      <span className={styles.confirmRow}>
        Reset {STRING_LABELS[activeString]} string?
        <button
          type="button"
          className={styles.dangerButton}
          onClick={() => {
            resetStringStats(activeString)
            setConfirming(false)
          }}
        >
          Yes, reset
        </button>
        <button type="button" className={styles.plainButton} onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </span>
    )
  }

  return (
    <span className={styles.stringResetRow}>
      <select
        className={styles.stringSelect}
        value={activeString}
        onChange={(e) => setSelectedString(e.target.value as StringName)}
        aria-label="String to reset"
      >
        {stringsWithData.map((name) => (
          <option key={name} value={name}>
            {STRING_LABELS[name]}
          </option>
        ))}
      </select>
      <button type="button" className={styles.plainButton} onClick={() => setConfirming(true)}>
        Reset string
      </button>
    </span>
  )
}
