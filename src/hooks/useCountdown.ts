import { useEffect, useRef, useState } from 'react'

/**
 * Counts down from `totalSeconds`, restarting whenever `resetKey` changes.
 * Returns the remaining time in milliseconds; fires `onComplete` once it hits zero.
 */
export function useCountdown(
  totalSeconds: number,
  enabled: boolean,
  resetKey: unknown,
  onComplete: () => void,
): number {
  const [remainingMs, setRemainingMs] = useState(totalSeconds * 1000)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!enabled) {
      setRemainingMs(totalSeconds * 1000)
      return
    }

    const totalMs = totalSeconds * 1000
    const startedAt = Date.now()
    setRemainingMs(totalMs)

    let frame: number
    let done = false

    function tick() {
      const remaining = Math.max(0, totalMs - (Date.now() - startedAt))
      setRemainingMs(remaining)
      if (remaining <= 0) {
        if (!done) {
          done = true
          onCompleteRef.current()
        }
        return
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSeconds, enabled, resetKey])

  return remainingMs
}
