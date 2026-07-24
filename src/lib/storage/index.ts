import { createEmptyState, STORAGE_KEY, type PersistedSchemaV1 } from './schema'

export function loadState(): PersistedSchemaV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyState()
    const parsed = JSON.parse(raw) as PersistedSchemaV1
    if (parsed.version !== 1) return createEmptyState()
    return parsed
  } catch {
    return createEmptyState()
  }
}

export function saveState(state: PersistedSchemaV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.) — fail silently
  }
}

export * from './schema'
