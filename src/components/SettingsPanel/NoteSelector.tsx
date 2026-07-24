import { ALL_PITCH_CLASSES, pitchClassToEnharmonicLabel } from '../../lib/music-theory'
import type { PitchClass } from '../../types'
import { useSessionStore } from '../../store/sessionStore'
import styles from './SettingsPanel.module.css'

export function NoteSelector() {
  const selectedNotes = useSessionStore((s) => s.config.selectedNotes)
  const setConfig = useSessionStore((s) => s.setConfig)

  function toggle(pc: PitchClass) {
    const next = selectedNotes.includes(pc) ? selectedNotes.filter((n) => n !== pc) : [...selectedNotes, pc]
    setConfig({ selectedNotes: next })
  }

  function selectAll() {
    setConfig({ selectedNotes: [...ALL_PITCH_CLASSES] })
  }

  function selectNone() {
    setConfig({ selectedNotes: [] })
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend>Notes</legend>
      <div className={styles.checkboxGrid}>
        {ALL_PITCH_CLASSES.map((pc) => (
          <label key={pc} className={styles.checkboxOption}>
            <input type="checkbox" checked={selectedNotes.includes(pc)} onChange={() => toggle(pc)} />
            {pitchClassToEnharmonicLabel(pc)}
          </label>
        ))}
      </div>
      <div className={styles.inlineActions}>
        <button type="button" onClick={selectAll}>
          All
        </button>
        <button type="button" onClick={selectNone}>
          None
        </button>
      </div>
    </fieldset>
  )
}
