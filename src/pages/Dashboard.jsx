import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiClock, FiAlertTriangle, FiRepeat, FiTrendingUp } from 'react-icons/fi'

import ProgressChart from '../components/ProgressChart'
import { useProgress } from '../hooks/useProgress'
import { useStudy } from '../context/StudyContext'
import { fetchMotivationalQuote } from '../services/aiService'
import { formatDate, isOverdue } from '../utils/helpers'

import { auth } from '../services/firebase' // 🔥 ADD THIS

function Dashboard() {
  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    revisionTasks,
    completionPercentage,
    getSubjectProgress,
    getWeeklyData
  } = useProgress()

  const { revisions } = useStudy()
  const [quote, setQuote] = useState({ content: '', author: '' })

  useEffect(() => {
    fetchMotivationalQuote().then(setQuote)
  }, [])

  const subjectProgress = getSubjectProgress()
  const weeklyData = getWeeklyData()

  const pieData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
    { name: 'Overdue', value: overdueTasks }
  ]

  const upcomingRevisions = revisions
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.revisionDate) - new Date(b.revisionDate))
    .slice(0, 5)

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: <FiTrendingUp />, color: '#3b82f6' },
    { label: 'Completed', value: completedTasks, icon: <FiCheckCircle />, color: '#22c55e' },
    { label: 'Pending', value: pendingTasks, icon: <FiClock />, color: '#f59e0b' },
    { label: 'Overdue', value: overdueTasks, icon: <FiAlertTriangle />, color: '#ef4444' }
  ]

  return (
    <motion.div
      className="page dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      {/* 🔥 HEADER */}
      <div className="page-header">
        <h1>Study Dashboard</h1>

        {/* 🔥 USER EMAIL */}
        <p style={{ color: "#94a3b8", marginTop: "5px" }}>
          Logged in as: {auth.currentUser?.email}
        </p>

        {quote.content && (
          <p className="quote">"{quote.content}" — {quote.author}</p>
        )}
      </div>

      {/* 🔥 STATS */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            style={{ borderTop: `3px solid ${stat.color}` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* 🔥 PROGRESS BAR */}
      <div className="completion-bar-container">
        <div className="completion-header">
          <span>Overall Progress</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="completion-bar">
          <motion.div
            className="completion-fill"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 🔥 CHARTS */}
      <div className="charts-grid">
        <ProgressChart
          type="bar"
          data={subjectProgress}
          title="Subject Progress (%)"
        />
        <ProgressChart
          type="pie"
          data={pieData}
          title="Task Distribution"
        />
        <ProgressChart
          type="line"
          data={weeklyData}
          title="Weekly Productivity"
        />
      </div>

      {/* 🔥 REVISIONS */}
      {upcomingRevisions.length > 0 && (
        <div className="dashboard-revisions">
          <h3><FiRepeat /> Upcoming Revisions</h3>
          <div className="revision-reminders">
            {upcomingRevisions.map(rev => (
              <div
                key={rev.id}
                className={`revision-reminder ${isOverdue(rev.revisionDate) ? 'overdue' : ''}`}
              >
                <span className="rev-topic">{rev.topicName}</span>
                <span className="rev-subject">{rev.subjectName}</span>
                <span className="rev-date">{formatDate(rev.revisionDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  )
}

export default Dashboard