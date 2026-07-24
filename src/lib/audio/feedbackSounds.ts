let sharedContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!sharedContext) sharedContext = new AudioContext()
  if (sharedContext.state === 'suspended') void sharedContext.resume()
  return sharedContext
}

/** Plays a short, soft tone starting `startOffset` seconds from now. */
function playTone(
  ctx: AudioContext,
  frequencyHz: number,
  startOffset: number,
  durationSec: number,
  peakGain: number,
): void {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequencyHz

  const startTime = ctx.currentTime + startOffset
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec)

  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + durationSec + 0.02)
}

/** Quick ascending two-note chime. */
export function playSuccessSound(): void {
  try {
    const ctx = getAudioContext()
    playTone(ctx, 880, 0, 0.1, 0.15) // A5
    playTone(ctx, 1318.51, 0.08, 0.16, 0.15) // E6
  } catch {
    // Web Audio unavailable (unsupported browser, blocked, etc.) — fail silently.
  }
}

/** Short descending, low-pitched buzz. */
export function playErrorSound(): void {
  try {
    const ctx = getAudioContext()
    playTone(ctx, 220, 0, 0.16, 0.12) // A3
    playTone(ctx, 174.61, 0.1, 0.22, 0.12) // F3
  } catch {
    // Web Audio unavailable (unsupported browser, blocked, etc.) — fail silently.
  }
}
