import { useSessionStore } from '../../store/sessionStore'
import { usePreferencesStore } from '../../store/preferencesStore'
import { resumeAudioContext } from '../../lib/audio/audioContext'
import { NumericInput } from '../NumericInput'
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
      <legend className={styles.srOnly}>Metronome</legend>
      <label className={styles.checkboxOption}>
        <input
          type="checkbox"
          checked={metronomeEnabled}
          onChange={(e) => {
            if (e.target.checked) void resumeAudioContext()
            setMetronomeEnabled(e.target.checked)
          }}
        />
        Enable metronome
      </label>
      {metronomeEnabled && (
        <>
          {!lockActive && (
            <label className={styles.timerRow}>
              BPM
              <NumericInput
                value={metronomeBpm}
                min={20}
                max={300}
                onValueChange={setMetronomeBpm}
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
                <NumericInput
                  value={metronomeBeatsPerNote}
                  min={1}
                  max={16}
                  onValueChange={setMetronomeBeatsPerNote}
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
