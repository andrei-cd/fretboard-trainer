import { ALL_PITCH_CLASSES, pitchClassToEnharmonicLabel } from '../../lib/music-theory'
import { useStatsStore } from '../../store/statsStore'
import { ResetStatsButton } from './ResetStatsButton'
import styles from './StatsView.module.css'

export function StatsView() {
  const stats = useStatsStore((s) => s.stats)

  const rows = ALL_PITCH_CLASSES.map((pc) => ({
    pitchClass: pc,
    label: pitchClassToEnharmonicLabel(pc),
    entry: stats[pc] ?? null,
  })).sort((a, b) => (b.entry?.avgResponseTimeMs ?? -1) - (a.entry?.avgResponseTimeMs ?? -1))

  const maxAvg = Math.max(1, ...rows.map((r) => r.entry?.avgResponseTimeMs ?? 0))

  return (
    <div className={styles.statsView}>
      <div className={styles.header}>
        <h3>Note response times</h3>
        <ResetStatsButton />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Note</th>
            <th>Avg time</th>
            <th>Samples</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.pitchClass}>
              <td className={styles.noteCell}>{row.label}</td>
              <td>{row.entry ? `${(row.entry.avgResponseTimeMs / 1000).toFixed(2)}s` : '—'}</td>
              <td>{row.entry?.sampleCount ?? 0}</td>
              <td className={styles.barCell}>
                <div
                  className={styles.bar}
                  style={{ width: row.entry ? `${(row.entry.avgResponseTimeMs / maxAvg) * 100}%` : '0%' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
