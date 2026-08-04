import { useEffect, useRef, useState } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import { useStatsStore } from '../../store/statsStore'
import { usePreferencesStore } from '../../store/preferencesStore'
import { MIC_SENSITIVITY_PRESETS, useMicPitch } from '../../lib/pitch-detection/useMicPitch'
import { createStabilityTracker } from '../../lib/pitch-detection/stabilityBuffer'
import { midiNoteToLabel, midiNotesForNote } from '../../lib/music-theory'
import { playErrorSound, playSuccessSound } from '../../lib/audio/feedbackSounds'
import { NoteDisplay } from './NoteDisplay'
import { MicStatusIndicator } from './MicStatusIndicator'
import { FeedbackBadge, type Feedback } from './FeedbackBadge'
import { StatsView } from '../StatsView/StatsView'
import styles from './PracticeView.module.css'

const STABLE_MS = 150
/** How long the success badge/sound shows before auto-advancing to the next note. */
const SUCCESS_ADVANCE_DELAY_MS = 600
/** How long the error badge/sound stays up before clearing (listening continues the whole time). */
const ERROR_FEEDBACK_MS = 2200

export function MicPracticeView() {
  const [micActive, setMicActive] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const adaptiveEnabled = useSessionStore((s) => s.config.adaptiveEnabled)
  const fretRange = useSessionStore((s) => s.config.fretRange)
  const current = useSessionStore((s) => s.round.current)
  const roundStartedAt = useSessionStore((s) => s.round.roundStartedAt)
  const nextRound = useSessionStore((s) => s.nextRound)
  const recordSample = useStatsStore((s) => s.recordSample)
  const soundEnabled = usePreferencesStore((s) => s.soundEnabled)
  const feedbackMessagesEnabled = usePreferencesStore((s) => s.feedbackMessagesEnabled)
  const micSensitivity = usePreferencesStore((s) => s.micSensitivity)

  const micState = useMicPitch({ active: micActive, ...MIC_SENSITIVITY_PRESETS[micSensitivity] })
  const trackerRef = useRef(createStabilityTracker(STABLE_MS))
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // The exact MIDI note last confirmed correct — a guitar string keeps ringing after a
  // round advances, so the next round needs to ignore that leftover sustain instead of
  // mistaking it for a fresh (incorrect) attempt at the new note.
  const lastConfirmedMidiNoteRef = useRef<number | null>(null)
  // Guards against scoring the current round more than once: a held/decaying note can flicker
  // (harmonics, brief clarity dips) and get "confirmed" by the tracker a second time before
  // the success-delay timer advances to the next round, which previously played the success
  // sound and recorded a sample twice for a single correct answer.
  const roundScoredRef = useRef(false)

  function clearFeedbackTimeout() {
    if (feedbackTimeoutRef.current !== null) {
      clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = null
    }
  }

  // New round: ignore any carried-over ringing from the last note, and clear old feedback.
  useEffect(() => {
    trackerRef.current.ignoreUntilChanged(lastConfirmedMidiNoteRef.current)
    roundScoredRef.current = false
    setFeedback(null)
    clearFeedbackTimeout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.pitchClass, current?.stringName, current?.noteId])

  useEffect(() => clearFeedbackTimeout, [])

  useEffect(() => {
    if (micState.status !== 'granted' || !current || roundScoredRef.current) return
    const confirmedMidiNote = trackerRef.current.push(micState.detected, Date.now())
    if (confirmedMidiNote === null) return

    clearFeedbackTimeout()
    const validMidiNotes = midiNotesForNote(current.stringName, current.pitchClass, fretRange)

    if (validMidiNotes.includes(confirmedMidiNote)) {
      roundScoredRef.current = true
      const responseTimeMs = roundStartedAt ? Date.now() - roundStartedAt : 0
      recordSample(current.stringName, current.noteId, responseTimeMs)
      lastConfirmedMidiNoteRef.current = confirmedMidiNote
      if (soundEnabled) playSuccessSound()
      if (feedbackMessagesEnabled) {
        setFeedback({ kind: 'success' })
        feedbackTimeoutRef.current = setTimeout(() => nextRound(), SUCCESS_ADVANCE_DELAY_MS)
      } else {
        nextRound()
      }
      return
    }

    if (soundEnabled) playErrorSound()
    if (feedbackMessagesEnabled) {
      setFeedback({ kind: 'error', playedLabel: midiNoteToLabel(confirmedMidiNote) })
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), ERROR_FEEDBACK_MS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micState.detected, micState.status, current, fretRange, soundEnabled, feedbackMessagesEnabled])

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
      {feedback && <FeedbackBadge feedback={feedback} />}
      {adaptiveEnabled && (
        <button type="button" className={styles.statsLink} onClick={() => setShowStats((v) => !v)}>
          {showStats ? 'Hide stats' : 'View stats'}
        </button>
      )}
      {adaptiveEnabled && showStats && <StatsView />}
    </div>
  )
}
