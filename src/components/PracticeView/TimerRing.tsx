import { useId } from 'react'
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
  const gradientId = useId()
  const fraction = totalSeconds > 0 ? Math.max(0, Math.min(1, remainingMs / (totalSeconds * 1000))) : 0
  const offset = CIRCUMFERENCE * (1 - fraction)
  const secondsLeft = Math.ceil(remainingMs / 1000)

  return (
    <div className={styles.timerRing}>
      <svg width={SIZE} height={SIZE}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={`url(#${gradientId})`}
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
