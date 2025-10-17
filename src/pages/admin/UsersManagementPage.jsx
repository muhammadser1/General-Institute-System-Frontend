import { useIsMobile } from '../../hooks/useMediaQuery'
import UsersManagementPageDesktop from './UsersManagementPageDesktop'
import UsersManagementPageMobile from './UsersManagementPageMobile'

const UsersManagementPage = () => {
  const isMobile = useIsMobile()

  return isMobile ? <UsersManagementPageMobile /> : <UsersManagementPageDesktop />
}

export default UsersManagementPage
