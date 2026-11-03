import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LabelBadge } from './LabelBadge'
import { PriorityBadge } from './PriorityBadge'
import { useTranslation } from '../hooks/useTranslation'
import type { Task } from '../types'

export function CompareTable({ tasks }: { tasks: Task[] }) {
  const { t, pick, date } = useTranslation()

  const rows: { key: string; label: string; render: (task: Task) => ReactNode }[] = [
    { key: 'status', label: t('field.status'), render: (task) => t(`status.${task.status}`) },
    { key: 'priority', label: t('field.priority'), render: (task) => <PriorityBadge priority={task.priority} /> },
    { key: 'estimate', label: t('field.estimate'), render: (task) => t('field.hours', { count: task.estimateHours }) },
    { key: 'assignee', label: t('field.assignee'), render: (task) => task.assignee },
    { key: 'dueDate', label: t('field.dueDate'), render: (task) => date(task.dueDate) },
    {
      key: 'labels',
      label: t('field.labels'),
      render: (task) =>
        task.labels.length === 0 ? (
          <span className="text-slate-600">{t('compare.noLabels')}</span>
        ) : (
          <span className="flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <LabelBadge key={label} label={label} />
            ))}
          </span>
        ),
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-brand-50">
            <th scope="col" className="border border-slate-300 px-3 py-2 font-semibold text-slate-900">
              {t('compare.field')}
            </th>
            {tasks.map((task) => (
              <th key={task.id} scope="col" className="border border-slate-300 px-3 py-2 font-semibold">
                <Link to={`/item/${task.id}`} className="rounded text-brand-800 hover:underline">
                  {pick(task.title)}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row" className="border border-slate-300 bg-slate-50 px-3 py-2 font-semibold text-slate-900">
                {row.label}
              </th>
              {tasks.map((task) => (
                <td key={task.id} className="border border-slate-300 px-3 py-2 align-top text-slate-800">
                  {row.render(task)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
