import { useIsMobile } from '../../hooks/useMediaQuery'
import TeacherStatsPageDesktop from './TeacherStatsPageDesktop'
import TeacherStatsPageMobile from './TeacherStatsPageMobile'

const TeacherStatsPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <TeacherStatsPageMobile /> : <TeacherStatsPageDesktop />
}

export default TeacherStatsPage
