import { FiEdit2, FiTrash2, FiCheck, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { formatDate, getPriorityColor, isOverdue } from '../utils/helpers'

function TaskCard({ task, onEdit, onDelete, onComplete }) {
  const overdue = task.status !== 'Completed' && isOverdue(task.deadline)

  return (
    <motion.div
      className={`task-card ${overdue ? 'overdue' : ''} ${task.status === 'Completed' ? 'completed' : ''}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
          {task.priority}
        </span>
      </div>

      <div className="task-meta">
        <span className="task-subject">{task.subject}</span>
        <span className="task-topic">{task.topic}</span>
      </div>

      <div className="task-footer">
        <span className={`task-deadline ${overdue ? 'overdue-text' : ''}`}>
          <FiClock /> {formatDate(task.deadline)}
          {overdue && ' (Overdue)'}
        </span>
        <div className="task-actions">
          {task.status !== 'Completed' && (
            <button className="icon-btn success" onClick={() => onComplete(task.id)} title="Complete">
              <FiCheck />
            </button>
          )}
          <button className="icon-btn" onClick={() => onEdit(task)} title="Edit">
            <FiEdit2 />
          </button>
          <button className="icon-btn danger" onClick={() => onDelete(task.id)} title="Delete">
            <FiTrash2 />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard
