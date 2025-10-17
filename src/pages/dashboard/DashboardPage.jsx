import { useIsMobile } from '../../hooks/useMediaQuery'
import DashboardPageDesktop from './DashboardPageDesktop'
import DashboardPageMobile from './DashboardPageMobile'

const DashboardPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <DashboardPageMobile /> : <DashboardPageDesktop />
}

export default DashboardPage
