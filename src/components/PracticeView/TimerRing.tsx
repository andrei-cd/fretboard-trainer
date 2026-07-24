import styles from './PracticeView.module.css'

interface TimerRingProps {
  totalSeconds: number
  remainingMs: number
}

const SIZE = 72
const STROKE = 6
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerRing({ totalSeconds, remainingMs }: TimerRingProps) {
  const fraction = totalSeconds > 0 ? Math.max(0, Math.min(1, remainingMs / (totalSeconds * 1000))) : 0
  const offset = CIRCUMFERENCE * (1 - fraction)
  const secondsLeft = Math.ceil(remainingMs / 1000)

  return (
    <div className={styles.timerRing}>
      <svg width={SIZE} height={SIZE}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <span className={styles.timerSeconds}>{secondsLeft}</span>
    </div>
  )
}
