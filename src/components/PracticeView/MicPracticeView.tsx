import { useEffect, useRef, useState } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useStatsStore } from '../../store/statsStore'
import { useMicPitch } from '../../lib/pitch-detection/useMicPitch'
import { createStabilityTracker } from '../../lib/pitch-detection/stabilityBuffer'
import { formatStringName, midiNotesForNote } from '../../lib/music-theory'
import { NoteDisplay } from './NoteDisplay'
import { MicStatusIndicator } from './MicStatusIndicator'
import { StatsView } from '../StatsView/StatsView'
import styles from './PracticeView.module.css'

const STABLE_MS = 150
const MIN_CLARITY = 0.9
const WRONG_OCTAVE_HINT_MS = 2500

export function MicPracticeView() {
  const [micActive, setMicActive] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [wrongOctaveHint, setWrongOctaveHint] = useState(false)

  const mode = useSessionStore((s) => s.config.mode)
  const fretRange = useSessionStore((s) => s.config.fretRange)
  const current = useSessionStore((s) => s.round.current)
  const roundStartedAt = useSessionStore((s) => s.round.roundStartedAt)
  const nextRound = useSessionStore((s) => s.nextRound)
  const recordSample = useStatsStore((s) => s.recordSample)

  const micState = useMicPitch({ active: micActive, minClarity: MIN_CLARITY })
  const trackerRef = useRef(createStabilityTracker(STABLE_MS))

  useEffect(() => {
    trackerRef.current.reset()
    setWrongOctaveHint(false)
  }, [current?.pitchClass, current?.stringName])

  useEffect(() => {
    if (!wrongOctaveHint) return
    const timeout = setTimeout(() => setWrongOctaveHint(false), WRONG_OCTAVE_HINT_MS)
    return () => clearTimeout(timeout)
  }, [wrongOctaveHint])

  useEffect(() => {
    if (micState.status !== 'granted' || !current) return
    const confirmedMidiNote = trackerRef.current.push(micState.detected, Date.now())
    if (confirmedMidiNote === null) return

    const validMidiNotes = midiNotesForNote(current.stringName, current.pitchClass, fretRange)
    if (validMidiNotes.includes(confirmedMidiNote)) {
      const responseTimeMs = roundStartedAt ? Date.now() - roundStartedAt : 0
      recordSample(current.noteId, responseTimeMs)
      nextRound()
      return
    }

    const confirmedPitchClass = ((confirmedMidiNote % 12) + 12) % 12
    if (confirmedPitchClass === current.pitchClass) {
      setWrongOctaveHint(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micState.detected, micState.status, current, fretRange])

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
      {wrongOctaveHint && current && (
        <p className={styles.wrongOctaveHint}>
          Right note, wrong string/octave — play it on the {formatStringName(current.stringName)} string.
        </p>
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
