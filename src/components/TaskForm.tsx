import { useId, useState, type FormEvent } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { LABEL_KEYS, PRIORITIES, STATUSES, type LabelKey, type Priority, type Status, type Task, type TaskInput } from '../types'

interface TaskFormProps {
  initial?: Task
  onSubmit: (input: TaskInput) => void
  onCancel: () => void
}

type ErrorKey = 'title' | 'assignee' | 'dueDate' | 'estimate'

function isStatus(value: string): value is Status {
  return STATUSES.some((item) => item === value)
}

function isPriority(value: string): value is Priority {
  return PRIORITIES.some((item) => item === value)
}

export function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const { t } = useLanguage()
  const uid = useId()
  const [titleVi, setTitleVi] = useState(initial?.title.vi ?? '')
  const [titleEn, setTitleEn] = useState(initial?.title.en ?? '')
  const [descVi, setDescVi] = useState(initial?.description.vi ?? '')
  const [descEn, setDescEn] = useState(initial?.description.en ?? '')
  const [status, setStatus] = useState<Status>(initial?.status ?? 'todo')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium')
  const [estimate, setEstimate] = useState(String(initial?.estimateHours ?? 1))
  const [assignee, setAssignee] = useState(initial?.assignee ?? '')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [labels, setLabels] = useState<LabelKey[]>(initial?.labels ?? [])
  const [errors, setErrors] = useState<ErrorKey[]>([])

  const toggleLabel = (label: LabelKey) => {
    setLabels((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found: ErrorKey[] = []
    const viTitle = titleVi.trim()
    const enTitle = titleEn.trim()
    const hours = Number(estimate)
    if (viTitle === '' && enTitle === '') {
      found.push('title')
    }
    if (assignee.trim() === '') {
      found.push('assignee')
    }
    if (dueDate === '') {
      found.push('dueDate')
    }
    if (estimate.trim() === '' || !Number.isFinite(hours) || hours < 0) {
      found.push('estimate')
    }
    setErrors(found)
    if (found.length > 0) {
      return
    }
    const viDesc = descVi.trim()
    const enDesc = descEn.trim()
    onSubmit({
      title: { vi: viTitle === '' ? enTitle : viTitle, en: enTitle === '' ? viTitle : enTitle },
      description: { vi: viDesc === '' ? enDesc : viDesc, en: enDesc === '' ? viDesc : enDesc },
      status,
      priority,
      estimateHours: hours,
      assignee: assignee.trim(),
      dueDate,
      labels,
    })
  }

  const has = (key: ErrorKey) => errors.includes(key)
  const id = (name: string) => `${uid}-${name}`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor={id('titleVi')} className="mb-1 block text-sm font-semibold text-slate-900">
          {t('field.titleVi')}
        </label>
        <input
          id={id('titleVi')}
          className="field-input"
          value={titleVi}
          aria-invalid={has('title')}
          aria-describedby={id('titleHint')}
          onChange={(event) => {
            setTitleVi(event.target.value)
          }}
        />
      </div>
      <div>
        <label htmlFor={id('titleEn')} className="mb-1 block text-sm font-semibold text-slate-900">
          {t('field.titleEn')}
        </label>
        <input
          id={id('titleEn')}
          className="field-input"
          value={titleEn}
          aria-invalid={has('title')}
          aria-describedby={id('titleHint')}
          onChange={(event) => {
            setTitleEn(event.target.value)
          }}
        />
        <p id={id('titleHint')} className="mt-1 text-xs text-slate-600">
          {t('form.titleHint')}
        </p>
        {has('title') && (
          <p role="alert" className="mt-1 text-sm font-medium text-red-700">
            {t('form.errTitle')}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={id('descVi')} className="mb-1 block text-sm font-semibold text-slate-900">
          {t('field.descriptionVi')}
        </label>
        <textarea
          id={id('descVi')}
          rows={3}
          className="field-input"
          value={descVi}
          onChange={(event) => {
            setDescVi(event.target.value)
          }}
        />
      </div>
      <div>
        <label htmlFor={id('descEn')} className="mb-1 block text-sm font-semibold text-slate-900">
          {t('field.descriptionEn')}
        </label>
        <textarea
          id={id('descEn')}
          rows={3}
          className="field-input"
          value={descEn}
          onChange={(event) => {
            setDescEn(event.target.value)
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id('status')} className="mb-1 block text-sm font-semibold text-slate-900">
            {t('field.status')}
          </label>
          <select
            id={id('status')}
            className="field-input"
            value={status}
            onChange={(event) => {
              if (isStatus(event.target.value)) {
                setStatus(event.target.value)
              }
            }}
          >
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {t(`status.${item}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id('priority')} className="mb-1 block text-sm font-semibold text-slate-900">
            {t('field.priority')}
          </label>
          <select
            id={id('priority')}
            className="field-input"
            value={priority}
            onChange={(event) => {
              if (isPriority(event.target.value)) {
                setPriority(event.target.value)
              }
            }}
          >
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {t(`priority.${item}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id('estimate')} className="mb-1 block text-sm font-semibold text-slate-900">
            {t('field.estimate')}
          </label>
          <input
            id={id('estimate')}
            type="number"
            min={0}
            step={0.5}
            className="field-input"
            value={estimate}
            aria-invalid={has('estimate')}
            onChange={(event) => {
              setEstimate(event.target.value)
            }}
          />
          {has('estimate') && (
            <p role="alert" className="mt-1 text-sm font-medium text-red-700">
              {t('form.errEstimate')}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={id('dueDate')} className="mb-1 block text-sm font-semibold text-slate-900">
            {t('field.dueDate')}
          </label>
          <input
            id={id('dueDate')}
            type="date"
            className="field-input"
            value={dueDate}
            aria-invalid={has('dueDate')}
            onChange={(event) => {
              setDueDate(event.target.value)
            }}
          />
          {has('dueDate') && (
            <p role="alert" className="mt-1 text-sm font-medium text-red-700">
              {t('form.errDate')}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={id('assignee')} className="mb-1 block text-sm font-semibold text-slate-900">
          {t('field.assignee')}
        </label>
        <input
          id={id('assignee')}
          className="field-input"
          value={assignee}
          aria-invalid={has('assignee')}
          onChange={(event) => {
            setAssignee(event.target.value)
          }}
        />
        {has('assignee') && (
          <p role="alert" className="mt-1 text-sm font-medium text-red-700">
            {t('form.errAssignee')}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-semibold text-slate-900">{t('field.labels')}</legend>
        <div className="flex flex-wrap gap-3">
          {LABEL_KEYS.map((label) => (
            <label key={label} className="inline-flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={labels.includes(label)}
                onChange={() => {
                  toggleLabel(label)
                }}
                className="h-4 w-4 accent-emerald-700"
              />
              {t(`label.${label}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {t('form.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {t('form.save')}
        </button>
      </div>
    </form>
  )
}
