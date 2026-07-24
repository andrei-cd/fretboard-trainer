import { ACCIDENTAL_NOTE_ID_PAIRS, ALL_NOTE_IDS, NATURAL_NOTE_IDS } from '../../lib/music-theory'
import type { NoteId } from '../../types'
import { useSessionStore } from '../../store/sessionStore'
import styles from './SettingsPanel.module.css'

export function NoteSelector() {
  const selectedNotes = useSessionStore((s) => s.config.selectedNotes)
  const setConfig = useSessionStore((s) => s.setConfig)

  function toggle(id: NoteId) {
    const next = selectedNotes.includes(id) ? selectedNotes.filter((n) => n !== id) : [...selectedNotes, id]
    setConfig({ selectedNotes: next })
  }

  function selectAll() {
    setConfig({ selectedNotes: [...ALL_NOTE_IDS] })
  }

  function selectNone() {
    setConfig({ selectedNotes: [] })
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend>Notes</legend>
      <div className={styles.checkboxGrid}>
        {NATURAL_NOTE_IDS.map((id) => (
          <label key={id} className={styles.checkboxOption}>
            <input type="checkbox" checked={selectedNotes.includes(id)} onChange={() => toggle(id)} />
            {id}
          </label>
        ))}
      </div>
      <div className={styles.accidentalList}>
        {ACCIDENTAL_NOTE_ID_PAIRS.map(([sharp, flat]) => (
          <div className={styles.accidentalRow} key={sharp}>
            <label className={styles.checkboxOption}>
              <input type="checkbox" checked={selectedNotes.includes(sharp)} onChange={() => toggle(sharp)} />
              {sharp}
            </label>
            <label className={styles.checkboxOption}>
              <input type="checkbox" checked={selectedNotes.includes(flat)} onChange={() => toggle(flat)} />
              {flat}
            </label>
          </div>
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
