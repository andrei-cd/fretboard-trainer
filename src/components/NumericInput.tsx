import { useEffect, useState } from 'react'

interface NumericInputProps {
  value: number
  min: number
  max: number
  onValueChange: (value: number) => void
}

/**
 * A number input that permits an empty field while it is being edited. Native controlled
 * number inputs otherwise snap back to their prior value as soon as the last digit is erased.
 */
export function NumericInput({ value, min, max, onValueChange }: NumericInputProps) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => setDraft(String(value)), [value])

  function commit(valueToCommit: string) {
    const parsed = Number(valueToCommit)
    if (!Number.isFinite(parsed)) {
      setDraft(String(value))
      return
    }

    const nextValue = Math.min(max, Math.max(min, Math.round(parsed)))
    setDraft(String(nextValue))
    if (nextValue !== value) onValueChange(nextValue)
  }

  return (
    <input
      type="number"
      min={min}
      max={max}
      step={1}
      inputMode="numeric"
      value={draft}
      onChange={(event) => {
        const nextDraft = event.target.value
        setDraft(nextDraft)
        if (nextDraft !== '') commit(nextDraft)
      }}
      onBlur={() => {
        if (draft === '') setDraft(String(value))
        else commit(draft)
      }}
    />
  )
}
