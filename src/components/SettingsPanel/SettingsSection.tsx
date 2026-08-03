import { useState, type ReactNode } from 'react'
import styles from './SettingsPanel.module.css'

interface SettingsSectionProps {
  title: string
  /** Should this section be open right now, absent a manual override? Re-evaluated as the
      current practice mode changes, until the user clicks the header — after that, their
      choice sticks for the rest of the session. */
  relevant: boolean
  children: ReactNode
}

export function SettingsSection({ title, relevant, children }: SettingsSectionProps) {
  const [override, setOverride] = useState<boolean | null>(null)
  const open = override ?? relevant

  return (
    <section className={styles.section} data-open={open}>
      <button
        type="button"
        className={styles.sectionHeader}
        aria-expanded={open}
        onClick={() => setOverride(!open)}
      >
        <span className={styles.sectionTitle}>{title}</span>
        <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className={styles.sectionBody}>
        <div className={styles.sectionBodyInner}>{children}</div>
      </div>
    </section>
  )
}
