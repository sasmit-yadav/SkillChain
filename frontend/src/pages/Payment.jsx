import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'

const Payment = () => {
  const navigate = useNavigate()
  const { taskId } = useParams()

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

  useEffect(() => {
    // Update earnings in localStorage
    const currentEarnings = parseFloat(localStorage.getItem('skillchain_earnings') || '0')
    const newEarnings = currentEarnings + task.reward
    localStorage.setItem('skillchain_earnings', newEarnings.toString())
    
    // Trigger update event
    window.dispatchEvent(new Event('credentialUpdated'))
  }, [task.reward])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Released</h1>
          <p className="text-gray-600">Your reward has been processed</p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Your reward has been released via smart contract escrow</p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Task Completed:</span>
                <span className="font-semibold text-gray-800">{task.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Skill:</span>
                <span className="font-semibold text-gray-800">{task.skill}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-lg text-gray-700">Amount Released:</span>
                <span className="text-3xl font-bold text-green-600">${task.reward.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Simulation Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>⚠️ Prototype Simulation:</strong> Payment released via smart contract escrow (simulated for demo purposes).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex-1"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Browse More Tasks
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Your credential has been minted on the blockchain</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Payment has been released to your account</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">→</span>
              <span>View your updated dashboard to see your new credential and earnings</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Payment

