import { format, isPast, isToday, addDays } from 'date-fns'

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'MMM dd, yyyy')
}

export const isOverdue = (deadline) => {
  if (!deadline) return false
  const d = new Date(deadline)
  return isPast(d) && !isToday(d)
}

export const getRevisionDate = (completionDate, daysAfter = 3) => {
  if (!completionDate) return null
  return addDays(new Date(completionDate), daysAfter)
}

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return '#ef4444'
    case 'Medium': return '#f59e0b'
    case 'Low': return '#22c55e'
    default: return '#6b7280'
  }
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return '#22c55e'
    case 'In Progress': return '#3b82f6'
    case 'Not Started': return '#6b7280'
    case 'Needs Revision': return '#f59e0b'
    case 'Pending': return '#f59e0b'
    case 'Overdue': return '#ef4444'
    default: return '#6b7280'
  }
}

export const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0
  const completed = tasks.filter(t => t.status === 'Completed').length
  return Math.round((completed / tasks.length) * 100)
}
