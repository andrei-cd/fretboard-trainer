let sharedContext: AudioContext | null = null

/** Lazily creates a single AudioContext shared by all sound-producing features. */
export function getAudioContext(): AudioContext {
  if (!sharedContext || sharedContext.state === 'closed') sharedContext = new AudioContext()
  return sharedContext
}

/** Resume audio from a user interaction before scheduling sounds. */
export function resumeAudioContext(ctx = getAudioContext()): Promise<void> {
  if (ctx.state === 'running') return Promise.resolve()
  return ctx.resume()
}
