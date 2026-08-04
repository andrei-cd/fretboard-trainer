import { usePreferencesStore } from '../../store/preferencesStore'
import styles from './AppModeToggle.module.css'

export function AppModeToggle() {
  const appMode = usePreferencesStore((s) => s.appMode)
  const setAppMode = usePreferencesStore((s) => s.setAppMode)

  return (
    <div className={styles.toggleGroup} role="group" aria-label="Practice mode">
      <button
        type="button"
        className={styles.toggleButton}
        data-active={appMode === 'recall'}
        aria-pressed={appMode === 'recall'}
        onClick={() => setAppMode('recall')}
      >
        Recall
      </button>
      <button
        type="button"
        className={styles.toggleButton}
        data-active={appMode === 'recognition'}
        aria-pressed={appMode === 'recognition'}
        onClick={() => setAppMode('recognition')}
      >
        Recognition
      </button>
    </div>
  )
}
