import { useIsMobile } from '../../hooks/useMediaQuery'
import LessonsPageDesktop from './LessonsPageDesktop'
import LessonsPageMobile from './LessonsPageMobile'

const LessonsPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <LessonsPageMobile /> : <LessonsPageDesktop />
}

export default LessonsPage
