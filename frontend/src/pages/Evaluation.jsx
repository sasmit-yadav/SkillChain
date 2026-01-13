import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

const Evaluation = () => {
  const navigate = useNavigate()
  const { taskId } = useParams()
  const [isProcessing, setIsProcessing] = useState(false)

  const tasks = {
    1: {
      title: 'Build a React Component Library',
      skill: 'React Development',
      reward: 150.00
    },
    2: {
      title: 'Design a Smart Contract for Voting',
      skill: 'Solidity Development',
      reward: 200.00
    },
    3: {
      title: 'Optimize Database Queries',
      skill: 'Backend Engineering',
      reward: 175.00
    }
  }

  const task = tasks[taskId] || tasks[1]

  // Simulated evaluation metrics
  const evaluationMetrics = {
    accuracy: 90,
    speed: 'Good',
    fraudCheck: 'Passed',
    finalScore: 82
  }

  const handleIssueCredential = () => {
    setIsProcessing(true)
    // Navigate to credential page after a brief delay
    setTimeout(() => {
      navigate(`/credential/${taskId}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Evaluation</h1>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>⚠️ Prototype Simulation:</strong> This is a simulated AI evaluation for demo purposes.
            </p>
          </div>
        </div>

        {/* Task Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h2>
          <p className="text-gray-600">Skill: {task.skill}</p>
        </div>

        {/* Evaluation Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Evaluation Results</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Accuracy</span>
              <span className="text-2xl font-bold text-green-600">{evaluationMetrics.accuracy}%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Speed</span>
              <span className="text-xl font-semibold text-blue-600">{evaluationMetrics.speed}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="text-gray-700 font-medium">Fraud Check</span>
              <span className="text-xl font-semibold text-purple-600">{evaluationMetrics.fraudCheck}</span>
            </div>
          </div>

          {/* Final Score */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Final Score</p>
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {evaluationMetrics.finalScore}
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <p className="text-sm text-gray-500">Qualified for credential issuance</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleIssueCredential}
            disabled={isProcessing}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
          >
            {isProcessing ? 'Processing...' : 'Issue Credential'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Evaluation

