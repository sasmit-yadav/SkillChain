import { useNavigate } from 'react-router-dom'

const Tasks = () => {
  const navigate = useNavigate()

  const tasks = [
    {
      id: 1,
      title: 'Build a React Component Library',
      skill: 'React Development',
      reward: 150.00,
      description: 'Create a reusable component library with 5+ components including buttons, cards, and forms.'
    },
    {
      id: 2,
      title: 'Design a Smart Contract for Voting',
      skill: 'Solidity Development',
      reward: 200.00,
      description: 'Develop a secure voting smart contract with access control and vote tallying functionality.'
    },
    {
      id: 3,
      title: 'Optimize Database Queries',
      skill: 'Backend Engineering',
      reward: 175.00,
      description: 'Analyze and optimize slow database queries, reducing query time by at least 50%.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-700 flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">Task Marketplace</h1>
              <p className="text-gray-600">Complete tasks to earn blockchain-verified credentials</p>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {task.skill}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ${task.reward.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Reward</div>
                </div>
                <button
                  onClick={() => navigate(`/submit/${task.id}`)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  Start Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tasks

