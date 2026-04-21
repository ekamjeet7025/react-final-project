// aiService.js — powered by Anthropic Claude API

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

const callClaude = async (prompt) => {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true'
},
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`Claude API request failed (${response.status}). ${errText}`)
  }

  const data = await response.json()
  const text = data?.content
    ?.map(block => (block.type === 'text' ? block.text : ''))
    .join('') ?? ''

  return text.trim()
}

export const generateSummary = async (topic) => {
  try {
    const prompt = `You are a helpful study assistant. Provide a clear, concise and comprehensive summary for students on the topic: ${topic}`
    return await callClaude(prompt)
  } catch (error) {
    console.error('AI Summary Error:', error)
    throw new Error('Failed to generate summary. Please try again.')
  }
}

export const generateQuestions = async (topic) => {
  try {
    const prompt = `You are a helpful study assistant. Generate 5 practice questions for students on the topic: ${topic}. Number each question.`
    return await callClaude(prompt)
  } catch (error) {
    console.error('AI Questions Error:', error)
    throw new Error('Failed to generate questions. Please try again.')
  }
}

export const generateFlashcards = async (topic) => {
  try {
    const prompt = `You are a helpful study assistant. Generate 5 flashcards (question and answer pairs) for the topic: ${topic}. Format each as "Q: ... A: ..." on separate lines.`
    return await callClaude(prompt)
  } catch (error) {
    console.error('AI Flashcards Error:', error)
    throw new Error('Failed to generate flashcards. Please try again.')
  }
}

// Replaces quotable.io — Claude generates a motivational quote directly
export const fetchMotivationalQuote = async () => {
  try {
    const prompt = `Generate a single short motivational quote suitable for a student who is studying hard. 
Respond ONLY with valid JSON in this exact format, no extra text, no markdown:
{"content": "the quote text here", "author": "Author Name"}`

    const raw = await callClaude(prompt)

    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/gi, '').trim()
    return JSON.parse(clean)
  } catch (error) {
    console.error('Quote generation error:', error)
    return {
      content: 'The secret of getting ahead is getting started.',
      author: 'Mark Twain'
    }
  }
}