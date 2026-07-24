import { usePreferencesStore } from '../../store/preferencesStore'
import type { MicSensitivity } from '../../types'
import styles from './SettingsPanel.module.css'

const OPTIONS: { value: MicSensitivity; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Fewer false positives, but may miss quiet playing' },
  { value: 'medium', label: 'Medium', description: 'Balanced (default)' },
  { value: 'high', label: 'High', description: 'Picks up quiet playing, more prone to false positives' },
]

export function MicSettings() {
  const micSensitivity = usePreferencesStore((s) => s.micSensitivity)
  const setMicSensitivity = usePreferencesStore((s) => s.setMicSensitivity)

  return (
    <fieldset className={styles.fieldset}>
      <legend>Microphone sensitivity</legend>
      <div className={styles.modeList}>
        {OPTIONS.map((option) => (
          <label key={option.value} className={styles.modeOption} data-active={micSensitivity === option.value}>
            <input
              type="radio"
              name="micSensitivity"
              value={option.value}
              checked={micSensitivity === option.value}
              onChange={() => setMicSensitivity(option.value)}
            />
            <span className={styles.modeText}>
              <span className={styles.modeLabel}>{option.label}</span>
              <span className={styles.modeDescription}>{option.description}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
