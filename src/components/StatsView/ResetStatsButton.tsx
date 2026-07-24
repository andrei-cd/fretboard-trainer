import { useState } from 'react'
import { useStatsStore } from '../../store/statsStore'
import styles from './StatsView.module.css'

export function ResetStatsButton() {
  const [confirming, setConfirming] = useState(false)
  const resetStats = useStatsStore((s) => s.resetStats)

  if (confirming) {
    return (
      <span className={styles.confirmRow}>
        Reset all learned stats?
        <button
          type="button"
          className={styles.dangerButton}
          onClick={() => {
            resetStats()
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
    <button type="button" className={styles.plainButton} onClick={() => setConfirming(true)}>
      Reset stats
    </button>
  )
}
