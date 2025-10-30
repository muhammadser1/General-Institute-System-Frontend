import { useIsMobile } from '../../hooks/useMediaQuery'
import LoginPageDesktop from './LoginPageDesktop'
import LoginPageMobile from './LoginPageMobile'

const LoginPage = () => {
  const isMobile = useIsMobile()
  return isMobile ? <LoginPageMobile /> : <LoginPageDesktop />
}

export default LoginPage
















