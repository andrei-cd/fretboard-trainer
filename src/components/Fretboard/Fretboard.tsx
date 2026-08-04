import {
  DOUBLE_FRET_MARKERS,
  SINGLE_FRET_MARKERS,
  STRING_LABELS,
  STRING_NAMES,
} from '../../lib/music-theory'
import type { FretboardLabelMode, StringName } from '../../types'
import styles from './Fretboard.module.css'

interface FretboardProps {
  fretCount: number
  leftHand: boolean
  labelMode: FretboardLabelMode
  showMarkers: boolean
  highlighted: { stringName: StringName; fret: number } | null
}

const VIEW_WIDTH = 1000
const VIEW_HEIGHT = 320
const TOP_PADDING = 16
const RIGHT_PADDING = 16

/** High string on top, low string on bottom — matches FretboardHeatmap's existing row order. */
const ROWS: readonly StringName[] = [...STRING_NAMES].reverse()

export function Fretboard({ fretCount, leftHand, labelMode, showMarkers, highlighted }: FretboardProps) {
  const showStringLabels = labelMode === 'frets-strings' || labelMode === 'strings-only'
  const showFretLabels = labelMode === 'frets-strings' || labelMode === 'frets-only'

  const stringLabelWidth = showStringLabels ? 40 : 12
  const fretLabelHeight = showFretLabels ? 28 : 8

  // String labels sit next to the nut, which moves sides in left-hand mode — so the wider
  // margin needs to follow the nut rather than always sitting on the left.
  const boardLeft = leftHand ? RIGHT_PADDING : stringLabelWidth
  const boardRight = VIEW_WIDTH - (leftHand ? stringLabelWidth : RIGHT_PADDING)
  const boardTop = TOP_PADDING
  const boardBottom = VIEW_HEIGHT - fretLabelHeight
  const boardWidth = boardRight - boardLeft
  const stringGap = (boardBottom - boardTop) / (ROWS.length - 1)

  /** Real scale-length taper: fret spacing narrows toward the body, all within a fixed board width. */
  function rawFretOffset(fret: number): number {
    return 1 - 1 / Math.pow(2, fret / 12)
  }
  const scale = boardWidth / rawFretOffset(fretCount)

  function fretX(fret: number): number {
    const offset = rawFretOffset(fret) * scale
    return leftHand ? boardRight - offset : boardLeft + offset
  }

  function dotX(fret: number): number {
    if (fret === 0) return fretX(0)
    return (fretX(fret - 1) + fretX(fret)) / 2
  }

  function stringY(stringName: StringName): number {
    return boardTop + ROWS.indexOf(stringName) * stringGap
  }

  const markerCenterY = (boardTop + boardBottom) / 2
  const markerOffsetY = (boardBottom - boardTop) * 0.2

  const highlightPos = highlighted ? { x: dotX(highlighted.fret), y: stringY(highlighted.stringName) } : null

  return (
    <svg
      className={styles.fretboard}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Guitar fretboard"
    >
      {showMarkers &&
        Array.from({ length: fretCount }, (_, i) => i + 1).map((fret) => {
          if (DOUBLE_FRET_MARKERS.includes(fret)) {
            const x = dotX(fret)
            return (
              <g key={fret}>
                <circle className={styles.marker} cx={x} cy={markerCenterY - markerOffsetY} r={7} />
                <circle className={styles.marker} cx={x} cy={markerCenterY + markerOffsetY} r={7} />
              </g>
            )
          }
          if (SINGLE_FRET_MARKERS.includes(fret)) {
            return <circle key={fret} className={styles.marker} cx={dotX(fret)} cy={markerCenterY} r={7} />
          }
          return null
        })}

      {ROWS.map((stringName) => (
        <line
          key={stringName}
          className={styles.stringLine}
          x1={boardLeft}
          x2={boardRight}
          y1={stringY(stringName)}
          y2={stringY(stringName)}
        />
      ))}

      {Array.from({ length: fretCount + 1 }, (_, fret) => (
        <line
          key={fret}
          className={fret === 0 ? styles.nutLine : styles.fretLine}
          x1={fretX(fret)}
          x2={fretX(fret)}
          y1={boardTop}
          y2={boardBottom}
        />
      ))}

      {showStringLabels &&
        ROWS.map((stringName) => (
          <text
            key={stringName}
            className={styles.stringLabel}
            x={leftHand ? boardRight + 12 : boardLeft - 12}
            y={stringY(stringName)}
            textAnchor={leftHand ? 'start' : 'end'}
            dominantBaseline="middle"
          >
            {STRING_LABELS[stringName].replace(' (low)', '').replace(' (high)', '')}
          </text>
        ))}

      {showFretLabels &&
        Array.from({ length: fretCount }, (_, i) => i + 1).map((fret) => (
          <text key={fret} className={styles.fretLabel} x={dotX(fret)} y={boardBottom + 20} textAnchor="middle">
            {fret}
          </text>
        ))}

      {highlightPos && <circle className={styles.highlight} cx={highlightPos.x} cy={highlightPos.y} r={11} />}
    </svg>
  )
}
