import { ACCIDENTAL_NOTE_ID_PAIRS, ALL_NOTE_IDS, NATURAL_NOTE_IDS } from '../../lib/music-theory';
import type { NoteId } from '../../types';
import { useSessionStore } from '../../store/sessionStore';
import { usePreferencesStore } from '../../store/preferencesStore';
import styles from './SettingsPanel.module.css';

export function NoteSelector() {
  const selectedNotes = useSessionStore((s) => s.config.selectedNotes);
  const setConfig = useSessionStore((s) => s.setConfig);
  const mergeAccidentalSpellingsEnabled = usePreferencesStore(
    (s) => s.mergeAccidentalSpellingsEnabled,
  );
  const setMergeAccidentalSpellingsEnabled = usePreferencesStore(
    (s) => s.setMergeAccidentalSpellingsEnabled,
  );

  function toggle(id: NoteId) {
    const next = selectedNotes.includes(id)
      ? selectedNotes.filter((n) => n !== id)
      : [...selectedNotes, id];
    setConfig({ selectedNotes: next });
  }

  function selectAll() {
    setConfig({ selectedNotes: [...ALL_NOTE_IDS] });
  }

  function selectNone() {
    setConfig({ selectedNotes: [] });
  }

  /** Adds every note in `group` to the selection, or removes them all if the whole group is already selected. */
  function toggleGroup(group: readonly NoteId[]) {
    const allSelected = group.every((id) => selectedNotes.includes(id));
    const next = allSelected
      ? selectedNotes.filter((id) => !group.includes(id))
      : [...selectedNotes, ...group.filter((id) => !selectedNotes.includes(id))];
    setConfig({ selectedNotes: next });
  }

  const sharpNoteIds = ACCIDENTAL_NOTE_ID_PAIRS.map(([sharp]) => sharp);
  const flatNoteIds = ACCIDENTAL_NOTE_ID_PAIRS.map(([, flat]) => flat);
  const naturalsActive = NATURAL_NOTE_IDS.every((id) => selectedNotes.includes(id));
  const sharpsActive = sharpNoteIds.every((id) => selectedNotes.includes(id));
  const flatsActive = flatNoteIds.every((id) => selectedNotes.includes(id));

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.srOnly}>Notes</legend>
      <div className={styles.checkboxGrid}>
        {NATURAL_NOTE_IDS.map((id) => (
          <label key={id} className={styles.checkboxOption}>
            <input
              type="checkbox"
              checked={selectedNotes.includes(id)}
              onChange={() => toggle(id)}
            />
            {id}
          </label>
        ))}
      </div>
      <div className={styles.accidentalList}>
        {ACCIDENTAL_NOTE_ID_PAIRS.map(([sharp, flat]) => (
          <div className={styles.accidentalRow} key={sharp}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={selectedNotes.includes(sharp)}
                onChange={() => toggle(sharp)}
              />
              {sharp}
            </label>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={selectedNotes.includes(flat)}
                onChange={() => toggle(flat)}
              />
              {flat}
            </label>
          </div>
        ))}
      </div>
      <label className={`${styles.checkboxOption} ${styles.mergeAccidentalsOption}`}>
        <input
          type="checkbox"
          checked={mergeAccidentalSpellingsEnabled}
          onChange={(e) => setMergeAccidentalSpellingsEnabled(e.target.checked)}
        />
        Treat enharmonic equivalents as one note when both are selected
      </label>
      <div className={styles.inlineActions}>
        <button type="button" onClick={selectAll}>
          All
        </button>
        <button type="button" onClick={selectNone}>
          None
        </button>
      </div>
      <div className={styles.inlineActions}>
        <button type="button" data-active={naturalsActive} onClick={() => toggleGroup(NATURAL_NOTE_IDS)}>
          Naturals
        </button>
        <button type="button" data-active={sharpsActive} onClick={() => toggleGroup(sharpNoteIds)}>
          Sharps
        </button>
        <button type="button" data-active={flatsActive} onClick={() => toggleGroup(flatNoteIds)}>
          Flats
        </button>
      </div>
    </fieldset>
  );
}
