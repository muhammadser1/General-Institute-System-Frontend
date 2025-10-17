import { Outlet } from 'react-router-dom'
import '../styles/layouts/AuthLayout.css'

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-container">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
