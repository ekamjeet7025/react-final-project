import { FiCheck, FiTrash2, FiCalendar } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate, isOverdue } from '../utils/helpers'

function RevisionList({ revisions, onComplete, onDelete }) {
  if (revisions.length === 0) {
    return <p className="empty-message">No revisions scheduled. Complete topics to generate revision reminders.</p>
  }

  return (
    <div className="revision-list">
      <AnimatePresence>
        {revisions.map(rev => {
          const overdue = !rev.completed && isOverdue(rev.revisionDate)
          return (
            <motion.div
              key={rev.id}
              className={`revision-item ${rev.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <div className="revision-info">
                <h4>{rev.topicName}</h4>
                <span className="revision-subject">{rev.subjectName}</span>
                <span className={`revision-date ${overdue ? 'overdue-text' : ''}`}>
                  <FiCalendar /> {formatDate(rev.revisionDate)}
                  {overdue && ' (Overdue!)'}
                </span>
              </div>
              <div className="revision-actions">
                {!rev.completed && (
                  <button
                    className="icon-btn success"
                    onClick={() => onComplete(rev.id)}
                    title="Mark as revised"
                  >
                    <FiCheck />
                  </button>
                )}
                <button
                  className="icon-btn danger"
                  onClick={() => onDelete(rev.id)}
                  title="Remove"
                >
                  <FiTrash2 />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default RevisionList
