import { useLanguage } from '../hooks/useLanguage'
import { isLanguage } from '../i18n/dictionary'
import type { Language } from '../types'

const OPTIONS: readonly Language[] = ['vi', 'en']

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div role="group" aria-label={t('lang.switch')} className="inline-flex overflow-hidden rounded-md border border-brand-700">
      {OPTIONS.map((option) => {
        const active = option === language
        return (
          <button
            key={option}
            type="button"
            lang={option}
            aria-pressed={active}
            aria-label={t(option === 'vi' ? 'lang.vi' : 'lang.en')}
            onClick={() => {
              if (isLanguage(option)) {
                setLanguage(option)
              }
            }}
            className={`px-3 py-1.5 text-sm font-semibold ${
              active ? 'bg-brand-700 text-white' : 'bg-white text-brand-700 hover:bg-brand-50'
            }`}
          >
            {option.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
