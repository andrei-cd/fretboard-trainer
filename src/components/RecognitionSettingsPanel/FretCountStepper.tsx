import { useRecognitionStore } from '../../store/recognitionStore'
import panelStyles from '../SettingsPanel/SettingsPanel.module.css'
import { NumericInput } from '../NumericInput'

export function FretCountStepper() {
  const fretCount = useRecognitionStore((s) => s.config.fretCount)
  const setConfig = useRecognitionStore((s) => s.setConfig)

  return (
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Fret Positions</legend>
      <label className={panelStyles.timerRow}>
        Frets shown
        <NumericInput
          value={fretCount}
          min={1}
          max={24}
          onValueChange={(value) => setConfig({ fretCount: value })}
        />
      </label>
    </fieldset>
  )
}
