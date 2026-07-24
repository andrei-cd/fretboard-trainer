import type { MicStatus } from '../../lib/pitch-detection'
import styles from './PracticeView.module.css'

interface MicStatusIndicatorProps {
  status: MicStatus
  error?: string
  onStart: () => void
  onStop: () => void
}

const LABELS: Record<MicStatus, string> = {
  idle: 'Microphone not started',
  requesting: 'Requesting microphone access…',
  granted: 'Listening…',
  denied: 'Microphone access denied',
  error: 'Microphone error',
}

export function MicStatusIndicator({ status, error, onStart, onStop }: MicStatusIndicatorProps) {
  if (status === 'idle') {
    return (
      <button type="button" className={styles.startButton} onClick={onStart}>
        Start listening
      </button>
    )
  }

  return (
    <div className={styles.micStatus} data-state={status}>
      {status === 'granted' && <span className={styles.pulseDot} />}
      <span>{LABELS[status]}</span>
      {error && <span>{error}</span>}
      {status === 'granted' ? (
        <button type="button" className={styles.startButton} onClick={onStop}>
          Stop
        </button>
      ) : status === 'denied' || status === 'error' ? (
        <button type="button" className={styles.startButton} onClick={onStart}>
          Retry
        </button>
      ) : null}
    </div>
  )
}
