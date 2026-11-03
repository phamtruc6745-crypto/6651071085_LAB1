import { Link } from 'react-router-dom'
import { Avatar } from './Avatar'
import { ArrowLeftIcon, ArrowRightIcon } from './Icons'
import { LabelBadge } from './LabelBadge'
import { PriorityBadge } from './PriorityBadge'
import { useTranslation } from '../hooks/useTranslation'
import { STATUSES, type Status, type Task } from '../types'
import { truncateText } from '../utils'

interface CardProps {
  task: Task
  selected: boolean
  selectDisabled: boolean
  onToggleSelect: (id: string) => void
  onMove: (id: string, status: Status) => void
}

export function Card({ task, selected, selectDisabled, onToggleSelect, onMove }: CardProps) {
  const { t, pick, date } = useTranslation()
  const index = STATUSES.indexOf(task.status)
  const previous: Status | undefined = STATUSES[index - 1]
  const next: Status | undefined = STATUSES[index + 1]
  const title = pick(task.title)

  return (
    <article
      className={`rounded-lg border bg-white p-4 shadow-sm ${
        selected ? 'border-brand ring-2 ring-brand' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          disabled={selectDisabled && !selected}
          onChange={() => {
            onToggleSelect(task.id)
          }}
          aria-label={t('card.select', { title })}
          className="mt-1 h-5 w-5 shrink-0 accent-emerald-700"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-900">
            <Link to={`/item/${task.id}`} className="rounded text-brand-800 hover:underline" aria-label={t('card.view', { title })}>
              {title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-slate-600">{truncateText(pick(task.description), 90)}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {task.labels.map((label) => (
          <LabelBadge key={label} label={label} />
        ))}
      </div>

      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
        <div>
          <dt className="sr-only">{t('field.dueDate')}</dt>
          <dd>{t('card.dueShort', { date: date(task.dueDate) })}</dd>
        </div>
        <div>
          <dt className="sr-only">{t('field.estimate')}</dt>
          <dd>{t('field.hours', { count: task.estimateHours })}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar name={task.assignee} />
          <span className="truncate text-sm text-slate-700">{task.assignee}</span>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className="btn-icon"
            disabled={previous === undefined}
            aria-label={t('card.moveTo', { status: t(`status.${previous ?? task.status}`) })}
            onClick={() => {
              if (previous !== undefined) {
                onMove(task.id, previous)
              }
            }}
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            className="btn-icon"
            disabled={next === undefined}
            aria-label={t('card.moveTo', { status: t(`status.${next ?? task.status}`) })}
            onClick={() => {
              if (next !== undefined) {
                onMove(task.id, next)
              }
            }}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </article>
  )
}
