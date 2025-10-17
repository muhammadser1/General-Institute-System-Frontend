import { useIsMobile } from '../../hooks/useMediaQuery'
import HeaderDesktop from './HeaderDesktop'
import HeaderMobile from './HeaderMobile'

const Header = () => {
  const isMobile = useIsMobile()

  return isMobile ? <HeaderMobile /> : <HeaderDesktop />
}

export default Header
