import { useSessionStore } from '../../store/sessionStore'
import { usePreferencesStore } from '../../store/preferencesStore'
import styles from './SettingsPanel.module.css'

export function MetronomeSettings() {
  const mode = useSessionStore((s) => s.config.mode)
  const metronomeEnabled = usePreferencesStore((s) => s.metronomeEnabled)
  const setMetronomeEnabled = usePreferencesStore((s) => s.setMetronomeEnabled)
  const metronomeBpm = usePreferencesStore((s) => s.metronomeBpm)
  const setMetronomeBpm = usePreferencesStore((s) => s.setMetronomeBpm)
  const metronomeLockToTimer = usePreferencesStore((s) => s.metronomeLockToTimer)
  const setMetronomeLockToTimer = usePreferencesStore((s) => s.setMetronomeLockToTimer)
  const metronomeBeatsPerNote = usePreferencesStore((s) => s.metronomeBeatsPerNote)
  const setMetronomeBeatsPerNote = usePreferencesStore((s) => s.setMetronomeBeatsPerNote)

  const isTimerMode = mode === 'timer'
  const lockActive = isTimerMode && metronomeLockToTimer

  return (
    <fieldset className={styles.fieldset}>
      <legend>Metronome</legend>
      <label className={styles.checkboxOption}>
        <input
          type="checkbox"
          checked={metronomeEnabled}
          onChange={(e) => setMetronomeEnabled(e.target.checked)}
        />
        Enable metronome
      </label>
      {metronomeEnabled && (
        <>
          {!lockActive && (
            <label className={styles.timerRow}>
              BPM
              <input
                type="number"
                min={20}
                max={300}
                value={metronomeBpm}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (Number.isFinite(value) && value > 0) setMetronomeBpm(value)
                }}
              />
            </label>
          )}
          {isTimerMode && (
            <>
              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={metronomeLockToTimer}
                  onChange={(e) => setMetronomeLockToTimer(e.target.checked)}
                />
                Lock tempo to countdown
              </label>
              {lockActive && (
                <label className={styles.timerRow}>
                  Beats per note
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={metronomeBeatsPerNote}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      if (Number.isFinite(value) && value > 0) setMetronomeBeatsPerNote(value)
                    }}
                  />
                </label>
              )}
            </>
          )}
        </>
      )}
    </fieldset>
  )
}
