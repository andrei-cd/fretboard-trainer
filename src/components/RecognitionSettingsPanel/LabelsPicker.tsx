import { useRecognitionStore } from '../../store/recognitionStore'
import type { FretboardLabelMode } from '../../types'
import panelStyles from '../SettingsPanel/SettingsPanel.module.css'
import styles from './RecognitionSettingsPanel.module.css'

const OPTIONS: { value: FretboardLabelMode; label: string }[] = [
  { value: 'frets-strings', label: 'Frets & Strings' },
  { value: 'frets-only', label: 'Frets Only' },
  { value: 'strings-only', label: 'Strings Only' },
  { value: 'none', label: 'None' },
]

export function LabelsPicker() {
  const labelMode = useRecognitionStore((s) => s.config.labelMode)
  const setConfig = useRecognitionStore((s) => s.setConfig)

  return (
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Labels</legend>
      <div className={styles.segmentedGroup} role="radiogroup" aria-label="Labels">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={styles.segmentedButton}
            data-active={labelMode === option.value}
            role="radio"
            aria-checked={labelMode === option.value}
            onClick={() => setConfig({ labelMode: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
