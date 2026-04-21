import { useState } from 'react'
import { motion } from 'framer-motion'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import RevisionList from '../components/RevisionList'
import { useStudy } from '../context/StudyContext'

function Revision() {
  const { revisions, topics, subjects, addRevision, updateRevision, deleteRevision } = useStudy()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [newRevision, setNewRevision] = useState({ topicId: '', revisionDate: '' })

  const handleComplete = (id) => {
    updateRevision(id, { completed: true })
    toast.success('Revision completed!')
  }

  const handleDelete = (id) => {
    deleteRevision(id)
    toast.success('Revision removed!')
  }

  const handleAddRevision = (e) => {
    e.preventDefault()
    if (!newRevision.topicId || !newRevision.revisionDate) {
      toast.error('Please select a topic and date')
      return
    }
    const topic = topics.find(t => t.id === newRevision.topicId)
    const subject = subjects.find(s => s.id === topic?.subjectId)
    addRevision({
      topicId: newRevision.topicId,
      topicName: topic?.name || '',
      subjectName: subject?.name || '',
      revisionDate: newRevision.revisionDate,
      completed: false
    })
    toast.success('Revision scheduled!')
    setShowForm(false)
    setNewRevision({ topicId: '', revisionDate: '' })
  }

  const tileContent = ({ date }) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const hasRevision = revisions.some(r => r.revisionDate === dateStr && !r.completed)
    if (hasRevision) {
      return <div className="calendar-dot" />
    }
    return null
  }

  const pendingRevisions = revisions.filter(r => !r.completed).sort((a, b) => new Date(a.revisionDate) - new Date(b.revisionDate))
  const completedRevisions = revisions.filter(r => r.completed)

  return (
    <motion.div
      className="page revision-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <h1>Revision Planner</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Schedule Revision
        </button>
      </div>

      {showForm && (
        <form className="revision-form card" onSubmit={handleAddRevision}>
          <h3>Schedule New Revision</h3>
          <div className="form-group">
            <label>Topic</label>
            <select
              value={newRevision.topicId}
              onChange={(e) => setNewRevision({ ...newRevision, topicId: e.target.value })}
            >
              <option value="">Select a topic</option>
              {topics.map(t => {
                const sub = subjects.find(s => s.id === t.subjectId)
                return (
                  <option key={t.id} value={t.id}>
                    {t.name} ({sub?.name})
                  </option>
                )
              })}
            </select>
          </div>
          <div className="form-group">
            <label>Revision Date</label>
            <input
              type="date"
              value={newRevision.revisionDate}
              onChange={(e) => setNewRevision({ ...newRevision, revisionDate: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Schedule</button>
            <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="revision-layout">
        <div className="revision-calendar">
          <h3>Calendar</h3>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
          />
        </div>

        <div className="revision-lists">
          <div className="revision-section">
            <h3>Pending Revisions ({pendingRevisions.length})</h3>
            <RevisionList
              revisions={pendingRevisions}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          </div>

          <div className="revision-section">
            <h3>Completed Revisions ({completedRevisions.length})</h3>
            <RevisionList
              revisions={completedRevisions}
              onComplete={() => {}}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Revision
