import { createContext, useContext, useState, useEffect } from 'react'
import { generateId, getRevisionDate } from '../utils/helpers'

const StudyContext = createContext()

const initialSubjects = [
  { id: 'sub1', name: 'Mathematics', description: 'Calculus, Linear Algebra, Probability', color: '#3b82f6' },
  { id: 'sub2', name: 'Computer Science', description: 'OS, Networks, DBMS', color: '#8b5cf6' },
  { id: 'sub3', name: 'Data Structures', description: 'Arrays, Trees, Graphs, Stacks', color: '#22c55e' },
  { id: 'sub4', name: 'Algorithms', description: 'Sorting, Searching, DP, Greedy', color: '#f59e0b' },
  { id: 'sub5', name: 'Physics', description: 'Mechanics, Thermodynamics, Optics', color: '#ef4444' }
]

const initialTopics = [
  { id: 'top1', subjectId: 'sub3', name: 'Binary Trees', difficulty: 'Medium', status: 'In Progress', notes: 'Focus on traversals and BST properties' },
  { id: 'top2', subjectId: 'sub4', name: 'Graph Algorithms', difficulty: 'Hard', status: 'Not Started', notes: 'BFS, DFS, Dijkstra, Bellman-Ford' },
  { id: 'top3', subjectId: 'sub4', name: 'Dynamic Programming', difficulty: 'Hard', status: 'Not Started', notes: 'Memoization and tabulation approaches' },
  { id: 'top4', subjectId: 'sub3', name: 'Linked Lists', difficulty: 'Easy', status: 'Completed', notes: 'Singly, Doubly, Circular' },
  { id: 'top5', subjectId: 'sub1', name: 'Calculus', difficulty: 'Medium', status: 'In Progress', notes: 'Derivatives and integrals' },
  { id: 'top6', subjectId: 'sub1', name: 'Linear Algebra', difficulty: 'Medium', status: 'Not Started', notes: 'Matrices, Eigenvalues' },
  { id: 'top7', subjectId: 'sub2', name: 'Operating Systems', difficulty: 'Medium', status: 'Needs Revision', notes: 'Process scheduling, memory management' },
  { id: 'top8', subjectId: 'sub5', name: 'Mechanics', difficulty: 'Easy', status: 'Completed', notes: 'Newton laws, kinematics' },
  { id: 'top9', subjectId: 'sub5', name: 'Thermodynamics', difficulty: 'Hard', status: 'In Progress', notes: 'Laws of thermodynamics, entropy' },
  { id: 'top10', subjectId: 'sub2', name: 'Computer Networks', difficulty: 'Medium', status: 'Not Started', notes: 'OSI model, TCP/IP' }
]

const initialTasks = [
  { id: 'task1', title: 'Solve 10 binary tree problems', subject: 'Data Structures', topic: 'Binary Trees', deadline: '2026-03-28', priority: 'High', status: 'Pending' },
  { id: 'task2', title: 'Revise Graph algorithms', subject: 'Algorithms', topic: 'Graph Algorithms', deadline: '2026-03-30', priority: 'Medium', status: 'Pending' },
  { id: 'task3', title: 'Complete calculus assignment', subject: 'Mathematics', topic: 'Calculus', deadline: '2026-03-26', priority: 'High', status: 'Pending' },
  { id: 'task4', title: 'Read OS chapter 5', subject: 'Computer Science', topic: 'Operating Systems', deadline: '2026-03-24', priority: 'Low', status: 'Completed' },
  { id: 'task5', title: 'Practice DP problems', subject: 'Algorithms', topic: 'Dynamic Programming', deadline: '2026-03-22', priority: 'High', status: 'Pending' },
  { id: 'task6', title: 'Revise linked list concepts', subject: 'Data Structures', topic: 'Linked Lists', deadline: '2026-04-01', priority: 'Low', status: 'Completed' },
  { id: 'task7', title: 'Study thermodynamics laws', subject: 'Physics', topic: 'Thermodynamics', deadline: '2026-03-29', priority: 'Medium', status: 'Pending' },
  { id: 'task8', title: 'Linear algebra matrices', subject: 'Mathematics', topic: 'Linear Algebra', deadline: '2026-04-02', priority: 'Medium', status: 'Pending' }
]

const initialRevisions = [
  { id: 'rev1', topicId: 'top4', topicName: 'Linked Lists', subjectName: 'Data Structures', revisionDate: '2026-03-28', completed: false },
  { id: 'rev2', topicId: 'top8', topicName: 'Mechanics', subjectName: 'Physics', revisionDate: '2026-03-27', completed: false }
]

export function StudyProvider({ children }) {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('study_subjects')
    return saved ? JSON.parse(saved) : initialSubjects
  })

  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem('study_topics')
    return saved ? JSON.parse(saved) : initialTopics
  })

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('study_tasks')
    return saved ? JSON.parse(saved) : initialTasks
  })

  const [revisions, setRevisions] = useState(() => {
    const saved = localStorage.getItem('study_revisions')
    return saved ? JSON.parse(saved) : initialRevisions
  })

  useEffect(() => {
    localStorage.setItem('study_subjects', JSON.stringify(subjects))
  }, [subjects])

  useEffect(() => {
    localStorage.setItem('study_topics', JSON.stringify(topics))
  }, [topics])

  useEffect(() => {
    localStorage.setItem('study_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('study_revisions', JSON.stringify(revisions))
  }, [revisions])

  // Subject CRUD
  const addSubject = (subject) => {
    setSubjects(prev => [...prev, { ...subject, id: generateId() }])
  }

  const updateSubject = (id, updated) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s))
  }

  const deleteSubject = (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id))
    setTopics(prev => prev.filter(t => t.subjectId !== id))
  }

  // Topic CRUD
  const addTopic = (topic) => {
    setTopics(prev => [...prev, { ...topic, id: generateId() }])
  }

  const updateTopic = (id, updated) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t))
    if (updated.status === 'Completed') {
      const topic = topics.find(t => t.id === id)
      const subject = subjects.find(s => s.id === topic?.subjectId)
      const revisionDate = getRevisionDate(new Date())
      addRevision({
        topicId: id,
        topicName: topic?.name || '',
        subjectName: subject?.name || '',
        revisionDate: revisionDate.toISOString().split('T')[0],
        completed: false
      })
    }
  }

  const deleteTopic = (id) => {
    setTopics(prev => prev.filter(t => t.id !== id))
  }

  // Task CRUD
  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: generateId() }])
  }

  const updateTask = (id, updated) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  // Revision CRUD
  const addRevision = (revision) => {
    setRevisions(prev => [...prev, { ...revision, id: generateId() }])
  }

  const updateRevision = (id, updated) => {
    setRevisions(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r))
  }

  const deleteRevision = (id) => {
    setRevisions(prev => prev.filter(r => r.id !== id))
  }

  const value = {
    subjects,
    topics,
    tasks,
    revisions,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
    addTask,
    updateTask,
    deleteTask,
    addRevision,
    updateRevision,
    deleteRevision
  }

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  )
}

export const useStudy = () => {
  const context = useContext(StudyContext)
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider')
  }
  return context
}
