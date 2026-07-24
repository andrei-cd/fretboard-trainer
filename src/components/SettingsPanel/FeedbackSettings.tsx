import { usePreferencesStore } from '../../store/preferencesStore'
import styles from './SettingsPanel.module.css'

export function FeedbackSettings() {
  const soundEnabled = usePreferencesStore((s) => s.soundEnabled)
  const setSoundEnabled = usePreferencesStore((s) => s.setSoundEnabled)
  const feedbackMessagesEnabled = usePreferencesStore((s) => s.feedbackMessagesEnabled)
  const setFeedbackMessagesEnabled = usePreferencesStore((s) => s.setFeedbackMessagesEnabled)

  return (
    <fieldset className={styles.fieldset}>
      <legend>Feedback (Microphone / Adaptive modes)</legend>
      <label className={styles.checkboxOption}>
        <input
          type="checkbox"
          checked={feedbackMessagesEnabled}
          onChange={(e) => setFeedbackMessagesEnabled(e.target.checked)}
        />
        Success/error messages
      </label>
      <label className={styles.checkboxOption}>
        <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
        Sound effects
      </label>
    </fieldset>
  )
}
