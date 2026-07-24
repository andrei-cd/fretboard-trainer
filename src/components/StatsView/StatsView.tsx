import { useStatsStore } from '../../store/statsStore'
import { ResetStatsButton } from './ResetStatsButton'
import { StatsHeatmap } from './StatsHeatmap'
import { HeatmapLegend } from './HeatmapLegend'
import styles from './StatsView.module.css'

export function StatsView() {
  const hasData = useStatsStore((s) => Object.keys(s.stats).length > 0)

  return (
    <div className={styles.statsView}>
      <div className={styles.header}>
        <h3>Note response times</h3>
        {hasData && <ResetStatsButton />}
      </div>
      {hasData ? (
        <>
          <StatsHeatmap />
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
