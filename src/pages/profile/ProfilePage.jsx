import { useIsMobile } from '../../hooks/useMediaQuery'
import ProfilePageDesktop from './ProfilePageDesktop'
import ProfilePageMobile from './ProfilePageMobile'

const ProfilePage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <ProfilePageMobile /> : <ProfilePageDesktop />
}

export default ProfilePage
