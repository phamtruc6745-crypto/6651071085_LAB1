import type { LabelKey } from '../types'
import { useLanguage } from '../hooks/useLanguage'

export function LabelBadge({ label }: { label: LabelKey }) {
  const { t } = useLanguage()
  return (
    <span className="inline-block rounded-md border border-brand-700 bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-800">
      {t(`label.${label}`)}
    </span>
  )
}
