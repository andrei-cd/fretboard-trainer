import { useEffect, useRef, useState } from 'react'
import { useRecognitionStore } from '../../store/recognitionStore'
import { usePreferencesStore } from '../../store/preferencesStore'
import { noteIdToPitchClass } from '../../lib/music-theory'
import { playErrorSound, playSuccessSound } from '../../lib/audio/feedbackSounds'
import { Fretboard } from '../Fretboard/Fretboard'
import { FeedbackBadge, type Feedback } from '../PracticeView/FeedbackBadge'
import { NoteAnswerGrid } from './NoteAnswerGrid'
import type { NoteId } from '../../types'
import styles from './RecognitionView.module.css'

/** How long the success badge/sound shows before auto-advancing to the next position. */
const SUCCESS_ADVANCE_DELAY_MS = 600
/** How long the error badge/sound stays up before clearing — the user can keep guessing. */
const ERROR_FEEDBACK_MS = 2200

export function RecognitionView() {
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [locked, setLocked] = useState(false)
  const [incorrectAnswers, setIncorrectAnswers] = useState<Set<NoteId>>(new Set())
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const config = useRecognitionStore((s) => s.config)
  const current = useRecognitionStore((s) => s.round.current)
  const nextRound = useRecognitionStore((s) => s.nextRound)
  const soundEnabled = usePreferencesStore((s) => s.recognitionSoundEnabled)
  const feedbackMessagesEnabled = usePreferencesStore((s) => s.recognitionFeedbackMessagesEnabled)

  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stringsKey = config.selectedStrings.join(',')
  const notesKey = config.selectedNotes.join(',')

  useEffect(() => {
    nextRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringsKey, config.fretCount, config.noteFilterEnabled, notesKey])

  useEffect(() => {
    setFeedback(null)
    setLocked(false)
    setIncorrectAnswers(new Set())
    if (feedbackTimeoutRef.current !== null) {
      clearTimeout(feedbackTimeoutRef.current)
      feedbackTimeoutRef.current = null
    }
  }, [current?.stringName, current?.fret])

  useEffect(
    () => () => {
      if (feedbackTimeoutRef.current !== null) clearTimeout(feedbackTimeoutRef.current)
    },
    [],
  )

  function handleAnswer(noteId: NoteId) {
    if (!current || locked) return

    setAttempts((count) => count + 1)

    if (noteIdToPitchClass(noteId) === current.pitchClass) {
      setLocked(true)
      setCorrectAnswers((count) => count + 1)
      if (soundEnabled) playSuccessSound()
      if (feedbackMessagesEnabled) {
        setFeedback({ kind: 'success' })
        feedbackTimeoutRef.current = setTimeout(() => nextRound(), SUCCESS_ADVANCE_DELAY_MS)
      } else {
        nextRound()
      }
      return
    }

    setIncorrectAnswers((answers) => new Set(answers).add(noteId))
    if (soundEnabled) playErrorSound()
    if (feedbackMessagesEnabled) {
      setFeedback({ kind: 'error', playedLabel: noteId })
      feedbackTimeoutRef.current = setTimeout(() => setFeedback(null), ERROR_FEEDBACK_MS)
    }
  }

  const correctPercentage = attempts === 0 ? 0 : Math.round((correctAnswers / attempts) * 100)

  return (
    <div className={styles.view}>
      <div className={styles.progressBar}>
        <p className={styles.progress} aria-live="polite">
          <span className={styles.progressCount}>{correctAnswers}/{attempts}</span>
          <span className={styles.progressPercentage}>{correctPercentage}% correct</span>
        </p>
        <button
          type="button"
          className={styles.resetProgressButton}
          onClick={() => {
            setCorrectAnswers(0)
            setAttempts(0)
          }}
        >
          Reset
        </button>
      </div>
      <div className={styles.fretboardWrap}>
        <Fretboard
          fretCount={config.fretCount}
          leftHand={config.leftHand}
          labelMode={config.labelMode}
          showMarkers={config.showFretMarkers}
          highlighted={current ? { stringName: current.stringName, fret: current.fret } : null}
        />
      </div>
      <div className={styles.answerArea}>
        <div className={styles.answerGridWrap}>
          <NoteAnswerGrid
            format={config.noteNameFormat}
            disabled={!current || locked}
            incorrectAnswers={incorrectAnswers}
            onAnswer={handleAnswer}
          />
          {feedback && (
            <div className={styles.feedbackFloating}>
              <FeedbackBadge feedback={feedback} verb="picked" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
