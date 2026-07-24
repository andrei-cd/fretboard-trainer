import { STRING_NAMES } from '../../lib/music-theory'
import type { StringName } from '../../types'
import { useSessionStore } from '../../store/sessionStore'
import styles from './SettingsPanel.module.css'

const STRING_LABELS: Record<StringName, string> = {
  E: 'E (low)',
  A: 'A',
  D: 'D',
  G: 'G',
  B: 'B',
  e: 'e (high)',
}

export function StringSelector() {
  const selectedStrings = useSessionStore((s) => s.config.selectedStrings)
  const setConfig = useSessionStore((s) => s.setConfig)

  function toggle(stringName: StringName) {
    const next = selectedStrings.includes(stringName)
      ? selectedStrings.filter((s) => s !== stringName)
      : [...selectedStrings, stringName]
    setConfig({ selectedStrings: next })
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend>Strings</legend>
      <div className={styles.checkboxGrid}>
        {STRING_NAMES.map((s) => (
          <label key={s} className={styles.checkboxOption}>
            <input type="checkbox" checked={selectedStrings.includes(s)} onChange={() => toggle(s)} />
            {STRING_LABELS[s]}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
