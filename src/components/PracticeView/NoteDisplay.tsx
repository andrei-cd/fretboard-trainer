import { pitchClassToEnharmonicLabel } from '../../lib/music-theory'
import { useSessionStore } from '../../store/sessionStore'
import styles from './PracticeView.module.css'

export function NoteDisplay() {
  const current = useSessionStore((s) => s.round.current)
  const selectedStrings = useSessionStore((s) => s.config.selectedStrings)
  const selectedNotes = useSessionStore((s) => s.config.selectedNotes)

  if (selectedStrings.length === 0 || selectedNotes.length === 0) {
    return <p className={styles.empty}>Select at least one string and one note to begin.</p>
  }

  if (!current) return null

  return (
    <div className={styles.noteDisplay}>
      <div className={styles.stringLabel}>String: {current.stringName === 'e' ? 'high e' : current.stringName}</div>
      <div className={styles.noteLabel}>{pitchClassToEnharmonicLabel(current.pitchClass)}</div>
    </div>
  )
}
