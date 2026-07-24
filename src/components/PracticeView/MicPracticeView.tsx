import { useEffect, useRef, useState } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useStatsStore } from '../../store/statsStore'
import { useMicPitch } from '../../lib/pitch-detection/useMicPitch'
import { createStabilityTracker } from '../../lib/pitch-detection/stabilityBuffer'
import { NoteDisplay } from './NoteDisplay'
import { MicStatusIndicator } from './MicStatusIndicator'
import { StatsView } from '../StatsView/StatsView'
import styles from './PracticeView.module.css'

const STABLE_MS = 150
const MIN_CLARITY = 0.9

export function MicPracticeView() {
  const [micActive, setMicActive] = useState(false)
  const [showStats, setShowStats] = useState(false)

  const mode = useSessionStore((s) => s.config.mode)
  const current = useSessionStore((s) => s.round.current)
  const roundStartedAt = useSessionStore((s) => s.round.roundStartedAt)
  const nextRound = useSessionStore((s) => s.nextRound)
  const recordSample = useStatsStore((s) => s.recordSample)

  const micState = useMicPitch({ active: micActive, minClarity: MIN_CLARITY })
  const trackerRef = useRef(createStabilityTracker(STABLE_MS))

  useEffect(() => {
    trackerRef.current.reset()
  }, [current?.pitchClass, current?.stringName])

  useEffect(() => {
    if (micState.status !== 'granted' || !current) return
    const confirmed = trackerRef.current.push(micState.detected, Date.now())
    if (confirmed !== null && confirmed === current.pitchClass) {
      const responseTimeMs = roundStartedAt ? Date.now() - roundStartedAt : 0
      recordSample(current.noteId, responseTimeMs)
      nextRound()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micState.detected, micState.status, current])

  return (
    <div className={styles.modeView}>
      <NoteDisplay />
      {current && (
        <MicStatusIndicator
          status={micState.status}
          error={micState.error}
          onStart={() => setMicActive(true)}
          onStop={() => setMicActive(false)}
        />
      )}
      {mode === 'adaptive' && (
        <button type="button" className={styles.statsLink} onClick={() => setShowStats((v) => !v)}>
          {showStats ? 'Hide stats' : 'View stats'}
        </button>
      )}
      {mode === 'adaptive' && showStats && <StatsView />}
    </div>
  )
}
