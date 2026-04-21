import { useStudy } from '../context/StudyContext'
import { isOverdue } from '../utils/helpers'

export const useTasks = () => {
  const { tasks, addTask, updateTask, deleteTask } = useStudy()

  const getFilteredTasks = (tab, filters = {}, searchQuery = '', sortBy = '') => {
    let filtered = [...tasks]

    // Tab filtering
    switch (tab) {
      case 'Pending':
        filtered = filtered.filter(t => t.status === 'Pending')
        break
      case 'Completed':
        filtered = filtered.filter(t => t.status === 'Completed')
        break
      case 'Overdue':
        filtered = filtered.filter(t => t.status !== 'Completed' && isOverdue(t.deadline))
        break
      case 'Revision':
        filtered = filtered.filter(t => t.status === 'Revision' || t.title.toLowerCase().includes('revis'))
        break
      default:
        break
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.topic.toLowerCase().includes(q)
      )
    }

    // Filters
    if (filters.subject) {
      filtered = filtered.filter(t => t.subject === filters.subject)
    }
    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority)
    }
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status)
    }

    // Sorting
    if (sortBy === 'deadline') {
      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    } else if (sortBy === 'priority') {
      const order = { High: 0, Medium: 1, Low: 2 }
      filtered.sort((a, b) => order[a.priority] - order[b.priority])
    } else if (sortBy === 'subject') {
      filtered.sort((a, b) => a.subject.localeCompare(b.subject))
    }

    return filtered
  }

  const completeTask = (id) => {
    updateTask(id, { status: 'Completed' })
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    getFilteredTasks
  }
}
