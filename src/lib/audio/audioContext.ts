let sharedContext: AudioContext | null = null

/** Lazily creates a single AudioContext shared by all sound-producing features. */
export function getAudioContext(): AudioContext {
  if (!sharedContext) sharedContext = new AudioContext()
  if (sharedContext.state === 'suspended') void sharedContext.resume()
  return sharedContext
}
