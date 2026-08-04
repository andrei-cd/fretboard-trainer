import { STRING_LABELS, STRING_NAMES } from '../../lib/music-theory'
import type { StringName } from '../../types'
import { useRecognitionStore } from '../../store/recognitionStore'
import panelStyles from '../SettingsPanel/SettingsPanel.module.css'

export function RecognitionStringSelector() {
  const selectedStrings = useRecognitionStore((s) => s.config.selectedStrings)
  const setConfig = useRecognitionStore((s) => s.setConfig)

  function toggle(stringName: StringName) {
    const next = selectedStrings.includes(stringName)
      ? selectedStrings.filter((s) => s !== stringName)
      : [...selectedStrings, stringName]
    setConfig({ selectedStrings: next })
  }

  function selectAll() {
    setConfig({ selectedStrings: [...STRING_NAMES] })
  }

  return (
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Strings</legend>
      <div className={panelStyles.checkboxGrid}>
        {STRING_NAMES.map((s) => (
          <label key={s} className={panelStyles.checkboxOption}>
            <input type="checkbox" checked={selectedStrings.includes(s)} onChange={() => toggle(s)} />
            {STRING_LABELS[s]}
          </label>
        ))}
      </div>
      <div className={panelStyles.inlineActions}>
        <button type="button" onClick={selectAll}>
          All
        </button>
      </div>
    </fieldset>
  )
}
