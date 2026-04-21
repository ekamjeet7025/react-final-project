import { useState } from 'react'
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi'
import { getStatusColor } from '../utils/helpers'

function TopicItem({ topic, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({ ...topic })

  const handleSave = () => {
    onUpdate(topic.id, editData)
    setEditing(false)
  }

  const statusOptions = ['Not Started', 'In Progress', 'Completed', 'Needs Revision']
  const difficultyOptions = ['Easy', 'Medium', 'Hard']

  if (editing) {
    return (
      <div className="topic-item editing">
        <input
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          placeholder="Topic name"
        />
        <select
          value={editData.difficulty}
          onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
        >
          {difficultyOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={editData.status}
          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
        >
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea
          value={editData.notes}
          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
          placeholder="Notes..."
        />
        <div className="topic-edit-actions">
          <button className="btn btn-sm btn-primary" onClick={handleSave}><FiCheck /> Save</button>
          <button className="btn btn-sm" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="topic-item">
      <div className="topic-info">
        <span className="topic-name">{topic.name}</span>
        <span className={`badge difficulty-${topic.difficulty.toLowerCase()}`}>{topic.difficulty}</span>
        <span className="badge status-badge" style={{ backgroundColor: getStatusColor(topic.status) }}>
          {topic.status}
        </span>
      </div>
      {topic.notes && <p className="topic-notes">{topic.notes}</p>}
      <div className="topic-actions">
        <button className="icon-btn" onClick={() => setEditing(true)}><FiEdit2 /></button>
        <button className="icon-btn danger" onClick={() => onDelete(topic.id)}><FiTrash2 /></button>
      </div>
    </div>
  )
}

export default TopicItem
