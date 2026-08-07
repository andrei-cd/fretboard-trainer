import { getAudioContext, resumeAudioContext } from './audioContext'

/** How far ahead (in seconds) clicks are scheduled into the Web Audio timeline. */
const SCHEDULE_AHEAD_SEC = 0.1
/** How often the scheduler wakes up to top up the schedule. */
const LOOKAHEAD_MS = 25

export interface MetronomeOptions {
  bpm: number
  /** Beats are accented (louder, higher-pitched) every `accentEvery` beats, starting at beat 0. */
  accentEvery: number
  onTick?: (beatIndex: number, accent: boolean) => void
}

export interface MetronomeHandle {
  stop: () => void
}

function scheduleClick(ctx: AudioContext, time: number, accent: boolean): void {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'square'
  oscillator.frequency.value = accent ? 1500 : 1000
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(accent ? 0.2 : 0.12, time + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(time)
  oscillator.stop(time + 0.06)
}

/**
 * Starts a click track at `bpm`. Beat 0 is scheduled immediately, so callers that want the
 * downbeat to land on a specific moment (e.g. a new round starting) should call this right
 * at that moment rather than reusing a running instance.
 */
export function startMetronome({ bpm, accentEvery, onTick }: MetronomeOptions): MetronomeHandle {
  const ctx = getAudioContext()
  const interval = 60 / bpm
  let nextBeatTime = ctx.currentTime
  let beatIndex = 0
  let stopped = false
  let timer: ReturnType<typeof setTimeout> | null = null

  function scheduleAhead() {
    if (stopped) return
    while (nextBeatTime < ctx.currentTime + SCHEDULE_AHEAD_SEC) {
      const accent = beatIndex % accentEvery === 0
      scheduleClick(ctx, nextBeatTime, accent)
      const delayMs = Math.max(0, (nextBeatTime - ctx.currentTime) * 1000)
      const firedBeat = beatIndex
      setTimeout(() => {
        if (!stopped) onTick?.(firedBeat, accent)
      }, delayMs)
      nextBeatTime += interval
      beatIndex += 1
    }
    timer = setTimeout(scheduleAhead, LOOKAHEAD_MS)
  }

  // A suspended context reports a frozen clock. Wait for it to be running before scheduling,
  // otherwise every future click can be queued at the same stale timestamp after a pause.
  void resumeAudioContext(ctx)
    .then(() => {
      if (stopped) return
      nextBeatTime = ctx.currentTime
      scheduleAhead()
    })
    .catch(() => {
      // Browsers may deny resume before any user gesture; a later toggle will retry it.
    })

  return {
    stop: () => {
      stopped = true
      if (timer !== null) clearTimeout(timer)
    },
  }
}
