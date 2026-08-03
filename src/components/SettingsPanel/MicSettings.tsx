import { usePreferencesStore } from '../../store/preferencesStore'
import type { MicSensitivity } from '../../types'
import styles from './SettingsPanel.module.css'

const LEVELS: { value: MicSensitivity; label: string; description: string }[] = [
  { value: 'very-low', label: 'Very low', description: 'Strictest — needs a loud, clean signal, least prone to false positives' },
  { value: 'low', label: 'Low', description: 'Fewer false positives, but may miss quiet playing' },
  { value: 'medium', label: 'Medium', description: 'Balanced (default)' },
  { value: 'high', label: 'High', description: 'Picks up quiet playing, more prone to false positives' },
  { value: 'very-high', label: 'Very high', description: 'Picks up very quiet playing, most prone to false positives' },
]

export function MicSettings() {
  const micSensitivity = usePreferencesStore((s) => s.micSensitivity)
  const setMicSensitivity = usePreferencesStore((s) => s.setMicSensitivity)

  const index = Math.max(
    0,
    LEVELS.findIndex((level) => level.value === micSensitivity),
  )
  const current = LEVELS[index]

  return (
    <fieldset className={styles.fieldset}>
      <legend>Microphone sensitivity</legend>
      <input
        type="range"
        className={styles.sensitivitySlider}
        min={0}
        max={LEVELS.length - 1}
        step={1}
        value={index}
        list="mic-sensitivity-ticks"
        onChange={(e) => setMicSensitivity(LEVELS[Number(e.target.value)].value)}
        aria-valuetext={current.label}
      />
      <datalist id="mic-sensitivity-ticks">
        {LEVELS.map((_, i) => (
          <option key={i} value={i} />
        ))}
      </datalist>
      <div className={styles.sensitivityTicks}>
        {LEVELS.map((level, i) => (
          <button
            key={level.value}
            type="button"
            className={styles.sensitivityTick}
            data-active={i === index}
            onClick={() => setMicSensitivity(level.value)}
          >
            {level.label}
          </button>
        ))}
      </div>
      <p className={styles.sensitivityDescription}>{current.description}</p>
    </fieldset>
  )
}
