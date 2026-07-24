import type { Mode } from '../../types'
import { useSessionStore } from '../../store/sessionStore'
import styles from './SettingsPanel.module.css'

const MODES: { value: Mode; label: string; description: string }[] = [
  { value: 'normal', label: 'Normal', description: 'Random note, manual advance' },
  { value: 'timer', label: 'Timer', description: 'Random note, auto-advance on countdown' },
  { value: 'mic', label: 'Microphone', description: 'Advances when you play the right note' },
  { value: 'adaptive', label: 'Adaptive', description: 'Microphone mode, favors your weak notes' },
]

export function ModeSelector() {
  const mode = useSessionStore((s) => s.config.mode)
  const setConfig = useSessionStore((s) => s.setConfig)

  return (
    <fieldset className={styles.fieldset}>
      <legend>Mode</legend>
      <div className={styles.modeList}>
        {MODES.map((m) => (
          <label key={m.value} className={styles.modeOption} data-active={mode === m.value}>
            <input
              type="radio"
              name="mode"
              value={m.value}
              checked={mode === m.value}
              onChange={() => setConfig({ mode: m.value })}
            />
            <span className={styles.modeText}>
              <span className={styles.modeLabel}>{m.label}</span>
              <span className={styles.modeDescription}>{m.description}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
