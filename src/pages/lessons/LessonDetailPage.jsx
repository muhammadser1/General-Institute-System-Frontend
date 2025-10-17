import { useIsMobile } from '../../hooks/useMediaQuery'
import LessonDetailPageDesktop from './LessonDetailPageDesktop'
import LessonDetailPageMobile from './LessonDetailPageMobile'

const LessonDetailPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <LessonDetailPageMobile /> : <LessonDetailPageDesktop />
}

export default LessonDetailPage
