import { useCallback, useId, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { ArrowLeftIcon } from '../components/Icons'
import { LabelBadge } from '../components/LabelBadge'
import { Modal } from '../components/Modal'
import { PriorityBadge } from '../components/PriorityBadge'
import { TaskForm } from '../components/TaskForm'
import notFoundImage from '../assets/not-found.svg'
import { useTasks } from '../hooks/useTasks'
import { useTranslation } from '../hooks/useTranslation'
import { STATUSES, type Status } from '../types'

function isStatus(value: string): value is Status {
  return STATUSES.some((item) => item === value)
}

export function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, pick, date } = useTranslation()
  const { tasks, updateTask, deleteTask, moveTask } = useTasks()
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const statusId = useId()

  const closeEdit = useCallback(() => {
    setShowEdit(false)
  }, [])
  const closeDelete = useCallback(() => {
    setShowDelete(false)
  }, [])

  const task = tasks.find((item) => item.id === id)

  if (task === undefined) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border-t-4 border-brand bg-white p-6 text-center shadow-sm">
        <img src={notFoundImage} alt={t('detail.notFoundAlt')} width={160} height={120} className="mx-auto h-[7.5rem] w-40" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{t('detail.notFoundTitle')}</h1>
        <p className="mt-2 text-slate-700">{t('detail.notFoundText', { id: id ?? '' })}</p>
        <Link to="/" className="btn-primary mt-6">
          {t('detail.backHome')}
        </Link>
      </div>
    )
  }

  const title = pick(task.title)

  return (
    <div className="pb-8">
      <Link to="/" className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeftIcon />
        {t('detail.back')}
      </Link>

      <article className="mt-4 rounded-xl border-t-4 border-brand bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowEdit(true)
              }}
            >
              {t('detail.edit')}
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                setShowDelete(true)
              }}
            >
              {t('detail.delete')}
            </button>
          </div>
        </div>

        <p className="mt-3 text-slate-700">{pick(task.description)}</p>

        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold text-slate-600">
              <label htmlFor={statusId}>{t('field.status')}</label>
            </dt>
            <dd className="mt-1">
              <select
                id={statusId}
                className="field-input"
                value={task.status}
                onChange={(event) => {
                  if (isStatus(event.target.value)) {
                    moveTask(task.id, event.target.value)
                  }
                }}
              >
                {STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {t(`status.${item}`)}
                  </option>
                ))}
              </select>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-600">{t('field.priority')}</dt>
            <dd className="mt-1">
              <PriorityBadge priority={task.priority} />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-600">{t('field.assignee')}</dt>
            <dd className="mt-1 flex items-center gap-2 text-slate-900">
              <Avatar name={task.assignee} />
              {task.assignee}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-600">{t('field.dueDate')}</dt>
            <dd className="mt-1 text-slate-900">{date(task.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-600">{t('field.estimate')}</dt>
            <dd className="mt-1 text-slate-900">{t('field.hours', { count: task.estimateHours })}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-600">{t('field.createdAt')}</dt>
            <dd className="mt-1 text-slate-900">{date(task.createdAt)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-semibold text-slate-600">{t('field.labels')}</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {task.labels.length === 0 ? (
                <span className="text-slate-600">{t('compare.noLabels')}</span>
              ) : (
                task.labels.map((label) => <LabelBadge key={label} label={label} />)
              )}
            </dd>
          </div>
        </dl>
      </article>

      {showEdit && (
        <Modal title={t('form.editTitle')} onClose={closeEdit}>
          <TaskForm
            initial={task}
            onCancel={closeEdit}
            onSubmit={(input) => {
              updateTask(task.id, input)
              closeEdit()
            }}
          />
        </Modal>
      )}

      {showDelete && (
        <Modal title={t('detail.deleteTitle')} onClose={closeDelete}>
          <p className="text-slate-800">{t('detail.deleteConfirm', { title })}</p>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={closeDelete}>
              {t('form.cancel')}
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                deleteTask(task.id)
                void navigate('/')
              }}
            >
              {t('detail.deleteYes')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
