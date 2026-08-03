import styles from './App.module.css';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { PracticeView } from './components/PracticeView/PracticeView';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <img src="/favicon.svg" alt="" className={styles.logo} aria-hidden="true" />
          <h1>Fretboard Trainer</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className={styles.layout}>
        <PracticeView />
        <SettingsPanel />
      </main>
    </div>
  );
}

export default App;
