export type Language = 'vi' | 'en'

export type Status = 'todo' | 'doing' | 'done'

export type Priority = 'low' | 'medium' | 'high'

export type LabelKey =
  | 'frontend'
  | 'backend'
  | 'design'
  | 'bug'
  | 'docs'
  | 'testing'
  | 'devops'

export type LocalizedText = Record<Language, string>

export interface Task {
  /** Duy nhat, dang chuoi, vi du "task-001" */
  id: string
  /** Tieu de song ngu */
  title: LocalizedText
  /** Mo ta song ngu */
  description: LocalizedText
  status: Status
  priority: Priority
  /** Uoc luong (gio), so >= 0 */
  estimateHours: number
  /** Ten nguoi phu trach (ten rieng, khong dich) */
  assignee: string
  /** Han chot, dinh dang ISO "YYYY-MM-DD" */
  dueDate: string
  /** Danh sach nhan, chi nhan gia tri trong LabelKey */
  labels: LabelKey[]
  /** Ngay tao, dinh dang ISO "YYYY-MM-DD" */
  createdAt: string
}

export type TaskInput = Omit<Task, 'id' | 'createdAt'>

export const STATUSES: readonly Status[] = ['todo', 'doing', 'done']

export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high']

export const LABEL_KEYS: readonly LabelKey[] = [
  'frontend',
  'backend',
  'design',
  'bug',
  'docs',
  'testing',
  'devops',
]
