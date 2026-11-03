import type { Status, Task } from '../types'

export type TasksAction =
  | { type: 'add'; task: Task }
  | { type: 'update'; task: Task }
  | { type: 'delete'; id: string }
  | { type: 'move'; id: string; status: Status }

export function tasksReducer(state: Task[], action: TasksAction): Task[] {
  switch (action.type) {
    case 'add':
      return [...state, action.task]
    case 'update':
      return state.map((task) => (task.id === action.task.id ? action.task : task))
    case 'delete':
      return state.filter((task) => task.id !== action.id)
    case 'move':
      return state.map((task) => (task.id === action.id ? { ...task, status: action.status } : task))
    default:
      return state
  }
}
