import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiFileText, FiHelpCircle, FiLayers, FiLoader } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { generateSummary, generateQuestions, generateFlashcards } from '../services/aiService'

function AITools() {
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeMode, setActiveMode] = useState('summary')

  const modes = [
    { id: 'summary', label: 'Summary', icon: <FiFileText />, description: 'Generate a topic summary' },
    { id: 'questions', label: 'Questions', icon: <FiHelpCircle />, description: 'Generate practice questions' },
    { id: 'flashcards', label: 'Flashcards', icon: <FiLayers />, description: 'Generate flashcards' }
  ]

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setLoading(true)
    setResult('')

    try {
      let response
      switch (activeMode) {
        case 'summary':
          response = await generateSummary(topic)
          break
        case 'questions':
          response = await generateQuestions(topic)
          break
        case 'flashcards':
          response = await generateFlashcards(topic)
          break
        default:
          response = await generateSummary(topic)
      }
      setResult(response)
      toast.success(`${activeMode} generated!`)
    } catch (error) {
      toast.error(error.message || 'Failed to generate. Check your API key.')
      setResult('Error: ' + (error.message || 'Failed to generate content. Make sure your OpenAI API key is set in the .env file as VITE_OPENAI_API_KEY.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="page ai-tools-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <h1>AI Study Assistant</h1>
        <p className="page-subtitle">Generate summaries, practice questions, and flashcards using AI</p>
      </div>

      <div className="ai-modes">
        {modes.map(mode => (
          <motion.button
            key={mode.id}
            className={`ai-mode-btn ${activeMode === mode.id ? 'active' : ''}`}
            onClick={() => { setActiveMode(mode.id); setResult('') }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {mode.icon}
            <span className="mode-label">{mode.label}</span>
            <span className="mode-desc">{mode.description}</span>
          </motion.button>
        ))}
      </div>

      <div className="ai-input-section card">
        <div className="form-group">
          <label>Enter Topic</label>
          <input
            type="text"
            placeholder="e.g. Binary Search Trees"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? <><FiLoader className="spinner" /> Generating...</> : `Generate ${activeMode}`}
        </button>
      </div>

      {result && (
        <motion.div
          className="ai-result card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>
            {activeMode === 'summary' && 'Topic Summary'}
            {activeMode === 'questions' && 'Practice Questions'}
            {activeMode === 'flashcards' && 'Flashcards'}
          </h3>
          <div className="ai-result-content">
            {result.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </motion.div>
      )}

      <div className="ai-tips card">
        <h3>Tips for better results</h3>
        <ul>
          <li>Be specific with your topic (e.g., "Binary Search Trees" instead of just "Trees")</li>
          <li>Include the context (e.g., "Graph BFS for competitive programming")</li>
          <li>Try different modes for the same topic to get comprehensive study material</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default AITools
