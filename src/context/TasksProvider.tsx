import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { TasksContext, type TasksContextValue } from './TasksContext'
import { tasksReducer } from './tasksReducer'
import { createTaskId, loadTasks, saveTasks, todayIso } from '../data/tasks'
import type { Status, Task, TaskInput } from '../types'

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((input: TaskInput): string => {
    const task: Task = { ...input, id: createTaskId(), createdAt: todayIso() }
    dispatch({ type: 'add', task })
    return task.id
  }, [])

  const updateTask = useCallback(
    (id: string, input: TaskInput) => {
      const current = tasks.find((task) => task.id === id)
      if (current === undefined) {
        return
      }
      dispatch({ type: 'update', task: { ...input, id, createdAt: current.createdAt } })
    },
    [tasks],
  )

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'delete', id })
  }, [])

  const moveTask = useCallback((id: string, status: Status) => {
    dispatch({ type: 'move', id, status })
  }, [])

  const value = useMemo<TasksContextValue>(
    () => ({ tasks, addTask, updateTask, deleteTask, moveTask }),
    [tasks, addTask, updateTask, deleteTask, moveTask],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}
