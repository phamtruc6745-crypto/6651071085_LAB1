import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageContext, type LanguageContextValue } from './LanguageContext'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  dictionaries,
  interpolate,
  isLanguage,
} from '../i18n/dictionary'
import type { Language } from '../types'

function readStoredLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isLanguage(stored)) {
      return stored
    }
  } catch {
    return DEFAULT_LANGUAGE
  }
  return DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage)

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
    } catch {
      return
    }
  }, [])

  const t = useCallback<LanguageContextValue['t']>(
    (key, params) => interpolate(dictionaries[language][key], params),
    [language],
  )

  useEffect(() => {
    document.documentElement.lang = language
    document.title = dictionaries[language]['app.title']
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
