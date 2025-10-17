import { useIsMobile } from '../../hooks/useMediaQuery'
import CreateLessonPageDesktop from './CreateLessonPageDesktop'
import CreateLessonPageMobile from './CreateLessonPageMobile'

const CreateLessonPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <CreateLessonPageMobile /> : <CreateLessonPageDesktop />
}

export default CreateLessonPage
