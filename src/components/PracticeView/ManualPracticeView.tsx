import { useSessionStore } from '../../store/sessionStore'
import { useCountdown } from '../../hooks/useCountdown'
import { NoteDisplay } from './NoteDisplay'
import { TimerRing } from './TimerRing'
import styles from './PracticeView.module.css'

export function ManualPracticeView() {
  const mode = useSessionStore((s) => s.config.mode)
  const timerSeconds = useSessionStore((s) => s.config.timerSeconds)
  const current = useSessionStore((s) => s.round.current)
  const roundStartedAt = useSessionStore((s) => s.round.roundStartedAt)
  const nextRound = useSessionStore((s) => s.nextRound)

  const isTimerMode = mode === 'timer'
  const remainingMs = useCountdown(timerSeconds, isTimerMode && current !== null, roundStartedAt, nextRound)

  return (
    <div className={styles.modeView}>
      <NoteDisplay />
      {isTimerMode && current && <TimerRing totalSeconds={timerSeconds} remainingMs={remainingMs} />}
      {current && (
        <button type="button" className={styles.nextButton} onClick={() => nextRound()}>
          Next
        </button>
      )}
    </div>
  )
}
