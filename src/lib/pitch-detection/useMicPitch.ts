import { useEffect, useState } from 'react'
import { PitchDetector } from 'pitchy'
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
}

const FFT_SIZE = 2048
const IDLE_STATE: MicPitchState = { status: 'idle', detected: null, clarity: 0 }

export function useMicPitch({ active, minClarity = 0.9 }: UseMicPitchOptions): MicPitchState {
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
        detector.minVolumeDecibels = -45
        const buffer = new Float32Array(detector.inputLength)

        setState({ status: 'granted', detected: null, clarity: 0 })

        const tick = () => {
          if (cancelled || !audioContext) return
          analyser.getFloatTimeDomainData(buffer)
          const [frequency, clarity] = detector.findPitch(buffer, audioContext.sampleRate)
          const detected = clarity >= minClarity && frequency > 0 ? frequencyToNote(frequency) : null
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
  }, [active, minClarity])

  return state
}
