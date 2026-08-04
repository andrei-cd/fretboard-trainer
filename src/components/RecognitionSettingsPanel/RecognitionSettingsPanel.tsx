import { SettingsSection } from '../SettingsPanel/SettingsSection';
import panelStyles from '../SettingsPanel/SettingsPanel.module.css';
import { TuningSetting } from './TuningSetting';
import { LeftHandToggle } from './LeftHandToggle';
import { FretCountStepper } from './FretCountStepper';
import { LabelsPicker } from './LabelsPicker';
import { FretMarkersToggle } from './FretMarkersToggle';
import { RecognitionStringSelector } from './RecognitionStringSelector';
import { RecognitionNoteFilter } from './RecognitionNoteFilter';
import { NoteNamesPicker } from './NoteNamesPicker';
import { RecognitionFeedbackSettings } from './RecognitionFeedbackSettings';

export function RecognitionSettingsPanel() {
  return (
    <div className={panelStyles.panel}>
      <SettingsSection title="Fretboard" relevant={true} fullWidth>
        <TuningSetting />
        <LeftHandToggle />
        <FretCountStepper />
        <LabelsPicker />
        <FretMarkersToggle />
      </SettingsSection>

      <SettingsSection title="String & Note Pool" relevant={true}>
        <RecognitionStringSelector />
        <RecognitionNoteFilter />
      </SettingsSection>

      <SettingsSection title="Answers & Feedback" relevant={true}>
        <NoteNamesPicker />
        <RecognitionFeedbackSettings />
      </SettingsSection>
    </div>
  );
}
