import { useIsMobile } from '../../hooks/useMediaQuery'
import TeacherEarningsPageDesktop from './TeacherEarningsPageDesktop'
import TeacherEarningsPageMobile from './TeacherEarningsPageMobile'

const TeacherEarningsPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <TeacherEarningsPageMobile /> : <TeacherEarningsPageDesktop />
}

export default TeacherEarningsPage
