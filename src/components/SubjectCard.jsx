import { useState } from 'react'
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiPlus } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import TopicItem from './TopicItem'
import TopicForm from './TopicForm'

function SubjectCard({ subject, topics, onEdit, onDelete, onAddTopic, onUpdateTopic, onDeleteTopic }) {
  const [expanded, setExpanded] = useState(false)
  const [showTopicForm, setShowTopicForm] = useState(false)

  const completedTopics = topics.filter(t => t.status === 'Completed').length

  return (
    <motion.div
      className="subject-card"
      style={{ borderLeft: `4px solid ${subject.color}` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="subject-header" onClick={() => setExpanded(!expanded)}>
        <div className="subject-info">
          <div className="subject-color" style={{ backgroundColor: subject.color }} />
          <div>
            <h3>{subject.name}</h3>
            <p className="subject-desc">{subject.description}</p>
            <span className="topic-count">{completedTopics}/{topics.length} topics completed</span>
          </div>
        </div>
        <div className="subject-actions">
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onEdit(subject) }}>
            <FiEdit2 />
          </button>
          <button className="icon-btn danger" onClick={(e) => { e.stopPropagation(); onDelete(subject.id) }}>
            <FiTrash2 />
          </button>
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="subject-topics"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {topics.map(topic => (
              <TopicItem
                key={topic.id}
                topic={topic}
                onUpdate={onUpdateTopic}
                onDelete={onDeleteTopic}
              />
            ))}
            {showTopicForm ? (
              <TopicForm
                subjectId={subject.id}
                onSubmit={(topic) => { onAddTopic(topic); setShowTopicForm(false) }}
                onCancel={() => setShowTopicForm(false)}
              />
            ) : (
              <button className="add-topic-btn" onClick={() => setShowTopicForm(true)}>
                <FiPlus /> Add Topic
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SubjectCard
