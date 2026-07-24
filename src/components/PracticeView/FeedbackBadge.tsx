import styles from './PracticeView.module.css'

export type Feedback = { kind: 'success' } | { kind: 'error'; playedLabel: string }

interface FeedbackBadgeProps {
  feedback: Feedback
}

export function FeedbackBadge({ feedback }: FeedbackBadgeProps) {
  if (feedback.kind === 'success') {
    return (
      <div className={styles.feedbackBadge} data-kind="success" role="status">
        ✓ Correct!
      </div>
    )
  }

  return (
    <div className={styles.feedbackBadge} data-kind="error" role="status">
      ✗ You played {feedback.playedLabel}
    </div>
  )
}
