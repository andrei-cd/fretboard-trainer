import { useEffect } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { ManualPracticeView } from './ManualPracticeView'
import { MicPracticeView } from './MicPracticeView'
import styles from './PracticeView.module.css'

export function PracticeView() {
  const mode = useSessionStore((s) => s.config.mode)
  const selectedStrings = useSessionStore((s) => s.config.selectedStrings)
  const selectedNotes = useSessionStore((s) => s.config.selectedNotes)
  const nextRound = useSessionStore((s) => s.nextRound)

  const stringsKey = selectedStrings.join(',')
  const notesKey = selectedNotes.join(',')

  useEffect(() => {
    nextRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, stringsKey, notesKey])

  const isMicMode = mode === 'mic' || mode === 'adaptive'

  return <div className={styles.view}>{isMicMode ? <MicPracticeView /> : <ManualPracticeView />}</div>
}
