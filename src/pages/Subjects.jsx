import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import SubjectCard from '../components/SubjectCard'
import SearchBar from '../components/SearchBar'
import { useSubjects } from '../hooks/useSubjects'
import { useDebounce } from '../hooks/useDebounce'

const subjectSchema = yup.object({
  name: yup.string().required('Subject name is required'),
  description: yup.string().required('Description is required'),
  color: yup.string().required('Color is required')
})

function Subjects() {
  const {
    subjects, topics, addSubject, updateSubject, deleteSubject,
    addTopic, updateTopic, deleteTopic, getTopicsBySubject
  } = useSubjects()

  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(subjectSchema),
    defaultValues: { name: '', description: '', color: '#3b82f6' }
  })

  const onSubmit = (data) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data)
      toast.success('Subject updated!')
    } else {
      addSubject(data)
      toast.success('Subject added!')
    }
    reset()
    setShowForm(false)
    setEditingSubject(null)
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setValue('name', subject.name)
    setValue('description', subject.description)
    setValue('color', subject.color)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    deleteSubject(id)
    toast.success('Subject deleted!')
  }

  const handleSearch = useCallback((q) => {
    setSearchQuery(q)
  }, [])

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.description.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <motion.div
      className="page subjects-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <h1>Subjects & Topics</h1>
        <div className="page-actions">
          <SearchBar onSearch={handleSearch} placeholder="Search subjects..." />
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingSubject(null); reset() }}>
            <FiPlus /> Add Subject
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            className="subject-form card"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3>{editingSubject ? 'Edit Subject' : 'New Subject'}</h3>
            <div className="form-group">
              <label>Subject Name</label>
              <input {...register('name')} placeholder="e.g. Mathematics" />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <input {...register('description')} placeholder="e.g. Calculus, Linear Algebra" />
              {errors.description && <span className="error">{errors.description.message}</span>}
            </div>
            <div className="form-group">
              <label>Color</label>
              <input type="color" {...register('color')} />
              {errors.color && <span className="error">{errors.color.message}</span>}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingSubject ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn" onClick={() => { setShowForm(false); setEditingSubject(null); reset() }}>
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="subjects-list">
        <AnimatePresence>
          {filteredSubjects.map(subject => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              topics={getTopicsBySubject(subject.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddTopic={addTopic}
              onUpdateTopic={updateTopic}
              onDeleteTopic={deleteTopic}
            />
          ))}
        </AnimatePresence>
        {filteredSubjects.length === 0 && (
          <p className="empty-message">No subjects found. Create one to get started!</p>
        )}
      </div>
    </motion.div>
  )
}

export default Subjects
