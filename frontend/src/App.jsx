import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import SubmitTask from './pages/SubmitTask'
import Evaluation from './pages/Evaluation'
import Credential from './pages/Credential'
import Payment from './pages/Payment'
import VerifySkill from './pages/VerifySkill'
import Certificate from './pages/Certificate'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/submit/:taskId" element={<SubmitTask />} />
        <Route path="/evaluation/:taskId" element={<Evaluation />} />
        <Route path="/credential/:taskId" element={<Credential />} />
        <Route path="/payment/:taskId" element={<Payment />} />
        <Route path="/verify" element={<VerifySkill />} />
        <Route path="/certificate/:tokenId" element={<Certificate />} />
      </Routes>
    </Router>
  )
}

export default App

