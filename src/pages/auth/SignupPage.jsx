import { useIsMobile } from '../../hooks/useMediaQuery'
import SignupPageDesktop from './SignupPageDesktop'
import SignupPageMobile from './SignupPageMobile'

const SignupPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <SignupPageMobile /> : <SignupPageDesktop />
}

export default SignupPage
