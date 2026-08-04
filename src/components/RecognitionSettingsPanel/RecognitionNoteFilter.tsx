import { ACCIDENTAL_NOTE_ID_PAIRS, ALL_NOTE_IDS, NATURAL_NOTE_IDS } from '../../lib/music-theory';
import type { NoteId } from '../../types';
import { useRecognitionStore } from '../../store/recognitionStore';
import panelStyles from '../SettingsPanel/SettingsPanel.module.css';

export function RecognitionNoteFilter() {
  const noteFilterEnabled = useRecognitionStore((s) => s.config.noteFilterEnabled);
  const selectedNotes = useRecognitionStore((s) => s.config.selectedNotes);
  const setConfig = useRecognitionStore((s) => s.setConfig);

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
    <fieldset className={panelStyles.fieldset}>
      <legend className={panelStyles.srOnly}>Note Filter</legend>
      <label className={panelStyles.checkboxOption}>
        <input
          type="checkbox"
          checked={noteFilterEnabled}
          onChange={(e) => setConfig({ noteFilterEnabled: e.target.checked })}
        />
        Limit which notes can appear
      </label>

      {noteFilterEnabled && (
        <>
          <div className={panelStyles.checkboxGrid}>
            {NATURAL_NOTE_IDS.map((id) => (
              <label key={id} className={panelStyles.checkboxOption}>
                <input type="checkbox" checked={selectedNotes.includes(id)} onChange={() => toggle(id)} />
                {id}
              </label>
            ))}
          </div>
          <div className={panelStyles.accidentalList}>
            {ACCIDENTAL_NOTE_ID_PAIRS.map(([sharp, flat]) => (
              <div className={panelStyles.accidentalRow} key={sharp}>
                <label className={panelStyles.checkboxOption}>
                  <input type="checkbox" checked={selectedNotes.includes(sharp)} onChange={() => toggle(sharp)} />
                  {sharp}
                </label>
                <label className={panelStyles.checkboxOption}>
                  <input type="checkbox" checked={selectedNotes.includes(flat)} onChange={() => toggle(flat)} />
                  {flat}
                </label>
              </div>
            ))}
          </div>
          <div className={panelStyles.inlineActions}>
            <button type="button" onClick={selectAll}>
              All
            </button>
            <button type="button" onClick={selectNone}>
              None
            </button>
          </div>
          <div className={panelStyles.inlineActions}>
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
        </>
      )}
    </fieldset>
  );
}
