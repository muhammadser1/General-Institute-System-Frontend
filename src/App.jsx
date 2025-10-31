import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AddStudentProvider } from './contexts/AddStudentContext'
import AppRoutes from './routes/AppRoutes'
import './styles/App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AddStudentProvider>
          <AppRoutes />
        </AddStudentProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
