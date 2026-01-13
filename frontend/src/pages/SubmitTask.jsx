import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

const SubmitTask = () => {
  const navigate = useNavigate()
  const { taskId } = useParams()
  const [submission, setSubmission] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tasks = {
    1: {
      title: 'Build a React Component Library',
      skill: 'React Development',
      reward: 150.00,
      description: 'Create a reusable component library with 5+ components including buttons, cards, and forms. Submit your GitHub repository link and a brief explanation of your implementation.'
    },
    2: {
      title: 'Design a Smart Contract for Voting',
      skill: 'Solidity Development',
      reward: 200.00,
      description: 'Develop a secure voting smart contract with access control and vote tallying functionality. Submit your contract code and deployment address.'
    },
    3: {
      title: 'Optimize Database Queries',
      skill: 'Backend Engineering',
      reward: 175.00,
      description: 'Analyze and optimize slow database queries, reducing query time by at least 50%. Submit your optimized queries and performance metrics.'
    }
  }

  const task = tasks[taskId] || tasks[1]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!submission.trim()) {
      alert('Please provide a submission before continuing.')
      return
    }

    setIsSubmitting(true)
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false)
      navigate(`/evaluation/${taskId}`)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/tasks')}
            className="text-purple-600 hover:text-purple-700 mb-4 flex items-center"
          >
            ← Back to Tasks
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{task.title}</h1>
          <div className="flex items-center gap-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {task.skill}
            </span>
            <span className="text-green-600 font-semibold">${task.reward.toFixed(2)} Reward</span>
          </div>
        </div>

        {/* Task Description */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Description</h2>
          <p className="text-gray-600 leading-relaxed">{task.description}</p>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Submission</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Enter your submission here... (e.g., GitHub link, code, explanation)"
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              required
            />
            <div className="mt-4 flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Task'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitTask

