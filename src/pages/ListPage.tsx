import { useCallback, useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { CompareBar } from '../components/CompareBar'
import { CompareTable } from '../components/CompareTable'
import { PlusIcon } from '../components/Icons'
import { Modal } from '../components/Modal'
import { SkeletonCard } from '../components/SkeletonCard'
import { TaskForm } from '../components/TaskForm'
import emptyColumn from '../assets/empty-column.svg'
import { useSkeleton } from '../hooks/useSkeleton'
import { useTasks } from '../hooks/useTasks'
import { useTranslation } from '../hooks/useTranslation'
import { PRIORITIES, STATUSES, type Priority, type Task } from '../types'
import { debounce } from '../utils'

const MAX_COMPARE = 4
const SKELETON_DELAY_MS = 600

type PriorityFilter = Priority | 'all'

function isPriorityFilter(value: string): value is PriorityFilter {
  return value === 'all' || PRIORITIES.some((item) => item === value)
}

export function ListPage() {
  const { t } = useTranslation()
  const { tasks, addTask, moveTask } = useTasks()
  const [query, setQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  const applyQuery = useMemo(() => debounce(setAppliedQuery, 300), [])
  const loading = useSkeleton(`${appliedQuery}|${priorityFilter}`, SKELETON_DELAY_MS)

  const filtered = useMemo(() => {
    const needle = appliedQuery.trim().toLowerCase()
    return tasks.filter((task) => {
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false
      }
      if (needle === '') {
        return true
      }
      const haystack = `${task.title.vi} ${task.title.en} ${task.assignee}`.toLowerCase()
      return haystack.includes(needle)
    })
  }, [tasks, appliedQuery, priorityFilter])

  const selectedTasks = useMemo(
    () => selectedIds.map((id) => tasks.find((task) => task.id === id)).filter((task): task is Task => task !== undefined),
    [selectedIds, tasks],
  )

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id)
      }
      return current.length >= MAX_COMPARE ? current : [...current, id]
    })
  }, [])

  const closeAdd = useCallback(() => {
    setShowAdd(false)
  }, [])

  const closeCompare = useCallback(() => {
    setShowCompare(false)
  }, [])

  return (
    <div className={selectedTasks.length > 0 ? 'pb-28' : 'pb-8'}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('app.title')}</h1>
          <p className="mt-1 text-sm text-slate-600">{t('app.tagline')}</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setShowAdd(true)
          }}
        >
          <PlusIcon />
          {t('board.add')}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="task-search" className="mb-1 block text-sm font-semibold text-slate-900">
            {t('board.search')}
          </label>
          <input
            id="task-search"
            type="search"
            className="field-input"
            value={query}
            placeholder={t('board.searchPlaceholder')}
            onChange={(event) => {
              setQuery(event.target.value)
              applyQuery(event.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="task-priority" className="mb-1 block text-sm font-semibold text-slate-900">
            {t('board.filterPriority')}
          </label>
          <select
            id="task-priority"
            className="field-input"
            value={priorityFilter}
            onChange={(event) => {
              if (isPriorityFilter(event.target.value)) {
                setPriorityFilter(event.target.value)
              }
            }}
          >
            <option value="all">{t('board.allPriorities')}</option>
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {t(`priority.${item}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="sr-only" role="status">
        {loading ? t('board.loading') : ''}
      </p>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy={loading}>
        {STATUSES.map((status) => {
          const columnTasks = filtered.filter((task) => task.status === status)
          const headingId = `column-${status}`
          return (
            <section key={status} aria-labelledby={headingId} className="rounded-xl border-t-4 border-brand bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 id={headingId} className="text-lg font-bold text-slate-900">
                  {t(`status.${status}`)}
                </h2>
                {!loading && (
                  <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800">
                    {t('board.columnCount', { count: columnTasks.length })}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {loading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-6 text-center">
                    <img src={emptyColumn} alt={t('board.emptyAlt')} width={120} height={80} className="h-20 w-[7.5rem]" loading="lazy" />
                    <p className="text-sm text-slate-600">{t('board.emptyColumn')}</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <Card
                      key={task.id}
                      task={task}
                      selected={selectedIds.includes(task.id)}
                      selectDisabled={selectedIds.length >= MAX_COMPARE}
                      onToggleSelect={toggleSelect}
                      onMove={moveTask}
                    />
                  ))
                )}
              </div>
            </section>
          )
        })}
      </div>

      <CompareBar
        count={selectedTasks.length}
        max={MAX_COMPARE}
        onOpen={() => {
          setShowCompare(true)
        }}
        onClear={() => {
          setSelectedIds([])
        }}
      />

      {showAdd && (
        <Modal title={t('form.addTitle')} onClose={closeAdd}>
          <TaskForm
            onCancel={closeAdd}
            onSubmit={(input) => {
              addTask(input)
              closeAdd()
            }}
          />
        </Modal>
      )}

      {showCompare && (
        <Modal title={t('compare.title')} onClose={closeCompare} wide>
          <CompareTable tasks={selectedTasks} />
        </Modal>
      )}
    </div>
  )
}
