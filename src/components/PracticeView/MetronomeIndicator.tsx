import { useSessionStore } from '../../store/sessionStore'
import { usePreferencesStore } from '../../store/preferencesStore'
import { useMetronome } from '../../hooks/useMetronome'
import styles from './PracticeView.module.css'

const MIN_LOCKED_BPM = 20
const MAX_LOCKED_BPM = 300

export function MetronomeIndicator() {
  const mode = useSessionStore((s) => s.config.mode)
  const timerSeconds = useSessionStore((s) => s.config.timerSeconds)
  const roundStartedAt = useSessionStore((s) => s.round.roundStartedAt)
  const current = useSessionStore((s) => s.round.current)

  const metronomeEnabled = usePreferencesStore((s) => s.metronomeEnabled)
  const metronomeBpm = usePreferencesStore((s) => s.metronomeBpm)
  const metronomeLockToTimer = usePreferencesStore((s) => s.metronomeLockToTimer)
  const metronomeBeatsPerNote = usePreferencesStore((s) => s.metronomeBeatsPerNote)

  const isTimerMode = mode === 'timer'
  const lockActive = isTimerMode && metronomeLockToTimer
  const bpm = lockActive
    ? Math.min(MAX_LOCKED_BPM, Math.max(MIN_LOCKED_BPM, (metronomeBeatsPerNote * 60) / timerSeconds))
    : metronomeBpm

  const { pulseKey, accent } = useMetronome({
    enabled: metronomeEnabled && current !== null,
    bpm,
    // Timer mode restarts the click on beat 0 whenever a new note appears, so the downbeat
    // always lands on the note change instead of drifting relative to it.
    resetKey: isTimerMode ? roundStartedAt : undefined,
    accentEvery: lockActive ? metronomeBeatsPerNote : 4,
  })

  if (!metronomeEnabled || !current) return null

  return (
    <div className={styles.metronome} aria-hidden="true">
      <span key={pulseKey} className={styles.metronomeDot} data-accent={accent} />
    </div>
  )
}
