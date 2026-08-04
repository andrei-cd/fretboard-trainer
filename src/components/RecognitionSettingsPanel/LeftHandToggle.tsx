import { useRecognitionStore } from '../../store/recognitionStore'
import panelStyles from '../SettingsPanel/SettingsPanel.module.css'

export function LeftHandToggle() {
  const leftHand = useRecognitionStore((s) => s.config.leftHand)
  const setConfig = useRecognitionStore((s) => s.setConfig)

  return (
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Left Hand</legend>
      <label className={panelStyles.checkboxOption}>
        <input type="checkbox" checked={leftHand} onChange={(e) => setConfig({ leftHand: e.target.checked })} />
        Left-handed (mirror fretboard)
      </label>
    </fieldset>
  )
}
