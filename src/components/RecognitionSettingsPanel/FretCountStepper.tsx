import { useRecognitionStore } from '../../store/recognitionStore'
import panelStyles from '../SettingsPanel/SettingsPanel.module.css'

export function FretCountStepper() {
  const fretCount = useRecognitionStore((s) => s.config.fretCount)
  const setConfig = useRecognitionStore((s) => s.setConfig)

  return (
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Fret Positions</legend>
      <label className={panelStyles.timerRow}>
        Frets shown
        <input
          type="number"
          min={1}
          max={24}
          value={fretCount}
          onChange={(e) => {
            const value = Number(e.target.value)
            if (Number.isFinite(value) && value >= 1 && value <= 24) setConfig({ fretCount: value })
          }}
        />
      </label>
    </fieldset>
  )
}
