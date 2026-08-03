import { useEffect, useState } from 'react'
import { startMetronome } from '../lib/audio/metronome'

interface UseMetronomeOptions {
  enabled: boolean
  bpm: number
  /** Changing this restarts the click track from beat 0, syncing the downbeat to that moment. */
  resetKey?: unknown
  accentEvery: number
}

interface MetronomeBeat {
  /** Increments on every tick; use as a React `key` to restart a per-tick animation. */
  pulseKey: number
  accent: boolean
}

const SILENT: MetronomeBeat = { pulseKey: 0, accent: false }

/** Drives an audible click track and returns the latest beat for driving a visual pulse. */
export function useMetronome({ enabled, bpm, resetKey, accentEvery }: UseMetronomeOptions): MetronomeBeat {
  const [beat, setBeat] = useState<MetronomeBeat>(SILENT)

  useEffect(() => {
    if (!enabled || !Number.isFinite(bpm) || bpm <= 0) {
      setBeat(SILENT)
      return
    }

    const handle = startMetronome({
      bpm,
      accentEvery,
      onTick: (_beatIndex, accent) => setBeat((prev) => ({ pulseKey: prev.pulseKey + 1, accent })),
    })
    return () => handle.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, bpm, resetKey, accentEvery])

  return beat
}
