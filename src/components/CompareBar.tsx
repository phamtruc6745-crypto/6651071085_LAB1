import { useLanguage } from '../hooks/useLanguage'

interface CompareBarProps {
  count: number
  max: number
  onOpen: () => void
  onClear: () => void
}

export function CompareBar({ count, max, onOpen, onClear }: CompareBarProps) {
  const { t } = useLanguage()
  if (count === 0) {
    return null
  }

  return (
    <section
      aria-label={t('compare.bar')}
      className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-brand bg-white shadow-lg"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900" role="status">
            {t('compare.selected', { count })}
          </p>
          <p className="text-xs text-slate-600">
            {count < 2 ? t('compare.needTwo') : count >= max ? t('compare.maxReached', { max }) : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={onClear}>
            {t('compare.clear')}
          </button>
          <button type="button" className="btn-primary" disabled={count < 2} onClick={onOpen}>
            {t('compare.open')}
          </button>
        </div>
      </div>
    </section>
  )
}
