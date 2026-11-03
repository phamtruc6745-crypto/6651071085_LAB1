import { createContext } from 'react'
import type { Status, Task, TaskInput } from '../types'

export interface TasksContextValue {
  tasks: Task[]
  addTask: (input: TaskInput) => string
  updateTask: (id: string, input: TaskInput) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, status: Status) => void
}

export const TasksContext = createContext<TasksContextValue | null>(null)
