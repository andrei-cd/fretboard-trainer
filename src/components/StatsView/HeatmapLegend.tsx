import { HEATMAP_BUCKET_COUNT } from '../../lib/stats/heatmapScale'
import styles from './StatsView.module.css'

export function HeatmapLegend() {
  return (
    <div className={styles.legend}>
      <span className={styles.legendLabel}>Fast</span>
      <div className={styles.legendSwatches}>
        {Array.from({ length: HEATMAP_BUCKET_COUNT }, (_, bucket) => (
          <span key={bucket} className={styles.legendSwatch} data-bucket={bucket} />
        ))}
      </div>
      <span className={styles.legendLabel}>Slow</span>
      <span className={styles.legendDivider} />
      <span className={styles.legendSwatch} data-bucket="none" />
      <span className={styles.legendLabel}>No data</span>
    </div>
  )
}
