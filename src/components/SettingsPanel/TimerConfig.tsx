import { useSessionStore } from '../../store/sessionStore'
import { NumericInput } from '../NumericInput'
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
        <NumericInput
          value={timerSeconds}
          min={1}
          max={60}
          onValueChange={(value) => setConfig({ timerSeconds: value })}
        />
      </label>
    </fieldset>
  )
}
