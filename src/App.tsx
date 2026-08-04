import styles from './App.module.css';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { PracticeView } from './components/PracticeView/PracticeView';
import { RecognitionView } from './components/RecognitionView/RecognitionView';
import { RecognitionSettingsPanel } from './components/RecognitionSettingsPanel/RecognitionSettingsPanel';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { AppModeToggle } from './components/AppModeToggle/AppModeToggle';
import { usePreferencesStore } from './store/preferencesStore';

function App() {
  const appMode = usePreferencesStore((s) => s.appMode);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <img src="/favicon.svg" alt="" className={styles.logo} aria-hidden="true" />
          <h1>Fretboard Trainer</h1>
        </div>
        <div className={styles.headerControls}>
          <AppModeToggle />
          <ThemeToggle />
        </div>
      </header>
      <main className={styles.layout}>
        {appMode === 'recall' ? (
          <>
            <PracticeView />
            <SettingsPanel />
          </>
        ) : (
          <>
            <RecognitionView />
            <RecognitionSettingsPanel />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
