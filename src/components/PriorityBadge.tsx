import type { Priority } from '../types'
import { useLanguage } from '../hooks/useLanguage'

const STYLES: Record<Priority, string> = {
  low: 'bg-brand-100 text-brand-800',
  medium: 'bg-amber-100 text-amber-900',
  high: 'bg-red-100 text-red-800',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { t } = useLanguage()
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[priority]}`}>
      {t(`priority.${priority}`)}
    </span>
  )
}
