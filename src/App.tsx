import styles from './App.module.css';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { PracticeView } from './components/PracticeView/PracticeView';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Fretboard Trainer</h1>
      </header>
      <div className={styles.layout}>
        <SettingsPanel />
        <PracticeView />
      </div>
    </div>
  );
}

export default App;
