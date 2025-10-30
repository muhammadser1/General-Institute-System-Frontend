import { useIsMobile } from '../../hooks/useMediaQuery'
import StudentStatsPageDesktop from './StudentStatsPageDesktop'
import StudentStatsPageMobile from './StudentStatsPageMobile'

const StudentStatsPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <StudentStatsPageMobile /> : <StudentStatsPageDesktop />
}

export default StudentStatsPage
