import styles from './PracticeView.module.css'

export type Feedback = { kind: 'success' } | { kind: 'error'; playedLabel: string }

interface FeedbackBadgeProps {
  feedback: Feedback
  /** How the wrong note was produced — "played" (mic-detected) or "picked" (clicked). */
  verb?: string
}

export function FeedbackBadge({ feedback, verb = 'played' }: FeedbackBadgeProps) {
  if (feedback.kind === 'success') {
    return (
      <div className={styles.feedbackBadge} data-kind="success" role="status">
        ✓ Correct!
      </div>
    )
  }

  return (
    <div className={styles.feedbackBadge} data-kind="error" role="status">
      ✗ You {verb} {feedback.playedLabel}
    </div>
  )
}
