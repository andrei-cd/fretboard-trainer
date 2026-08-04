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
  const usesMic = mode === 'mic';

  return (
    <div className={styles.panel}>
      <SettingsSection title="Mode" relevant={true}>
        <ModeSelector />
      </SettingsSection>

      <SettingsSection title="More Settings" relevant={isTimerMode || usesMic}>
        {isTimerMode && <TimerConfig />}
        <MetronomeSettings />
        <FeedbackSettings />
        {usesMic && <MicSettings />}
      </SettingsSection>

      <SettingsSection title="Strings & Notes" relevant={true} fullWidth>
        <StringSelector />
        <NoteSelector />
      </SettingsSection>
    </div>
  );
}
