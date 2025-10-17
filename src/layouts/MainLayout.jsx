import { Outlet } from 'react-router-dom'
import { useIsMobile } from '../hooks/useMediaQuery'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import Footer from '../components/layout/Footer'
import '../styles/layouts/MainLayout.css'

const MainLayout = () => {
  const isMobile = useIsMobile()

  return (
    <div className="main-layout">
      <Header />
      <div className="main-layout-content">
        {!isMobile && <Sidebar />}
        <main className="main-layout-main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
