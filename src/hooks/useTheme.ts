import { useEffect, useState } from 'react'
import { usePreferencesStore } from '../store/preferencesStore'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Resolves the active theme (explicit override, falling back to live system preference),
 * keeps `<html data-theme>` in sync, and exposes a toggle that sets a permanent override —
 * once the user picks explicitly, system preference changes no longer affect them.
 */
export function useTheme(): { theme: 'light' | 'dark'; toggleTheme: () => void } {
  const themeOverride = usePreferencesStore((s) => s.themeOverride)
  const setThemeOverride = usePreferencesStore((s) => s.setThemeOverride)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)

  useEffect(() => {
    if (themeOverride) return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeOverride])

  const theme = themeOverride ?? systemTheme

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, toggleTheme: () => setThemeOverride(theme === 'dark' ? 'light' : 'dark') }
}
