import { useState } from 'react'
import { useStatsStore } from '../../store/statsStore'
import { ResetStatsButton } from './ResetStatsButton'
import { StatsHeatmap } from './StatsHeatmap'
import { FretboardHeatmap } from './FretboardHeatmap'
import { HeatmapLegend } from './HeatmapLegend'
import styles from './StatsView.module.css'

type ViewMode = 'fretboard' | 'note'

export function StatsView() {
  const hasData = useStatsStore((s) => Object.keys(s.stats).length > 0)
  const [view, setView] = useState<ViewMode>('fretboard')

  return (
    <div className={styles.statsView}>
      <div className={styles.header}>
        <h3>Note response times</h3>
        {hasData && <ResetStatsButton />}
      </div>
      {hasData ? (
        <>
          <div className={styles.viewToggle} role="tablist" aria-label="Heatmap layout">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'fretboard'}
              className={styles.toggleButton}
              data-active={view === 'fretboard'}
              onClick={() => setView('fretboard')}
            >
              Fretboard
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'note'}
              className={styles.toggleButton}
              data-active={view === 'note'}
              onClick={() => setView('note')}
            >
              By note
            </button>
          </div>
          {view === 'fretboard' ? <FretboardHeatmap /> : <StatsHeatmap />}
          <HeatmapLegend />
        </>
      ) : (
        <p className={styles.emptyState}>
          No data yet — practice in Microphone or Adaptive mode and this fills in with your response
          times per string and note.
        </p>
      )}
    </div>
  )
}
