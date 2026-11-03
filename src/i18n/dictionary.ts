import { en } from './en'
import { vi, type TranslationKey } from './vi'
import type { Language } from '../types'

export const dictionaries: Record<Language, Record<TranslationKey, string>> = { vi, en }

export const LANGUAGE_STORAGE_KEY = 'kanban.lang'

export const DEFAULT_LANGUAGE: Language = 'vi'

export const LOCALES: Record<Language, string> = { vi: 'vi-VN', en: 'en-US' }

export function isLanguage(value: unknown): value is Language {
  return value === 'vi' || value === 'en'
}

export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (params === undefined) {
    return template
  }
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name]
    return value === undefined ? match : String(value)
  })
}

export function formatDate(isoDate: string, language: Language): string {
  const parts = isoDate.split('-').map(Number)
  const [year, month, day] = parts
  if (parts.length !== 3 || !year || !month || !day) {
    return isoDate
  }
  return new Intl.DateTimeFormat(LOCALES[language], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(year, month - 1, day))
}
