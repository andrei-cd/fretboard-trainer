import panelStyles from '../SettingsPanel/SettingsPanel.module.css'
import styles from './RecognitionSettingsPanel.module.css'

export function TuningSetting() {
  return (
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Tuning</legend>
      <div className={styles.settingRow}>
        <span className={styles.settingLabel}>Tuning</span>
        <span className={styles.settingValue}>Standard (E A D G B e)</span>
      </div>
    </fieldset>
  )
}
