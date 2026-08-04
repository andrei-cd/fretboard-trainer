import { ACCIDENTAL_NOTE_ID_PAIRS, NATURAL_NOTE_IDS } from '../../lib/music-theory'
import type { NoteId, NoteNameFormat } from '../../types'
import styles from './RecognitionView.module.css'

interface NoteAnswerGridProps {
  format: NoteNameFormat
  disabled: boolean
  incorrectAnswers: ReadonlySet<NoteId>
  onAnswer: (noteId: NoteId) => void
}

/** Maps each natural letter to its sharp/flat accidental pair, e.g. 'C' -> ['C#', 'Db']. */
const NATURAL_TO_ACCIDENTAL_PAIR = new Map<NoteId, [NoteId, NoteId]>(
  ACCIDENTAL_NOTE_ID_PAIRS.map((pair) => [pair[0][0] as NoteId, pair]),
)

function AnswerRow({
  cells,
  disabled,
  incorrectAnswers,
  onAnswer,
}: {
  cells: (NoteId | null)[]
  disabled: boolean
  incorrectAnswers: ReadonlySet<NoteId>
  onAnswer: (noteId: NoteId) => void
}) {
  return (
    <>
      {cells.map((noteId, i) =>
        noteId ? (
          <button
            key={noteId}
            type="button"
            className={`${styles.answerButton} ${incorrectAnswers.has(noteId) ? styles.answerButtonIncorrect : ''}`}
            disabled={disabled || incorrectAnswers.has(noteId)}
            onClick={() => onAnswer(noteId)}
          >
            {noteId}
          </button>
        ) : (
          <span key={i} className={styles.answerButtonEmpty} aria-hidden="true" />
        ),
      )}
    </>
  )
}

export function NoteAnswerGrid({ format, disabled, incorrectAnswers, onAnswer }: NoteAnswerGridProps) {
  const sharpCells = NATURAL_NOTE_IDS.map((natural) => NATURAL_TO_ACCIDENTAL_PAIR.get(natural)?.[0] ?? null)
  const flatCells = NATURAL_NOTE_IDS.map((natural) => NATURAL_TO_ACCIDENTAL_PAIR.get(natural)?.[1] ?? null)

  return (
    <div className={styles.answerGrid} role="group" aria-label="Note names">
      {(format === 'sharps' || format === 'both') && (
        <AnswerRow cells={sharpCells} disabled={disabled} incorrectAnswers={incorrectAnswers} onAnswer={onAnswer} />
      )}
      <AnswerRow
        cells={[...NATURAL_NOTE_IDS]}
        disabled={disabled}
        incorrectAnswers={incorrectAnswers}
        onAnswer={onAnswer}
      />
      {(format === 'flats' || format === 'both') && (
        <AnswerRow cells={flatCells} disabled={disabled} incorrectAnswers={incorrectAnswers} onAnswer={onAnswer} />
      )}
    </div>
  )
}
