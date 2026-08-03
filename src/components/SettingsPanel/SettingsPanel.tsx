import { useSessionStore } from '../../store/sessionStore';
import { SettingsSection } from './SettingsSection';
import { ModeSelector } from './ModeSelector';
import { StringSelector } from './StringSelector';
import { NoteSelector } from './NoteSelector';
import { TimerConfig } from './TimerConfig';
import { MetronomeSettings } from './MetronomeSettings';
import { FeedbackSettings } from './FeedbackSettings';
import { MicSettings } from './MicSettings';
import styles from './SettingsPanel.module.css';

export function SettingsPanel() {
  const mode = useSessionStore((s) => s.config.mode);
  const isTimerMode = mode === 'timer';
  const usesMic = mode === 'mic' || mode === 'adaptive';

  return (
    <div className={styles.panel}>
      <SettingsSection title="Mode" relevant={true}>
        <ModeSelector />
      </SettingsSection>

      <SettingsSection title="Strings & Notes" relevant={true}>
        <StringSelector />
        <NoteSelector />
      </SettingsSection>

      <SettingsSection title="Metronome" relevant={isTimerMode}>
        {isTimerMode && <TimerConfig />}
        <MetronomeSettings />
      </SettingsSection>

      <SettingsSection title="Feedback & Microphone" relevant={usesMic}>
        <FeedbackSettings />
        {usesMic && <MicSettings />}
      </SettingsSection>
    </div>
  );
}
