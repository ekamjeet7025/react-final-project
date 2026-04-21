import { useStudy } from '../context/StudyContext'
import { isOverdue } from '../utils/helpers'

export const useProgress = () => {
  const { tasks, topics, subjects } = useStudy()

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'Completed').length
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length
  const overdueTasks = tasks.filter(t => t.status !== 'Completed' && isOverdue(t.deadline)).length
  const revisionTasks = tasks.filter(t => t.status === 'Revision' || t.title.toLowerCase().includes('revis')).length

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getSubjectProgress = () => {
    return subjects.map(subject => {
      const subjectTasks = tasks.filter(t => t.subject === subject.name)
      const subjectCompleted = subjectTasks.filter(t => t.status === 'Completed').length
      const subjectTopics = topics.filter(t => t.subjectId === subject.id)
      const topicsCompleted = subjectTopics.filter(t => t.status === 'Completed').length

      return {
        name: subject.name,
        color: subject.color,
        totalTasks: subjectTasks.length,
        completedTasks: subjectCompleted,
        totalTopics: subjectTopics.length,
        completedTopics: topicsCompleted,
        progress: subjectTasks.length > 0 ? Math.round((subjectCompleted / subjectTasks.length) * 100) : 0
      }
    })
  }

  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((day, i) => ({
      day,
      tasks: Math.floor(Math.random() * 5) + 1,
      hours: Math.floor(Math.random() * 4) + 1
    }))
  }

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    revisionTasks,
    completionPercentage,
    getSubjectProgress,
    getWeeklyData
  }
}
