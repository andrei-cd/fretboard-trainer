import { usePreferencesStore } from '../../store/preferencesStore'
import panelStyles from '../SettingsPanel/SettingsPanel.module.css'

export function RecognitionFeedbackSettings() {
  const soundEnabled = usePreferencesStore((s) => s.recognitionSoundEnabled)
  const setSoundEnabled = usePreferencesStore((s) => s.setRecognitionSoundEnabled)
  const feedbackMessagesEnabled = usePreferencesStore((s) => s.recognitionFeedbackMessagesEnabled)
  const setFeedbackMessagesEnabled = usePreferencesStore((s) => s.setRecognitionFeedbackMessagesEnabled)

  return (
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Feedback</legend>
      <label className={panelStyles.checkboxOption}>
        <input
          type="checkbox"
          checked={feedbackMessagesEnabled}
          onChange={(e) => setFeedbackMessagesEnabled(e.target.checked)}
        />
        Success/error messages
      </label>
      <label className={panelStyles.checkboxOption}>
        <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
        Sound effects
      </label>
    </fieldset>
  )
}
