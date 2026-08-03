import { useEffect, useState } from 'react'
import { PitchDetector } from 'pitchy'
import type { MicSensitivity } from '../../types'
import { frequencyToNote, type DetectedNote } from './pitchToNote'

export type MicStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error'

export interface MicPitchState {
  status: MicStatus
  detected: DetectedNote | null
  clarity: number
  error?: string
}

interface UseMicPitchOptions {
  /** Only requests mic access and starts analyzing while true. */
  active: boolean
  /** Minimum pitchy clarity (0-1) required to accept a reading. */
  minClarity?: number
  /** Minimum input volume (dBFS) below which pitchy won't attempt detection. Less negative = stricter. */
  minVolumeDecibels?: number
}

const FFT_SIZE = 2048
const IDLE_STATE: MicPitchState = { status: 'idle', detected: null, clarity: 0 }

/**
 * Frequencies outside a guitar's practical range (including a capo/high frets) are almost
 * certainly noise — mains hum, room rumble, breath, hiss — not a played note, so readings
 * outside this band are rejected before they ever reach the stability tracker.
 */
const MIN_PLAUSIBLE_HZ = 70
const MAX_PLAUSIBLE_HZ = 1500

/**
 * The low end requires a louder, cleaner signal (fewer false positives from background noise,
 * but may miss quiet playing); the high end picks up quieter/softer notes at the cost of being
 * more prone to false positives from ambient noise.
 */
export const MIC_SENSITIVITY_PRESETS: Record<MicSensitivity, { minClarity: number; minVolumeDecibels: number }> = {
  'very-low': { minClarity: 0.97, minVolumeDecibels: -30 },
  low: { minClarity: 0.95, minVolumeDecibels: -35 },
  medium: { minClarity: 0.92, minVolumeDecibels: -40 },
  high: { minClarity: 0.88, minVolumeDecibels: -45 },
  'very-high': { minClarity: 0.84, minVolumeDecibels: -50 },
}

export function useMicPitch({
  active,
  minClarity = 0.9,
  minVolumeDecibels = -45,
}: UseMicPitchOptions): MicPitchState {
  const [state, setState] = useState<MicPitchState>(IDLE_STATE)

  useEffect(() => {
    if (!active) {
      setState(IDLE_STATE)
      return
    }

    let cancelled = false
    let stream: MediaStream | null = null
    let audioContext: AudioContext | null = null
    let rafId: number | null = null

    async function start() {
      setState({ status: 'requesting', detected: null, clarity: 0 })
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = FFT_SIZE
        source.connect(analyser)

        const detector = PitchDetector.forFloat32Array(analyser.fftSize)
        detector.minVolumeDecibels = minVolumeDecibels
        const buffer = new Float32Array(detector.inputLength)

        setState({ status: 'granted', detected: null, clarity: 0 })

        const tick = () => {
          if (cancelled || !audioContext) return
          analyser.getFloatTimeDomainData(buffer)
          const [frequency, clarity] = detector.findPitch(buffer, audioContext.sampleRate)
          const inPlausibleRange = frequency >= MIN_PLAUSIBLE_HZ && frequency <= MAX_PLAUSIBLE_HZ
          const detected = clarity >= minClarity && inPlausibleRange ? frequencyToNote(frequency) : null
          setState({ status: 'granted', detected, clarity })
          rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
      } catch (err) {
        if (cancelled) return
        const isDenied = err instanceof DOMException && err.name === 'NotAllowedError'
        setState({
          status: isDenied ? 'denied' : 'error',
          detected: null,
          clarity: 0,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    start()

    return () => {
      cancelled = true
      if (rafId !== null) cancelAnimationFrame(rafId)
      stream?.getTracks().forEach((t) => t.stop())
      void audioContext?.close()
    }
  }, [active, minClarity, minVolumeDecibels])

  return state
}
