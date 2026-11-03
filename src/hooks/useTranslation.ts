import { useCallback } from 'react'
import { useLanguage } from './useLanguage'
import { formatDate } from '../i18n/dictionary'
import type { LocalizedText } from '../types'

export function useTranslation() {
  const { language, t } = useLanguage()

  const pick = useCallback((text: LocalizedText): string => text[language], [language])

  const date = useCallback((isoDate: string): string => formatDate(isoDate, language), [language])

  return { t, language, pick, date }
}
