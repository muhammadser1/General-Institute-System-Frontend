import React from 'react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import DashboardPageDesktop from './DashboardPageDesktop'
import DashboardPageMobile from './DashboardPageMobile'
import '../../styles/pages/admin/DashboardPage.css'

const DashboardPage = () => {
  const isMobile = useIsMobile()

  return (
    <div className="dashboard-page">
      {isMobile ? <DashboardPageMobile /> : <DashboardPageDesktop />}
    </div>
  )
}

export default DashboardPage

