import { useIsMobile } from '../../hooks/useMediaQuery'
import AboutPageDesktop from './AboutPageDesktop'
import AboutPageMobile from './AboutPageMobile'

const AboutPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <AboutPageMobile /> : <AboutPageDesktop />
}

export default AboutPage

