import { ModeSelector } from './ModeSelector'
import { StringSelector } from './StringSelector'
import { NoteSelector } from './NoteSelector'
import { TimerConfig } from './TimerConfig'
import styles from './SettingsPanel.module.css'

export function SettingsPanel() {
  return (
    <div className={styles.panel}>
      <ModeSelector />
      <StringSelector />
      <NoteSelector />
      <TimerConfig />
    </div>
  )
}
