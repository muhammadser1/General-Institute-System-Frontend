import { useIsMobile } from '../../hooks/useMediaQuery'
import AdminDashboardPageDesktop from './AdminDashboardPageDesktop'
import AdminDashboardPageMobile from './AdminDashboardPageMobile'

const AdminDashboardPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <AdminDashboardPageMobile /> : <AdminDashboardPageDesktop />
}

export default AdminDashboardPage
