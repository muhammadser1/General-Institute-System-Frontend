import { useIsMobile } from '../../hooks/useMediaQuery'
import HomePageDesktop from './HomePageDesktop'
import HomePageMobile from './HomePageMobile'

const HomePage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <HomePageMobile /> : <HomePageDesktop />
}

export default HomePage
