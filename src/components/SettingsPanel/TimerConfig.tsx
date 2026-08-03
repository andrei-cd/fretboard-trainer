import { useSessionStore } from '../../store/sessionStore'
import styles from './SettingsPanel.module.css'

export function TimerConfig() {
  const mode = useSessionStore((s) => s.config.mode)
  const timerSeconds = useSessionStore((s) => s.config.timerSeconds)
  const setConfig = useSessionStore((s) => s.setConfig)

  if (mode !== 'timer') return null

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.srOnly}>Countdown</legend>
      <label className={styles.timerRow}>
        Seconds per note
        <input
          type="number"
          min={1}
          max={60}
          value={timerSeconds}
          onChange={(e) => {
            const value = Number(e.target.value)
            if (Number.isFinite(value) && value > 0) setConfig({ timerSeconds: value })
          }}
        />
      </label>
    </fieldset>
  )
}
