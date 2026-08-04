import { useRecognitionStore } from '../../store/recognitionStore'
import panelStyles from '../SettingsPanel/SettingsPanel.module.css'

export function FretMarkersToggle() {
  const showFretMarkers = useRecognitionStore((s) => s.config.showFretMarkers)
  const setConfig = useRecognitionStore((s) => s.setConfig)

  return (
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Fret Markers</legend>
      <label className={panelStyles.checkboxOption}>
        <input
          type="checkbox"
          checked={showFretMarkers}
          onChange={(e) => setConfig({ showFretMarkers: e.target.checked })}
        />
        Show fret markers
      </label>
    </fieldset>
  )
}
