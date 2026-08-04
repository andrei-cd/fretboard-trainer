import { useRecognitionStore } from '../../store/recognitionStore'
import type { NoteNameFormat } from '../../types'
import panelStyles from '../SettingsPanel/SettingsPanel.module.css'
import styles from './RecognitionSettingsPanel.module.css'

const OPTIONS: { value: NoteNameFormat; label: string }[] = [
  { value: 'sharps', label: 'Sharps' },
  { value: 'flats', label: 'Flats' },
  { value: 'both', label: 'Sharps & Flats' },
]

export function NoteNamesPicker() {
  const noteNameFormat = useRecognitionStore((s) => s.config.noteNameFormat)
  const setConfig = useRecognitionStore((s) => s.setConfig)

  return (
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Note Names</legend>
      <div className={styles.segmentedGroup} role="radiogroup" aria-label="Note Names">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={styles.segmentedButton}
            data-active={noteNameFormat === option.value}
            role="radio"
            aria-checked={noteNameFormat === option.value}
            onClick={() => setConfig({ noteNameFormat: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
