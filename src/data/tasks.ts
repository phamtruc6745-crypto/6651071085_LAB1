import seedData from './data.json'
import {
  LABEL_KEYS,
  PRIORITIES,
  STATUSES,
  type LabelKey,
  type LocalizedText,
  type Priority,
  type Status,
  type Task,
} from '../types'

export const TASKS_STORAGE_KEY = 'kanban.tasks.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLocalizedText(value: unknown): value is LocalizedText {
  return isRecord(value) && typeof value.vi === 'string' && typeof value.en === 'string'
}

function isStatus(value: unknown): value is Status {
  return STATUSES.some((item) => item === value)
}

function isPriority(value: unknown): value is Priority {
  return PRIORITIES.some((item) => item === value)
}

function isLabelKey(value: unknown): value is LabelKey {
  return LABEL_KEYS.some((item) => item === value)
}

export function toTask(value: unknown): Task | null {
  if (!isRecord(value)) {
    return null
  }
  const { id, title, description, status, priority, estimateHours, assignee, dueDate, labels, createdAt } = value
  if (
    typeof id !== 'string' ||
    id === '' ||
    !isLocalizedText(title) ||
    !isLocalizedText(description) ||
    !isStatus(status) ||
    !isPriority(priority) ||
    typeof estimateHours !== 'number' ||
    !Number.isFinite(estimateHours) ||
    typeof assignee !== 'string' ||
    typeof dueDate !== 'string' ||
    !Array.isArray(labels)
  ) {
    return null
  }
  return {
    id,
    title,
    description,
    status,
    priority,
    estimateHours,
    assignee,
    dueDate,
    labels: labels.filter(isLabelKey),
    createdAt: typeof createdAt === 'string' ? createdAt : dueDate,
  }
}

export function parseTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) {
    return []
  }
  const seen = new Set<string>()
  const result: Task[] = []
  for (const item of value) {
    const task = toTask(item)
    if (task !== null && !seen.has(task.id)) {
      seen.add(task.id)
      result.push(task)
    }
  }
  return result
}

export function getSeedTasks(): Task[] {
  return parseTasks(seedData)
}

export function loadTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY)
    if (raw !== null) {
      const stored = parseTasks(JSON.parse(raw))
      if (stored.length > 0) {
        return stored
      }
    }
  } catch {
    return getSeedTasks()
  }
  return getSeedTasks()
}

export function saveTasks(tasks: Task[]): void {
  try {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    return
  }
}

export function createTaskId(): string {
  return `task-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}
